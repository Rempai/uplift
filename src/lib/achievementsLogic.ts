import type { RideRead, ReviewRead, UserAchievementCreate, AchievementRead } from "@/lib/client";
import { UserService } from "@/lib/client";

type achievementObj = {
  userId: number;
  achievementId: number;
  currentRide?: RideRead | null;
  reviewList?: ReviewRead[] | null;
  rideList?: Array<RideRead> | null;
  reviewsAmount?: number | null;
  resolutionData?: RideRead | null;
  tutorialCompleted?: boolean | null;
};

export const unlockedAchievementsIds: Array<number> = [];

export const isAchieved = ({
  userId,
  achievementId,
  currentRide = null,
  reviewList = null,
  rideList = null,
  resolutionData = null,
  tutorialCompleted = null,
}: achievementObj) => {
  switch (achievementId) {
    case 1:
      if (!unlockedAchievementsIds.includes(achievementId)) {
        postUserAchievement(userId, achievementId);
        return true;
      }
      false;
    case 2:
      if (!unlockedAchievementsIds.includes(achievementId)) {
        const fiveStarReviews = reviewList.filter((review) => review.stars === 5);
        if (fiveStarReviews.length === rideList.length) {
          postUserAchievement(userId, achievementId);
          return true;
        }
      }
      return false;
    case 4:
      if (!unlockedAchievementsIds.includes(achievementId)) {
        postUserAchievement(userId, achievementId);
        return true;
      }
      return false;
    case 5:
      if (!unlockedAchievementsIds.includes(achievementId)) {
        postUserAchievement(userId, achievementId);
        return true;
      }
      return false;
    case 7: {
      if (!unlockedAchievementsIds.includes(achievementId)) {
        const { mainProblem, mainCause, partiesInvolved } = resolutionData;
        console.log("bar", resolutionData);
        const correctMainCauses = currentRide.mainCause.match(/(?<=;)[^;]+(?=;)/g);
        const correctMainProblems = currentRide.mainProblem.match(/(?<=;)[^;]+(?=;)/g);
        const correctPartiesInvolved = currentRide.partiesInvolved.match(/(?<=;)[^;]+(?=;)/g);
        console.log(correctMainCauses.includes(resolutionData.mainCause));
        if (
          correctMainProblems.includes(mainProblem.trim()) &&
          correctMainCauses.includes(mainCause.trim()) &&
          correctPartiesInvolved.includes(partiesInvolved.trim())
        ) {
          postUserAchievement(userId, achievementId);
          return true;
        }
        return false;
      }
    }
    case 9:
      if (!unlockedAchievementsIds.includes(achievementId)) {
        if (rideList && reviewList) {
          const reviews = reviewList.filter((review) => review.stars > 3);
          for (const ride of rideList) {
            const reviewExists = reviews.filter((review) => review.rideId === ride.id);
            if (!reviewExists) {
              return false;
            }
            postUserAchievement(userId, achievementId);
            return true;
          }
        }
      }
      return false;
    default:
      return false;
  }
};

const postUserAchievement = async (userId: number, achievementId: number) => {
  const currentTime = new Date().toISOString();
  const input: UserAchievementCreate = {
    date: currentTime,
    userId: userId,
    achievementId: achievementId,
  };
  await UserService.postUserAchievement(input);
};
