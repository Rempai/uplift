<script lang="ts">
  import { validation } from "@/lib/stores";

  import { push } from "svelte-spa-router";

  import { validateData, validationErrorCheck } from "@/lib/validation";

  import Form from "@/components/Form.svelte";

  export let enctype = "application/x-www-form-urlencoded";
  export let crudRoute: string;
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
    try {
      await validateData(crudRoute, value, true);
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          const fileContents = await value.text();
          await service(fileContents);
          push("/admin/");
        }
      }
      console.log(value);
      await service(value);
      push("/admin/" + page);
    } catch (error) {
      validationErrorCheck(error, true);
      $validation = $validation;
    }
  };
</script>

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
