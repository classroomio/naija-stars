<script lang="ts">
  import { onMount } from 'svelte';

  import { API_BASE_URL } from '$lib/config';
  import Table from './table.svelte';
  import { Skeleton } from '$lib/components/skeleton';
  import type { Repository, ApiMetadata } from '$lib/types/repository';

  let repositories: Repository[] = [];
  let apiMetadata: ApiMetadata = {
    pagination: {
      currentPage: 1,
      totalPages: 25,
      totalItems: 250,
      itemsPerPage: 10,
      hasNextPage: false,
      hasPrevPage: false,
    },
    sort: {
      sortBy: 'stars',
      order: 'desc',
    },
  };

  let isFetching = false;

  async function fetchRepositories() {
    isFetching = true;

    try {
      const response = await fetch(`${API_BASE_URL}/repositories?limit=5`);
      if (!response.ok) {
        throw new Error('Failed to fetch repositories');
      }
      const result = await response.json();

      repositories = result.data;
      apiMetadata = {
        pagination: result.pagination,
        sort: result.sort,
      };
    } catch (err: any) {
      console.error(err);
    }

    isFetching = false;
  }

  onMount(() => {
    fetchRepositories();
  });
</script>

<div class="mt-5 max-w-2xl mx-auto">
  {#if isFetching}
    <div class="rounded-md border w-full">
      <div class="flex flex-col gap-4 p-4">
        <Skeleton class="h-10 w-full" />
        <Skeleton class="h-8 w-full" />
        <Skeleton class="h-8 w-full" />
        <Skeleton class="h-8 w-full" />
        <Skeleton class="h-8 w-full" />
        <Skeleton class="h-8 w-full" />
      </div>
    </div>

    <Skeleton class="h-10 w-full" />
  {:else}
    <div>
      <h2
        class="mt-5 scroll-m-20 border-b pb-4 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
      >
        Open source projects in Nigeria
      </h2>
    </div>
    <Table data={repositories} {apiMetadata} />
  {/if}
</div>
