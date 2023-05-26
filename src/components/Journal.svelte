<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import type { PassageRead, RideRead } from "@/lib/client";

  import Tabs from "@/components/Tab.svelte";
  import Form from "@/components/Form.svelte";
  import Button from "@/components/Button.svelte";
  import Tab from "@/components/Tab.svelte";

  export let journalData: Array<PassageRead>;
  export let resolutionData: RideRead;

  let branchData: Array<PassageRead> = [];

  const dispatch = createEventDispatcher();

  let currentTab = 0;

  interface tabItem {
    label: string;
    value: number;
  }

  let tabItems: Array<tabItem> = [{ label: "Trunk", value: 1 }];

  let virtues: Array<string> = ["bravery", "perseverance", "integrity", "enthusiasm"];

  const getData = (tab: number) => {
    journalData.forEach((obj) => {
      if (tab === 1) {
        if (obj.branch === "Trunk") branchData.push(obj);
      } else {
        if (!tabItems.find((e) => e.label === obj.branch)) {
          let tab_num: number = tabItems.length;
          tabItems.push({ label: obj.branch, value: tab_num + 1 });
        }

        const item = tabItems.find((e) => e.label === obj.branch);
        if (obj.branch !== "trunk" && item && item.value === tab) {
          branchData.push(obj);
        }
      }
    });
  };

  const gotoBranch = async () => {
    dispatch(
      "gotoTab",
      branchData.find((e) => e.branch === tabItems[currentTab - 1].label)
    );
  };

  function addInputToFormData(formData, key, value) {
    formData.append(key, value);
  }

  const submitForm = async ({ target }) => {
    const formData = new FormData(target);

    addInputToFormData(formData, "mainProblem", resolutionData.mainProblem);
    addInputToFormData(formData, "partiesInvolved", resolutionData.partiesInvolved);
    addInputToFormData(formData, "mainCause", resolutionData.mainCause);

    const value = Object.fromEntries(formData.entries());
    dispatch("report", value);
  };

  $: {
    branchData = [];
    getData(currentTab);
  }

  // Make outer container with flex col and with a fixed `em` width and height.
  // First col: get 1/th width of parent container, flex col, all children in this container with full
  // middle col: 80% of max width of parent. flex row, padding on first row and items-center.
  // third col: use tab component, change the style, flex col, h-1/2 on each
</script>

<div
  class="bg-night-3 flex mx-auto w-screen max-w-screen-lg h-[20em] gap-2 border-4 border-night-1 z-20"
  style="border-radius: 10%">
  <div class="flex-col w-3/12 h-full">
    <div class="flex flex-wrap">
      <Tabs bind:activeTabValue={currentTab} items={tabItems} />
      <Button
        onclick={gotoBranch}
        text="Go to branch"
        class="w-full flex justify-center align-bottom mt-3 bg-aurora-orange text-sm" />
    </div>
  </div>
  <div class="w-full flex-col overflow-y-auto overflow-x-hidden">
    {#if currentTab}
      {#each branchData as data}
        <div
          class={data.speaker === "You"
            ? "flex flex-col items-end text-end w-full px-3 mt-2"
            : "w-full px-3 mt-2"}>
          <p class={data.speaker === "You" ? "bg-frost-4 w-fit p-1" : "bg-aurora-green w-fit p-1"}>
            {data.speaker}
          </p>
          <p class={data.speaker === "You" ? "bg-frost-4 p-1" : "bg-aurora-green w-fit p-1"}>
            {@html data.content}
          </p>
        </div>
      {/each}
    {/if}
  </div>
  <div class="flex flex-col w-1/12">
    <div class="border-4 border-night-2 grow flex justify-center items-center">
      <p class="writing-vertical transform rotate-90 origin-center">Journal</p>
    </div>
    <div class="border-4 border-night-2 grow flex justify-center items-center">
      <p class="writing-vertical transform rotate-90 origin-center">Report</p>
    </div>
  </div>
</div>

<!-- <div
  class="bg-night-3 rounded z-2 flex absolute left-0 right-0 mx-auto top-3 w-screen max-w-screen-lg max-h-[30rem] gap-2 border-4 border-night-1 z-20">
  <div class="overflow-x-auto flex flex-col flex-wrap basis-11/12">
    <Tabs bind:activeTabValue={currentTab} items={tabItems} />
    <Button
      onClick={gotoBranch}
      text="Go to branch"
      class="w-full flex justify-center mt-3 bg-aurora-orange" />
    <div class="h-full" />
    <div class="overflow-y-auto overflow-x-hidden">
      {#if currentTab}
        {#each branchData as data}
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
        <label class="bg-aurora-orange p-2 !mt-1 !mb-0" for="mainProblem">Main Problem</label>
        <input
          disabled
          value={resolutionData.mainProblem}
          name="mainProblem"
          type="text"
          placeholder="What?"
          required
          class="w-full !rounded-[0px]" />
        <label class="bg-aurora-orange p-2 !mb-0" for="partiesInvolved">Parties Involved</label>
        <input
          disabled
          value={resolutionData.partiesInvolved}
          name="partiesInvolved"
          type="text"
          placeholder="What?"
          required
          class="w-full !rounded-[0px]" />
        <label class="bg-aurora-orange p-2 !mb-0" for="mainCause">Primary Cause</label>
        <input
          disabled
          value={resolutionData.mainCause}
          name="mainCause"
          type="text"
          placeholder="What?"
          required
          class="w-full !rounded-[0px]" />
        <div>
          <div class="bg-aurora-orange text-left p-2 mt-5"><b>Virtue of courage</b></div>
          <table class="w-full">
            <thead>
              <tr>
                <th class="bg-gray-400" />
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
-->
