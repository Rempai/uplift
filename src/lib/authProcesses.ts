import { AuthService } from "./client";

export const loginForAccessToken = async (target: HTMLFormElement) => {
  const formData = new FormData(target);
  const value = Object.fromEntries(formData.entries());

  try {
    const res = await AuthService.loginForAccessToken(value);
    localStorage.setItem("access_token", res.access_token);
    localStorage.setItem("refresh_token", res.refresh_token);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const registerForAccessToken = async (target: HTMLFormElement) => {
  const form_data = new FormData(target);
  const value = Object.fromEntries(form_data.entries());
  try {
    const res = await AuthService.registerUser(value);
    localStorage.setItem("access_token", res.access_token);
    localStorage.setItem("refresh_token", res.refresh_token);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
