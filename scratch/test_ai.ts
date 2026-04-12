import { fetchBusinessInfoWithAI } from '../src/app/actions/ai_onboarding';
import * as dotenv from 'dotenv';
dotenv.config();

async function test() {
  console.log("Testing AI Onboarding with real URL...");
  const result = await fetchBusinessInfoWithAI('https://www.conciergeai.uk/');
  console.log("RESULT:", JSON.stringify(result, null, 2));
}

test().catch(console.error);
