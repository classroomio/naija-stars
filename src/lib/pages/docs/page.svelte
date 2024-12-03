<script>
  import { Router } from 'svelte-routing';
  import GetPage from './get.svelte';
  import SearchPage from './search.svelte';
  import logo from '$lib/assets/logo.svg';

  export let url = '';

  let state = '';

  const navigation = [
    {
      label: 'get',
      text: 'Get Repositories'
    },
    {
      label: 'search',
      text: 'Search Repositories'
    }
  ];
</script>

<Router {url}>
  <main
    class="relative flex flex-col gap-y-5 w-full md:items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10 md:h-[80vh] overflow-hidden overflow-y-auto"
  >
    <aside class="md:sticky top-0 z-30 h-full w-full shrink-0">
      <button on:click={() => (state = '')} class="mb-3 p-2">Repositories</button>

      <ul class="flex flex-col gap-1 mt-2">
        {#each navigation as nav}
          <button
            on:click={() => (state = nav.label)}
            class="p-2 flex items-center gap-5 rounded-md {state === nav.label &&
              'dark:bg-gray-800 text-black border border-gray-900'}"
          >
            <span
              class="px-2 py-1 text-xs rounded-sm uppercase w-[30%] {nav.label === 'get' &&
                'bg-green-900 text-green-400'} {nav.label === 'search' && 'bg-gray-900 text-white'}"
            >
              {nav.label}
            </span>

            <span class="text-sm">{nav.text}</span>
          </button>
        {/each}
      </ul>
    </aside>

    <div class="h-full">
      {#if state === ''}
        <section
          class="flex flex-col justify-center items-center gap-5 rounded-md border h-[60vh] md:h-full p-5"
        >
          <h1 class="text-4xl text-center">Welcome to Naija Stars Docs</h1>
          <img src={logo} alt="logo" class="w-28 h-28" />
        </section>
      {:else if state === 'get'}
        <GetPage />
      {:else if state === 'search'}
        <SearchPage />
      {/if}
    </div>
  </main>
</Router>
