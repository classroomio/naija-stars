<script lang="ts">
  import { API_BASE_URL } from '$lib/config';
  import { Skeleton } from '$lib/components/skeleton';
  import type { Repository, ApiMetadata } from '$lib/types/repository';
  import { debounce } from '$lib/functions/debounce';

  import Table from './table.svelte';

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
  let currentPage: number;
  let currentOrder: string;

  let isFetching = false;
  let isMounted = false;

  const fetchRepositories = debounce(
    async (pageNumber: number = 1, order: string = 'desc') => {
      console.log('fetching repositories');
      isFetching = true;

      try {
        const url = new URL(`${API_BASE_URL}/repositories`);
        url.searchParams.set('limit', '10');
        url.searchParams.set('page', pageNumber.toString());
        url.searchParams.set('order', order);

        const response = await fetch(url);

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

      if (!isMounted) {
        isMounted = true;
      }
    },
    1000
  );

  $: fetchRepositories(currentPage, currentOrder);

  $: gettingFreshData = isFetching && isMounted;
</script>

<div class="mt-5 max-w-2xl mx-auto">
  {#if isFetching && !isMounted}
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
  {:else}
    <div>
      <h2
        class="mt-5 scroll-m-20 border-b pb-4 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
      >
        Open source projects in Nigeria
      </h2>
    </div>
    {#key gettingFreshData}
      <Table
        data={repositories}
        {apiMetadata}
        bind:currentPage
        bind:currentOrder
        isFetching={gettingFreshData}
      />
    {/key}
  {/if}
</div>
