<script lang="ts">
  import { errors } from "@/lib/stores";

  import { push } from "svelte-spa-router";

  import { ErrorMessage } from "@/lib/error";

  import Form from "@/components/Form.svelte";
  import Error from "../Error.svelte";

  export let enctype = "application/x-www-form-urlencoded";
  export let formHTML: string | CallableFunction;
  export let service: CallableFunction;

  let parts = window.location.href.split("/");
  let page: string;

  parts[parts.length - 1] === ""
    ? (page = parts[parts.length - 3])
    : (page = parts[parts.length - 2]);

  const submitForm = async ({ target }) => {
    const formData = new FormData(target);
    const value = Object.fromEntries(formData.entries());

    for (let x in value) {
      if (value[x] === "") {
        delete value[x];
      }
      if (value[x] instanceof File) {
        // @ts-ignore
        const fileContents = await value[x].text();
        await service(fileContents);
        push("/admin/");
        return;
      } else if (value[x] === "on") {
        // @ts-ignore
        value[x] = true;
      } else if (/^\d+$/.test(value[x].toString())) {
        // @ts-ignore
        value[x] = parseInt(value[x].toString());
      }
    }
    await service(value)
      .then(() => push("/admin/" + page))
      .catch((err) => ErrorMessage(err));
  };
</script>

<div class="absolute right-0 w-full max-h-full overflow-hidden flex flex-col">
  {#each $errors as error}
    <Error message={error.msg} id={error.id} />
  {/each}
</div>
<main class="flex">
  <div class="card w-fit min-w-[25em]">
    <h1 class="capitalize text-3xl pt-2">Create {page}</h1>
    <Form handleSubmit={submitForm} backButton={true} on:back={() => history.back()} {enctype}>
      <div slot="forms">
        {@html formHTML}
      </div>
    </Form>
  </div>
</main>
