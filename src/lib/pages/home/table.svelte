<script lang="ts">
  import { onMount } from 'svelte';
  import { readable } from 'svelte/store';
  import {
    Render,
    Subscribe,
    createRender,
    createTable,
  } from 'svelte-headless-table';
  import {
    addHiddenColumns,
    addPagination,
    addSortBy,
    addTableFilter,
  } from 'svelte-headless-table/plugins';
  import ArrowUpDown from 'lucide-svelte/icons/arrow-up-down';
  import ArrowRight from 'lucide-svelte/icons/chevron-right';
  import ArrowLeft from 'lucide-svelte/icons/chevron-left';

  import { cn } from '$lib/utils';
  import { Input } from '$lib/components/input';
  import type { Repository, ApiMetadata } from '$lib/types/repository';

  import Actions from './table-actions.svelte';
  import * as Table from '$lib/components/table/index.js';
  import { Button } from '$lib/components/button/index.js';

  export let data: Repository[] = [];
  export let apiMetadata: ApiMetadata;
  export let currentPage: number;
  export let currentOrder: string;
  export let currentSortBy: string;
  export let searchValue: string = '';
  export let isFetching: boolean;

  function extractLastSegment(url) {
    if (typeof url !== 'string' || !url.includes('/')) {
      return '';
    }
    return url.split('/').filter(Boolean).pop();
  }

  function handleSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    searchValue = input.value;
    filterValue.set(input.value);
  }

  const table = createTable(readable(data), {
    sort: addSortBy({ disableMultiSort: true }),
    page: addPagination(),
    filter: addTableFilter({
      fn: ({ filterValue, value }) => value.includes(filterValue),
    }),
    hide: addHiddenColumns(),
  });

  const columns = table.createColumns([
    table.column({
      header: 'Name',
      accessor: 'link',
    }),
    table.column({
      header: '',
      accessor: 'author_avatar',
      cell: ({ value }) => value.toLowerCase(),
    }),
    table.column({
      header: 'Author',
      accessor: 'author',
      cell: ({ value }) => value.toLowerCase(),
    }),
    table.column({
      header: 'Stars',
      accessor: 'stars',
      cell: ({ value }) => {
        return value;
      },
    }),
    table.column({
      header: 'Forks',
      accessor: 'forks',
      cell: ({ value }) => {
        return value;
      },
    }),
    table.column({
      header: '',
      accessor: (data) => data,
      cell: (item) => {
        return createRender(Actions, { data: item.value });
      },
    }),
  ]);

  const {
    headerRows,
    pageRows,
    tableAttrs,
    tableBodyAttrs,
    flatColumns,
    pluginStates,
    rows,
  } = table.createViewModel(columns);

  const { hiddenColumnIds } = pluginStates.hide;
  const ids = flatColumns.map((c) => c.id);
  let hideForId = Object.fromEntries(ids.map((id) => [id, true]));

  const { filterValue } = pluginStates.filter;

  function previousPage() {
    if (currentPage > 1) {
      currentPage--;
    }
  }

  function nextPage() {
    if (apiMetadata.pagination.hasNextPage) {
      currentPage++;
    }
  }

  function onFirstPage() {
    currentPage = 1;
  }

  function onLastPage() {
    currentPage = apiMetadata.pagination.totalPages;
  }

  $: $hiddenColumnIds = Object.entries(hideForId)
    .filter(([, hide]) => !hide)
    .map(([id]) => id);

  $: {
    if (typeof currentPage === 'number') {
      const url = new URL(window.location.href);
      url.searchParams.set('page', currentPage.toString());
      history.replaceState(null, '', url.toString());
    }
  }

  onMount(() => {
    console.log(data);
    const params = new URLSearchParams(window.location.search);
    const pageParam = parseInt(params.get('page') || '1', 10);
    currentPage =
      !isNaN(pageParam) && pageParam > 0
        ? pageParam
        : apiMetadata?.pagination?.currentPage || 1;
    currentOrder = apiMetadata?.sort?.order || 'desc';
  });
</script>

