import { SalesFramework, SalesStage, SalesStageConfig } from '../../types';

export class SalesFrameworkEngine {
  private framework: SalesFramework;
  private currentStageKey: SalesStage = 'rapport';
  private askedQuestions: Set<string> = new Set();
  private collectedInformation: Map<string, string> = new Map();

  constructor(framework: SalesFramework) {
    this.framework = framework;
  }

  getFramework(): SalesFramework {
    return this.framework;
  }

  getCurrentStage(): SalesStageConfig {
    const stage = this.framework.stages.find((s) => s.key === this.currentStageKey);
    return (
      stage || {
        key: 'discovery',
        displayName: 'Discovery',
        order: 2,
        objective: 'Discover prospect setup',
        suggestedQuestions: [],
      }
    );
  }

  setStage(stageKey: SalesStage): void {
    this.currentStageKey = stageKey;
  }

  getNextStageKey(): SalesStage {
    const currentOrder = this.getCurrentStage().order;
    const nextStage = this.framework.stages.find((s) => s.order === currentOrder + 1);
    return nextStage ? nextStage.key : this.currentStageKey;
  }

  getSuggestedQuestionsForCurrentStage(): string[] {
    const stage = this.getCurrentStage();
    return stage.suggestedQuestions.filter((q) => !this.askedQuestions.has(q));
  }

  recordQuestionAsked(question: string): void {
    this.askedQuestions.add(question);
  }

  recordInformation(key: string, value: string): void {
    this.collectedInformation.set(key, value);
  }

  getCollectedInformation(): Record<string, string> {
    const res: Record<string, string> = {};
    this.collectedInformation.forEach((v, k) => {
      res[k] = v;
    });
    return res;
  }

  checkForbiddenBehavior(responseCandidate: string): string[] {
    const violations: string[] = [];
    const lower = responseCandidate.toLowerCase();

    this.framework.forbiddenBehaviors.forEach((behavior) => {
      if (
        behavior.toLowerCase().includes('discount') &&
        (lower.includes('free') || lower.includes('50% off'))
      ) {
        violations.push(`Violated rule: ${behavior}`);
      }
    });

    return violations;
  }
}
