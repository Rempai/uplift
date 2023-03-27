import { validation } from "@/lib/stores";
import { get } from "svelte/store";

import type { Register, PassengerRead, RideRead, ReviewRead } from "@/lib/client";

// TODO: jthis fucker is not working properly anymore with the new API package
const validationArray = get(validation);

export function isEmailValid(value: string) {
  return /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(value);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function validateData(mode: string, formdata: any, createMode: boolean) {
  if (
    mode == "/auth/register/" ||
    mode == "/auth/users/" ||
    mode == "/auth/user/" ||
    mode == "Register"
  )
    userCheck(formdata, createMode);

  if (mode == "/character/passenger/") passengerCheck(formdata);

  if (mode == "/character/ride/") rideCheck(formdata);

  if (mode == "/character/review/") reviewCheck(formdata);

  return ArrayChecker();
}

async function userCheck(formdata: Register, createMode: boolean) {
  validationArray.length = 0;
  if (formdata.username.length > 30)
    validationArray.push("Username is too long (Max 30 characters).");

  if (formdata.username.length < 3)
    validationArray.push("Username is too short (Min 3 characters).");

  if (createMode == true) {
    if (!(formdata.password === formdata.repeatPassword))
      validationArray.push("Passwords do not match.");
    if (formdata.password.length < 6 || formdata.repeatPassword.length < 6)
      validationArray.push("Password too short (Min 6 characters).");
  }
}

async function passengerCheck(formdata: PassengerRead) {
  validationArray.length = 0;
  if (formdata.name.length < 3)
    validationArray.push("Character name too short (min 3 characters)");

  if (formdata.icon.startsWith("/") && !formdata.icon.endsWith(".png" || ".jpg"))
    validationArray.push(
      "Invalid icon format, did you start with a '/' did you use a png or jpg?"
    );
}

async function rideCheck(formdata: RideRead) {
  validationArray.length = 0;
  if (formdata.time < 1) validationArray.push("Please enter a valid time");
}

async function reviewCheck(formdata: ReviewRead) {
  validationArray.length = 0;
  if (formdata.stars > 5 || formdata.stars < 0)
    validationArray.push("Only 0 to 5 stars is allowed");
}

async function ArrayChecker() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (validationArray.length > 0) {
        return reject("CAT");
      } else {
        return resolve(undefined);
      }
    }, 0);
  });
}

export async function validationErrorCheck(err: string, admin: boolean) {
  validationArray.length = 0;

  if (err == "ApiError: Validation Error" && !admin) {
    validationArray.push("Username already in use");
    return "";
  } else if (err == "ApiError: Unauthorized" && !admin) {
    validationArray.push("Incorrect password or username");
    return "";
  } else {
    validationArray.push(err.toString());
    return err.toString();
  }
}
