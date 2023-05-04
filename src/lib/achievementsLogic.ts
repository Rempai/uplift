import type { RideRead, ReviewRead, UserAchievementCreate, AchievementRead } from "@/lib/client";
import { UserService } from "@/lib/client";

type achievementObj = {
  userId: number;
  achievementId: number;
  reviewList?: ReviewRead[] | null;
  riderList?: Array<RideRead> | null;
  reviewsAmount?: number | null;
  currentRadio?: number | null;
  tutorialCompleted?: boolean | null;
};

export let IdUnlockedAchievements: Array<number> = [];

export const isAchieved = ({
  userId,
  achievementId,
  reviewList = null,
  currentRadio = null,
  tutorialCompleted = null,
  riderList = null,
}: achievementObj) => {
  console.log(IdUnlockedAchievements, "achievementunlcoked");

  switch (achievementId) {
    case 1:
      if (!IdUnlockedAchievements.includes(achievementId)) {
        postUserAchievement(userId, achievementId);
        return true;
      }
      console.log("already unlocked");
      return false;
    case 2:
      if (!IdUnlockedAchievements.includes(achievementId)) {
        const fiveStarReviews = reviewList.filter((review) => review.stars === 5);
        if (fiveStarReviews.length === riderList.length) {
          postUserAchievement(userId, achievementId);
          return true;
        }
      }
      console.log("already unlocked");
      return false;
    case 4:
      if (!IdUnlockedAchievements.includes(achievementId)) {
        postUserAchievement(userId, achievementId);
        return true;
      }
    case 5:
      if (!IdUnlockedAchievements.includes(achievementId)) {
        postUserAchievement(userId, achievementId);
        return true;
      }
      console.log("already unlocked");
      return false;
    case 9:
      if (!IdUnlockedAchievements.includes(achievementId)) {
        if (riderList && reviewList) {
          const reviews = reviewList.filter((review) => review.stars > 3);
          for (const ride of riderList) {
            const reviewExists = reviews.filter((review) => review.rideId === ride.id);
            if (!reviewExists) {
              return false;
            }
            postUserAchievement(userId, achievementId);
            return true;
          }
        }
      }
      console.log("already unlocked");
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
  let currentTime = new Date().toISOString();
  const input: UserAchievementCreate = {
    date: currentTime,
    userId: userId,
    achievementId: achievementId,
  };
  await UserService.postUserAchievement(input);
};
