<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import Menu from "@/components/contextMenu/Menu.svelte";
  import MenuOption from "@/components/contextMenu/MenuOption.svelte";

  const dispatch = createEventDispatcher();

  let pos = { x: 0, y: 0 };
  let showMenu = false;

  export const key = {};

  let selectedText = "";

  interface marks {
    text: string;
    type: string;
  }

  document.addEventListener(`selectionchange`, () => {});
  async function onRightClick(e) {
    selectedText = document.getSelection().toString();
    console.log(selectedText);

    if (showMenu) {
      showMenu = false;
      await new Promise((res) => setTimeout(res, 100));
    }
    
    pos = { x: e.clientX, y: e.clientY };
    showMenu = true;
  }

  function closeMenu() {
    showMenu = false;
  }

  const dispatchClick = (marks) => {
    dispatch("menuClick", marks);
  };
</script>

{#if showMenu}
  <Menu {...pos} on:click={closeMenu} on:clickoutside={closeMenu}>
    <!-- <MenuOption
        on:click{console.log{}}
        text= "{pos.x}, {pos.y}"
      />
      <hr> -->
    <MenuOption
      on:click={() => dispatchClick({ text: selectedText, type: "marked_problem" })}
      text="✏ Main Problem" />
    <MenuOption
      on:click={() => dispatchClick({ text: selectedText, type: "marked_involved" })}
      text="✏ Involved Party" />
    <MenuOption
      on:click={() => dispatchClick({ text: selectedText, type: "marked_cause" })}
      text="✏ Primary Cause" />
  </Menu>
{/if}

<svelte:body on:contextmenu|preventDefault={onRightClick} />
