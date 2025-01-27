import { AuthService, UserService, type Register } from "@/lib/client";

export const loginForAccessToken = async (target: HTMLFormElement) => {
  const urlSearchParams = new URLSearchParams(new FormData(target) as any);

  let returnValue;
  await AuthService.login(urlSearchParams)
    .then((res) => {
      localStorage.setItem("access_token", res.access_token);
      localStorage.setItem("refresh_token", res.refresh_token);
      returnValue = res;
    })
    .catch((err) => {
      returnValue = err;
    });
  return returnValue;
};

export const registerForAccessToken = async (target: HTMLFormElement) => {
  const formData = new FormData(target);
  const value = Object.fromEntries(formData.entries());
  const register: Register = {
    username: value.username as string,
    password: value.password as string,
    repeatPassword: value.repeatPassword as string,
  };

  let returnValue;
  await AuthService.register(register)
    .then((res) => {
      localStorage.setItem("access_token", res.access_token);
      localStorage.setItem("refresh_token", res.refresh_token);
      returnValue = res;
    })
    .catch((err) => {
      returnValue = err;
    });
  return returnValue;
};

export const updateUserAccount = async (target: HTMLFormElement, parse_jwt_sub: number) => {
  const formData = new FormData(target);
  const value = Object.fromEntries(formData.entries());

  let returnValue;
  await UserService.updateUser(parse_jwt_sub, value)
    .then((update) => {
      if (value.password != null || value.newPassword != null || value.repeatPassword != null) {
        returnValue = "password";
      } else {
        returnValue = "username";
      }
      // @ts-ignore
      update.type = returnValue;
      returnValue = update;
    })
    .catch((err) => {
      returnValue = err;
    });
  return returnValue;
};
