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
    addSelectedRows,
    addSortBy,
    addTableFilter,
  } from 'svelte-headless-table/plugins';
  import ArrowUpDown from 'lucide-svelte/icons/arrow-up-down';

  import { cn } from '$lib/utils';
  import { Input } from '$lib/components/input';
  import type { Repository, ApiMetadata } from '$lib/types/repository';

  import Actions from './table-actions.svelte';
  import DataTableCheckbox from './table-checkbox.svelte';
  import * as Table from '$lib/components/table/index.js';
  import { Button } from '$lib/components/button/index.js';

  export let data: Repository[] = [];
  export let apiMetadata: ApiMetadata;
  export let currentPage: number;
  export let currentOrder: string;

  const table = createTable(readable(data), {
    sort: addSortBy({ disableMultiSort: true }),
    page: addPagination(),
    filter: addTableFilter({
      fn: ({ filterValue, value }) => value.includes(filterValue),
    }),
    select: addSelectedRows(),
    hide: addHiddenColumns(),
  });

  const columns = table.createColumns([
    table.column({
      header: (_, { pluginStates }) => {
        const { allPageRowsSelected } = pluginStates.select;
        return createRender(DataTableCheckbox, {
          checked: allPageRowsSelected,
        });
      },
      accessor: 'id',
      cell: ({ row }, { pluginStates }) => {
        const { getRowState } = pluginStates.select;
        const { isSelected } = getRowState(row);

        return createRender(DataTableCheckbox, {
          checked: isSelected,
        });
      },
      plugins: {
        sort: {
          disable: true,
        },
        filter: {
          exclude: true,
        },
      },
    }),
    table.column({
      header: 'Name',
      accessor: 'name',
      plugins: { sort: { disable: true }, filter: { exclude: true } },
    }),
    table.column({
      header: 'Author',
      accessor: 'author',
      cell: ({ value }) => value.toLowerCase(),
      plugins: {
        filter: {
          getFilterValue(value) {
            return value.toLowerCase();
          },
        },
      },
    }),
    table.column({
      header: 'Stars',
      accessor: 'stars',
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
      plugins: {
        sort: {
          disable: true,
        },
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

  const { sortKeys } = pluginStates.sort;
  const { hiddenColumnIds } = pluginStates.hide;
  const ids = flatColumns.map((c) => c.id);
  let hideForId = Object.fromEntries(ids.map((id) => [id, true]));

  const { filterValue } = pluginStates.filter;
  const { selectedDataIds } = pluginStates.select;

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
    const params = new URLSearchParams(window.location.search);
    const pageParam = parseInt(params.get('page'), 10);
    currentPage =
      !isNaN(pageParam) && pageParam > 0
        ? pageParam
        : apiMetadata?.pagination?.currentPage || 1;
    currentOrder = apiMetadata?.sort?.order || 'desc';
  });
</script>

<div class="w-full">
  <div class="hidden py-4">
    <Input
      class="max-w-sm"
      placeholder="Filter emails..."
      type="text"
      bind:value={$filterValue}
    />
  </div>
  <div class="rounded-md my-4 border">
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
                    {#if cell.id === 'stars'}
                      <Button
                        variant="ghost"
                        class="pl-0 hover:bg-transparent"
                        on:click={() =>
                          (currentOrder =
                            currentOrder === 'asc' ? 'desc' : 'asc')}
                      >
                        <Render of={cell.render()} />
                        <ArrowUpDown
                          class="ml-2 h-4 w-4 {currentOrder === 'asc' &&
                            'text-white'}"
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
            <Table.Row
              {...rowAttrs}
              data-state={$selectedDataIds[row.id] && 'selected'}
            >
              {#each row.cells as cell (cell.id)}
                <Subscribe attrs={cell.attrs()} let:attrs>
                  <Table.Cell class="[&:has([role=checkbox])]:pl-3" {...attrs}>
                    {#if cell.id === 'amount'}
                      <div class="text-right font-medium">
                        <Render of={cell.render()} />
                      </div>
                    {:else if cell.id === 'status'}
                      <div class="capitalize">
                        <Render of={cell.render()} />
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
      {Object.keys($selectedDataIds).length} of {$rows.length} row(s) selected.
    </div>
    <Button
      variant="outline"
      size="sm"
      on:click={previousPage}
      disabled={!apiMetadata.pagination.hasPrevPage}
    >
      Previous
    </Button>
    <Button
      variant="outline"
      size="sm"
      on:click={nextPage}
      disabled={!apiMetadata.pagination.hasNextPage}
    >
      Next
    </Button>
  </div>
</div>
