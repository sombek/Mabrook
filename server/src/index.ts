import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

type Bindings = {
  OPENAI_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();
import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database

const route = app.post(
  '/tasks',
  zValidator(
    'json',
    z.array(
      z.object({
        question: z.string(),
        // could be a string, number, or boolean
        answer: z.string() || z.number() || z.boolean(),
      })
    )
  ),
  async (c) => {
    const token = c.req.header('Authorization');
    if (!token) {
      return c.json(
        {
          ok: false,
          message: 'Unauthorized',
        },
        401
      );
    }
    const supabase = createClient(
      'https://ohgdivtvldokcfagsywc.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oZ2RpdnR2bGRva2NmYWdzeXdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY2MDI4OTIsImV4cCI6MjA0MjE3ODg5Mn0.nazr-TiKx95RCTxOZMpelc0bgAyZDyGFbZwMlI_inS8',
      { global: { headers: { Authorization: c.req.header('Authorization')! } } }
    );
    const resp = await supabase.auth.getUser(token.replace('Bearer ', ''));

    // Handle the survey input array
    const surveyInputs = c.req.valid('json');

    // surveyInputs.forEach((input) => {
    //   console.log('Received survey input:', input);
    // });

    const r = await supabase.auth.getSession();
    console.log(r);
    const response = await supabase.from('sections').insert({
      name: 'Survey',
      description: JSON.stringify(surveyInputs),
    });
    console.log(response);
    return c.json(
      {
        ok: true,
        message: 'Survey data received!',
      },
      201
    );
  }
);

export type AppType = typeof route;
export default app;

// const honoClient = hc<AppType>('');
// export type HonoClientType = typeof honoClient; // Needed to fix webstorm types issue

//
// app.get('/', async (c) => {
//   let jwt = c.req.header('Authorization');
//   if (!jwt) {
//     return c.text('Unauthorized');
//   }
//   jwt = jwt.replace('Bearer ', '');
//
//   const {
//     data: { user },
//   } = await supabase.auth.getUser(jwt);
//   console.log(user);
//
//   const SECRET_KEY = c.env.OPENAI_API_KEY;
//   return c.text(SECRET_KEY);
//   // return c.text('Hello Hono!');
// });