<div class="w-full">
  <div class="rounded-md my-4 border">
    <div class="m-2">
      <Input
        placeholder="Filter repositories..."
        type="text"
        bind:value={$filterValue}
        on:input={handleSearchInput}
      />
    </div>

    <Table.Root {...$tableAttrs}>
      <Table.Header>
        {#each $headerRows as headerRow}
          <Subscribe rowAttrs={headerRow.attrs()}>
            <Table.Row>
              {#each headerRow.cells as cell (cell.id)}
                <Subscribe
                  attrs={cell.attrs()}
                  let:attrs
                  props={cell.props()}
                  let:props
                >
                  <Table.Head
                    {...attrs}
                    class={cn('[&:has([role=checkbox])]:pl-3')}
                  >
                    {#if cell.id === 'stars' || cell.id === 'forks'}
                      <Button
                        variant="ghost"
                        class="pl-0 hover:bg-transparent"
                        on:click={() => {
                          if (cell.id === 'stars') {
                            currentSortBy = 'stars';
                            currentOrder =
                              currentOrder === 'asc' ? 'desc' : 'asc';
                          }
                          if (cell.id === 'forks') {
                            currentSortBy = 'forks';
                            currentOrder =
                              currentOrder === 'asc' ? 'desc' : 'asc';
                          }
                        }}
                      >
                        <Render of={cell.render()} />
                        <ArrowUpDown
                          class="ml-2 h-4 w-4 {currentSortBy === cell.id &&
                            currentOrder === 'asc' &&
                            'text-green-500'} {currentSortBy === cell.id &&
                            currentOrder === 'desc' &&
                            'text-red-500'}"
                        />
                      </Button>
                    {:else}
                      <Render of={cell.render()} />
                    {/if}
                  </Table.Head>
                </Subscribe>
              {/each}
            </Table.Row>
          </Subscribe>
        {/each}
      </Table.Header>
      <Table.Body {...$tableBodyAttrs}>
        {#each $pageRows as row (row.id)}
          <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
            <Table.Row {...rowAttrs}>
              {#each row.cells as cell (cell.id)}
                <Subscribe attrs={cell.attrs()} let:attrs>
                  <Table.Cell class="[&:has([role=checkbox])]:pl-3" {...attrs}>
                    {#if cell.id === 'link'}
                      <!-- wrap it around the link of the repo -->
                      <a
                        href={`${cell.render()}`}
                        class="text-right font-medium"
                        target="_blank"
                      >
                        <Render
                          of={extractLastSegment(cell.render() || '') ||
                            'Unknown'}
                        />
                      </a>
                    {:else if cell.id === 'author_avatar'}
                      <div class="w-[30px]">
                        <img
                          src={`${cell.render()}`}
                          class="rounded-full"
                          alt=""
                        />
                      </div>
                    {:else}
                      <Render of={cell.render()} />
                    {/if}
                  </Table.Cell>
                </Subscribe>
              {/each}
            </Table.Row>
          </Subscribe>
        {/each}
      </Table.Body>
    </Table.Root>
  </div>
  <div class="flex items-center justify-end space-x-2 py-4">
    <div class="text-muted-foreground flex-1 text-sm">
      {$rows.length} repo(s) | Page {currentPage} of
      {apiMetadata.pagination.totalPages}
    </div>

    <Button
      variant="outline"
      size="sm"
      on:click={onFirstPage}
      disabled={currentPage === 1 || isFetching}
    >
      First page
    </Button>

    <Button
      variant="outline"
      size="sm"
      on:click={previousPage}
      disabled={!apiMetadata.pagination.hasPrevPage || isFetching}
    >
      <ArrowLeft />
    </Button>
    <Button
      variant="outline"
      size="sm"
      on:click={nextPage}
      disabled={!apiMetadata.pagination.hasNextPage || isFetching}
    >
      <ArrowRight />
    </Button>
    <Button
      variant="outline"
      size="sm"
      on:click={onLastPage}
      disabled={currentPage === apiMetadata.pagination.totalPages || isFetching}
    >
      Last page
    </Button>
  </div>
</div>
