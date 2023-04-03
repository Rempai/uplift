<script lang="ts">
  import { onMount } from "svelte";

  import { checkAccount, getContentMargin } from "@/lib/adminLogic";

  import AdminNav from "@/components/AdminNav.svelte";

  let check = false;
  let contentMargin = 0;

  onMount(async () => {
    await checkAccount();
    check = true;
  });

  const setContentMargin = (event: CustomEvent) => {
    contentMargin = getContentMargin(event.detail);
  };
</script>

<svelte:head>
  <title>Uplift | admin</title>
</svelte:head>

{#if check}
  <main class="md:flex min-h-screen">
    <AdminNav on:navHeight={setContentMargin} />
    <div class="flex-1 pb-10 px-5" style="margin-top: {contentMargin}px">
      <h1 class="mt-2">Admin page</h1>
      <hr class="mb-3" />
      <div class="gap-4 flex justify-between flex-col md:flex-row">
        <!-- use flex-row for screens larger than md breakpoint -->
        <div class="w-full">
          <div class="card h-full">
            <h2>Logs</h2>
            <hr class="mb-3" />
          </div>
        </div>
        <div class="flex flex-col gap-4 w-full">
          <div class="card">
            <h2>Happy users</h2>
            <hr class="mb-3" />
            <img class="w-full rounded" src="real-analysis1.png" alt="Happy Users" />
          </div>
          <div class="card">
            <h2>Stock value</h2>
            <hr class="mb-3" />
            <img class="w-full rounded" src="real-analysis2.png" alt="Stock Value" />
          </div>
        </div>
      </div>
    </div>
  </main>
{/if}
