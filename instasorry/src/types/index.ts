export interface FollowerEntry {
  username: string;
  fullName?: string;
  profileUrl?: string;
}

export interface SnapshotDiff {
  unfollowed: FollowerEntry[];
  newFollowers: FollowerEntry[];
  notFollowingBack: FollowerEntry[];
  userDoesNotFollowBack: FollowerEntry[];
  followerCount: number;
  followingCount: number;
}

export interface DashboardStats {
  followerCount: number;
  followingCount: number;
  notFollowingBack: number;
  userDoesNotFollowBack: number;
  unfollowed: number;
  newFollowers: number;
  lastSyncAt: Date | null;
}

export interface InstagramExportData {
  followers: FollowerEntry[];
  following: FollowerEntry[];
}

export type PlanType = "MONTHLY" | "ANNUAL";
export type SubscriptionStatus = "TRIALING" | "ACTIVE" | "PAST_DUE" | "CANCELED" | "UNPAID";
