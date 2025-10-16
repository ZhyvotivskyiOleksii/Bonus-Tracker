/**
 * @fileoverview This file initializes the AI (Genkit) plugin for Next.js App Router.
 */
'use server';

import {NextRequest} from 'next/server';
import './genkit';

// This is the handler for the Genkit API.
// It is exported from this file and used by the Next.js App Router.
//
// See: `src/app/api/genkit/[[...path]]/route.ts`
export async function POST(req: NextRequest) {
  const {POST} = await import('@genkit-ai/next');
  return POST(req);
}
