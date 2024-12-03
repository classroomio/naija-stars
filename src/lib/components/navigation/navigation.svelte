<script>
  import { Link } from 'svelte-routing';
  import Sun from 'lucide-svelte/icons/sun';
  import Moon from 'lucide-svelte/icons/moon';
  import ArrowUpRight from 'lucide-svelte/icons/arrow-up-right';
  import Button from '$lib/components/button/button.svelte';
  import { toggleMode } from 'mode-watcher';

  import logo192 from '$lib/assets/logo.svg';
</script>

<header
  class="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur"
>
  <p
    class="bg-blue-700 py-1.5 text-center text-sm font-medium text-white dark:bg-blue-700 dark:text-white"
  >
    built by
    <a
      href="https://classroomio.com"
      target="_blank"
      class="inline-flex items-center font-semibold underline-offset-2 hover:underline"
    >
      classroomio
      <svg
        width="24"
        height="24"
        stroke="currentColor"
        stroke-width="2"
        class="lucide-icon lucide lucide-arrow-up-right ml-0.5 h-3 w-3"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        ><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg
      >
    </a>
    | data by
    <a
      href="https://madeinnigeria.dev"
      target="_blank"
      class="inline-flex items-center font-semibold underline-offset-2 hover:underline"
    >
      made in nigeria
      <svg
        width="24"
        height="24"
        stroke="currentColor"
        stroke-width="2"
        class="lucide-icon lucide lucide-arrow-up-right ml-0.5 h-3 w-3"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        ><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg
      >
    </a>
  </p>
  <div class="container flex h-14 max-w-screen-2xl items-center">
    <div class="mr-4 hidden md:flex">
      <a href="/" class="mr-6 flex items-center space-x-4">
        <img src={logo192} alt="Naija Stars" class="h-8 w-8" />

        <Link
          to={'/docs'}
          class="transition-colors text-foreground/50 hover:underline cursor-pointer"
          let:active
        >
          <span class={active ? 'text-foreground/90' : ''}> Docs </span>
        </Link>

        <span class="hidden font-bold xl:inline-block">Naija Stars</span>
      </a>
      <!-- <nav class="flex items-center gap-3 text-sm">
        
      </nav> -->
    </div>
    <button
      type="button"
      tabindex="0"
      aria-haspopup="dialog"
      aria-expanded="false"
      data-melt-dialog-trigger=""
      data-dialog-trigger=""
      class="focus-visible:ring-ring inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 py-2 mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
      data-button-root=""
      ><svg
        stroke-width="1.5"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        ><path
          d="M3 5H11"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path><path
          d="M3 12H16"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path><path
          d="M3 19H21"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path></svg
      >
      <span class="sr-only" data-svelte-h="svelte-1t6m3jq">Toggle Menu</span
      ></button
    >
    <div
      class="flex flex-1 items-center justify-between space-x-2 md:justify-end"
    >
      <nav class="flex items-center">
        <Button
          variant="link"
          href="https://www.madeinnigeria.dev"
          target="_blank"
          rel="noreferrer noopener"
          class="flex items-center gap-0"
        >
          Made in Nigeria

          <ArrowUpRight class="h-4" />
        </Button>
        <Button
          variant="link"
          href="https://www.classroomio.com"
          target="_blank"
          rel="noreferrer noopener"
          class="flex items-center gap-0"
        >
          ClassroomIO

          <ArrowUpRight class="h-4" />
        </Button>
        <a
          href="https://github.com/classroomio/classroomio"
          target="_blank"
          rel="noopener noreferrer"
          ><div
            class="focus-visible:ring-ring inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground rounded-md text-xs h-8 w-8 px-0"
          >
            <svg viewBox="0 0 438.549 438.549" class="h-4 w-4"
              ><path
                fill="currentColor"
                d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z"
              ></path></svg
            > <span class="sr-only" data-svelte-h="svelte-11yow7k">GitHub</span>
          </div></a
        >
        <a
          href="https://twitter.com/classroomio"
          target="_blank"
          rel="noreferrer"
          ><div
            class="focus-visible:ring-ring inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground rounded-md text-xs h-8 w-8 px-0"
          >
            <svg
              height="23"
              viewBox="0 0 1200 1227"
              width="23"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              class="h-3 w-3 fill-current"
              ><path
                d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"
              ></path></svg
            >
            <span class="sr-only" data-svelte-h="svelte-13ytjzu"
              >X (formerly known as Twitter)</span
            >
          </div></a
        >

        <Button on:click={toggleMode} variant="outline" size="icon">
          <Sun
            class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
          />
          <Moon
            class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
          />
          <span class="sr-only">Toggle theme</span>
        </Button>
      </nav>
    </div>
  </div>
</header>
