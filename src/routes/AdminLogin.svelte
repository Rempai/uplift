<script lang="ts">
  import { push } from "svelte-spa-router";

  import { parseJwt } from "@/lib/jwtParser";
  import { validation } from "@/lib/stores";
  import { validationErrorCheck } from "@/lib/validation";
  import { loginForAccessToken } from "@/lib/authProcesses";

  import Form from "@/components/Form.svelte";
  import Button from "@/components/Button.svelte";

  $validation.length = 0;
  const handleSubmit = async ({ target }) => {
    const login = await loginForAccessToken(target);
    if (login == true) {
      let parsedJwt = await parseJwt(localStorage.getItem("access_token"));

      if (parsedJwt.role === "Admin") {
        push("/admin");
      } else {
        // TODO: show error that user is not admin
        push("/");
      }
    } else {
      validationErrorCheck(login, false);
    }

    if (localStorage.getItem("access_token") === null) {
      return;
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
    <hr class="my-6 w-10/12" />
    <Button
      onClick={() => push("/")}
      text="Go to homepage"
      class="!border-aurora-red hover:bg-aurora-red" />
  </div>
</main>
