/**
 * @fileoverview This file initializes the AI (Genkit) plugin.
 *
 * It is used by flows to get a reference to the AI object.
 */
import {googleAI} from '@genkit-ai/google-genai';
import {genkit} from 'genkit';

// This is the AI object that will be used by all flows.
// It is initialized with the Google AI plugin.
// The API key is read from the GEMINI_API_KEY environment variable.
//
// You can add other plugins to the array, such as a vector database.
export const ai = genkit({
  plugins: [googleAI({apiVersion: 'v1beta'})],
});
