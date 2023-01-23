<script lang="ts">
  import { location } from "svelte-spa-router";

  import { type route, checkRoute } from "@/lib/adminLogic";

  import AdminNav from "@/components/AdminNav.svelte";
  import Read from "@/components/crud/Read.svelte";

  let crudRoute: route;

  $: crudRoute = checkRoute($location);
</script>

<svelte:head>
  <title>Uplift | Read</title>
</svelte:head>

<AdminNav />

<Read crudRoute={crudRoute.route} service={crudRoute.service} />
