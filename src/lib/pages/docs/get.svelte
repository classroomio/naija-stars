<section class="flex item-start gap-5 p-5">
  <section class="w-2/4">
    <h1 class="text-xl">Get Repositories</h1>
    <p class="text-sm mt-1">Get Repositories from the database</p>

    <div class="border rounded-md p-2.5 my-5 text-sm">
      <span class="bg-green-900 text-green-500 px-2 py-1 text-sm rounded-sm">GET</span>
      <span class="tracking-wide ml-1"> / api / repositories</span>
    </div>

    <h1 class="text-xl">Request</h1>
    <p class="text-sm mt-2">Query Parameters</p>

    <div class="≈p-2.5 mt-10 text-sm">
      <div class="flex items-center gap-5 mb-4">
        <p>Page</p>
        <p class="text-xs px-2 py-0.5 bg-red-50 text-black rounded-md">number</p>
      </div>

      <p>Page number of repository</p>
    </div>

    <div class="≈p-2.5 mt-10 text-sm">
      <div class="flex items-center gap-5 mb-4">
        <p>Limit</p>
        <p class="text-xs px-2 py-0.5 bg-red-50 text-black rounded-md">number</p>
      </div>

      <p>Limit per page</p>
    </div>

    <div class="≈p-2.5 mt-10 text-sm">
      <div class="flex items-center gap-5 mb-4">
        <p>SortBy</p>
        <p class="text-xs px-2 py-0.5 bg-red-50 text-black rounded-md">string</p>
      </div>

      <p>Sort by stars | forks</p>
    </div>

    <div class="≈p-2.5 mt-10 text-sm">
      <div class="flex items-center gap-5 mb-4">
        <p>Order</p>
        <p class="text-xs px-2 py-0.5 bg-red-50 text-black rounded-md">string</p>
      </div>

      <p>Order of sorting. asc | desc</p>
    </div>
  </section>

  <section class="w-2/4 flex flex-col gap-5">
    <div
      class="flex flex-col gap-3 bg-black dark:bg-transparent dark:border text-white rounded-md h-auto p-4 text-xs"
    >
      <p>curl --request GET \</p>
      <p>--url http://localhost:8000/api/repositories \</p>
    </div>

    <div
      class="bg-black dark:bg-transparent dark:border text-white rounded-md h-[70%] overflow-auto"
    >
      <pre>
        <code class="language-json text-xs">
          {`{
  "status": "success",
  "data": [   [
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
    }
]
}`}
        </code>
      </pre>
    </div>
  </section>
</section>
