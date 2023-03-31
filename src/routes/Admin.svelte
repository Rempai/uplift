<script lang="ts">
  import { onMount } from "svelte";

  import { checkAccount } from "@/lib/adminLogic";

  import AdminNav from "@/components/AdminNav.svelte";

  let check = false;
  let mobileContentMargin;

  onMount(async () => {
    await checkAccount();
    check = true;
  });

  function test(event) {
    mobileContentMargin = event.detail;
  }
</script>

<svelte:head>
  <title>Uplift | admin</title>
</svelte:head>

{#if check}
  <main class="md:flex min-h-screen">
    <AdminNav on:navHeight={test} />
    <div class="flex-1 pb-10 px-5 mt-[{mobileContentMargin}px] md:mt-0">
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
