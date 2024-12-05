<script>
  import { fade } from 'svelte/transition';
  import { Router } from 'svelte-routing';
  import GetPage from './get.svelte';
  import SearchPage from './search.svelte';
  import logo from '$lib/assets/logo.svg';

  export let url = '';

  let id = 1;

  const navigation = [
    {
      id: 1,
      label: 'get',
      text: 'Get Repositories',
    },
    {
      id: 2,
      label: 'get',
      text: 'Search Repositories',
    },
  ];
</script>

<Router {url}>
  <main
    class="relative p-10 flex flex-col gap-y-5 w-full md:items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10 md:min-h-[80vh]"
  >
    <aside class="md:sticky top-0 z-30 h-full w-full shrink-0">
      <button on:click={() => (id = 0)} class="mb-3 p-2 text-xl">
        Repositories
      </button>

      <ul class="flex flex-col gap-3 p-1">
        {#each navigation as nav}
          <button
            on:click={() => (id = nav.id)}
            class="p-2 flex items-center gap-5 rounded-md border-2 border-background hover:border-2 hover:border-gray-200 dark:hover:border-neutral-800 cursor-pointer {id ===
              nav.id &&
              ' text-black dark:text-white border-2 border-gray-200 dark:border-neutral-800'}"
          >
            <span
              class="px-2 py-1 text-xs rounded-sm uppercase w-[30%] {nav.label ===
                'get' && 'bg-green-900 text-green-400'}"
            >
              {nav.label}
            </span>

            <span class="text-sm">{nav.text}</span>
          </button>
        {/each}
      </ul>
    </aside>

    {#key id}
      <div class="h-full" transition:fade>
        {#if id === 0}
          <section
            class="flex flex-col justify-center items-center gap-5 rounded-md border md:h-full p-5"
          >
            <h1 class="text-4xl text-center">Welcome to Naija Stars API</h1>
            <img src={logo} alt="logo" class="w-28 h-28" />
          </section>
        {:else if id === 1}
          <GetPage />
        {:else if id === 2}
          <SearchPage />
        {/if}
      </div>
    {/key}
  </main>
</Router>
