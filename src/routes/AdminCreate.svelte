<script lang="ts">
  import { location } from "svelte-spa-router";

  import { type route, checkRoute } from "@/lib/adminLogic";

  import AdminNav from "@/components/AdminNav.svelte";
  import Create from "@/components/crud/Create.svelte";

  let crudRoute: route;

  $: crudRoute = checkRoute($location);
</script>

<svelte:head>
  <title>Admin | Create</title>
</svelte:head>
<main class="sm:flex min-h-screen">
  <AdminNav />
  <div class="overflow-auto flex-1 p-10">
    <Create
      crudRoute={crudRoute.route}
      service={crudRoute.service}
      formHTML={crudRoute.html}
      enctype={crudRoute.enctype} />
  </div>
</main>
