// Import dependencies
import { z } from 'zod';
import OpenAI from 'openai';
import Axios from 'axios';

// Define the schema using Zod for validating an array of question-answer pairs
const SurveyItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const SurveyListSchema = z.array(SurveyItemSchema);
// wedding app
const DEFAULT_SECTIONS = [
  'Venue Selection',
  'Wedding Dress',
  'Wedding Cake',
  'Wedding Invitations',
  'Photographer',
  'Videographer',
  'Wedding Planner',
  'Wedding Decor',
  'Wedding Entertainment',
  'Wedding Catering',
  'Wedding Transportation',
];

// Magic function (replace with your actual logic)
const magicFunction = async (surveyData: { question: string; answer: string }[]) => {
  // Example logic for processing
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  const openai = new OpenAI({
    apiKey: apiKey,
  });

  // the goal is to generate json contains tasks based on the user's answers
  // should be in 2 sections 1- Sections and each section contains tasks
  const prompt = `
  You are a bot helping a user plan their wedding. 
  
  Create a JSON object that contains the tasks based on the user's answers.
  The user answered the following questions:
  ${surveyData.map((item) => `Question: ${item.question}, Answer: ${item.answer}`).join('\n')}
  
  The JSON object should have the following structure:
  {
    "sections": [
      {
        "title": "Section 1",
        "tasks": [
          {
            "title": "Task 1",
            "description": "Description of task 1",
          },
          {
            "title": "Task 2",
            "description": "Description of task 2",
          }
        ]
      },
      {
        "title": "Section 2",
        "tasks": [
          {
            "title": "Task 3",
            "description": "Description of task 3",
          }
        ]
      }
    ]
  }
  
  The tasks should be based on the user's answers to the questions.
  
  Make sure to include at least 2 sections and 3 tasks.
  Use the following sections as a starting point:
  ${DEFAULT_SECTIONS.join('\n')}
  
  
  
  
  
  `;

  // Documentation here: https://github.com/openai/openai-node
  const chatCompletion = await openai.chat.completions.create({
    // Choose model from here: https://platform.openai.com/docs/models
    model: 'gpt-3.5-turbo',
    stream: false,
  });
  openai;

  console.log(chatCompletion);
  const reply = chatCompletion.choices[0].message.content;
  console.log(reply);
  return reply;
  // return new Response(reply, {
  //   headers: { 'Content-Type': 'text/plain' },
  // });
};

// Supabase function handler
Deno.serve(async (req: Request) => {
  // Ensure the request is a POST request
  if (req.method !== 'POST') {
    return new Response('Only POST requests are allowed', { status: 405 });
  }

  try {
    // Parse the request body
    const body = await req.json();

    // Validate the request body to ensure it's an array of question-answer pairs
    const surveyData = SurveyListSchema.parse(body);

    // Process each question-answer pair using the magic function
    const results = await magicFunction(surveyData);

    // Return a success response with all the results
    return new Response(JSON.stringify({ results }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    // Handle validation or other errors
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
