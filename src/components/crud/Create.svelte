<script lang="ts">
  import { validation } from "@/lib/stores";

  import { push } from "svelte-spa-router";

  import { crudCheck, validationErrorCheck } from "@/lib/validation";

  import Form from "@/components/Form.svelte";

  export let enctype = "application/x-www-form-urlencoded";
  export let formData = false;
  export let crudRoute: string;
  export let formHTML: string | CallableFunction;
  export let service: CallableFunction;

  let parts = window.location.href.split("/");
  let page: string;

  parts[parts.length - 1] === ""
    ? (page = parts[parts.length - 3])
    : (page = parts[parts.length - 2]);

  const submitForm = async ({ target }) => {
    const form_data = new FormData(target);
    const value = Object.fromEntries(form_data.entries());

    crudCheck(crudRoute, value, true);
    $validation = $validation;
    if ($validation.length === 0) {
      if (formData) {
        await service(target)
          .then(() => push("/admin/" + page))
          .catch((err: string) => validationErrorCheck(err));
        $validation = $validation;
      } else {
        await service(value)
          .then(() => push("/admin/" + page))
          .catch((err: string) => validationErrorCheck(err));
        $validation = $validation;
      }
    }
  };
</script>

<main class="admin-space block">
  <div class="card w-fit min-w-[25em]">
    <h1 class="capitalize text-3xl pt-2">Create {page}</h1>
    <Form handleSubmit={submitForm} backButton={true} on:back={() => history.back()} {enctype}>
      <div slot="forms">
        {@html formHTML}
      </div>
    </Form>
  </div>
</main>
