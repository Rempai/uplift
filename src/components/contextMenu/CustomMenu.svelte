<script>
  import Menu from "@/components/contextMenu/Menu.svelte";
  import MenuOption from "@/components/contextMenu/MenuOption.svelte";

  let pos = { x: 0, y: 0 };
  let showMenu = false;

  export const key = {};

  async function onRightClick(e) {
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
</script>

{#if showMenu}
  <Menu {...pos} on:click={closeMenu} on:clickoutside={closeMenu}>
    <!-- <MenuOption
        on:click{console.log{}}
        text= "{pos.x}, {pos.y}"
      />
      <hr> -->
    <MenuOption on:click={console.log} text="✏ main problem" />
    <MenuOption on:click={console.log} text="✏ involved party" />
    <MenuOption on:click={console.log} text="✏ primary cause" />
  </Menu>
{/if}

<svelte:body on:contextmenu|preventDefault={onRightClick} />
