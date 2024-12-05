<script lang="ts">
  import { ScrollArea } from '$lib/components/scroll-area';
  import { Link } from 'svelte-routing';
  import logo from '$lib/assets/logo.svg';

  const pages = [
    {
      label: 'All projects',
      to: '/',
    },
    {
      label: 'Most forked',
      to: '/stats/forks',
    },
    {
      label: 'Top 20 contributors',
      to: '/stats/contributors',
    },
    {
      label: 'Top 10 languages',
      to: '/stats/languages',
    },
    {
      label: 'Most popular license',
      to: '/stats/license',
    },
  ];
</script>

<aside
  class="fixed top-20 z-30 -ml-2 hidden h-[80vh] w-full shrink-0 md:sticky md:block"
>
  <ScrollArea class="fixed top-20 left-0 h-screen py-5 px-8">
    <div class="">
      <div class="w-full flex justify-center mb-5">
        <img src={logo} alt="logo" class="w-28 h-28" />
      </div>

      <ul>
        {#each pages as page}
          <li class="px-3 py-2">
            <Link
              to={page.to}
              class="transition-colors text-foreground/50 hover:underline cursor-pointer"
              let:active
            >
              <span class={active ? 'text-foreground/90' : ''}>
                {page.label}
              </span>
            </Link>
          </li>
        {/each}
      </ul>
    </div>
  </ScrollArea>
</aside>
