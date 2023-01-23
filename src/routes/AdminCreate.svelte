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

<AdminNav />

<Create crudRoute={crudRoute.route} service={crudRoute.service} formHTML={crudRoute.html} />
