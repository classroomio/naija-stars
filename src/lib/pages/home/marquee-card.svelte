<script lang="ts">
  import { cn } from '$lib/utils';
  import starIcon from '$lib/assets/star.svg';

  export let author_avatar: string;
  export let name: string;
  export let author: string;
  export let description: string;
  export let stars: number;
  export let link: string;
</script>

<a
  href={link}
  target="_blank"
  class={cn(
    'relative w-72 cursor-pointer overflow-hidden rounded-2xl border p-4',
    // light styles
    'border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]',
    // dark styles
    'dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]'
  )}
>
  <div class="flex flex-row justify-between items-center">
    <div class="flex flex-row items-center gap-2">
      <img class="rounded-full" width="32" height="32" alt="" src={author_avatar} />
      <div class="flex flex-col">
        <!-- svelte-ignore a11y-structure -->
        <figcaption class="text-sm font-medium dark:text-white">
          {name}
        </figcaption>
        <p class="text-xs font-medium dark:text-white/40">{author}</p>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <img src={starIcon} alt="" class="w-5 text-white fill-white" />
      <p class="text-xs">{stars}</p>
    </div>
  </div>
  <blockquote class="mt-2 text-sm line-clamp-3">{description}</blockquote>
</a>
