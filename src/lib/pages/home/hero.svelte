<script lang="ts">
  import { onMount } from 'svelte';
  import { Skeleton } from '$lib/components/skeleton';
  import type { Repository } from '$lib/types/repository';
  import { Marquee, MarqueeCard } from '$lib/components/marquee';
  import { BorderBeam } from '$lib/components/border-beam';
  import { API_BASE_URL } from '$lib/config';

  let data: Repository[] = [];
  let isFetching = true;

  async function fetchOdogwus() {
    try {
      const url = new URL(`${API_BASE_URL}/repositories`);
      const response = await fetch(url);
      const result = await response.json();
      data = result.data;
    } catch (error) {
      console.error(error);
    } finally {
      isFetching = false;
    }
  }

  onMount(() => {
    fetchOdogwus();
  });

  $: firstRow = data.slice(0, data.length / 2);
  $: secondRow = data.slice(data.length / 2);
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

  {#if isFetching}
    <div class="flex flex-col gap-4 p-4">
      <Skeleton class="h-10 w-full" />
      <Skeleton class="h-8 w-full" />
      <Skeleton class="h-8 w-full" />
      <Skeleton class="h-8 w-full" />
      <Skeleton class="h-8 w-full" />
      <Skeleton class="h-8 w-full" />
    </div>
  {:else}
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
  {/if}
  <div
    class="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"
  ></div>
  <div
    class="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"
  ></div>
</div>
