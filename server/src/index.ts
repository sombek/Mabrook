import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { generateTasksFromSurvey } from './generateTasks';
import { Bindings } from '../bindings';
import { createSupabaseClient } from '../supabaseClient';

// Create the Hono app with bindings
type AppEnv = { Bindings: Bindings };
const app = new Hono<AppEnv>();

// Define route to handle task generation
app.post(
  '/tasks',
  zValidator(
    'json',
    z.array(
      z.object({
        question: z.string(),
        answer: z.union([z.string(), z.number(), z.boolean()]),
      })
    )
  ),
  async (c) => {
    // Validate authorization token
    const token = c.req.header('Authorization');
    if (!token) {
      return c.json({ ok: false, message: 'Unauthorized' }, 401);
    }

    try {
      // Create Supabase client
      const supabase = createSupabaseClient(c.env, token);

      // Handle the survey input array
      const surveyInputs = c.req.valid('json');
      const sections = await generateTasksFromSurvey(c.env, surveyInputs);

      // Add sections and tasks to the database
      for (const section of sections) {
        // Add the section to the database if it doesn't exist
        let { data: sectionData, error: sectionError } = await supabase
          .from('sections')
          .select()
          .eq('name', section.section);

        if (sectionError) {
          throw new Error('Error fetching sections');
        }

        if (!sectionData || sectionData.length === 0) {
          const { data, error: insertError } = await supabase
            .from('sections')
            .insert({ name: section.section })
            .select();
          if (insertError) {
            throw new Error('Error inserting sections');
          }
          sectionData = data;
        }

        // Add tasks to the database
        for (const task of section.tasks) {
          const sectionId = sectionData[0].section_id;
          const { error: taskError } = await supabase.from('tasks').insert({
            section_id: sectionId,
            name: task.title,
            details: task.description,
            status: 'pending',
          });

          if (taskError) {
            throw new Error('Error inserting tasks');
          }
        }
      }

      return c.json({ ok: true, message: 'Survey data received!' }, 201);
    } catch (error) {
      console.error('Error processing request:', error);
      return c.json({ ok: false, message: 'Internal Server Error' }, 500);
    }
  }
);

export type AppType = typeof app;
export default app;
