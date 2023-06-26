<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import Button from "@/components/Button.svelte";

  export let login = false;
  export let register = false;
  export let backButton = false;

  export let enctype = "application/x-www-form-urlencoded";

  export let submitButton = "mt-4 bg-frost-4";

  export let handleSubmit;

  const dispatch = createEventDispatcher();
</script>

<div class="form flex flex-col items-center">
  <form
    on:submit|preventDefault={handleSubmit}
    {enctype}
    method="POST"
    class="flex flex-col items-center mt-2 g-2 w-full">
    {#if login}
      <div>
        <label for="username">Username</label>
        <input required type="text" name="username" placeholder="username" />
      </div>
      <div>
        <label for="password">Password</label>
        <input required type="password" name="password" placeholder="password" />
      </div>
    {:else if register}
      <div>
        <label for="username">Username</label>
        <input required type="text" name="username" placeholder="username" />
      </div>
      <div>
        <label for="password">Password</label>
        <input required type="password" name="password" placeholder="password" />
      </div>
      <div>
        <label for="repeatPassword">Repeat Password</label>
        <input required type="password" name="repeatPassword" placeholder="repeat password" />
      </div>
    {:else}
      <slot name="forms" />
    {/if}
    <Button type="submit" text="submit" class={submitButton} />
  </form>
  {#if backButton}
    <Button onClick={() => dispatch("back")} text="go back" class="mt-4 bg-aurora-red" />
  {/if}
</div>

<style>
  .form :global(input:not([type="file"])),
  .form :global(textarea),
  .form :global(select) {
    border-radius: 10px;
    border: 2px solid transparent;
    padding: 0.8em;
    background-color: #5e81ac;
  }
  .form :global(label) {
    font-weight: bold;
    display: block;
    margin: 1em 0;
  }
  .form :global(textarea) {
    min-height: 10em;
    max-height: 20em;
    min-width: 18.5em;
    max-width: 18.5em;
  }

  .form :global(input[type="checkbox"]) {
    width: 1.2em;
    height: 1.2em;
  }

  .form :global(input:invalid),
  .form :global(textarea:invalid) {
    border: 2px dashed #bf616a;
  }
</style>
