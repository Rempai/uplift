<script lang="ts">
  import Buitenkamer from "/buitenkamer.png";
</script>

<footer class="bg-night-2 pt-10 pb-3 border-t-2 border-solid border-night-1">
  <div class="max-w-screen-md mx-auto flex flex-col md:flex-row justify-between">
    <div class="mb-5">
      <p class="font-bold font-xl mb-5 text-frost-1">De Buitenkamer</p>
      <a href="https://buitenkamer.org/">
        <img src={Buitenkamer} alt="De Buitenkamer" />
      </a>
    </div>
    <div>
      <p class="font-bold font-xl mb-5 text-frost-1">Links</p>
      <ul>
        <li><a href="#/">Home</a></li>
        <li><a href="#/game">Game</a></li>
      </ul>
    </div>
  </div>
</footer>
