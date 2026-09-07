import {
  AIAnalysisResult,
  AIProvider,
  CallRecord,
  CallScoreBreakdown,
  FollowUpItem,
  Objection,
  PainPoint,
  ProductKnowledgeItem,
  SalesFramework,
  SalesStage,
  TranscriptItem,
} from '../../types';

export class SmartRulesAIProvider implements AIProvider {
  name = 'Smart Sales Framework Engine (Local Rule Engine)';

  async analyzeConversation(context: {
    currentStage: SalesStage;
    transcripts: TranscriptItem[];
    latestMessage: string;
    framework: SalesFramework;
    productKnowledge: ProductKnowledgeItem[];
  }): Promise<AIAnalysisResult> {
    const text = (context.latestMessage || '').toLowerCase();
    const history = context.transcripts.map((t) => t.text.toLowerCase()).join(' ');

    let stage: SalesStage = context.currentStage;
    let intent: 'low' | 'medium' | 'high' = 'low';
    const pain_points: PainPoint[] = [];
    const objections: Objection[] = [];
    const buying_signals: string[] = [];
    let detected_label = 'DISCOVERY';
    let suggested_response = '';
    let next_question = '';
    let reason = 'Analyzed latest prospect input based on Smart Menu framework rules.';

    // Check for OBJECTIONS
    if (
      text.includes('mahal') ||
      text.includes('expensive') ||
      text.includes('high price') ||
      text.includes('budget')
    ) {
      stage = 'objection_handling';
      intent = 'medium';
      objections.push({
        type: 'PRICE',
        confidence: 0.96,
        underlyingConcern: 'Perceived value vs cost / uncertainty about ROI',
      });
      detected_label = 'Price Objection';
      suggested_response =
        'Gets ko po, Sir. Para makita natin kung worth it talaga, ask ko lang po — magkano po usually yung value ng time or orders na nawawala kapag mabagal yung ordering process?';
      next_question = 'Aside from price, may concern pa po ba kayo sa system?';
      reason = 'Price objection detected ("medyo mahal"). Applied value-anchoring framework response.';
    } else if (text.includes('static') || text.includes('view lang') || text.includes('manual')) {
      // PAIN DISCOVERY
      stage = 'pain_discovery';
      intent = 'medium';
      pain_points.push({
        name: 'STATIC MENU / NO DIRECT ORDERING',
        severity: 'medium',
        category: 'Efficiency',
      });
      detected_label = 'Static Menu Pain Point';
      suggested_response =
        'Ah I see, static menu lang po pala. Ask ko lang po Sir, napapansin niyo po ba na kailangan pa rin maghintay ng customers bago makuha ang orders kahit naka-QR na?';
      next_question = 'Usually po ba nadadagdagan yung waiting time kapag peak hours?';
      reason = 'Prospect confirmed current QR menu is static only. Highlighted lack of digital ordering efficiency.';
    } else if (text.includes('qr menu') || text.includes('may system') || text.includes('meron na')) {
      // EXISTING SOLUTION DETECTED
      stage = 'discovery';
      intent = 'medium';
      detected_label = 'Existing Solution';
      suggested_response =
        'Ah okay po, Sir. Ask ko lang po, yung QR menu niyo currently pang-view lang ba ng menu or nakakapag-order na rin directly yung customers?';
      next_question = 'Nakakareceive din ba ng realtime order notifications ang kitchen niyo?';
      reason = 'Existing QR menu detected. Probed for specific functionality (view-only vs ordering).';
    } else if (text.includes('magkano') || text.includes('how much') || text.includes('pricing') || text.includes('cost')) {
      // BUYING SIGNAL
      stage = 'qualification';
      intent = 'high';
      buying_signals.push('Price Inquiry');
      detected_label = 'Price Inquiry / Buying Signal';
      suggested_response =
        'Sure po, Sir! Depende po sa number of tables at branches niyo. Para ma-customize natin ang exact quote, ilang tables po currently ang dine-in area niyo?';
      next_question = 'Ilang branches po ang minamanage niyo currently?';
      reason = 'Prospect inquired about price. High intent signal detected; anchoring value before giving exact quote.';
    } else if (text.includes('demo') || text.includes('start') || text.includes('paano payment') || text.includes('set up')) {
      // CLOSING SIGNAL
      stage = 'closing';
      intent = 'high';
      buying_signals.push('Demo Request / Strong Closing Signal');
      detected_label = 'Closing Signal';
      suggested_response =
        'Based sa mga sinabi niyo po, mukhang fit na fit talaga ang Smart Menu sa current setup niyo. Would you like us to set up the Smart Menu for you this week?';
      next_question = 'Anong day po ang pinaka-convenient para sa fast onboarding session natin?';
      reason = 'Strong buying intent identified. Recommending immediate close.';
    } else {
      // DEFAULT DISCOVERY/RAPPORT
      stage = context.currentStage || 'discovery';
      intent = 'low';
      detected_label = 'Discovery Inquiry';
      suggested_response =
        'Salamat sa pagshare Sir! Para mas ma-evaluate natin ang operational needs niyo, ilang tables po total angina-accommodate niyo everyday?';
      next_question = 'May dedicated cashier and kitchen display unit na po ba kayo?';
      reason = 'Standard discovery inquiry following Smart Menu framework.';
    }

    return {
      current_stage: stage,
      intent,
      pain_points,
      objections,
      buying_signals,
      suggested_response,
      next_question,
      reason,
      confidence: 0.94,
      detected_label,
    };
  }

