import { errors } from "@/lib/stores";

const showError = (err: string) => {
  const cleanedError = err.toString().replace(/^(ApiError|TypeError):\s*/, "");
  const id = Math.random();
  const newErr = { msg: cleanedError, id };
  errors.update((e) => [...e, newErr]);
};

export const ErrorMessage = (str: string) => {
  function isJsonString(str: string) {
    try {
      JSON.parse(str);
    } catch {
      return false;
    }
    return true;
  }

  if (typeof str === "object") {
    // @ts-ignore
    const res = Object.values(str)[3].message;

    if (isJsonString(res)) {
      const obj = JSON.parse(res);
      if (obj.length === 1) {
        showError(obj[0].message);
      } else if (obj.length > 1) {
        obj.forEach((element) => {
          showError(element.message);
        });
      }
    } else {
      showError(str);
    }
  } else if (typeof str === "string") {
    showError(str);
  }
};
