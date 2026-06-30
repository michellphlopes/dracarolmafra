import { prisma } from "@/lib/prisma";
import { FollowerEntry, SnapshotDiff } from "@/types";

// Algoritmo principal de comparação de snapshots
export async function computeAndSaveSnapshot(
  instagramAccountId: string,
  followers: FollowerEntry[],
  following: FollowerEntry[]
): Promise<SnapshotDiff> {
  // Busca snapshot anterior mais recente
  const previousSnapshot = await prisma.instagramSnapshot.findFirst({
    where: { instagramAccountId },
    orderBy: { takenAt: "desc" },
    include: { followers: true, following: true },
  });

  // Cria novo snapshot
  const newSnapshot = await prisma.instagramSnapshot.create({
    data: {
      instagramAccountId,
      followerCount: followers.length,
      followingCount: following.length,
      followers: {
        create: followers.map((f) => ({
          username: f.username,
          fullName: f.fullName,
          profileUrl: f.profileUrl,
        })),
      },
      following: {
        create: following.map((f) => ({
          username: f.username,
          fullName: f.fullName,
          profileUrl: f.profileUrl,
        })),
      },
    },
  });

  const followerSet = new Set(followers.map((f) => f.username));
  const followingSet = new Set(following.map((f) => f.username));

  // Calcula listas derivadas
  const notFollowingBack: FollowerEntry[] = following.filter(
    (f) => !followerSet.has(f.username)
  );
  const userDoesNotFollowBack: FollowerEntry[] = followers.filter(
    (f) => !followingSet.has(f.username)
  );

  let unfollowed: FollowerEntry[] = [];
  let newFollowers: FollowerEntry[] = [];

  if (previousSnapshot) {
    const prevFollowerSet = new Set(
      previousSnapshot.followers.map((f) => f.username)
    );
    const prevFollowingSet = new Set(
      previousSnapshot.following.map((f) => f.username)
    );

    // Quem deixou de seguir: estava antes, não está agora
    unfollowed = previousSnapshot.followers
      .filter((f) => !followerSet.has(f.username))
      .map((f) => ({
        username: f.username,
        fullName: f.fullName ?? undefined,
        profileUrl: f.profileUrl ?? undefined,
      }));

    // Novos seguidores: não estava antes, está agora
    newFollowers = followers
      .filter((f) => !prevFollowerSet.has(f.username))
      .map((f) => ({
        username: f.username,
        fullName: f.fullName ?? undefined,
        profileUrl: f.profileUrl ?? undefined,
      }));

    // Persiste eventos de unfollow com deduplicação por data
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eventsToCreate = [
      ...unfollowed.map((u) => ({
        instagramAccountId,
        eventType: "UNFOLLOWED",
        targetUsername: u.username,
        targetFullName: u.fullName,
        targetProfileUrl: u.profileUrl,
        detectedAt: new Date(),
      })),
      ...newFollowers.map((u) => ({
        instagramAccountId,
        eventType: "NEW_FOLLOWER",
        targetUsername: u.username,
        targetFullName: u.fullName,
        targetProfileUrl: u.profileUrl,
        detectedAt: new Date(),
      })),
    ];

    // Cria eventos um a um com upsert para deduplicação (compatível com SQLite e PostgreSQL)
    for (const evt of eventsToCreate) {
      await prisma.instagramEvent.upsert({
        where: {
          instagramAccountId_targetUsername_eventType_detectedAt: {
            instagramAccountId: evt.instagramAccountId,
            targetUsername: evt.targetUsername,
            eventType: evt.eventType,
            detectedAt: evt.detectedAt,
          },
        },
        update: {},
        create: evt,
      });
    }
  }

  // Atualiza contadores da conta
  await prisma.instagramAccount.update({
    where: { id: instagramAccountId },
    data: {
      followerCount: followers.length,
      followingCount: following.length,
      lastSyncAt: new Date(),
    },
  });

  return {
    unfollowed,
    newFollowers,
    notFollowingBack,
    userDoesNotFollowBack,
    followerCount: followers.length,
    followingCount: following.length,
  };
}

export async function getDashboardStats(instagramAccountId: string) {
  const account = await prisma.instagramAccount.findUnique({
    where: { id: instagramAccountId },
  });

  const latestSnapshot = await prisma.instagramSnapshot.findFirst({
    where: { instagramAccountId },
    orderBy: { takenAt: "desc" },
    include: { followers: true, following: true },
  });

  if (!latestSnapshot) {
    return {
      followerCount: 0,
      followingCount: 0,
      notFollowingBack: 0,
      userDoesNotFollowBack: 0,
      unfollowed: 0,
      newFollowers: 0,
      lastSyncAt: null,
    };
  }

  const followerSet = new Set(latestSnapshot.followers.map((f) => f.username));
  const followingSet = new Set(latestSnapshot.following.map((f) => f.username));

  const notFollowingBack = latestSnapshot.following.filter(
    (f) => !followerSet.has(f.username)
  ).length;

  const userDoesNotFollowBack = latestSnapshot.followers.filter(
    (f) => !followingSet.has(f.username)
  ).length;

  const unfollowedCount = await prisma.instagramEvent.count({
    where: {
      instagramAccountId,
      eventType: "UNFOLLOWED",
    },
  });

  const newFollowersCount = await prisma.instagramEvent.count({
    where: {
      instagramAccountId,
      eventType: "NEW_FOLLOWER",
    },
  });

  return {
    followerCount: latestSnapshot.followerCount,
    followingCount: latestSnapshot.followingCount,
    notFollowingBack,
    userDoesNotFollowBack,
    unfollowed: unfollowedCount,
    newFollowers: newFollowersCount,
    lastSyncAt: account?.lastSyncAt ?? null,
  };
}
