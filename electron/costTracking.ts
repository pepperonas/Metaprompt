import { getHistory } from './store';
import { calculateCost } from '../src/utils/costCalculator';
import type { Provider, TokenUsage } from '../src/types';

export interface CostSummary {
  provider: Provider;
  totalCost: number;
  requestCount: number;
  totalInputTokens: number;
  totalOutputTokens: number;
}

export const getCostsLast30Days = (provider: Provider): CostSummary => {
  const history = getHistory();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  console.log(`[CostTracking] Getting costs for provider: ${provider}, history entries: ${history.length}`);

  const relevantEntries = history.filter((entry: any) => {
    const entryDate = new Date(entry.timestamp);
    const isRelevant = (
      entry.provider === provider &&
      entry.success === true &&
      entryDate >= thirtyDaysAgo &&
      entry.tokenUsage
    );
    
    if (isRelevant) {
      console.log(`[CostTracking] Found relevant entry:`, {
        provider: entry.provider,
        model: entry.model,
        timestamp: entry.timestamp,
        tokenUsage: entry.tokenUsage,
        cost: entry.cost,
      });
    }
    
    return isRelevant;
  });

  console.log(`[CostTracking] Found ${relevantEntries.length} relevant entries for ${provider}`);

  let totalCost = 0;
  let totalInputTokens = 0;
  let totalOutputTokens = 0;

  relevantEntries.forEach((entry: any) => {
    if (entry.tokenUsage && entry.cost !== undefined) {
      totalCost += entry.cost;
      totalInputTokens += entry.tokenUsage.inputTokens || 0;
      totalOutputTokens += entry.tokenUsage.outputTokens || 0;
      console.log(`[CostTracking] Using stored cost: $${entry.cost} for model ${entry.model}`);
    } else if (entry.tokenUsage) {
      // Fallback: Berechne Kosten falls nicht gespeichert
      const cost = calculateCost(entry.provider, entry.model, entry.tokenUsage);
      totalCost += cost;
      totalInputTokens += entry.tokenUsage.inputTokens || 0;
      totalOutputTokens += entry.tokenUsage.outputTokens || 0;
      console.log(`[CostTracking] Calculated cost: $${cost} for model ${entry.model}`);
    }
  });

  const result = {
    provider,
    totalCost,
    requestCount: relevantEntries.length,
    totalInputTokens,
    totalOutputTokens,
  };

  console.log(`[CostTracking] Final result for ${provider}:`, result);

  return result;
};

