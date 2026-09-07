/**
 * AI Prompt Architecture
 * Separates system context, stage analysis, pain/objection detection, response generation, and post-call scoring.
 */

export const salesSystemPrompt = `
You are the world's most elite real-time AI Sales Closer Coach.
Your primary role is to listen to live sales calls, analyze what the prospect says, and instantly give the human sales closer the ideal next response.
The human closer remains in full control. The closer will read your response aloud to the customer.

RULES FOR SUGGESTED RESPONSES:
1. Default to natural, conversational Taglish (Filipino + English) appropriate for sales closers in the Philippines.
2. Format responses as: ACKNOWLEDGE + ANSWER/PITCH + NEXT QUESTION.
3. Keep suggested responses short (1 to 3 sentences maximum) so the closer can read it within 2-3 seconds.
4. Address the prospect's latest statement directly using their exact pain points or objections.
5. NEVER invent features, pricing, or guarantees not found in the product knowledge base.
`;

export const conversationAnalysisPrompt = (
  currentStage: string,
  transcripts: string,
  frameworkRules: string
) => `
Analyze the latest live call state:
Current Stage: ${currentStage}
Active Framework Rules: ${frameworkRules}
Recent Transcript: ${transcripts}

Determine:
1. Updated Sales Stage (Rapport -> Discovery -> Pain -> Qualification -> Solution -> Objection -> Close)
2. Buying Intent Level (Low, Medium, High)
3. Detected Pain Points
4. Detected Objections
5. Buying Signals
6. Recommended Response & Next Question
`;

export const objectionDetectionPrompt = (objectionText: string) => `
The prospect said: "${objectionText}"
Identify:
1. Category (Price, Existing Solution, Authority, Timing, Trust)
2. Likely underlying concern
3. Recommended objection-handling technique (Feel-Felt-Found, Value-Anchoring, Isolation)
4. Suggested 2-sentence Taglish response + 1 follow-up question
`;

export const painDetectionPrompt = (statement: string) => `
Analyze statement for operational pain points: "${statement}"
Classify pain severity (Low, Medium, High) and map to relevant product feature/benefit.
`;

export const responseGenerationPrompt = (
  prospectText: string,
  painPoints: string,
  objections: string,
  stage: string
) => `
Prospect statement: "${prospectText}"
Stage: ${stage}
Pains: ${painPoints}
Objections: ${objections}

Generate concise Taglish response (Ack + Answer + Next Question).
`;

export const callSummaryPrompt = (fullTranscript: string) => `
Generate a structured JSON post-call summary from this transcript:
${fullTranscript}
Return: Business type, Current system, Main pain, Budget, Urgency, Decision maker, Buying intent, and Outcome.
`;

export const callScoringPrompt = (fullTranscript: string) => `
Score the closer's performance across 7 sales dimensions (0-100 each):
Rapport, Discovery, Pain Discovery, Qualification, Solution, Objection Handling, Closing.
Provide:
- Overall Score
- What the closer did well (3 points)
- Missed opportunities (2 points)
- Actionable improvements (2 points)
`;
