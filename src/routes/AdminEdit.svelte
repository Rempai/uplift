<script lang="ts">
  import { location } from "svelte-spa-router";

  import { checkRoute, stripPath, type route } from "@/lib/adminLogic";

  import AdminNav from "@/components/AdminNav.svelte";
  import Edit from "@/components/crud/Edit.svelte";

  let crudRoute: route;

  let loc = $location;
  loc = stripPath(loc);
  let digitCount = loc
    .split(/[^0-9]+/)
    .pop()
    .replace(/[^0-9]/g, "").length;
  loc = loc.substring(0, loc.length - digitCount - 1);

  $: crudRoute = checkRoute(loc);
</script>

<svelte:head>
  <title>Admin | Edit</title>
</svelte:head>

<AdminNav />

<Edit
  crudRoute={crudRoute.route}
  service={crudRoute.service}
  formHTML={crudRoute.html}
  preview={crudRoute.preview} />
