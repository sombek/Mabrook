// generateTasks.ts
import { Bindings } from '../bindings';
import OpenAI from 'openai';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';

export async function generateTasksFromSurvey(
  env: Bindings,
  surveyInputs: { question: string; answer: string | number | boolean }[]
) {
  const SECTIONS = ['VENUE', 'GUESTS', 'BUDGET', 'WEDDING_DRESS', 'MUSIC', 'CATERING', 'MAKEUP'];

  const prompt = {
    context:
      'You are building a wedding planner app. The app should generate tasks for each section based on the survey inputs. The tasks should be in Arabic and include 3-5 tasks per section.',
    survey: surveyInputs.map((input) => `${input.question}: ${input.answer}`).join('\n'),
    sections: SECTIONS,
    outputInstructions:
      'Please generate tasks for each section based on the survey inputs. The output format should be a JSON object with the section name as the key and the tasks as the value.',
  };

  const TasksSchema = z.object({
    section: z.string(),
    tasks: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
      })
    ),
  });
  const allResponseSchema = z.object({
    tasks: z.array(TasksSchema),
  });
  console.log('Generating tasks for survey');
  const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  const completion = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: prompt.context },
      {
        role: 'system',
        content: `Sections: ${prompt.sections.join(', ')} use them as keys never change them`,
      },
      { role: 'user', content: prompt.survey },
    ],
    response_format: zodResponseFormat(allResponseSchema, 'tasks'),
  });

  try {
    const event = completion.choices[0].message;
    if (event.content !== null) {
      const parsedResponse = JSON.parse(event.content);
      return parsedResponse.tasks;
    }
  } catch (error) {
    console.error('Error parsing response:', error);
  }

  return [];
}
