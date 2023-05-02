import { push } from "svelte-spa-router";

import { parseJwt } from "@/lib/jwtParser";
import {
  achievementEditHTML,
  achievementHTML,
  attributeEditHTML,
  attributeHTML,
  passageBulkHTML,
  passageEditHTML,
  passageHTML,
  passengerEditHTML,
  passengerHTML,
  reviewEditHTML,
  reviewHTML,
  rideEditHTML,
  rideHTML,
  userEditHTML,
  userHTML,
} from "@/lib/formHTML";

import { CharactersService, OpenAPI, PassageHandlingService, UserService } from "@/lib/client";

import IoIosPersonCircleOutline from "~icons/heroicons/user-circle";
import MdPersonOutline from "~icons/healthicons/person-outline";
import GiRoad from "~icons/game-icons/road";
import IoIosStarOutline from "~icons/ion/star-outline";
import IoIosDocOutline from "~icons/ion/document-text-outline";
import IoIosAttach from "~icons/ion/attach-outline";
import IonGitMergeOutline from "~icons/ion/git-merge-outline";
import IonStatsChartOutline from '~icons/ion/stats-chart-outline'

export interface route {
  route: string;
  call: string;
  service: CallableFunction;
  role: string;
  icon?: any;
  html?: string | CallableFunction;
  preview?: boolean;
  enctype?: string;
}

export const routes: Array<route> = [
  // Read + Delete
  {
    route: "/admin/user",
    call: "/user/users/",
    icon: IoIosPersonCircleOutline,
    service: UserService.deleteUser,
    role: "Admin",
  },
  {
    route: "/admin/achievement",
    call: "/user/achievement/achievements",
    icon: IonStatsChartOutline,
    service: UserService.deleteAchievement,
    role: "Writer",
  },
  {
    route: "/admin/passenger",
    call: "/character/passengers/",
    icon: MdPersonOutline,
    service: CharactersService.deletePassenger,
    role: "Writer",
  },
  {
    route: "/admin/ride",
    call: "/character/rides/",
    icon: GiRoad,
    service: CharactersService.deleteRide,
    role: "Writer",
  },
  {
    route: "/admin/review",
    call: "/character/reviews/",
    icon: IoIosStarOutline,
    service: CharactersService.deleteReview,
    role: "Writer",
  },
  {
    route: "/admin/passage",
    call: "/passage_handler/passages/",
    icon: IoIosDocOutline,
    service: PassageHandlingService.deletePassage,
    role: "Writer",
  },
  {
    route: "/admin/attribute",
    call: "/passage_handler/attributes/",
    icon: IoIosAttach,
    service: PassageHandlingService.deleteAttribute,
    role: "Writer",
  },

  // Create
  {
    route: "/admin/user/create",
    call: "/user/users/",
    html: userHTML,
    service: UserService.postUser,
    role: "Admin",
  },
  {
    route: "/admin/achievement/create",
    call: "/user/achevement/",
    html: achievementHTML,
    service: UserService.postAchievement,
    role: "Writer",
  },
  {
    route: "/admin/passenger/create",
    call: "/character/passengers/",
    html: passengerHTML,
    service: CharactersService.postPassenger,
    role: "Writer",
  },
  {
    route: "/admin/ride/create",
    call: "/character/rides/",
    html: rideHTML,
    service: CharactersService.postRide,
    role: "Writer",
  },
  {
    route: "/admin/review/create",
    call: "/character/reviews/",
    html: reviewHTML,
    service: CharactersService.postReview,
    role: "Writer",
  },
  {
    route: "/admin/passage/create",
    call: "/passage_handler/passages/",
    html: passageHTML,
    service: PassageHandlingService.postPassage,
    role: "Writer",
  },
  {
    route: "/admin/attribute/create",
    call: "/passage_handler/attributes/",
    html: attributeHTML,
    service: PassageHandlingService.postAttribute,
    role: "Writer",
  },
  {
    route: "/admin/abstractor",
    call: "/passage_handler/passage_bulk/",
    html: passageBulkHTML,
    service: PassageHandlingService.postPassageBulk,
    icon: IonGitMergeOutline,
    role: "Writer",
    enctype: "multipart/form-data",
  },

  // Update
  {
    route: "/admin/user/edit",
    call: "/user/",
    html: userEditHTML,
    service: UserService.updateUser,
    role: "Admin",
  },
  {
    route: "/admin/achievement/edit",
    call: "/user/achievement/",
    html: achievementEditHTML,
    service: UserService.updateAchievement,
    role: "Admin",
  },
  {
    route: "/admin/passenger/edit",
    call: "/character/passenger/",
    html: passengerEditHTML,
    service: CharactersService.updatePassenger,
    role: "Writer",
  },
  {
    route: "/admin/ride/edit",
    call: "/character/ride/",
    html: rideEditHTML,
    service: CharactersService.updateRide,
    role: "Writer",
  },
  {
    route: "/admin/review/edit",
    call: "/character/review/",
    html: reviewEditHTML,
    service: CharactersService.updateReview,
    role: "Writer",
  },
  {
    route: "/admin/passage/edit",
    call: "/passage_handler/passage/",
    html: passageEditHTML,
    preview: true,
    service: PassageHandlingService.updatePassage,
    role: "Writer",
  },
  {
    route: "/admin/attribute/edit",
    call: "/passage_handler/attribute/",
    html: attributeEditHTML,
    service: PassageHandlingService.updateAttribute,
    role: "Writer",
  },
];

export async function checkAccount() {
  const acc = await parseJwt(localStorage.getItem("access_token")).catch(() =>
    push("/admin/login")
  );

  if (acc) {
    if (acc.role !== "Admin" && acc.role !== "Writer") push("/");
  }
}

export function stripPath(location: string): string {
  if (location.endsWith("/")) location.substring(0, location.length - 1);

  return location;
}

export function checkRoute(location: string): route {
  const path_check = stripPath(location);
  let route: string;
  let html: string | CallableFunction;
  let role: string;
  let service: CallableFunction;
  let preview: boolean;
  let enctype: string;

  checkAccount();
  routes.some((e) => {
    if (path_check === e.route) {
      route = e.call;
      html = e.html;
      service = e.service;
      role = e.role;
      preview = e.preview;
      enctype = e.enctype;

      return true; // Go out of loop
    }
  });

  return {
    route: route,
    call: route,
    html: html,
    service: service,
    role: role,
    enctype: enctype,
    preview: preview,
  };
}

export async function getData(crudRoute: string, id?: string) {
  const token = localStorage.getItem("access_token");
  const headers = { Authorization: `Bearer ${token}` };

  const url = id ? `/api${crudRoute}${id}` : `/api${crudRoute}`;
  const res = await fetch(OpenAPI.BASE + url, {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    credentials: "include",
    redirect: "follow",
    referrerPolicy: "no-referrer",
    headers,
  });

  return await res.json();
}

export function getContentMargin(navHeight: number) {
  let windowWidth = window.innerWidth;
  let contentMargin = windowWidth < 768 ? navHeight : 0;

  function updateWindowWidth() {
    windowWidth = window.innerWidth;
    contentMargin = windowWidth < 768 ? navHeight : 0;
  }

  window.addEventListener("resize", updateWindowWidth);

  return contentMargin;
}
