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
    <h1>Admin Page</h1>
    <hr class="mb-3" />
    <div class="flex justify-between w-full px-3 gap-4">
      <div class="card w-full">
        <div class="flex justify-between items-center">
          <h2>Logs</h2>
        </div>
        <hr class="mb-3" />
        <div class="overflow-y-auto bg-night-1 rounded p-4 h-screen" />
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
  </main>
{/if}
