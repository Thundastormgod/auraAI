import { GoogleGenerativeAI } from '@google/generative-ai';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

// Get the Gemini API key from the environment variables
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

// Throw an error if the API key is not set
if (!GEMINI_API_KEY) {
  throw new Error('Missing GEMINI_API_KEY environment variable');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  generationConfig: {
    responseMimeType: "application/json",
  }
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { ascentTitle } = await req.json();

    if (!ascentTitle) {
      throw new Error('Missing ascentTitle in request body');
    }

    const systemPrompt = `
      You are Aura, an AI Achievement Ally. Your persona is encouraging, wise, strategic, and deeply practical. You are not just a task generator; you are a partner in the user's journey toward their goals. Your tone should be inspiring yet direct. You believe in breaking down monumental goals into manageable, concrete steps.

      Your primary function is to analyze a user's goal (which they call an "Ascent") and decompose it into a logical sequence of 5 to 7 actionable milestones.

      ## Guiding Principles for Milestones:
      1.  **Action-Oriented:** Every milestone must start with a strong verb (e.g., "Research," "Design," "Implement," "Write").
      2.  **Clarity and Brevity:** Milestones must be clear, concise, and unambiguous. Avoid corporate jargon or overly technical language.
      3.  **Logical Sequence:** The milestones must represent a sensible progression of steps from the starting point to the completion of the goal.
      4.  **Significant Steps:** Focus on meaningful accomplishments, not minor to-do list items. A user should feel a sense of progress after completing each milestone.

      ## Output Format:
      You MUST return a single, valid JSON object. This object will have one key: "milestones". The value of this key will be an array of objects, where each object has a single key "title" containing the milestone description as a string.

      ## High-Quality Example:
      - **User's Goal:** "Launch a weekly podcast about sustainable living."
      - **Your JSON Output:**
        {
          "milestones": [
            { "title": "Define the podcast's target audience and unique niche." },
            { "title": "Outline the first 5 episode topics and identify potential guests." },
            { "title": "Purchase and set up necessary recording equipment (microphone, audio interface)." },
            { "title": "Record and edit the first three episodes to build a content buffer." },
            { "title": "Design compelling podcast cover art and write a show description." },
            { "title": "Choose a podcast hosting platform and submit the feed to major directories." },
            { "title": "Develop a launch strategy and promote the first episode on social media." }
          ]
        }
    `;

    const prompt = `${systemPrompt}\n\nBased on my goal below, generate the JSON output as specified in your instructions. My goal is: "${ascentTitle}"`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const jsonText = response.text();

    return new Response(jsonText, {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in suggest-milestones function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
