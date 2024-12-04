<script lang="ts">
  import ComingSoon from '$lib/pages/shared/coming-soon.svelte';
  import Sidebar from '$lib/pages/shared/sidebar.svelte';
</script>

<div
  class="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10"
>
  <Sidebar />

  <div class="py-6 lg:gap-10 lg:py-8 mt-5 max-w-2xl mx-auto">
    <div class="h-[50vh] flex items-center justify-center">
      <ComingSoon />
    </div>
  </div>
</div>
