<script lang="ts">
  import { onMount } from "svelte";
  import { location, push } from "svelte-spa-router";

  import { checkAccount } from "@/lib/adminLogic";
  import { FactoryService } from "@/lib/client";

  import Button from "@/components/Button.svelte";
  import AdminNav from "@/components/AdminNav.svelte";
  import Modal from "@/components/Modal.svelte";

  import RealAnalysis1 from "/real-analysis1.png";
  import RealAnalysis2 from "/real-analysis2.png";

  checkAccount();

  let showModal = false;

  const reset_db = async () => {
    await FactoryService.factory().then(() => {
      localStorage.clear();
      push("/");
    });
  };

  onMount(() => {
    if ($location === "/admin/database") showModal = true;
  });
</script>

<svelte:head>
  <title>Uplift | admin</title>
</svelte:head>

<Modal {showModal} modalHeader="Database Options">
  <p>If you want to reset the database to factory data, click `Reset Database`.</p>
  <p><b>Note: All current data will be lost.</b></p>
  <div class="flex gap-4 mt-3">
    <Button
      onClick={reset_db}
      text="Reset Database"
      class="bg-transparent !border-aurora-red hover:bg-aurora-red" />
    <Button
      onClick={() => history.back()}
      text="Go back"
      class="bg-transparent !border-aurora-green hover:bg-aurora-green" />
  </div>
</Modal>

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
        <img class="w-full rounded" src={RealAnalysis1} alt="Happy Users" />
      </div>
      <div class="card">
        <h2>Stock value</h2>
        <hr class="mb-3" />
        <img class="w-full rounded" src={RealAnalysis2} alt="Stock Value" />
      </div>
    </div>
  </div>
</main>
