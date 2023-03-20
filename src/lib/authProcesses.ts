import { AuthService, UserService } from "@/lib/client";

export const loginForAccessToken = async (target: HTMLFormElement) => {
  const urlSearchParams = new URLSearchParams(new FormData(target) as any);
  try {
    const res = await AuthService.login(urlSearchParams);
    localStorage.setItem("access_token", res.access_token);
    localStorage.setItem("refresh_token", res.refresh_token);
    return true;
  } catch (e) {
    return e;
  }
};

export const registerForAccessToken = async (target: HTMLFormElement) => {
  const form_data = new FormData(target);
  const value = Object.fromEntries(form_data.entries());
  try {
    const res = await AuthService.register(value);
    localStorage.setItem("access_token", res.access_token);
    localStorage.setItem("refresh_token", res.refresh_token);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
