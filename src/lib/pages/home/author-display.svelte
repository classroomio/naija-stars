<script lang="ts">
  import type { Repository } from '$lib/types/repository';

  export let data: Repository;
</script>

<a
  href={`${data.author_link_madeinnigeria}`}
  target="_blank"
  rel="noopener noreferrer"
>
  <div class="flex items-center gap-3">
    <img src={data.author_avatar} alt="" class="w-7 rounded-full" />

    {data.author_madeinnigeria}
  </div>
</a>
