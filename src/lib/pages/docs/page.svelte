<script>
  import { Router } from 'svelte-routing';
  import GetPage from './get.svelte';
  import SearchPage from './search.svelte';
  import logo from '$lib/assets/logo.svg';

  export let url = '';

  let state = '';

  const navigation = [
    {
      label: 'get'
    },
    {
      label: 'search'
    }
  ];
</script>

<Router {url}>
  <main class="p-5">
    <div
      class="flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[100px_minmax(0,1fr)] lg:gap-10"
    >
      <aside
        class="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block"
      >
        <div class="">
          <button on:click={() => (state = '')}>Repositories</button>
          <ul>
            {#each navigation as nav}
              <li class="py-1">
                <button
                  on:click={() => (state = nav.label)}
                  class="px-2 py-1 text-xs rounded-sm {nav.label === 'get' &&
                    'bg-green-900 text-green-400'} {nav.label === 'search' &&
                    'bg-gray-900 text-white'}"
                >
                  <span class="uppercase">
                    {nav.label}
                  </span>
                </button>
              </li>
            {/each}
          </ul>
        </div>
      </aside>

      <div class=" h-full">
        {#if state === ''}
          <section
            class="flex flex-col justify-center items-center gap-5 rounded-md border h-[70%]"
          >
            <h1 class="text-4xl">Welcome to Naija Stars Docs</h1>
            <img src={logo} alt="logo" class="w-28 h-28" />
          </section>
        {:else if state === 'get'}
          <GetPage />
        {:else if state === 'search'}
          <SearchPage />
        {/if}
      </div>
    </div>
  </main>
</Router>
