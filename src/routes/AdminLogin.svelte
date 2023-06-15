<script lang="ts">
  import { push } from "svelte-spa-router";

  import { parseJwt } from "@/lib/jwtParser";
  import { loginForAccessToken } from "@/lib/authProcesses";

  import Form from "@/components/Form.svelte";
  import Button from "@/components/Button.svelte";
  import Notification from "@/components/Notification.svelte";

  let messages: Array<string> = [];

  const handleSubmit = async ({ target }) => {
    await loginForAccessToken(target)
      .then((login) => {
        if (login.access_token != null) {
          parseJwt(login.access_token).then((parsedJWT) => {
            if (parsedJWT.role === "Admin" || parsedJWT.role === "Writer") {
              push("/admin");
            } else {
              ErrorMessage("Does not have the required role");
            }
          });
        } else {
          ErrorMessage(login);
        }
      })
      .catch((err) => ErrorMessage(err));
  };

  const showError = (err: string) => {
    const cleanedError = err.toString().replace(/^(ApiError|TypeError):\s*/, "");
    messages = [...messages, err];
  };

  const ErrorMessage = (str: string) => {
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
      } else if (typeof res === "string") {
        showError(res);
      } else {
        showError(str);
      }
    }
  };
</script>

<svelte:head>
  <title>Admin | Login</title>
</svelte:head>

<main
  class="w-full h-screen flex items-center justify-center bg-[url('/bg.png')] bg-cover bg-center">
  <div class="flex flex-col items-center w-fit p-6 md:px-48 rounded bg-night-2/80 shadow">
    <h1>Login</h1>
    <Form login={true} {handleSubmit} />
    <Notification {messages} />
    <hr class="my-6 w-10/12" />
    <Button
      onClick={() => push("/")}
      text="Go to homepage"
      class="!border-aurora-red hover:bg-aurora-red" />
  </div>
</main>
