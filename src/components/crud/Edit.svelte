<script lang="ts">
  import { push } from "svelte-spa-router";

  import { errors } from "@/lib/stores";
  import { getData } from "@/lib/adminLogic";
  import { ErrorMessage } from "@/lib/error";

  import Form from "@/components/Form.svelte";
  import Error from "@/components/Error.svelte";

  import Highlight from "svelte-highlight";
  import vbscriptHtml from "svelte-highlight/languages/vbscript-html";
  import onedark from "svelte-highlight/styles/atom-one-dark";

  export let crudRoute: string;
  export let formHTML: string | CallableFunction;
  export let service: CallableFunction;
  export let preview = false;
  export let code = "";

  let data: string;
  let page: string;
  let id: string;

  let parts = window.location.href.split("/");

  if (parts[parts.length - 1] === "") {
    page = parts[parts.length - 4];
    id = parts[parts.length - 2];
  } else {
    page = parts[parts.length - 3];
    id = parts[parts.length - 1];
  }

  const updateForm = async ({ target }) => {
    const formData = new FormData(target);
    const value = Object.fromEntries(formData.entries());

    for (let x in value) {
      if (value[x] === "") {
        delete value[x];
      } else if (value[x] === "on") {
        // @ts-ignore
        value[x] = true;
      } else if (/^\d+$/.test(value[x].toString())) {
        // @ts-ignore
        value[x] = parseInt(value[x].toString());
      }
    }
    await service(id, value)
      .then(() => push("/admin/" + page))
      .catch((err) => ErrorMessage(err));
  };

  const checkHTML = async () => {
    let get_data = await getData(crudRoute, id);
    if (formHTML instanceof Function) {
      data = formHTML(get_data);
    }

    if (get_data.content) code = get_data.content;
  };

  $: if (formHTML instanceof Function) {
    checkHTML();
  }
</script>

<svelte:head>
  {@html onedark}
</svelte:head>

<div class="absolute right-0 w-full max-h-full overflow-hidden flex flex-col">
  {#each $errors as error}
    <Error message={error.msg} id={error.id} />
  {/each}
</div>
<main class={preview ? "flex flex-wrap gap-4 admin-space" : "admin-space"}>
  <div class="card flex-1">
    <h1 class="capitalize">Edit {page}</h1>
    <Form handleSubmit={updateForm} backButton={true} on:back={() => history.back()}>
      <div slot="forms">
        {#if typeof formHTML === "string"}
          {@html formHTML}
        {:else}
          {#await data then}
            {@html data}
          {/await}
        {/if}
      </div>
    </Form>
  </div>
  {#if preview}
    <div class="card flex-1 max-w-full">
      <h1>Preview</h1>
      <hr class="mb-2" />
      <Highlight language={vbscriptHtml} {code} />
    </div>
  {/if}
</main>
