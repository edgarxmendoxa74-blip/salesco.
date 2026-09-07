import {
  CallRecord,
  CloserUser,
  ObjectionItem,
  ProductKnowledgeItem,
  SalesFramework,
  TrainingExample,
} from '../../types';

const STORAGE_KEYS = {
  CALLS: 'ai_copilot_calls_v1',
  FRAMEWORKS: 'ai_copilot_frameworks_v1',
  KNOWLEDGE: 'ai_copilot_knowledge_v1',
  OBJECTIONS: 'ai_copilot_objections_v1',
  TRAINING: 'ai_copilot_training_v1',
  SETTINGS: 'ai_copilot_settings_v1',
};

// Initial Seed Data for Demo Mode
const DEFAULT_SMART_MENU_FRAMEWORK: SalesFramework = {
  id: 'fw_smart_menu',
  name: 'Smart Menu Sales Framework',
  description: 'Default consultative sales framework for Smart Menu QR ordering solutions for restaurants.',
  isDefault: true,
  forbiddenBehaviors: [
    'Pitching full feature dump before discovery',
    'Inventing non-existent pricing or discounts',
    'Arguing with prospect regarding price objections',
    'Interupting prospect while explaining pain points',
  ],
  stages: [
    {
      key: 'rapport',
      displayName: 'Rapport',
      order: 1,
      objective: 'Establish connection and context. Do not pitch immediately.',
      suggestedQuestions: [
        'How is business today, Sir?',
        'Anong type of restaurant po ang minamanage niyo?',
        'Ilang branches po currently?',
      ],
    },
    {
      key: 'discovery',
      displayName: 'Discovery',
      order: 2,
      objective: 'Discover current ordering process, POS system, tables, and staff size.',
      suggestedQuestions: [
        'Ano po current setup niyo for taking customer orders?',
        'May QR menu na po ba kayo currently?',
        'Ilang tables po ang dine-in area niyo?',
      ],
    },
    {
      key: 'pain_discovery',
      displayName: 'Pain Discovery',
      order: 3,
      objective: 'Identify slow ordering, missed orders, waiter overload, customer waiting.',
      suggestedQuestions: [
        'Minsan po ba naiinip ang customers kapag puno ang tables?',
        'May instances po ba na nagkakamali sa kitchen order slips?',
      ],
    },
    {
      key: 'pain_clarification',
      displayName: 'Pain Clarification',
      order: 4,
      objective: 'Help prospect quantify business impact and lost revenue.',
      suggestedQuestions: [
        'How often po nangyayari yun during peak hours?',
        'Magkano po estimated order value ang nawawala kapag may umalis na customer dahil mabagal mag-take ng order?',
      ],
    },
    {
      key: 'qualification',
      displayName: 'Qualification',
      order: 5,
      objective: 'Determine decision maker, pain severity, urgency, and budget fit.',
      suggestedQuestions: [
        'Kayo po ba ang decision maker for restaurant technology upgrades?',
        'How soon niyo po plan ire-resolve itong bottleneck?',
      ],
    },
    {
      key: 'solution',
      displayName: 'Solution',
      order: 6,
      objective: 'Present problem-feature-benefit alignment. Direct ordering QR solution.',
      suggestedQuestions: [
        'What if directly na makakapag-order ang customers via QR menu without waiting for staff?',
      ],
    },
    {
      key: 'objection_handling',
      displayName: 'Objection Handling',
      order: 7,
      objective: 'Identify objection, address underlying concern, ask follow-up question.',
      suggestedQuestions: [
        'Bukod po sa price, may iba pa po ba kayong concern sa implementation?',
      ],
    },
    {
      key: 'closing',
      displayName: 'Closing',
      order: 8,
      objective: 'Detect strong buying signals and ask for the close.',
      suggestedQuestions: [
        'Would you like us to set up the Smart Menu for your main branch this week?',
      ],
    },
  ],
  rules: [
    {
      stageKey: 'objection_handling',
      ruleType: 'objection',
      ruleCondition: 'Prospect mentions price is high',
      approvedResponse:
        'Gets ko po, Sir. Para makita natin kung worth it talaga, ask ko lang po — magkano po usually yung value ng time or orders na nawawala kapag mabagal yung ordering process?',
    },
  ],
};

