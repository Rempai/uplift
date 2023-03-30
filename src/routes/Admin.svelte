<script lang="ts">
  import { onMount } from "svelte";

  import { checkAccount } from "@/lib/adminLogic";

  import AdminNav from "@/components/AdminNav.svelte";

  let check = false;
  onMount(async () => {
    await checkAccount();
    check = true;
  });
</script>

<svelte:head>
  <title>Uplift | admin</title>
</svelte:head>

{#if check}
  <AdminNav />

  <main class="admin-space">
    <AdminNav />
    <div class="flex-1 pb-10 pr-10">
      <h1 class="mt-6">Admin page</h1>
      <hr class="mb-3" />
      <div class="gap-4 flex justify-between ">
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
