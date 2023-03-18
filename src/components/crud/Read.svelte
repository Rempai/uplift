<script lang="ts">
  import { onMount } from "svelte";

  import { location, push } from "svelte-spa-router";

  import { parseJwt } from "@/lib/jwtParser";
  import { getData } from "@/lib/adminLogic";

  import { UserService } from "@/lib/client";

  import Button from "@/components/Button.svelte";
  import Modal from "@/components/Modal.svelte";
  import Loader from "@/components/Loader.svelte";

  import Highlight from "svelte-highlight";
  import vbscriptHtml from "svelte-highlight/languages/vbscript-html";
  import onedark from "svelte-highlight/styles/atom-one-dark";

  import { DataHandler, Search, Pagination, RowCount, RowsPerPage } from "@vincjo/datatables";

  import FaRegEdit from "~icons/fa-regular/edit";
  import FaRegTrashAlt from "~icons/fa-regular/trash-alt";
  import MdPlusCircleOutline from "~icons/mdi/plus-circle-outline";

  export let crudRoute: string;

  export let service: CallableFunction;

  let crudName = $location.replace(/\/admin\//g, "");

  let showModal = false;
  let modalHeader: string;

  let loading = true;

  interface select_data {
    // bruh
    data: any; // eslint-disable-line
    name: string;
  }

  let selected_data: select_data;

  let handler;
  let rows;

  let columns_keys: Array<string> = [];

  let loc = $location + "/create";

  const td_class = `border border-dotted border-storm-1 px-3 py-2 overflow-hidden`;

  const locEdit = (id: number): string => {
    return $location + "/edit/" + id;
  };

  const toggleModal = () => {
    showModal = !showModal;
  };

  const deleteConfirm = (data) => {
    let name: string;
    if (data.name) {
      name = data.name;
    } else if (data.username) {
      name = data.username;
    } else if (data.passage_name) {
      name = data.passage_name;
    } else {
      name = "id " + data.id;
    }

    modalHeader = "Delete " + name;
    selected_data = { data, name };
    showModal = true;
  };

  const deleteRow = async () => {
    if ($location === "/admin/user") {
      let parsed_token = await parseJwt(localStorage.getItem("access_token"));

      if (selected_data.data.id == parsed_token.sub) {
        UserService.deleteUser(selected_data.data.id)
          .then(() => {
            localStorage.clear();
            push("/admin/login");
          })
          .catch((err) => console.log(err));
      } else {
        await UserService.deleteUser(selected_data.data.id).catch((err) => console.log(err));
      }
    } else {
      await service(selected_data.data.id).catch((err) => console.log(err));
    }

    showModal = false;
    // TODO: filter/reduce instead of reloading
    // also, fix brokey
    window.location.reload();
  };

  const checkIcon = (data) => {
    data = data.toString();
    return data.endsWith(".png" || ".jpg");
  };

  const escapeIconError = (data) => {
    // This function is to just evade a TS error that shoudn't be there in the first place
    return data;
  };

  const add_nested_objects = (
    data: object,
    prefix: string | null = null,
    nested_keys = columns_keys
  ) => {
    for (let key in data) {
      const value = data[key];
      const new_prefix = prefix ? `${prefix}_${key}` : key;
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        if (nested_keys.includes(key)) {
          add_nested_objects(value, null, nested_keys);
        } else {
          add_nested_objects(value, new_prefix, nested_keys);
        }
      } else {
        columns_keys.push(new_prefix);
      }
    }
  };

  onMount(async () => {
    let data = await getData(crudRoute);

    handler = new DataHandler(data, { rowsPerPage: 10 });
    rows = handler.getRows();
    add_nested_objects($rows[0]);

    loading = false;
  });
</script>

<svelte:head>
  {@html onedark}
</svelte:head>

<main class="admin-space">
  <Modal {modalHeader} {showModal} on:click={toggleModal}>
    <p>Are you sure you want to delete {selected_data.name}?</p>
    <p><b>This action is irreversable.</b></p>
    <div class="flex gap-3">
      <span on:keypress on:click={deleteRow}>
        <Button text="Delete" class="bg-aurora-red" />
      </span>
      <span on:keypress on:click={toggleModal}>
        <Button text="Cancel" class="bg-aurora-green" />
      </span>
    </div>
  </Modal>
  <div class="card">
    <div class="card-header">
      <h1 class="capitalize">{crudName} management</h1>
      <span on:keypress on:click={() => push(loc)}>
        <Button href="#{loc}" text="new {crudName}" class="!px-2 bg-frost-4">
          <div slot="icon" class="w-6 ml-4 text-night-1">
            <MdPlusCircleOutline font-size="1em" class="!text-night-1" />
          </div>
        </Button>
      </span>
    </div>
    <Loader {loading} />
    {#if rows}
      {#await rows}
        <Loader />
      {:then}
        <div class="flex justify-between py-2">
          <Search {handler} />
          <RowsPerPage {handler} />
        </div>
        <div class="w-full overflow-auto max-h-96">
          <table
            class="border border-dotted border-storm-1 table-fixed w-full border-separate border-spacing-0">
            <thead class="sticky">
              <tr>
                {#if columns_keys}
                  {#each columns_keys as column}
                    <th class="border border-dotted border-storm-1 py-2 bg-frost-4 w-56"
                      >{column}</th>
                  {/each}
                  <th class="border border-dotted border-storm-1 py-2 bg-frost-4 w-56">options</th>
                {/if}
              </tr>
            </thead>
            <tbody>
              {#each $rows as row}
                <tr class="hover:bg-night-1 even:bg-night-2">
                  {#each Object.values(row) as data}
                    {#if typeof data === "object"}
                      {#each Object.values(data) as obj}
                        {#if checkIcon(obj)}
                          <td class={td_class}
                            ><img
                              class="h-12 w-12 rounded text-center mx-auto"
                              src={obj}
                              alt="" /></td>
                        {:else}
                          <td class={td_class}>{obj}</td>
                        {/if}
                      {/each}
                    {:else if checkIcon(data)}
                      <td class={td_class}
                        ><img
                          class="h-12 w-12 rounded text-center mx-auto"
                          src={escapeIconError(data)}
                          alt="" /></td>
                    {:else if data === true || data === false}
                      <td class={td_class}
                        ><input type="checkbox" bind:checked={data} disabled /></td>
                    {:else if data == row.content}
                      <td class="border border-dotted border-storm-1 px-3 py-2"
                        ><Highlight language={vbscriptHtml} code={data} /></td>
                    {:else if data == row.color}
                      <td style:color={row.color} class={td_class}>{data}</td>
                    {:else}
                      <td class={td_class}>{data}</td>
                    {/if}
                  {/each}
                  <td class="py-2 border border-dotted border-storm-1">
                    <div class="flex justify-around">
                      <span on:keypress on:click={() => push(locEdit(row.id))}>
                        <Button href="#{$location}/edit/{row.id}" text="" class="bg-aurora-yellow">
                          <div slot="icon" class="w-5 h-8 flex items-center text-night-1">
                            <FaRegEdit class="text-night-1" font-size="2em" />
                          </div>
                        </Button>
                      </span>
                      <span on:keypress on:click={() => deleteConfirm(row)}>
                        <Button text="" class="bg-aurora-red">
                          <div slot="icon" class="w-4 h-8 flex items-center text-night-1">
                            <FaRegTrashAlt class="text-night-1" font-size="2em" />
                          </div>
                        </Button>
                      </span>
                    </div>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
        <div class="flex justify-between py-2">
          <RowCount {handler} />
          <Pagination {handler} />
        </div>
      {/await}
    {/if}
  </div>
</main>
