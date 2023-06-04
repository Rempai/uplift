<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import type { PassageRead, RideRead } from "@/lib/client";

  import Tabs from "@/components/Tab.svelte";
  import Form from "@/components/Form.svelte";
  import Button from "@/components/Button.svelte";
  import IoIosClose from "~icons/ion/close-outline";

  export let journalData: Array<PassageRead>;
  export let resolutionData: RideRead;
  export let currentRide: RideRead;
  export let closeButton = true;

  let openJournal = true;
  let branchData: Array<PassageRead> = [];
  let open = 1;
  let currentTab = 0;

  const dispatch = createEventDispatcher();

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

  const checkShow = (number: number) => {
    if (open !== number) {
      open = number;
    }
  };

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

{#if openJournal}
  <div
    class="bg-night-3 flex mx-auto max-w-5xl rounded-[10%] h-full border-4 border-night-1 z-20 overflow-hidden">
    {#if open === 1}
      <div
        class="flex h-full w-min flex-wrap overflow-y-auto overflow-x-hidden border-r-4 border-night-1">
        <Tabs bind:activeTabValue={currentTab} items={tabItems} />
        <Button
          onClick={gotoBranch}
          text="Go to branch"
          class="w-48 h-fit flex justify-center mt-3 bg-aurora-orange text-sm !rounded-[0px] !px-2 !py-3 !shadow-[0px] self-end" />
      </div>
      <div class="w-full flex-col overflow-y-auto overflow-x-hidden relative">
        <div class="flex flex-col sticky top-0">
          <div class="flex bg-night-2 pb-[0.67rem]">
            <img
              class="ml-2 mt-2 rounded-[100%] h-10 w-10 border-2 border-night-1"
              src={currentRide.passenger.icon}
              alt="" />
            <p class="mt-4 ml-2">{currentRide.passenger.name}</p>
          </div>
          <hr class="border-night-1 border-[2.4px] mb-3" />
        </div>
        {#if currentTab}
          {#each branchData as data}
            <div
              class={data.speaker === "You"
                ? "flex flex-col items-end text-end w-full px-3 mt-2 rounded-b"
                : "w-fit px-3 mt-2 rounded-b"}>
              <p
                class={data.speaker === "You"
                  ? "bg-frost-4 w-fit p-1 rounded-t mr-2"
                  : "bg-aurora-green w-fit p-1 rounded-t ml-2"}>
                {data.speaker}
              </p>
              <p
                class={data.speaker === "You"
                  ? "bg-frost-4 p-1 mr-2 rounded-b rounded-tl"
                  : "bg-aurora-green p-1 ml-2 rounded-b rounded-tr"}>
                {@html data.content}
              </p>
            </div>
          {/each}
        {/if}
      </div>
    {/if}
    {#if open === 2}
      <div class="overflow-hidden overflow-y-auto flex flex-col flex-wrap w-full pb-3">
        <Form handleSubmit={submitForm} on:back={() => history.back()}>
          <div slot="forms" class="flex w-full ml-8 mt-2">
            <div class="flex flex-col w-1/2">
              <div class="flex flex-col items-center">
                <img src="logo.png" alt="" class="w-32" />
                <p class="font-bold text-md mt-3">Problem</p>
              </div>
              <div class="justify-start items-start grow mr-2">
                <label class="bg-aurora-orange p-2 !mb-0 !m-0 rounded-t" for="mainProblem"
                  >Main Problem</label>
                <input
                  disabled
                  value={resolutionData.mainProblem}
                  name="mainProblem"
                  type="text"
                  placeholder="What?"
                  required
                  class="w-full !rounded-[0px] !rounded-b" />
                <label class="bg-aurora-orange p-2 !mb-0 rounded-t" for="partiesInvolved"
                  >Parties Involved</label>
                <input
                  disabled
                  value={resolutionData.partiesInvolved}
                  name="partiesInvolved"
                  type="text"
                  placeholder="What?"
                  required
                  class="w-full !rounded-[0px] !rounded-b" />
                <label class="bg-aurora-orange p-2 !mb-0 rounded-t" for="mainCause"
                  >Primary Cause</label>
                <input
                  disabled
                  value={resolutionData.mainCause}
                  name="mainCause"
                  type="text"
                  placeholder="What?"
                  required
                  class="w-full !rounded-[0px] !rounded-b" />
              </div>
            </div>
            <div class="border-2 border-night-1" />
            <div class="flex flex-col w-1/2">
              <div class="flex flex-col items-center">
                <img src="logo.png" alt="test" class="w-32" />
                <p class="font-bold text-md mt-3">Problem</p>
              </div>
              <div class="ml-2 mr-8 rounded overflow-hidden h-full">
                <div class="bg-aurora-orange text-left p-2"><b>Virtue of courage</b></div>
                <table class="w-full">
                  <thead>
                    <tr>
                      <th class="bg-storm-1" />
                      <th class="text-center bg-frost-3 text-sm" colspan="2">Underused</th>
                      <th class="text-center bg-frost-3 text-sm">Balanced</th>
                      <th class="text-center bg-frost-3 text-sm" colspan="2">Overused</th>
                    </tr>
                  </thead>
                  <tbody>
                    {#each virtues as virtue}
                      <tr>
                        <td class="capitalize bg-frost-3 p-4 w-32 !m-0">{virtue}</td>
                        {#each Array(2) as _}
                          <td class="bg-frost-4 px-4 text-center ">
                            <input
                              class="scale-150"
                              type="radio"
                              name={virtue}
                              value="1"
                              required />
                          </td>
                        {/each}
                        <td class="bg-aurora-green px-6 text-center">
                          <input class="scale-150" type="radio" name={virtue} value="3" required />
                        </td>
                        {#each Array(2) as _}
                          <td class="bg-aurora-red px-4 text-center">
                            <input
                              class="scale-150"
                              type="radio"
                              name={virtue}
                              value="5"
                              required />
                          </td>
                        {/each}
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Form>
      </div>
    {/if}
    <div class="flex flex-col w-16">
      <div class="border-l-4 border-b-4 border-night-1">
        {#if closeButton}
          <Button
            onClick={() => {
              dispatch("closed");
              openJournal = false;
            }}
            class="!shadow-transparent !p-1 ">
            <div slot="icon">
              <IoIosClose font-size="2em" class="text-aurora-red" />
            </div>
          </Button>
        {/if}
      </div>
      <div
        class={open === 2
          ? "border-l-4 border-b-4 border-night-1 grow flex justify-center items-center bg-night-2 hover:bg-night-3 cursor-pointer"
          : "border-l-4 border-b-4 border-night-1 grow flex justify-center items-center bg-night-3 hover:bg-night-3 cursor-pointer"}
        on:keypress
        on:click={() => checkShow(1)}>
        <p class="writing-vertical transform rotate-90 origin-center font-bold">Journal</p>
      </div>
      <div
        class={open === 1
          ? "border-l-4 border-b-2 border-night-1 grow flex justify-center items-center bg-night-2 hover:bg-night-3 cursor-pointer"
          : "border-l-4 border-b-2 border-night-1 grow flex justify-center items-center bg-night-3 hover:bg-night-3 cursor-pointer"}
        on:keypress
        on:click={() => checkShow(2)}>
        <p class="writing-vertical transform rotate-90 origin-center font-bold">Report</p>
      </div>
    </div>
  </div>
{/if}
