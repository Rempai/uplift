<script lang="ts">
  import { push } from "svelte-spa-router";

  import { validation } from "@/lib/stores";
  import { validationErrorCheck, crudCheck } from "@/lib/validation";
  import { getData } from "@/lib/adminLogic";

  import Form from "@/components/Form.svelte";

  import Highlight from "svelte-highlight";
  import vbscriptHtml from "svelte-highlight/languages/vbscript-html";
  import onedark from "svelte-highlight/styles/atom-one-dark";

  export let enctype = "application/x-www-form-urlencoded";

  export let crudRoute: string;
  export let formHTML: string | CallableFunction;
  export let service: CallableFunction;
  export let preview = false;
  export let code = "";

  let data;
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

  $validation.length = 0;

  const updateForm = async ({ target }) => {
    const form_data = new FormData(target);
    const value = Object.fromEntries(form_data.entries());

    console.log(crudRoute);
    await crudCheck(crudRoute, value, false).then(async () => {
      for (let x in value) {
        if (value[x] === "") {
          delete value[x];
        }
      }
      await service(id, value)
        .then(() => push("/admin/" + page))
        .catch((err) => validationErrorCheck(err, true));
      $validation = $validation;
    });

    if ($validation.length == 0) {
    }
  };

  const checkHTML = async () => {
    let get_data = await getData(crudRoute, id);
    // @ts-ignore
    data = formHTML(get_data);

    if (get_data.passage_content) code = get_data.passage_content;
  };

  $: if (typeof formHTML === "function") {
    checkHTML();
  }
</script>

<svelte:head>
  {@html onedark}
</svelte:head>

<main class={preview ? "flex justify-around flex-wrap g-4 admin-space" : "block admin-space"}>
  <div class="card w-fit">
    <h1 class="capitalize">Edit {page}</h1>
    <Form handleSubmit={updateForm} backButton={true} on:back={() => history.back()} {enctype}>
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
    <div class="card md:w-1/2">
      <h1>Preview</h1>
      <hr class="mb-2" />
      <Highlight language={vbscriptHtml} {code} />
    </div>
  {/if}
</main>
