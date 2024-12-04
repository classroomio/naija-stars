<script lang="ts">
  import type { Repository } from '$lib/types/repository';
  import { Marquee, MarqueeCard } from '$lib/components/marquee';
  import { BorderBeam } from '$lib/components/border-beam';

  export let data: Repository[] = [];

  let firstRow = data.slice(0, data.length / 2);
  let secondRow = data.slice(data.length / 2);
</script>

<div
  class="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background py-2 mb-5"
>
  <BorderBeam size={300} duration={12} />
  <h2
    class="mt-5 scroll-m-20 border-b pb-4 md:text-3xl text-center font-semibold tracking-tight transition-colors first:mt-0"
  >
    The Odogwu's
  </h2>
  <Marquee pauseOnHover class="[--duration:20s]">
    {#each firstRow as item}
      <MarqueeCard {...item} />
    {/each}
  </Marquee>
  <Marquee reverse pauseOnHover class="[--duration:20s]">
    {#each secondRow as item}
      <MarqueeCard {...item} />
    {/each}
  </Marquee>
  <div
    class="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"
  ></div>
  <div
    class="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"
  ></div>
</div>
