<script lang="ts">
  import { onMount } from 'svelte';
  import { API_BASE_URL } from '$lib/config';
  import { Skeleton } from '$lib/components/skeleton';
  import Sidebar from '$lib/pages/shared/sidebar.svelte';
  import type { Repository, ApiMetadata } from '$lib/types/repository';
  import { debounce } from '$lib/functions/debounce';
  import detectUrlChange from 'detect-url-change';

  import Table from './table.svelte';
  import Hero from './hero.svelte';

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
  let searchValue: string = '';

  let isFetching = true;
  let isMounted = false;

  const fetchRepositories = debounce(async () => {
    console.log('fetching repositories');
    isFetching = true;

    const params = new URLSearchParams(window.location.search);
    const page = parseInt(params.get('page') || '1', 10);
    const order = params.get('order') || 'desc';
    const sortBy = params.get('sortBy') || 'stars';

    try {
      const url = new URL(`${API_BASE_URL}/repositories`);
      url.searchParams.set('limit', '10');
      url.searchParams.set('page', page.toString());
      url.searchParams.set('order', order);
      url.searchParams.set('sortBy', sortBy);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch repositories');
      }
      const result = await response.json();

      repositories = result.data.map((repo: Repository, index: number) => ({
        ...repo,
        id: index + 1 + (page - 1) * 10,
      }));
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
  }, 1000);

  const searchRepositories = debounce(async (param = '') => {
    console.log('fetching repositories');
    isFetching = true;

    try {
      const url = new URL(`${API_BASE_URL}/repositories/search`);
      url.searchParams.set('text', param);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch repositories');
      }

      const result = await response.json();
      repositories = result.data.map((repo: Repository, index: number) => ({
        ...repo,
        id: index + 1,
      }));
      apiMetadata = {
        pagination: result.pagination,
        sort: result.sort,
      };
    } catch (err: any) {
      console.error(err);
    }

    isFetching = false;
  }, 1000);

  onMount(() => {
    detectUrlChange.on('change', () => {
      fetchRepositories();
    });
  });

  $: gettingFreshData = isFetching && isMounted;
</script>

<div
  class="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10"
>
  <Sidebar />

  <div class="py-6 lg:gap-10 w-full max-w-4xl mx-auto">
    <Hero />

    <h2
      class="mt-5 scroll-m-20 border-b pb-4 text-3xl font-semibold tracking-tight text-center transition-colors first:mt-0"
    >
      All Open Source Projects By Nigerians
    </h2>
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
      {#key gettingFreshData}
        <Table
          data={repositories}
          {apiMetadata}
          bind:searchValue
          isFetching={gettingFreshData}
          onSearch={searchRepositories}
        />
      {/key}
    {/if}
  </div>
</div>
