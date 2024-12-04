<script lang="ts">
  import { AspectRatio } from '$lib/components/aspect-ratio';
</script>

<div class="w-[450px]">
  <AspectRatio ratio={16 / 9} class="bg-muted relative">
    <img
      src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
      alt="Gray by Drew Beamer"
      class="h-full w-full rounded-md object-cover"
    />
    <h2
      class="text-center scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 dark:text-black"
    >
      Coming soon
    </h2>
  </AspectRatio>
</div>
