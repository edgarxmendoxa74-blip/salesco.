export type SalesStage =
  | 'rapport'
  | 'discovery'
  | 'pain_discovery'
  | 'pain_clarification'
  | 'qualification'
  | 'solution'
  | 'objection_handling'
  | 'closing';

export type BuyingIntent = 'low' | 'medium' | 'high';

export type CallOutcome =
  | 'closed_won'
  | 'closed_lost'
  | 'follow_up'
  | 'not_qualified'
  | 'no_decision'
  | 'in_progress';

export type Speaker = 'prospect' | 'closer' | 'system';

export type AudioSourceType = 'microphone' | 'voip' | 'upload' | 'demo';

export interface TranscriptItem {
  id: string;
  speaker: Speaker;
  text: string;
  timestamp: string;
  confidence: number;
}

export interface PainPoint {
  name: string;
  severity: 'low' | 'medium' | 'high';
  category?: string;
}

export interface Objection {
  type: string;
  confidence: number;
  underlyingConcern?: string;
  closerResponse?: string;
  aiEvaluation?: string;
  betterResponse?: string;
}

export interface AIAnalysisResult {
  current_stage: SalesStage;
  intent: BuyingIntent;
  pain_points: PainPoint[];
  objections: Objection[];
  buying_signals: string[];
  suggested_response: string;
  next_question: string;
  reason: string;
  confidence: number;
  detected_label?: string;
}

export interface SalesStageConfig {
  key: SalesStage;
  displayName: string;
  order: number;
  objective: string;
  suggestedQuestions: string[];
}

export interface FrameworkRule {
  stageKey: SalesStage;
  ruleType: 'qualification' | 'pain_discovery' | 'objection' | 'closing';
  ruleCondition: string;
  approvedResponse: string;
}

export interface SalesFramework {
  id: string;
  name: string;
  description: string;
  stages: SalesStageConfig[];
  rules: FrameworkRule[];
  forbiddenBehaviors: string[];
  isDefault?: boolean;
}

export interface ProductKnowledgeItem {
  id: string;
  productId: string;
  productName: string;
  category: 'feature' | 'pricing' | 'faq' | 'policy' | 'competitor';
  title: string;
  content: string;
  benefits: string[];
}

export interface ObjectionItem {
  id: string;
  objectionText: string;
  category: 'price' | 'existing_solution' | 'authority' | 'timing' | 'trust';
  idealResponse: string;
  followUpQuestion: string;
  underlyingConcern: string;
}

export interface TrainingExample {
  id: string;
  prospectStatement: string;
  closerResponse: string;
  whyItWorked: string;
  stage: SalesStage;
  objectionType?: string;
}

export interface QualificationStatus {
  decisionMaker: 'YES' | 'NO' | 'UNKNOWN';
  pain: BuyingIntent;
  urgency: BuyingIntent;
  budget: BuyingIntent;
  fit: 'HIGH' | 'MEDIUM' | 'LOW';
  buyingIntent: BuyingIntent;
}

export interface CallScoreBreakdown {
  overallScore: number;
  rapportScore: number;
  discoveryScore: number;
  painDiscoveryScore: number;
  qualificationScore: number;
  solutionScore: number;
  objectionHandlingScore: number;
  closingScore: number;
  whatWentWell: string[];
  missedOpportunities: string[];
  improvements: string[];
}

export interface FollowUpItem {
  id: string;
  recommendedAction: string;
  scheduledFor?: string;
  notes?: string;
  isCompleted?: boolean;
}

export interface CallRecord {
  id: string;
  prospectName: string;
  businessName: string;
  contactPhone?: string;
  date: string;
  durationSeconds: number;
  currentStage: SalesStage;
  buyingIntent: BuyingIntent;
  outcome: CallOutcome;
  score?: number;
  audioSourceType: AudioSourceType;
  transcripts: TranscriptItem[];
  analysis?: AIAnalysisResult;
  qualification?: QualificationStatus;
  scoreBreakdown?: CallScoreBreakdown;
  followUp?: FollowUpItem;
}

export interface CloserUser {
  id: string;
  fullName: string;
  email: string;
  role: 'admin' | 'manager' | 'closer';
  quotaTarget: number;
  conversionRate: number;
  totalCalls: number;
  averageScore: number;
  avatarUrl?: string;
}

/* Abstraction Interfaces */
export interface AudioCaptureProvider {
  name: string;
  start(): Promise<void>;
  stop(): Promise<void>;
  pause(): void;
  resume(): void;
  onAudioData(callback: (data: Blob | Float32Array) => void): void;
  onError(callback: (err: Error) => void): void;
}

export interface TranscriptionProvider {
  name: string;
  start(): Promise<void>;
  stop(): Promise<void>;
  pause(): void;
  resume(): void;
  onTranscript(callback: (item: TranscriptItem) => void): void;
  onError(callback: (err: Error) => void): void;
}

export interface AIProvider {
  name: string;
  analyzeConversation(context: {
    currentStage: SalesStage;
    transcripts: TranscriptItem[];
    latestMessage: string;
    framework: SalesFramework;
    productKnowledge: ProductKnowledgeItem[];
    qualification?: QualificationStatus;
  }): Promise<AIAnalysisResult>;
  
  quickAction(
    action: 'SHORTER' | 'MORE_NATURAL' | 'MORE_PERSUASIVE' | 'NEXT_QUESTION' | 'HANDLE_OBJECTION' | 'SKIP',
    currentSuggestion: string,
    context: { currentStage: SalesStage; latestMessage: string; objections: Objection[] }
  ): Promise<string>;

  generatePostCallReport(call: CallRecord): Promise<{
    scoreBreakdown: CallScoreBreakdown;
    summary: string;
    followUp: FollowUpItem;
  }>;
}
