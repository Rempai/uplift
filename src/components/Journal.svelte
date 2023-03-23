<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import type { PassageRead, RideRead } from "@/lib/client";

  import Tabs from "@/components/Tab.svelte";
  import Form from "@/components/Form.svelte";
  import Button from "@/components/Button.svelte";

  export let journal_data: Array<PassageRead>;
  export let resolution_data: RideRead;

  // TODO: random journal styling bug

  let branch_data: Array<PassageRead> = [];

  const dispatch = createEventDispatcher();

  let currentTab = 0;

  interface tabItem {
    label: string;
    value: number;
  }

  let tabItems: Array<tabItem> = [{ label: "Trunk", value: 1 }];

  let virtues: Array<string> = ["bravery", "perseverance", "integrity", "enthusiasm"];

  const getData = (tab: number) => {
    journal_data.forEach((obj) => {
      if (tab === 1) {
        if (obj.trunk) branch_data.push(obj);
      } else {
        if (!tabItems.find((e) => e.label === obj.branch_name)) {
          let tab_num: number = tabItems.length;
          tabItems.push({ label: obj.branch_name, value: tab_num + 1 });
        }

        let item = tabItems.find((e) => e.value === tab);
        switch (tab) {
          case 2:
            if (!obj.trunk && item.value === 2) branch_data.push(obj);
            break;
          case 3:
            if (!obj.trunk && item.value === 3) branch_data.push(obj);
            break;
          case 4:
            if (!obj.trunk && item.value === 4) branch_data.push(obj);
            break;
          case 5:
            if (!obj.trunk && item.value === 5) branch_data.push(obj);
            break;
          case 6:
            if (!obj.trunk && item.value === 6) branch_data.push(obj);
            break;
          case 7:
            if (!obj.trunk && item.value === 7) branch_data.push(obj);
            break;
        }
      }
    });
  };

  const gotoBranch = async (branch_data) => {
    dispatch("gotoTab", branch_data[0]);
  };

  function addInputToFormData(formData, key, value) {
    formData.append(key, value);
  }

  const submitForm = async ({ target }) => {
    const form_data = new FormData(target);

    addInputToFormData(form_data, "main_problem", resolution_data.main_problem);
    addInputToFormData(form_data, "parties_involved", resolution_data.parties_involved);
    addInputToFormData(form_data, "main_cause", resolution_data.main_cause);

    const value = Object.fromEntries(form_data.entries());
    dispatch("report", value);
  };

  $: {
    branch_data = [];
    getData(currentTab);
  }
</script>

<div
  class="bg-night-3 rounded z-2 flex absolute left-0 right-0 mx-auto top-32 w-screen max-w-screen-lg max-h-[30rem] gap-2 border-4 border-frost-1">
  <div class="overflow-y-auto flex flex-col flex-wrap">
    <Tabs bind:activeTabValue={currentTab} items={tabItems} />
    <span
      on:keypress
      on:click={() => gotoBranch(branch_data)}
      class="w-full flex justify-center mt-3">
      <Button text="Go to branch" class="bg-aurora-orange" />
    </span>
    <div class="h-full" />
    {#if currentTab}
      {#each branch_data as data}
        <div
          class={data.speaker === "You"
            ? "flex flex-col items-end text-end w-96 px-3 mt-2"
            : "w-96 px-3 mt-2"}>
          <p class={data.speaker === "You" ? "bg-frost-4 w-fit p-1" : "bg-aurora-green w-fit p-1"}>
            {data.speaker}
          </p>
          <p class={data.speaker === "You" ? "bg-frost-4 p-1" : "bg-aurora-green p-1"}>
            {@html data.content}
          </p>
        </div>
      {/each}
    {/if}
  </div>
  <div class="border border-night-1" />
  <div class="overflow-hidden overflow-y-auto flex flex-col flex-wrap pb-4">
    <Form handleSubmit={submitForm} on:back={() => history.back()}>
      <div slot="forms" class="mr-12">
        <label class="bg-aurora-orange p-2 !mt-1 !mb-0" for="main_problem">Main Problem</label>
        <input
          disabled
          value={resolution_data.main_problem}
          name="main_problem"
          type="text"
          placeholder="What?"
          required
          class="w-full !rounded-[0px]" />
        <label class="bg-aurora-orange p-2 !mb-0" for="parties_involved">Parties Involved</label>
        <input
          disabled
          value={resolution_data.parties_involved}
          name="parties_involved"
          type="text"
          placeholder="What?"
          required
          class="w-full !rounded-[0px]" />
        <label class="bg-aurora-orange p-2 !mb-0" for="main_cause">Primary Cause</label>
        <input
          disabled
          value={resolution_data.main_cause}
          name="main_cause"
          type="text"
          placeholder="What?"
          required
          class="w-full !rounded-[0px]" />
        <div>
          <div class="bg-aurora-orange text-center p-2 mt-5"><b>Virtue of Courage</b></div>
          <div class="flex justify-end capitalize text-sm bg-frost-1">
            <p class="mr-8">underused</p>
            <p class="mr-8">balanced</p>
            <p class="mr-8">overused</p>
          </div>
          {#each virtues as virtue}
            <div class="flex items-center bg-frost-3 flex-nowrap border-t-2 border-night-1">
              <label for="bravery" class="capitalize bg-aurora-purple p-4 w-32 !m-0"
                >{virtue}</label>
              {#each Array(2) as _}
                <div class="bg-frost-4 py-4 px-6">
                  <input class="scale-150" type="radio" name={virtue} value="1" required />
                </div>
              {/each}
              <div class="bg-aurora-green py-4 px-6">
                <input class="scale-150" type="radio" name={virtue} value="3" required />
              </div>
              {#each Array(2) as _}
                <div class="bg-aurora-red py-4 px-6">
                  <input class="scale-150" type="radio" name={virtue} value="5" required />
                </div>
              {/each}
            </div>
          {/each}
        </div>
      </div>
    </Form>
  </div>
</div>
