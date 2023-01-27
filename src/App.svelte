<script>
  import Router from "svelte-spa-router";
  import { wrap } from "svelte-spa-router/wrap";

  import NotFound from "@/routes/NotFound.svelte";

  import { OpenAPI } from "@/lib/client/index";

  OpenAPI.BASE = "https://localhost:8001";
  OpenAPI.TOKEN = localStorage.getItem("access_token");

  const routes = {
    "/": wrap({
      asyncComponent: () => import("@/routes/Home.svelte"),
    }),

    "/game": wrap({
      asyncComponent: () => import("@/routes/Game.svelte"),
    }),

    "/admin": wrap({
      asyncComponent: () => import("@/routes/Admin.svelte"),
    }),

    "/admin/database": wrap({
      asyncComponent: () => import("@/routes/Admin.svelte"),
    }),

    "/admin/login": wrap({
      asyncComponent: () => import("@/routes/AdminLogin.svelte"),
    }),

    "/admin/user": wrap({
      asyncComponent: () => import("@/routes/AdminRead.svelte"),
    }),

    "/admin/passenger": wrap({
      asyncComponent: () => import("@/routes/AdminRead.svelte"),
    }),

    "/admin/ride": wrap({
      asyncComponent: () => import("@/routes/AdminRead.svelte"),
    }),

    "/admin/review": wrap({
      asyncComponent: () => import("@/routes/AdminRead.svelte"),
    }),

    "/admin/passage": wrap({
      asyncComponent: () => import("@/routes/AdminRead.svelte"),
    }),

    "/admin/attribute": wrap({
      asyncComponent: () => import("@/routes/AdminRead.svelte"),
    }),

    "/admin/user/create": wrap({
      asyncComponent: () => import("@/routes/AdminCreate.svelte"),
    }),

    "/admin/passenger/create": wrap({
      asyncComponent: () => import("@/routes/AdminCreate.svelte"),
    }),

    "/admin/ride/create": wrap({
      asyncComponent: () => import("@/routes/AdminCreate.svelte"),
    }),

    "/admin/review/create": wrap({
      asyncComponent: () => import("@/routes/AdminCreate.svelte"),
    }),

    "/admin/passage/create": wrap({
      asyncComponent: () => import("@/routes/AdminCreate.svelte"),
    }),

    "/admin/attribute/create": wrap({
      asyncComponent: () => import("@/routes/AdminCreate.svelte"),
    }),

    "/admin/user/edit/:id": wrap({
      asyncComponent: () => import("@/routes/AdminEdit.svelte"),
    }),

    "/admin/passenger/edit/:id": wrap({
      asyncComponent: () => import("@/routes/AdminEdit.svelte"),
    }),

    "/admin/ride/edit/:id": wrap({
      asyncComponent: () => import("@/routes/AdminEdit.svelte"),
    }),

    "/admin/review/edit/:id": wrap({
      asyncComponent: () => import("@/routes/AdminEdit.svelte"),
    }),

    "/admin/passage/edit/:id": wrap({
      asyncComponent: () => import("@/routes/AdminEdit.svelte"),
    }),

    "/admin/attribute/edit/:id": wrap({
      asyncComponent: () => import("@/routes/AdminEdit.svelte"),
    }),

    // Catch-all, must be last
    "*": NotFound,
  };
</script>

<Router {routes} restoreScrollState={true} />