const DEFAULT_PRODUCT_KNOWLEDGE: ProductKnowledgeItem[] = [
  {
    id: 'pk_1',
    productId: 'prod_smart_menu',
    productName: 'Smart Menu QR System',
    category: 'feature',
    title: 'Direct Table QR Ordering',
    content: 'Customers scan table QR code to view menu, customize items, and submit orders directly to kitchen display without waiting for waiters.',
    benefits: ['Zero customer waiting time', 'Eliminates missed order slips', 'Increases table turnover by 30%'],
  },
  {
    id: 'pk_2',
    productId: 'prod_smart_menu',
    productName: 'Smart Menu QR System',
    category: 'pricing',
    title: 'Standard Tier Pricing',
    content: '₱1,999/month per branch inclusive of unlimited QR ordering, kitchen display dashboard, receipt printing integration, and 24/7 support.',
    benefits: ['No hidden transaction commissions', 'Cancel anytime', 'Free initial menu encoding'],
  },
  {
    id: 'pk_3',
    productId: 'prod_smart_menu',
    productName: 'Smart Menu QR System',
    category: 'faq',
    title: 'Internet Dependency Policy',
    content: 'Smart Menu includes offline local sync mode for POS printing even during temporary internet disconnections.',
    benefits: ['Uninterrupted operation during power outages', 'Local cashier print buffer'],
  },
];

const DEFAULT_OBJECTIONS: ObjectionItem[] = [
  {
    id: 'obj_1',
    objectionText: 'Medyo mahal naman.',
    category: 'price',
    idealResponse:
      'Gets ko po, Sir. Para makita natin kung worth it talaga, ask ko lang po — magkano po usually yung value ng time or orders na nawawala kapag mabagal yung ordering process?',
    followUpQuestion: 'Aside from price, may concern pa po ba kayo sa system?',
    underlyingConcern: 'Perceived value is uncertain relative to upfront monthly subscription.',
  },
  {
    id: 'obj_2',
    objectionText: 'May QR menu na kami ngayon.',
    category: 'existing_solution',
    idealResponse:
      'Ah okay po, Sir! Ask ko lang po, yung QR menu niyo currently pang-view lang ba ng menu or nakakapag-order na rin directly yung customers?',
    followUpQuestion: 'May realtime order notification din ba sa kitchen niyo?',
    underlyingConcern: 'Prospect assumes all QR menus have the exact same capabilities.',
  },
];

const DEFAULT_TRAINING_EXAMPLES: TrainingExample[] = [
  {
    id: 'te_1',
    prospectStatement: 'May QR menu na kami pero static lang.',
    closerResponse:
      'Ah okay po Sir, static lang pala. Kapag static kasi, kailangan pa rin mag-wait ng waiter to write down orders. With Smart Menu, derecho na sa kitchen kaya mas mabilis mag-turnover ng tables.',
    whyItWorked: 'Clarified difference between view-only QR and active ordering QR without discounting their existing tool.',
    stage: 'pain_discovery',
    objectionType: 'existing_solution',
  },
];

