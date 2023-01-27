import { push } from "svelte-spa-router";

import { parseJwt } from "@/lib/jwtParser";
import {
  attributeEditHTML,
  attributeHTML,
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

import { AuthService, CharactersService, PassageHandlingService } from "@/lib/client";

export interface route {
  route: string;
  call?: string;
  html?: string | CallableFunction;
  service?: CallableFunction;
  preview?: boolean;
}

const routes: Array<route> = [
  // Read + Delete
  { route: "/admin/user", call: "/user/users/", service: AuthService.deleteUser },
  {
    route: "/admin/passenger",
    call: "/character/passengers/",
    service: CharactersService.deletePassenger,
  },
  { route: "/admin/ride", call: "/character/rides/", service: CharactersService.deleteRide },
  {
    route: "/admin/review",
    call: "/character/reviews/",
    service: CharactersService.deleteReview,
  },
  {
    route: "/admin/passage",
    call: "/passage_handler/passages/",
    service: PassageHandlingService.deletePassage,
  },
  {
    route: "/admin/attribute",
    call: "/passage_handler/attributes/",
    service: PassageHandlingService.deleteAttribute,
  },

  // Create
  {
    route: "/admin/user/create",
    call: "/user/users/",
    html: userHTML,
    service: AuthService.postUser,
  },
  {
    route: "/admin/passenger/create",
    call: "/character/passengers/",
    html: passengerHTML,
    service: CharactersService.postPassenger,
  },
  {
    route: "/admin/ride/create",
    call: "/character/rides/",
    html: rideHTML,
    service: CharactersService.postRide,
  },
  {
    route: "/admin/review/create",
    call: "/character/reviews/",
    html: reviewHTML,
    service: CharactersService.postReview,
  },
  {
    route: "/admin/passage/create",
    call: "/passage_handler/passages/",
    html: passageHTML,
    service: PassageHandlingService.postPassage,
  },
  {
    route: "/admin/attribute/create",
    call: "/passage_handler/attributes/",
    html: attributeHTML,
    service: PassageHandlingService.postAttribute,
  },

  // Update
  {
    route: "/admin/user/edit",
    call: "/user/user/",
    html: userEditHTML,
    service: AuthService.updateUser,
  },
  {
    route: "/admin/passenger/edit",
    call: "/character/passenger/",
    html: passengerEditHTML,
    service: CharactersService.updatePassenger,
  },
  {
    route: "/admin/ride/edit",
    call: "/character/ride/",
    html: rideEditHTML,
    service: CharactersService.updateRide,
  },
  {
    route: "/admin/review/edit",
    call: "/character/review/",
    html: reviewEditHTML,
    service: CharactersService.updateReview,
  },
  {
    route: "/admin/passage/edit",
    call: "/passage_handler/passage/",
    html: passageEditHTML,
    preview: true,
    service: PassageHandlingService.updatePassage,
  },
  {
    route: "/admin/attribute/edit",
    call: "/passage_handler/attribute/",
    html: attributeEditHTML,
    service: PassageHandlingService.updateAttribute,
  },
];

export async function checkAccount() {
  const acc = await parseJwt(localStorage.getItem("access_token")).catch(() =>
    push("/admin/login")
  );

  if (acc) {
    if (acc.role !== "Admin") push("/");
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
  let preview: boolean;
  let service: CallableFunction;

  checkAccount();
  routes.some((e) => {
    if (path_check === e.route) {
      route = e.call;
      html = e.html;
      service = e.service;
      preview = e.preview;

      return true; // Go out of loop
    }
  });

  // if (!new_route) {
  //   replace("/admin");
  // }

  return {
    route: route,
    html: html,
    service: service,
    preview: preview,
  };
}

export async function getData(crudRoute: string, id?: string) {
  const token = localStorage.getItem("access_token");
  const headers = {};
  headers["Authorization"] = `Bearer ${token}`;

  let res: Response;
  if (id) {
    res = await fetch("https://localhost:8001/api" + crudRoute + id, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "include",
      redirect: "follow",
      referrerPolicy: "no-referrer",
      headers: new Headers(headers),
    });
  } else {
    res = await fetch("https://localhost:8001/api" + crudRoute, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "include",
      redirect: "follow",
      referrerPolicy: "no-referrer",
      headers: new Headers(headers),
    });
  }

  return await res.json();
}
