import { AuthService, UserService, type Register } from "./client";
import { validateData } from "./validation";

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
  const formData = new FormData(target);
  const value = Object.fromEntries(formData.entries());
  const register: Register = {
    username: value.username as string,
    password: value.password as string,
    repeat_password: value.repeat_password as string,
  };

  const returnvalue = await validateData("Register", value as Register, true).then(async () => {
    try {
      const res = await AuthService.register(register);
      localStorage.setItem("access_token", res.access_token);
      localStorage.setItem("refresh_token", res.refresh_token);
      return true;
    } catch (e) {
      console.log(e);
      return e as string;
    }
  });

  return returnvalue;
};

export const updateUserAccount = async (target: HTMLFormElement, parse_jwt_sub: number) => {
  const formData = new FormData(target);
  const value = Object.fromEntries(formData.entries());
  try {
    await UserService.updateUser(parse_jwt_sub, value);
    return true;
  } catch (e) {
    return e;
  }
};
