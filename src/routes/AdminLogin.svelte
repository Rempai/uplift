<script lang="ts">
  import { push } from "svelte-spa-router";

  import { parseJwt } from "@/lib/jwtParser";
  import { loginForAccessToken } from "@/lib/authProcesses";
  import { errors } from "@/lib/stores";
  import { ErrorMessage } from "@/lib/error";

  import Form from "@/components/Form.svelte";
  import Button from "@/components/Button.svelte";
  import Error from "@/components/Error.svelte";

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
</script>

<svelte:head>
  <title>Admin | Login</title>
</svelte:head>

<div class="absolute right-0 w-full max-h-full overflow-hidden flex flex-col">
  {#each $errors as error}
    <Error message={error.msg} id={error.id} />
  {/each}
</div>
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
