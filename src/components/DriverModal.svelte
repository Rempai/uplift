<script lang="ts">
  import IoIosChevronBackOutline from "~icons/ion/chevron-back-outline";
  import IoIosChevronForwardOutline from "~icons/ion/chevron-forward-outline";
  import IoIosStarOutline from "~icons/ion/star-outline";

	export let showDriverModal;

	let dialog;

	$: if (dialog && showDriverModal) dialog.showModal();

  const colors = ['#BF616A', '#D08770', '#EBCB8B', '#A3BE8C', '#B48EAD']; // array of predefined colors
  let currentColorIndex = 0;

  function changeColor(direction) {
    if (direction === 'left') {
      currentColorIndex = (currentColorIndex - 1 + colors.length) % colors.length;
    } else {
      currentColorIndex = (currentColorIndex + 1) % colors.length;
    }
  }
</script>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
	bind:this={dialog}
	on:close={() => (showDriverModal = false)}
	on:click|self={() => dialog.close()}
  class='card before:bg-[{colors[currentColorIndex]}]'
>
	<div class="flex justify-between items-center h-full" on:click|stopPropagation>
    <div class="leftArrow ml-[-3.1%]">
      <button on:click|preventDefault={() => changeColor('left')} type="button"><IoIosChevronBackOutline font-size="1.7em" /></button>
    </div>
    <div class="licenseContent flex flex-col ml-[10%] text-2xl">
      <span>Name: xxx</span>
      <span>Age: xxx</span>
      <span>Country: xx</span>
      <span>Achievements: x/x</span>
		<button class="w-32 mt-3 border-2 rounded border-black bg-slate-300 text-xl px-0" on:click={() => dialog.close()}>Close menu</button>
    </div>
    <div class="rightArrow">
      <button on:click|preventDefault={() => changeColor('right')} type="button"><IoIosChevronForwardOutline font-size="1.7em" /></button>
    </div>
	</div>
</dialog>

<style>
  dialog::backdrop {
		background: rgba(0, 0, 0, 0.6);
	}
  /* transitions */
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

  .card{
    height: 40%;
    width: 35%;
    border-radius: 38px;
    position: relative;
    user-select: none;
  }

  .card::before {
    content: '';
    background-image: url('/rijbewijs_feedback_noarrows.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    position: absolute;
    z-index: -99;
  }

</style>
