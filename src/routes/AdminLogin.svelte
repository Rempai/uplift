<script lang="ts">
  import { push } from "svelte-spa-router";

  import { parseJwt } from "@/lib/jwtParser";
  import { validation } from "@/lib/stores";
  import { validationErrorCheck } from "@/lib/validation";

  import { AuthService } from "@/lib/client";

  import Form from "@/components/Form.svelte";
  import Button from "@/components/Button.svelte";

  $validation.length = 0;
  const handleSubmit = async ({ target }) => {
    const form_data = new FormData(target);
    const value = Object.fromEntries(form_data.entries());

    $validation = $validation;
    // @ts-ignore you want formdata dumbass
    await AuthService.loginForAccessToken(value)
      .then((res) => {
        localStorage.setItem("access_token", res.access_token);
        localStorage.setItem("refresh_token", res.refresh_token);
      })
      .catch((err) => {
        validationErrorCheck(err);
      });

    $validation = $validation;

    let parsed_jwt = await parseJwt(localStorage.getItem("access_token"));

    if (parsed_jwt.role === "Admin") {
      push("/admin");
    } else {
      // TODO: show error that user is not admin
      push("/");
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
    <span class="submit">
      <Form login={true} {handleSubmit} />
    </span>
    <hr class="my-6 w-10/12" />
    <Button
      on:click={() => push("/")}
      text="Go to homepage"
      class="bg-transparent !border-aurora-red hover:bg-aurora-red" />
  </div>
</main>
