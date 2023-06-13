<script lang="ts">
  import { push } from "svelte-spa-router";

  import { parseJwt } from "@/lib/jwtParser";
  import { loginForAccessToken } from "@/lib/authProcesses";

  import Form from "@/components/Form.svelte";
  import Button from "@/components/Button.svelte";
  import Notification from "@/components/Notification.svelte";

  let messages: Array<string> = [];

  const showError = (err: string) => {
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

    if (typeof (str === "object")) {
      // @ts-ignore
      const res = Object.values(str)[1].value;

      if (isJsonString(res)) {
        const obj = JSON.parse(res);
        return obj[1].message;
      }
      return str;
    }
  };

  const handleSubmit = async ({ target }) => {
    const login = await loginForAccessToken(target)
      .then((login) => {
        return parseJwt(login.access_token);
      })
      .then((parsedJwt) => {
        if (parsedJwt.role === "Admin" || parsedJwt.role === "Writer") {
          push("/admin");
        } else {
          showError("User doesn't have admin or writer role.");
          push("/");
        }
      })
      .catch((err) => {
        showError(ErrorMessage(err));
      });
  };
</script>

<svelte:head>
  <title>Admin | Login</title>
</svelte:head>

<main
  class="w-full h-screen flex items-center justify-center bg-[url('/bg.png')] bg-cover bg-center">
  <Notification {messages} />
  <div class="flex flex-col items-center w-fit p-6 md:px-48 rounded bg-night-2/80 shadow">
    <h1>Login</h1>
    <Form login={true} {handleSubmit} />
    <hr class="my-6 w-10/12" />
    <Button
      onClick={() => push("/")}
      text="Go to homepage"
      class="!border-aurora-red hover:bg-aurora-red" />
  </div>
</main>
