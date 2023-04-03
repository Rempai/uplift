<script lang="ts">
  import { location } from "svelte-spa-router";

  import { checkRoute, getContentMargin, stripPath, type route } from "@/lib/adminLogic";

  import AdminNav from "@/components/AdminNav.svelte";
  import Edit from "@/components/crud/Edit.svelte";

  let crudRoute: route;
  let contentMargin = 0;

  let loc = $location;
  loc = stripPath(loc);
  let digitCount = loc
    .split(/[^0-9]+/)
    .pop()
    .replace(/[^0-9]/g, "").length;
  loc = loc.substring(0, loc.length - digitCount - 1);

  $: crudRoute = checkRoute(loc);

  const setContentMargin = (event: CustomEvent) => {
    contentMargin = getContentMargin(event.detail);
  };
</script>

<svelte:head>
  <title>Admin | Edit</title>
</svelte:head>

<div class="sm:flex min-h-screen admin-space" style="margin-top: {contentMargin}px;">
  <AdminNav on:navHeight={setContentMargin} />
  <div class="overflow-auto flex-1 px-10 pt-5">
    <Edit
      crudRoute={crudRoute.route}
      service={crudRoute.service}
      formHTML={crudRoute.html}
      preview={crudRoute.preview} />
  </div>
</div>
