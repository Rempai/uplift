<script lang="ts">
  import { location } from "svelte-spa-router";

  import { type route, checkRoute, getContentMargin } from "@/lib/adminLogic";

  import AdminNav from "@/components/AdminNav.svelte";
  import Create from "@/components/crud/Create.svelte";

  let crudRoute: route;
  let contentMargin = 0;
  $: crudRoute = checkRoute($location);

  const setContentMargin = (event: CustomEvent) => {
    contentMargin = getContentMargin(event.detail);
  };
</script>

<svelte:head>
  <title>Admin | Create</title>
</svelte:head>

<div class="md:flex min-h-screen admin-space" style="margin-top: {contentMargin}px;">
  <AdminNav on:navHeight={setContentMargin} />
  <div class="overflow-auto flex-1 p-5">
    <Create
      crudRoute={crudRoute.route}
      service={crudRoute.service}
      formHTML={crudRoute.html}
      enctype={crudRoute.enctype} />
  </div>
</div>
