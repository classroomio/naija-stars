<script>
  import HomePage from '$lib/pages/home/page.svelte';
  import { Button } from '$lib/components/button';

  import './style.css';
</script>

<main class="w-full">
  <Button variant="secondary">Click me</Button>
  <section class="max-w-4xl mx-auto">
    <HomePage />
  </section>
</main>
