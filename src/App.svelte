<script>
  import Router from "svelte-spa-router";
  import { wrap } from "svelte-spa-router/wrap";
  import NotFound from "@/routes/NotFound.svelte";

  import { OpenAPI } from "@/lib/client/index";

  OpenAPI.BASE = "https://uplift.appelsapje.net";
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

    "/admin/abstractor": wrap({
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

    "/info": wrap({
      asyncComponent: () => import("@/routes/Info.svelte"),
    }),

    // Catch-all, must be last
    "*": NotFound,
  };

  const fetchOriginal = window.fetch;

  window.fetch = async function (url, options) {
    const headers = new Headers(options.headers);
    const access_token = localStorage.getItem("access_token");

    if (access_token) {
      headers.set("Authorization", `Bearer ${access_token}`);
    }

    const response = await fetchOriginal(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        const refreshResponse = await fetchOriginal(OpenAPI.BASE + "/api/auth/refresh/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refresh_token: refreshToken,
          }),
        });

        if (refreshResponse.ok) {
          const { access_token } = await refreshResponse.json();
          localStorage.setItem("access_token", access_token);
          headers.set("Authorization", `Bearer ${access_token}`);
          options.headers = headers;
          const retryResponse = await fetchOriginal(url, {
            ...options,
            headers,
          });
          return retryResponse;
        } else {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.reload();
        }
        console.log(refreshResponse);
      } else {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.reload();
      }
    } else {
      return response;
    }
  };
</script>

<Router {routes} restoreScrollState={true} />
