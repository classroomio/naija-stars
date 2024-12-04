<script>
  import { Router, Route } from 'svelte-routing';

  import { Navigation } from '$lib/components/navigation';
  import HomePage from '$lib/pages/home/page.svelte';
  import DocsPage from '$lib/pages/docs/page.svelte';
  import OtherPage from '$lib/pages/other/page.svelte';
  import { ModeWatcher } from 'mode-watcher';

  import './style.css';

  export let url = '';
</script>

<ModeWatcher />

<Router {url}>
  <main class="w-full">
    <Navigation />

    <div class="">
      <Route path="/stats/:id" component={OtherPage} />
      <Route path="/">
        <HomePage />
      </Route>
      <Route path="/docs">
        <DocsPage />
      </Route>
    </div>
  </main>
</Router>