  async quickAction(
    action: 'SHORTER' | 'MORE_NATURAL' | 'MORE_PERSUASIVE' | 'NEXT_QUESTION' | 'HANDLE_OBJECTION' | 'SKIP',
    currentSuggestion: string,
    context: { currentStage: SalesStage; latestMessage: string; objections: Objection[] }
  ): Promise<string> {
    switch (action) {
      case 'SHORTER':
        return currentSuggestion
          .replace(/Ask ko lang po Sir, /g, '')
          .replace(/Para makita natin kung worth it talaga, /g, '')
          .replace(/Based sa mga sinabi niyo po, /g, '')
          .slice(0, 100) + '...';

      case 'MORE_NATURAL':
        return `Opo Sir, gets ko. ${currentSuggestion.replace('Gets ko po, Sir. ', '')}`;

      case 'MORE_PERSUASIVE':
        return `${currentSuggestion} Marami na rin po tayong partner restaurants na nadagdagan ng 35% ang daily table turnover gamit ito.`;

      case 'NEXT_QUESTION':
        return 'Aside from this, ano po ba ang pinakanakaka-delay sa ordering process niyo kapag puno ang restaurant?';

      case 'HANDLE_OBJECTION':
        return 'Naiintindihan ko po Sir. Karamihan ng clients namin ganyan din ang iniisip nung una, pero nare-realize nila na nababawi agad ang cost dahil walang na-mimisna order.';

      case 'SKIP':
        return 'Understood Sir. Tell me more about your peak hour operations.';

      default:
        return currentSuggestion;
    }
  }

