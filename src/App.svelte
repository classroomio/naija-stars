<script>
  import { Router, Route } from 'svelte-routing';

  import { Navigation } from '$lib/components/navigation';
  import HomePage from '$lib/pages/home/page.svelte';
  import ApiPage from '$lib/pages/api/page.svelte';
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
      <Route path="/api">
        <ApiPage />
      </Route>
      <Route path="/">
        <HomePage />
      </Route>
    </div>
  </main>
</Router>
