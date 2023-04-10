<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import Menu from "@/components/contextMenu/Menu.svelte";
  import MenuOption from "@/components/contextMenu/MenuOption.svelte";

  let offsetright;
  let offsetbottom;

  const dispatch = createEventDispatcher();

  let pos = { x: 0, y: 0 };
  let showMenu = false;

  let divpos = { width: 0, height: 0 };
  let maxWidth;
  let maxHeight;
  let divWidth;
  let divHeight;
  let testheight = 237;
  let testwidth = 162;
  let gaypadding = 16;

  export const key = {};

  let selectedText = "";

  document.addEventListener(`selectionchange`, () => {
    return;
  });
  async function onRightClick(e) {
    selectedText = document.getSelection().toString();

    maxWidth = window.screen.width;
    maxHeight = window.screen.height;
    offsetright = window.screen.width - 162;
    offsetbottom = window.screen.height - 237;
    maxHeight -= 117;

    if (showMenu) {
      showMenu = false;
      await new Promise((res) => setTimeout(res, 100));
    }

    pos = { x: e.clientX, y: e.clientY };
    divpos = { width: 0, height: 0 };
    showMenu = true;
  }

  function closeMenu(event: CustomEvent) {
    showMenu = false;
  }

  function getDimensions(event: CustomEvent) {
    divWidth = Math.ceil(event.detail.width);
    divHeight = Math.ceil(event.detail.height);
    console.log(pos.y);
    console.log(maxHeight, divHeight + pos.y + gaypadding);
  }

  interface marks {
    text: string;
    type: string;
  }

  const dispatchClick = (marks: marks) => {
    dispatch("menuClick", marks);
  };
</script>

{#if showMenu}
  <Menu {...pos} on:click={closeMenu} on:clickoutside={closeMenu} on:dimensions={getDimensions}>
    {#if maxWidth >= testwidth + pos.x && maxHeight >= testheight + pos.y + gaypadding}
      <MenuOption
        on:click={() => dispatchClick({ text: selectedText, type: "mainProblem" })}
        text="✏ Main Problem" />
      <MenuOption
        on:click={() => dispatchClick({ text: selectedText, type: "partiesInvolved" })}
        text="✏ Involved Party" />
      <MenuOption
        on:click={() => dispatchClick({ text: selectedText, type: "mainCause" })}
        text="✏ Primary Cause" />
      {pos.x} & {pos.y} <br />
      {maxWidth} & {maxHeight} <br />
      {divWidth} & {divHeight}
    {:else}
      <div class="">
        <MenuOption
          on:click={() => dispatchClick({ text: selectedText, type: "mainProblem" })}
          text="✏ Main Problem" />
        <MenuOption
          on:click={() => dispatchClick({ text: selectedText, type: "partiesInvolved" })}
          text="✏ Involved Party" />
        <MenuOption
          on:click={() => dispatchClick({ text: selectedText, type: "mainCause" })}
          text="✏ Primary Cause" />
      </div>
      <div class="!bg-aurora-yellow text-aurora-purple">
        <div class="bg-aurora-red text-aurora-purple">test</div>
        {pos.x} & {pos.y} <br />
        {maxWidth} & {maxHeight} <br />
        {divWidth} & {divHeight}
      </div>
    {/if}
  </Menu>
{/if}

<svelte:body on:contextmenu|preventDefault={onRightClick} />
