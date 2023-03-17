<script lang="ts">
  import { push } from "svelte-spa-router";

  import { routes, type route } from "@/lib/adminLogic";

  import AdminNavLink from "@/components/AdminNavLink.svelte";

  import IoIosLogOut from "~icons/ion/log-out-outline";
  import IoIosHomeOutline from "~icons/ion/home-outline";
  import IoIosServer from "~icons/ion/server-outline";

  import Logo from "/logo.png";

  const logout = () => {
    localStorage.clear();
    push("/");
  };

  const groupRoutesByCategory = (routes: route[]) => {
    const categories: { [key: string]: route[] } = {};

    routes.forEach((route) => {
      const category = route.call?.split("/")[1];

      if (category) {
        if (!categories[category]) {
          categories[category] = [];
        }

        categories[category].push(route);
      }
    });

    return categories;
  };
</script>

<nav
  class="shadow bg-night-2 flex flex-col gap-2 fixed h-full left-0 top-0 overflow-x-hidden overflow-y-auto pl-2">
  <div class="mt-3 pl-2 py-2 bg-night-1 flex rounded-l">
    <img src={Logo} alt="logo" class="w-10 h-6 mr-2" />
    <p>Uplift Admin</p>
  </div>
  <div class="flex flex-col">
    <AdminNavLink name="Homepage" link="/admin">
      <IoIosHomeOutline font-size="1.4em" />
    </AdminNavLink>
    <span on:keypress on:click={logout}>
      <AdminNavLink name="Logout" link="/">
        <IoIosLogOut font-size="1.6em" />
      </AdminNavLink>
    </span>
    <AdminNavLink name="Database" link="/admin/database">
      <IoIosServer font-size="1.4em" />
    </AdminNavLink>
  </div>
  {#each Object.entries(groupRoutesByCategory(routes)) as [category, routesInCategory]}
    {#if routesInCategory.length > 0}
      <div class="flex flex-col">
        <details open={true} class="cursor-pointer">
          <summary class="capitalize pr-4">{category} management</summary>
          {#each routesInCategory as route}
            {#if route.icon}
              <AdminNavLink name={route.route} link={route.route}>
                <svelte:component this={route.icon} font-size={route.iconSize} />
              </AdminNavLink>
            {/if}
          {/each}
        </details>
      </div>
    {/if}
  {/each}
</nav>

<style>
  @media (min-width: 768px) {
    :global(.admin-space) {
      margin: 2rem 2rem 2rem 20rem;
    }
  }

  :global(.admin-space .card) {
    background-color: #434c5e;
    padding: 0 2em 1em;
    border-radius: 10px;
    box-shadow: 3px 3px 5px 0px rgba(0, 0, 0, 0.5);
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
