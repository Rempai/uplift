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

  interface selectData {
    // bruh
    data: any; // eslint-disable-line
    name: string;
  }

  let selectedData: selectData;

  let handler;
  let rows;

  let columnsKeys: Array<string> = [];

  let loc = $location + "/create";

  const tdClass = `border border-dotted border-storm-1 px-3 py-2 overflow-hidden`;

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
    } else if (data.passageName) {
      name = data.passageName;
    } else {
      name = "id " + data.id;
    }

    modalHeader = "Delete " + name;
    selectedData = { data, name };
    showModal = true;
  };

  const deleteRow = async () => {
    if ($location === "/admin/user") {
      let parsedToken = await parseJwt(localStorage.getItem("access_token"));

      if (selectedData.data.id == parsedToken.sub) {
        await UserService.deleteUser(selectedData.data.id)
          .then(() => {
            localStorage.clear();
            push("/admin/login");
          })
          .catch((err) => console.log(err));
      } else {
        await UserService.deleteUser(selectedData.data.id).catch((err) => console.log(err));
      }
    } else {
      await service(selectedData.data.id).catch((err) => console.log(err));
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

  const addNestedObjects = (
    data: object,
    prefix: string | null = null,
    nestedKeys = columnsKeys
  ) => {
    for (let key in data) {
      const value = data[key];
      const newPrefix = prefix ? `${prefix}_${key}` : key;
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        if (nestedKeys.includes(key)) {
          addNestedObjects(value, null, nestedKeys);
        } else {
          addNestedObjects(value, newPrefix, nestedKeys);
        }
      } else {
        columnsKeys.push(newPrefix);
      }
    }
  };

  onMount(async () => {
    let data = await getData(crudRoute);

    handler = new DataHandler(data, { rowsPerPage: 10 });
    rows = handler.getRows();
    addNestedObjects($rows[0]);

    loading = false;
  });
</script>

<svelte:head>
  {@html onedark}
</svelte:head>

<Modal {modalHeader} {showModal} on:click={toggleModal}>
  <p>Are you sure you want to delete {selectedData.name}?</p>
  <p><b>This action is irreversable.</b></p>
  <div class="flex gap-3">
    <Button onClick={deleteRow} text="Delete" class="bg-aurora-red" />
    <Button onClick={toggleModal} text="Cancel" class="bg-aurora-green" />
  </div>
</Modal>
<main class="card">
  <div class="card-header flex flex-col items-center text-center gap-4 lg:flex-row">
    <h1 class="capitalize">{crudName} management</h1>
    <Button
      onClick={() => push(loc)}
      href="#{loc}"
      text="new {crudName}"
      class="!px-2 bg-frost-4 w-fit">
      <div slot="icon" class="w-6 ml-4 text-night-1">
        <MdPlusCircleOutline font-size="1em" class="!text-night-1" />
      </div>
    </Button>
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
              {#if columnsKeys}
                {#each columnsKeys as column}
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
                        <td class={tdClass}
                          ><img
                            class="h-12 w-12 rounded text-center mx-auto"
                            src={obj}
                            alt="" /></td>
                      {:else}
                        <td class={tdClass}>{obj}</td>
                      {/if}
                    {/each}
                  {:else if checkIcon(data)}
                    <td class={tdClass}
                      ><img
                        class="h-12 w-12 rounded text-center mx-auto"
                        src={data.toString()}
                        alt="" /></td>
                  {:else if data === true || data === false}
                    <td class={tdClass}><input type="checkbox" bind:checked={data} disabled /></td>
                  {:else if data == row.content}
                    <td class="border border-dotted border-storm-1 px-3 py-2"
                      ><Highlight language={vbscriptHtml} code={data} /></td>
                  {:else if data == row.color}
                    <td style:color={row.color} class={tdClass}>{data}</td>
                  {:else}
                    <td class={tdClass}>{data}</td>
                  {/if}
                {/each}
                <td class="py-2 border border-dotted border-storm-1">
                  <div class="flex justify-around">
                    <Button
                      onClick={() => push(locEdit(row.id))}
                      href="#{$location}/edit/{row.id}"
                      text=""
                      class="bg-aurora-yellow">
                      <div slot="icon" class="w-5 h-8 flex items-center text-night-1">
                        <FaRegEdit class="text-night-1" font-size="2em" />
                      </div>
                    </Button>
                    <Button onClick={() => deleteConfirm(row)} text="" class="bg-aurora-red">
                      <div slot="icon" class="w-4 h-8 flex items-center text-night-1">
                        <FaRegTrashAlt class="text-night-1" font-size="2em" />
                      </div>
                    </Button>
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
</main>
