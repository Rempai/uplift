<script lang="ts">
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";

  import { routes, type route } from "@/lib/adminLogic";
  import { parseJwt, type jwtObject } from "@/lib/jwtParser";

  import AdminNavLink from "@/components/AdminNavLink.svelte";

  import IoIosLogOut from "~icons/ion/log-out-outline";
  import IoIosHomeOutline from "~icons/ion/home-outline";

  let parsedJWT: jwtObject;

  const logout = () => {
    localStorage.clear();
    push("/");
  };

  const groupRoutesByCategory = (routes: route[]) => {
    const categories: { [key: string]: route[] } = {};

    routes.forEach((route) => {
      let category = route.call?.split("/")[1];
      if (category === "passage_handler") {
        category = "passage";
      }

      if (category) {
        if (!categories[category]) {
          categories[category] = [];
        }

        categories[category].push(route);
      }
    });

    return categories;
  };

  onMount(async () => {
    const token = localStorage.getItem("access_token");
    parsedJWT = await parseJwt(token);
  });
</script>

{#if parsedJWT}
  <nav
    class="shadow bg-night-2 flex flex-col gap-2 fixed h-full left-0 top-0 overflow-x-hidden overflow-y-auto pl-2">
    <div class="mt-3 pl-2 py-2 bg-night-1 flex rounded-l">
      <img src="logo.png" alt="logo" class="w-10 h-6 mr-2" />
      <p>Uplift Admin</p>
    </div>
    <div class="flex flex-col">
      <AdminNavLink name="Homepage" link="/admin">
        <IoIosHomeOutline font-size="1.5em" />
      </AdminNavLink>
      <span on:keypress on:click={logout}>
        <AdminNavLink name="Logout" link="/">
          <IoIosLogOut font-size="1.5em" />
        </AdminNavLink>
      </span>
    </div>
    {#each Object.entries(groupRoutesByCategory(routes)) as [category, routesInCategory]}
      {#if routesInCategory.length > 0}
        <div class="flex flex-col">
          <details open={true} class="cursor-pointer">
            <summary class="capitalize pr-4">{category} management</summary>
            {#each routesInCategory as route}
              {#if route.icon}
                {#if parsedJWT.role === "Writer" && route.role === "Writer"}
                  {#if route.route === "/admin/passage/abstractor"}
                    <AdminNavLink name={route.route} link={route.route}>
                      <svelte:component this={route.icon} font-size="1.5em" />
                    </AdminNavLink>
                  {:else}
                    <AdminNavLink name={route.route} link={route.route}>
                      <svelte:component this={route.icon} font-size="1.5em" />
                    </AdminNavLink>
                  {/if}
                {:else if parsedJWT.role === "Admin"}
                  {#if route.route === "/admin/passage/abstractor"}
                    <AdminNavLink name={route.route} link={route.route}>
                      <svelte:component this={route.icon} font-size="1.5em" />
                    </AdminNavLink>
                  {:else}
                    <AdminNavLink name={route.route} link={route.route}>
                      <svelte:component this={route.icon} font-size="1.5em" />
                    </AdminNavLink>
                  {/if}
                {/if}
              {/if}
            {/each}
          </details>
        </div>
      {/if}
    {/each}
  </nav>
{/if}

<style>
  @media (min-width: 768px) {
    :global(.admin-space) {
      margin: 2rem 2rem 2rem 15rem;
    }
  }

  :global(.admin-space .card) {
    background-color: #434c5e;
    padding: 0 2em 1em;
    border-radius: 10px;
    box-shadow: 3px 3px 5px 0px rgba(0, 0, 0, 0.5);
  }

  :global(.admin-space form) {
    align-items: start;
  }

  :global(.admin-space .card .card-header) {
    display: flex;
    justify-content: space-between;
    padding: 2em 0em;
  }

  :global(.admin-space code) {
    border-radius: 10px;
    font-size: 0.7em;
  }

  :global(.admin-space .form button, .admin-space .form span) {
    display: block;
    width: 100%;
  }

  /* tailwind doesn't support this */
  :global(.admin-space thead) {
    inset-block-start: 0;
  }

  /* overwrite svelte datatables styling */
  :global(.admin-space .card aside) {
    color: #d8dee9;
  }

  :global(.admin-space .card aside select) {
    color: #2e3440;
  }

  :global(.admin-space .card input) {
    border-radius: 10px;
    padding: 0.8em;
    border-color: transparent;
    background-color: #5e81ac;
  }

  :global(.admin-space .card section button) {
    color: #d8dee9;
  }

  :global(.admin-space .card section button.active) {
    background-color: #5e81ac;
  }

  :global(.admin-space .card section :not(button.disabled):hover) {
    background-color: #5e81ac;
  }

  :global(.admin-space .card section button.disabled) {
    cursor: not-allowed;
  }
</style>