  async generatePostCallReport(call: CallRecord): Promise<{
    scoreBreakdown: CallScoreBreakdown;
    summary: string;
    followUp: FollowUpItem;
  }> {
    const hasObjection = call.transcripts.some((t) => t.text.toLowerCase().includes('mahal'));
    const score = hasObjection ? 88 : 94;

    return {
      scoreBreakdown: {
        overallScore: score,
        rapportScore: 95,
        discoveryScore: 92,
        painDiscoveryScore: 90,
        qualificationScore: 88,
        solutionScore: 94,
        objectionHandlingScore: hasObjection ? 85 : 90,
        closingScore: 86,
        whatWentWell: [
          'Excellent discovery questioning regarding current QR menu setup.',
          'Maintained high empathy and natural Taglish conversational rhythm.',
          'Promptly identified static menu pain point.',
        ],
        missedOpportunities: [
          'Could have quantified the financial loss of missed orders earlier during pain clarification.',
        ],
        improvements: [
          'Ask deeper follow-up questions when the prospect mentions price before giving full quotes.',
        ],
      },
      summary:
        `Prospect ${call.prospectName} (${call.businessName || 'Restaurant Client'}) has an existing static QR menu. ` +
        `Main pain point identified is lack of interactive direct ordering and customer waiting time during peak hours. High interest in Smart Menu automated ordering.`,
      followUp: {
        id: `fu_${Date.now()}`,
        recommendedAction: 'Send ROI calculation deck and schedule 15-minute live demo on site.',
        scheduledFor: new Date(Date.now() + 86400000 * 2).toISOString(),
        notes: 'Follow up with Juan regarding table QR standee samples.',
        isCompleted: false,
      },
    };
  }
}

export class GeminiAIProvider implements AIProvider {
  name = 'Google Gemini 1.5/2.0 API';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async analyzeConversation(context: {
    currentStage: SalesStage;
    transcripts: TranscriptItem[];
    latestMessage: string;
    framework: SalesFramework;
    productKnowledge: ProductKnowledgeItem[];
  }): Promise<AIAnalysisResult> {
    if (!this.apiKey) {
      // Fallback to local rule provider if API key not set
      const fallback = new SmartRulesAIProvider();
      return fallback.analyzeConversation(context);
    }

    try {
      const systemPrompt = `
You are an expert real-time AI Sales Closer Coach.
Analyze the live sales conversation transcript between a Closer and a Prospect.
Respond ONLY with a valid JSON object matching this schema:
{
  "current_stage": "rapport" | "discovery" | "pain_discovery" | "pain_clarification" | "qualification" | "solution" | "objection_handling" | "closing",
  "intent": "low" | "medium" | "high",
  "pain_points": [ { "name": string, "severity": "low" | "medium" | "high" } ],
  "objections": [ { "type": string, "confidence": number, "underlyingConcern": string } ],
  "buying_signals": [ string ],
  "suggested_response": string,
  "next_question": string,
  "reason": string,
  "confidence": number,
  "detected_label": string
}
Rules:
1. Suggested responses MUST default to conversational Taglish (Filipino + English) appropriate for sales closers in the Philippines.
2. Structure suggested response as: ACKNOWLEDGE + ANSWER/PITCH + NEXT QUESTION. Keep it 1-3 sentences.
3. Align with framework name: ${context.framework.name}.
`;

      const userPrompt = `
Current Stage: ${context.currentStage}
Latest Prospect Statement: "${context.latestMessage}"
Transcript History: ${JSON.stringify(context.transcripts.slice(-6))}
Product Context: ${JSON.stringify(context.productKnowledge)}
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt + '\n\n' + userPrompt }] }],
            generationConfig: { responseMimeType: 'application/json' },
          }),
        }
      );

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        return JSON.parse(rawText) as AIAnalysisResult;
      }
    } catch (e) {
      console.warn('Gemini API call failed, using Smart Rules local fallback', e);
    }

    const fallback = new SmartRulesAIProvider();
    return fallback.analyzeConversation(context);
  }

  async quickAction(
    action: 'SHORTER' | 'MORE_NATURAL' | 'MORE_PERSUASIVE' | 'NEXT_QUESTION' | 'HANDLE_OBJECTION' | 'SKIP',
    currentSuggestion: string,
    context: { currentStage: SalesStage; latestMessage: string; objections: Objection[] }
  ): Promise<string> {
    const fallback = new SmartRulesAIProvider();
    return fallback.quickAction(action, currentSuggestion, context);
  }

  async generatePostCallReport(call: CallRecord): Promise<{
    scoreBreakdown: CallScoreBreakdown;
    summary: string;
    followUp: FollowUpItem;
  }> {
    const fallback = new SmartRulesAIProvider();
    return fallback.generatePostCallReport(call);
  }
}
