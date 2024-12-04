<section
  class="border rounded-md flex flex-col md:flex-row item-start gap-5 p-5 h-[80vh] overflow-y-auto"
>
  <section class="md:w-2/4 w-full">
    <h1 class="text-xl">Search Repositories</h1>
    <p class="text-sm mt-1">Search for Repositories from the database</p>

    <div class="border rounded-md p-2.5 my-5 text-sm">
      <span class="bg-green-900 text-green-500 px-2 py-1 text-sm rounded-sm"
        >GET</span
      >
      <span class="tracking-wide ml-1"> / v1 / repositories / search</span>
    </div>

    <h1 class="text-xl">Request</h1>
    <p class="text-sm mt-2">Query Parameters</p>

    <div class="≈p-2.5 mt-10 text-sm">
      <div class="flex items-center gap-5 mb-4">
        <p>text</p>
        <p class="text-xs px-2 py-0.5 bg-red-50 text-black rounded-md">
          string
        </p>
      </div>

      <p>Search value</p>
    </div>
  </section>

  <section class="md:w-2/4 w-full flex flex-col gap-5">
    <div
      class="flex flex-col gap-3 bg-white dark:bg-transparent border dark:text-white rounded-md h-auto p-4 text-xs"
    >
      <p>curl --request GET \</p>
      <p>--url https://api.naijastars.dev/v1/repositories/search \</p>
    </div>

    <div
      class="bg-white dark:bg-transparent border dark:text-white rounded-md h-[90%] overflow-auto"
    >
      <pre>
        <code class="language-json text-xs">
          {`
            {
              "data": [
                {
                  "id": 34,
                  "name": "chakra-ui",
                  "link": "https://github.com/chakra-ui/chakra-ui",
                  "description": "⚡️ Simple, Modular & Accessible UI Components for your React Applications",
                  "author": "chakra-ui",
                  "author_link": "https://github.com/chakra-ui",
                  "author_avatar": "https://avatars.githubusercontent.com/u/54212428?v=4",
                  "stars": 38073,
                  "topics": [
                      "a11y",
                      "accessible",
                      "ark-ui",
                      "chakra-ui",
                      "component",
                      "css-in-js",
                      "dark-mode",
                      "design-system",
                      "react",
                      "react-components",
                      "reactjs",
                      "styled",
                      "ui-components",
                      "ui-library",
                      "uikit",
                      "wai-aria"
                  ],
                  "license": {
                      "key": "mit",
                      "url": "https://api.github.com/licenses/mit",
                      "name": "MIT License"
                  },
                  "forks": 3285,
                  "open_issues_count": 12,
                  "archived": false,
                  "disabled": false,
                  "original_created_at": "2019-08-17T14:27:54.000Z",
                  "original_updated_at": "2024-12-03T07:58:40.000Z",
                  "created_at": "2024-12-01T14:44:03.981Z",
                  "updated_at": "2024-12-03T10:04:43.429Z",
                  "author_link_madeinnigeria": "https://twitter.com/thesegunadebayo",
                  "author_madeinnigeria": "@thesegunadebayo"
              },
              {
                  "id": 248,
                  "name": "zag",
                  "link": "https://github.com/chakra-ui/zag",
                  "description": "Finite state machines for building accessible design systems and UI components. Works with modern frameworks, and even just Vanilla JS",
                  "author": "chakra-ui",
                  "author_link": "https://github.com/chakra-ui",
                  "author_avatar": "https://avatars.githubusercontent.com/u/54212428?v=4",
                  "stars": 4102,
                  "topics": [
                      "a11y",
                      "accessibility",
                      "agnostic",
                      "component",
                      "design-systems",
                      "headless",
                      "headlessui",
                      "library",
                      "primitives",
                      "react",
                      "solid",
                      "state-machines",
                      "svelte",
                      "sveltejs",
                      "ui",
                      "ui-components",
                      "ui-kit",
                      "universal",
                      "vue",
                      "xstate"
                  ],
                  "license": {
                      "key": "mit",
                      "url": "https://api.github.com/licenses/mit",
                      "name": "MIT License"
                  },
                  "forks": 170,
                  "open_issues_count": 13,
                  "archived": false,
                  "disabled": false,
                  "original_created_at": "2021-07-07T11:38:07.000Z",
                  "original_updated_at": "2024-12-03T09:03:41.000Z",
                  "created_at": "2024-12-01T14:47:25.061Z",
                  "updated_at": "2024-12-03T10:08:08.882Z",
                  "author_link_madeinnigeria": "https://twitter.com/thesegunadebayo",
                  "author_madeinnigeria": "@thesegunadebayo"
                }
              ],
              "search": {
                  "text": "chakra",
                  "totalItems": 2
              }
            }
          `}
        </code>
      </pre>
    </div>
  </section>
</section>
