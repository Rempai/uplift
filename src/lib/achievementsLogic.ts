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

export const IdUnlockedAchievements: Array<number> = [];

export const isAchieved = ({
  userId,
  achievementId,
  currentRide = null,
  reviewList = null,
  resolutionData = null,
  tutorialCompleted = null,
  rideList = null,
}: achievementObj) => {
  switch (achievementId) {
    case 1:
      if (!IdUnlockedAchievements.includes(achievementId)) {
        postUserAchievement(userId, achievementId);
        return true;
      }
      return false;
    case 2:
      if (!IdUnlockedAchievements.includes(achievementId)) {
        const fiveStarReviews = reviewList.filter((review) => review.stars === 5);
        if (fiveStarReviews.length === rideList.length) {
          postUserAchievement(userId, achievementId);
          return true;
        }
      }
      return false;
    case 4:
      if (!IdUnlockedAchievements.includes(achievementId)) {
        postUserAchievement(userId, achievementId);
        return true;
      }
      return false;
    case 5:
      if (!IdUnlockedAchievements.includes(achievementId)) {
        postUserAchievement(userId, achievementId);
        return true;
      }
      return false;

    case 7: {
      const { mainProblem, mainCause, partiesInvolved } = resolutionData;

      const correctMainCauses = currentRide.mainCause.match(/(?<=;)[^;]+(?=;)/g);
      const correctMainProblems = currentRide.mainProblem.match(/(?<=;)[^;]+(?=;)/g);
      const correctPartiesInvolved = currentRide.partiesInvolved.match(/(?<=;)[^;]+(?=;)/g);

      if (
        correctMainCauses.includes(mainCause) &&
        correctMainProblems.includes(mainProblem) &&
        correctPartiesInvolved.includes(partiesInvolved)
      ) {
        postUserAchievement(userId, achievementId);
        return true;
      }
      return false;
    }
    case 9:
      if (!IdUnlockedAchievements.includes(achievementId)) {
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

// if (reviewList[-1]) {
//   if ((reviewList[-1].stars = 4)) {
//     postUserAchievement(userId, achievementId);
//     return true;
//   } else if ((reviewList[-1].stars = 5)) {
//     postUserAchievement(userId, achievementId);

//     return true;
//   }
// }

// if (tutorialCompleted) {
//   if (tutorialCompleted === true) {
//     postUserAchievement(userId, achievementId);

//     return true;
//   }
// }

// if (reviewList[0]) {
//   if (reviewList[0].stars === 5) {
//     postUserAchievement(userId, achievementId);
//     return true;
//   }
// }
// return false;

const postUserAchievement = async (userId: number, achievementId: number) => {
  const currentTime = new Date().toISOString();
  const input: UserAchievementCreate = {
    date: currentTime,
    userId: userId,
    achievementId: achievementId,
  };
  await UserService.postUserAchievement(input);
};
