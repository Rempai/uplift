<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import type { PassageRead, RideRead } from "@/lib/client";

  import Tabs from "@/components/Tab.svelte";
  import Form from "@/components/Form.svelte";
  import Button from "@/components/Button.svelte";
  import IoIosClose from "~icons/ion/close-outline";
  import MingcuteUser4Fill from "~icons/mingcute/user-4-fill";

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
</script>

{#if openJournal}
  <div
    class="bg-night-3 flex mx-auto max-w-5xl rounded h-full border-4 border-night-1 z-20 overflow-hidden">
    {#if open === 1}
      <div
        class="flex h-full w-min flex-wrap overflow-y-auto overflow-x-hidden border-r-4 border-night-1">
        <Tabs bind:activeTabValue={currentTab} items={tabItems} />
        <Button
          onClick={gotoBranch}
          text="Go to branch"
          class="w-48 h-fit flex justify-center mt-3 bg-aurora-orange text-base !rounded-[0px] !px-2 !py-3 !shadow-[0px] self-end" />
      </div>
      <div class="w-full flex-col overflow-y-auto overflow-x-hidden relative">
        <div class="flex flex-col sticky top-0 z-10">
          <div class="flex bg-night-2 pb-[0.67rem]">
            <img
              class="ml-3 mt-2 rounded-[100%] h-10 w-10 border-2 border-night-1"
              src={currentRide.passenger.icon}
              alt="" />
            <p class="mt-4 ml-2">{currentRide.passenger.name}</p>
          </div>
          <hr class="border-night-1 border-[2.4px] mb-3" />
        </div>
        {#if currentTab}
          {#each branchData as data}
            <div class={data.speaker === "You" ? "w-full flex justify-end" : "w-full flex"}>
              {#if data.speaker !== "You"}
                <img
                  class="w-10 h-10 rounded-[100%] ml-2"
                  src={currentRide.passenger.icon}
                  alt="" />
                <div
                  class="left bubble mb-8 flex flex-col w-1/3 text-night-2"
                  style="background-color: {data.attribute.color}">
                  <p>
                    {@html data.content}
                  </p>
                </div>
              {:else}
                <div class="right bubble mb-8 flex flex-col w-1/3 bg-aurora-green text-night-2">
                  <p>
                    {@html data.content}
                  </p>
                </div>
                <MingcuteUser4Fill class="w-12 h-12" />
              {/if}
            </div>
          {/each}
        {/if}
      </div>
    {/if}
    {#if open === 2}
      <div
        class="overflow-hidden overflow-y-auto flex flex-col flex-wrap w-full pb-3 h-full justify-center">
        <Form handleSubmit={submitForm} on:back={() => history.back()}>
          <div slot="forms" class="flex w-full mx-auto items-center">
            <div class="flex flex-col w-1/2">
              <div class="justify-start items-start grow m-8 mt-3 mb-0">
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
            <div class="border-2 border-night-1 h-2/3" />
            <div class="flex flex-col w-1/2">
              <div class="rounded overflow-hidden h-full m-8 mt-3 mb-1">
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
            class="!shadow-transparent flex justify-center items-center w-full h-full">
            <div slot="icon">
              <IoIosClose font-size="1.5em" class="text-aurora-red h-[2.53rem]" />
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

<style>
  .bubble {
    --r: 25px;
    --t: 30px;

    padding: calc(2 * var(--r) / 3);
    -webkit-mask: radial-gradient(var(--t) at var(--_d) 100%, #0000 98%, #000 102%) var(--_d) 0 /
        calc(100% - var(--r)) var(--t) no-repeat,
      conic-gradient(at var(--r) var(--r), #000 75%, #0000 0) calc(var(--r) / -2)
        calc(var(--r) / -2) padding-box,
      radial-gradient(50% 50% at center center, #000 98%, #0000 101%) 0 100% / var(--r) var(--r)
        space padding-box;
  }
  .left {
    --_d: 0%;
    border-left: var(--t) solid #0000;
    place-self: start;
  }
  .right {
    --_d: 100%;
    border-right: var(--t) solid #0000;
    place-self: end;
  }
</style>