const MOCK_CALL_HISTORY: CallRecord[] = [
  {
    id: 'call_demo_1',
    prospectName: 'Juan Dela Cruz',
    businessName: "Juan's Restaurant",
    contactPhone: '+63 917 123 4567',
    date: new Date(Date.now() - 3600000 * 4).toISOString(),
    durationSeconds: 512,
    currentStage: 'closing',
    buyingIntent: 'high',
    outcome: 'closed_won',
    score: 94,
    audioSourceType: 'demo',
    transcripts: [
      { id: 't1', speaker: 'prospect', text: 'May QR menu na kami ngayon.', timestamp: '10:00:15', confidence: 0.98 },
      { id: 't2', speaker: 'closer', text: 'Ah okay po, Sir. Ask ko lang po, static lang ba or nakakapag-order na rin customers?', timestamp: '10:00:22', confidence: 0.99 },
      { id: 't3', speaker: 'prospect', text: 'Pero static lang siya.', timestamp: '10:00:35', confidence: 0.97 },
      { id: 't4', speaker: 'prospect', text: 'Medyo mahal naman pala.', timestamp: '10:02:10', confidence: 0.95 },
      { id: 't5', speaker: 'closer', text: 'Gets ko po Sir. Para makita natin kung worth it, magkano po usually lost revenue during peak hours?', timestamp: '10:02:25', confidence: 0.98 },
    ],
    analysis: {
      current_stage: 'closing',
      intent: 'high',
      pain_points: [{ name: 'STATIC MENU', severity: 'medium' }],
      objections: [{ type: 'PRICE', confidence: 0.95 }],
      buying_signals: ['Requested setup quote', 'Asked for demo'],
      suggested_response: 'Based sa mga sinabi niyo po, mukhang fit talaga ang system. Set up na natin starting this week?',
      next_question: 'Anong day po convenient for onboarding?',
      reason: 'High buying intent demonstrated after handling price objection.',
      confidence: 0.96,
      detected_label: 'Price Objection Handled',
    },
    qualification: {
      decisionMaker: 'YES',
      pain: 'high',
      urgency: 'high',
      budget: 'high',
      fit: 'HIGH',
      buyingIntent: 'high',
    },
    scoreBreakdown: {
      overallScore: 94,
      rapportScore: 96,
      discoveryScore: 95,
      painDiscoveryScore: 92,
      qualificationScore: 90,
      solutionScore: 95,
      objectionHandlingScore: 92,
      closingScore: 94,
      whatWentWell: ['Excellent rapport building', 'Direct objection handling without defensive language'],
      missedOpportunities: ['Could have asked for referral after closing'],
      improvements: ['Follow up with printed QR sample standee'],
    },
    followUp: {
      id: 'fu_1',
      recommendedAction: 'Send onboarding agreement and table QR template pack.',
      scheduledFor: new Date(Date.now() + 86400000).toISOString(),
      notes: 'Juan requested onboarding on Thursday morning.',
      isCompleted: false,
    },
  },
];

export class CallStorageService {
  static getCalls(): CallRecord[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CALLS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CALLS, JSON.stringify(MOCK_CALL_HISTORY));
      return MOCK_CALL_HISTORY;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      return MOCK_CALL_HISTORY;
    }
  }

  static saveCall(call: CallRecord): void {
    const calls = this.getCalls();
    const existingIndex = calls.findIndex((c) => c.id === call.id);
    if (existingIndex >= 0) {
      calls[existingIndex] = call;
    } else {
      calls.unshift(call);
    }
    localStorage.setItem(STORAGE_KEYS.CALLS, JSON.stringify(calls));
  }

  static getCallById(id: string): CallRecord | undefined {
    return this.getCalls().find((c) => c.id === id);
  }

  static getFramework(): SalesFramework {
    const raw = localStorage.getItem(STORAGE_KEYS.FRAMEWORKS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.FRAMEWORKS, JSON.stringify(DEFAULT_SMART_MENU_FRAMEWORK));
      return DEFAULT_SMART_MENU_FRAMEWORK;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      return DEFAULT_SMART_MENU_FRAMEWORK;
    }
  }

  static saveFramework(framework: SalesFramework): void {
    localStorage.setItem(STORAGE_KEYS.FRAMEWORKS, JSON.stringify(framework));
  }

  static getProductKnowledge(): ProductKnowledgeItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.KNOWLEDGE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.KNOWLEDGE, JSON.stringify(DEFAULT_PRODUCT_KNOWLEDGE));
      return DEFAULT_PRODUCT_KNOWLEDGE;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      return DEFAULT_PRODUCT_KNOWLEDGE;
    }
  }

  static saveProductKnowledge(items: ProductKnowledgeItem[]): void {
    localStorage.setItem(STORAGE_KEYS.KNOWLEDGE, JSON.stringify(items));
  }

  static getObjectionLibrary(): ObjectionItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.OBJECTIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.OBJECTIONS, JSON.stringify(DEFAULT_OBJECTIONS));
      return DEFAULT_OBJECTIONS;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      return DEFAULT_OBJECTIONS;
    }
  }

  static saveObjectionLibrary(items: ObjectionItem[]): void {
    localStorage.setItem(STORAGE_KEYS.OBJECTIONS, JSON.stringify(items));
  }

  static getTrainingExamples(): TrainingExample[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TRAINING);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TRAINING, JSON.stringify(DEFAULT_TRAINING_EXAMPLES));
      return DEFAULT_TRAINING_EXAMPLES;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      return DEFAULT_TRAINING_EXAMPLES;
    }
  }

  static saveTrainingExamples(items: TrainingExample[]): void {
    localStorage.setItem(STORAGE_KEYS.TRAINING, JSON.stringify(items));
  }
}
