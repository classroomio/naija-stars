<script>
  import { Router, Link, Route } from 'svelte-routing';

  import { Navigation } from '$lib/components/navigation';
  import HomePage from '$lib/pages/home/page.svelte';
  import DocsPage from '$lib/pages/docs/page.svelte';
  import OtherPage from '$lib/pages/other/page.svelte';
  import { ModeWatcher } from 'mode-watcher';
  import { ScrollArea } from '$lib/components/scroll-area';

  import logo from '$lib/assets/logo.svg';

  import './style.css';

  export let url = '';

  const tags = [
    {
      label: 'All projects',
      to: '/',
    },
    {
      label: 'Most forked',
      to: '/stats/forks',
    },
    {
      label: 'Most popular license',
      to: '/stats/license',
    },
    {
      label: 'Top 20 contributors',
      to: '/stats/contributors',
    },
    {
      label: 'Top 10 languages',
      to: '/stats/languages',
    },
  ];
</script>

<ModeWatcher />

<Router {url}>
  <main class="w-full">
    <Navigation />

    <div
      class="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10"
    >
      <aside
        class="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block"
      >
        <ScrollArea class="fixed left-0 h-screen py-5 px-8">
          <div class="">
            <div class="w-full flex justify-center mb-5">
              <img src={logo} alt="logo" class="w-28 h-28" />
            </div>

            <ul>
              {#each tags as tag}
                <li class="px-3 py-2">
                  <Link
                    to={tag.to}
                    class="transition-colors text-foreground/50 hover:underline cursor-pointer"
                    let:active
                  >
                    <span class={active ? 'text-foreground/90' : ''}>
                      {tag.label}
                    </span>
                  </Link>
                </li>
              {/each}
            </ul>
          </div>
        </ScrollArea>
      </aside>

      <div class=" py-6 lg:gap-10 lg:py-8">
        <Route path="/stats/:id" component={OtherPage} />
        <Route path="/">
          <HomePage />
        </Route>
        <Route path="/docs">
          <DocsPage />
        </Route>
      </div>
    </div>
  </main>
</Router>
