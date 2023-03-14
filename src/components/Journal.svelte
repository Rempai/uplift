<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import type { journalAnswer } from "@/main";

  import type { PassageRead } from "@/lib/client";

  import Tabs from "@/components/Tab.svelte";
  import Form from "@/components/Form.svelte";
  import Button from "@/components/Button.svelte";

  export let journal_data: Array<PassageRead>;
  export let context_data: journalAnswer;

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

    addInputToFormData(form_data, "main_problem", context_data.marked_problem);
    addInputToFormData(form_data, "parties_involved", context_data.marked_involved);
    addInputToFormData(form_data, "main_cause", context_data.marked_cause);

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
  <div class="overflow-x-auto flex flex-col flex-wrap basis-11/12">
    <Tabs bind:activeTabValue={currentTab} items={tabItems} />
    <span
      on:keypress
      on:click={() => gotoBranch(branch_data)}
      class="w-full flex justify-center mt-3">
      <Button text="Go to branch" class="bg-aurora-orange" />
    </span>
    <div class="h-full" />
    <div class="overflow-y-auto">
      {#if currentTab}
        {#each branch_data as data}
          <div
            class={data.speaker === "You"
              ? "flex flex-col items-end text-end w-96 px-3 mt-2"
              : "w-96 px-3 mt-2"}>
            <p
              class={data.speaker === "You"
                ? "bg-frost-4 w-fit p-1"
                : "bg-aurora-green w-fit p-1"}>
              {data.speaker}
            </p>
            <p class={data.speaker === "You" ? "bg-frost-4 p-1" : "bg-aurora-green p-1"}>
              {@html data.content}
            </p>
          </div>
        {/each}
      {/if}
    </div>
  </div>
  <div class="border border-night-1" />
  <div class="overflow-hidden overflow-y-auto flex flex-col flex-wrap pb-4 w-full pr-2">
    <Form handleSubmit={submitForm} on:back={() => history.back()}>
      <div slot="forms" class="w-full">
        <label class="bg-aurora-orange p-2 !mt-1 !mb-0" for="main_problem">Main Problem</label>
        <input
          disabled
          value={context_data.marked_problem}
          name="main_problem"
          type="text"
          placeholder="What?"
          required
          class="w-full !rounded-[0px]" />
        <label class="bg-aurora-orange p-2 !mb-0" for="parties_involved">Parties Involved</label>
        <input
          disabled
          value={context_data.marked_involved}
          name="parties_involved"
          type="text"
          placeholder="What?"
          required
          class="w-full !rounded-[0px]" />
        <label class="bg-aurora-orange p-2 !mb-0" for="main_cause">Primary Cause</label>
        <input
          disabled
          value={context_data.marked_cause}
          name="main_cause"
          type="text"
          placeholder="What?"
          required
          class="w-full !rounded-[0px]" />
        <div>
          <div class="bg-aurora-orange text-left p-2 mt-5"><b>Virtue of courage</b></div>
          <table class="w-full">
            <thead>
              <tr>
                <th class="bg-aurora-purple" />
                <th class="text-center bg-frost-1" colspan="2">Underused</th>
                <th class="text-center bg-frost-1">Balanced</th>
                <th class="text-center bg-frost-1" colspan="2">Overused</th>
              </tr>
            </thead>
            <tbody>
              {#each virtues as virtue}
                <tr>
                  <td class="capitalize bg-aurora-purple p-4 w-32 !m-0">{virtue}</td>
                  {#each Array(2) as _}
                    <td class="bg-frost-4 py-4 px-6 text-center">
                      <input class="scale-150" type="radio" name={virtue} value="1" required />
                    </td>
                  {/each}
                  <td class="bg-aurora-green py-4 px-6 text-center">
                    <input class="scale-150" type="radio" name={virtue} value="3" required />
                  </td>
                  {#each Array(2) as _}
                    <td class="bg-aurora-red py-4 px-6 text-center">
                      <input class="scale-150" type="radio" name={virtue} value="5" required />
                    </td>
                  {/each}
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </Form>
  </div>
</div>
