export type jwtObject = {
  iss: string;
  sub: number;
  exp: number;
  username: string;
  role: string;
};

export async function parseJwt(token: string) {
  const base64Url = token.split(".")[1];

  if (!base64Url) {
    return null;
  }

  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}
