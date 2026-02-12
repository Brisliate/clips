import { UserRole, Platform, CampaignStatus, SubmissionStatus, TransactionType, TransactionStatus } from "@prisma/client";

export type { UserRole, Platform, CampaignStatus, SubmissionStatus, TransactionType, TransactionStatus };

export interface CampaignFilters {
  platform?: Platform;
  minCpm?: number;
  maxCpm?: number;
  niche?: string;
  minBudget?: number;
  minFollowers?: number;
  status?: CampaignStatus;
}

export interface DashboardStats {
  totalViews: number;
  totalSpend: number;
  activeCreators: number;
  activeCampaigns: number;
  totalEarnings?: number;
  pendingEarnings?: number;
}
