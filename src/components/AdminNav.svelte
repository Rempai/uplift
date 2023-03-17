<script lang="ts">
  import { push } from "svelte-spa-router";

  import AdminNavLink from "@/components/AdminNavLink.svelte";

  import IoIosLogOut from "~icons/ion/log-out-outline";
  import IoIosHomeOutline from "~icons/ion/home-outline";
  import IoIosServer from "~icons/ion/server-outline";
  import IoIosPersonCircleOutline from "~icons/heroicons/user-circle";
  import MdPersonOutline from "~icons/healthicons/person-outline";
  import GiRoad from "~icons/game-icons/road";
  import IoIosStarOutline from "~icons/ion/star-outline";
  import IoIosDocOutline from "~icons/ion/document-text-outline";
  import IoIosAttach from "~icons/ion/attach-outline";

  import Logo from "/logo.png";

  const logout = () => {
    localStorage.clear();
    push("/");
  };
</script>

<nav
  class="shadow bg-night-2 flex flex-col gap-2 fixed h-full left-0 top-0 overflow-x-hidden overflow-y-auto w-48 pl-2">
  <div class="mt-3 pl-2 py-2 bg-night-1 flex rounded-l">
    <img src={Logo} alt="logo" class="w-10 h-6 mr-2" />
    <p>Uplift Admin</p>
  </div>
  <div class="flex flex-col items-stretch">
  <span on:keypress on:click={logout}>
    <AdminNavLink name="Logout" link="/">
      <IoIosLogOut font-size="1.6em" />
    </AdminNavLink>
  </span>
  <AdminNavLink name="Homepage" link="/admin">
    <IoIosHomeOutline font-size="1.4em" />
  </AdminNavLink>
  <AdminNavLink name="Database" link="/admin/database">
    <IoIosServer font-size="1.4em" />
  </AdminNavLink>
</div>
  <details open={true} class="cursor-pointer">
    <summary>User management</summary>
    <div class="flex flex-col">
    <AdminNavLink name="User" link="/admin/user">
      <IoIosPersonCircleOutline class="pr-1" font-size="2em" />
    </AdminNavLink>
</div>
</details>
  <details open={true} class="cursor-pointer">
    <summary class="mr-2">Character management</summary>
    <div class="flex flex-col items-start">
    <AdminNavLink name="Passenger" link="/admin/passenger">
      <MdPersonOutline font-size="1.6em" />
    </AdminNavLink>
    <AdminNavLink name="Ride" link="/admin/ride">
      <GiRoad font-size="1.6em" />
    </AdminNavLink>
    <AdminNavLink name="Review" link="/admin/review">
      <IoIosStarOutline font-size="1.5em" />
    </AdminNavLink>
    </div>
  </details>
  <details open={true} class="cursor-pointer">
    <summary>Story management</summary>
    <div class="flex flex-col items-start">
    <AdminNavLink name="Passage" link="/admin/passage">
      <IoIosDocOutline font-size="1.4em" />
    </AdminNavLink>
    <AdminNavLink name="Attribute" link="/admin/attribute">
      <IoIosAttach font-size="1.6em" />
    </AdminNavLink>
    </div>
  </details>
</nav>

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
