<script lang="ts">
  import Footer from "@/components/Footer.svelte";
</script>

<section class="p-4 mx-auto max-w-screen-lg" id="knowledge">
  <div class="md:flex md:justify-around md:items-center md:gap-20">
    <div class="pb-10">
      <h1>Knowledge Page</h1>
      <p>
        Uplift is a game set in the near future, one where the gig economy has kept expanding and
        taxi licensing has become impossibly complicated! So much so, that the only viable way for
        a ride-sharing service to exist, is to offer a complimentary service to get around
        licensing issues. In Uplift’s case, the service provided is one of psychological advice. Go
        to <a href="http://deugd.net">Deugd.net</a> for more info about virtues.
      </p>
    </div>
  </div>
  {#each { length: 4 } as _}
    <div class="md:flex md:justify-around md:items-center md:gap-20" id="lorem">
      <div class="pb-10">
        <h3>Lorem</h3>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Est ex perferendis, sunt
          cupiditate repudiandae adipisci autem animi consequatur architecto laboriosam molestias,
          exercitationem quas, suscipit rerum expedita facilis cumque obcaecati illum! Lorem ipsum
          dolor sit, amet consectetur adipisicing elit. Est ex perferendis, sunt cupiditate
          repudiandae adipisci autem animi consequatur architecto laboriosam molestias,
          exercitationem quas, suscipit rerum expedita facilis cumque obcaecati illum!
        </p>
      </div>
    </div>
  {/each}
</section>
<section class="bg-night-3">
  <div class="p-4 mx-auto max-w-screen-lg md:flex md:justify-around md:items-center md:gap-20">
    <div class="pb-10 order-2">
      <h4>De Buitenkamer</h4>
      <p>
        Uplift is being designed as a student project at the behest of De Buitenkamer (<a
          href="https://buitenkamer.org">https://buitenkamer.org</a
        >). Who gave students at The Hague University of Applied Sciences the challenge to create a
        fun and innovative way to practice and learn ethical thinking and skills, as well as
        understanding of the concept of courage in general. The resulting game focuses on analysis
        of ethical problems and recognition of virtues and character skills as they have been
        developed in the field of Positive Psychology.
      </p>
    </div>
    <div class="order-1">
      <img src="uplift-buitenkamer.png" alt="" class="rounded w-screen" />
    </div>
  </div>
</section>

<Footer />
