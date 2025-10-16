/**
 * @fileOverview A flow that generates an affiliate link.
 */
'use server';

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateAffiliateLinkInputSchema = z.object({
  casinoUrl: z.string().describe('The URL of the casino.'),
  userId: z.string().describe('The ID of the user.'),
});
export type GenerateAffiliateLinkInput = z.infer<
  typeof GenerateAffiliateLinkInputSchema
>;

const GenerateAffiliateLinkOutputSchema = z.object({
  affiliateLink: z
    .string()
    .describe('The generated affiliate link for the user.'),
});
export type GenerateAffiliateLinkOutput = z.infer<
  typeof GenerateAffiliateLinkOutputSchema
>;

const prompt = ai.definePrompt({
  name: 'generateAffiliateLinkPrompt',
  input: {schema: GenerateAffiliateLinkInputSchema},
  output: {schema: GenerateAffiliateLinkOutputSchema},
  prompt: `You are an expert at creating affiliate links.

You will use this information to generate an affiliate link for the user.
The affiliate link must include the user ID as a query parameter.
The parameter name must be "affiliate_id".

Use the following as the primary source of information:

Casino URL: {{{casinoUrl}}}
User ID: {{{userId}}}`,
});

export const generateAffiliateLinkFlow = ai.defineFlow(
  {
    name: 'generateAffiliateLinkFlow',
    inputSchema: GenerateAffiliateLinkInputSchema,
    outputSchema: GenerateAffiliateLinkOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

export async function generateAffiliateLink(
  input: GenerateAffiliateLinkInput
): Promise<GenerateAffiliateLinkOutput> {
  return generateAffiliateLinkFlow(input);
}
