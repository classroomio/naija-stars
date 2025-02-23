# naijastars.dev

Visualization of the open source projects built by Nigerian developers.

## Links

- Webapp - [naijastars.dev](https://naijastars.dev)
- API - [api.naijastars.dev](https://api.naijastars.dev)
- Docs - [naijastars.dev/api](https://naijastars.dev/api)

## Tech Stack

- [Deno](https://deno.com/) - Backend + Runtime
- [Deno Deploy](https://deno.com/deploy) - Deployment
- [Svelte + Vite](https://svelte.dev/) - Frontend
- [Hono](https://hono.dev/) - API
- [Neon](https://neon.tech/) - Database
- [Upstash](https://upstash.com/) - Redis + Rate Limiting

## Demo

[![Demo Video](/src/lib/assets/demo-thumbnail.png)](https://youtu.be/_xsIeTr7ack)

## Commands

Before running any command, make sure you copy the contents of `.env.example` to `.env` and set the correct values.

- `deno run dev` - Start the both frontend and backend servers.

- `deno run be:dev` - Start the backend server.
- `deno run be:scrape` - Scrape the repositories.

- `deno run fe:dev` - Start the frontend server.
- `deno run fe:build` - Build the frontend.
- `deno run fe:preview` - Preview the frontend.

## Credits

### Built with ❤️ by [@classroomio](https://github.com/classroomio)

### Data from [@madeinnigeria](https://github.com/acekyd/made-in-nigeria)
