<script lang="ts">
  import { pop, push } from "svelte-spa-router";

  import Button from "@/components/Button.svelte";
</script>

<h1 class="text-center my-4">404 NotFound</h1>

<p class="text-center mb-4">Oops, this route doesn't exist!</p>
<div class="flex items-center gap-3 flex-col">
  <span on:keypress on:click={() => pop()}>
    <Button class="bg-aurora-red" text="Go Back" />
  </span>
  <span on:keypress on:click={() => push("/")}>
    <Button class="bg-frost-4" text="Homepage" />
  </span>
</div>
