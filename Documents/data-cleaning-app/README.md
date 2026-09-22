# Data Cleaning App

A browser-based data cleaning and profiling tool for analysts working with sensitive spreadsheets. Parsing, profiling, and cleaning run entirely in the client — there is no backend and nothing is uploaded.

## What never leaves the browser

Use this as a trust checklist, not marketing copy:

- **No file upload.** Spreadsheets are read locally with the File API; they are not posted to a server.
- **No account.** There is no login, tenant, or cloud workspace.
- **No data API.** Cleaning logic runs in the page. There is no service that receives rows, schemas, or previews.
- **Local export only.** Cleaned output is a download from the browser, not a share link.

If a future feature needs the network (for example, loading the app itself or optional documentation), it will not send spreadsheet contents. Treat any request that includes cell data as a bug.

## Status

Week 1 — environment setup in progress. Cleaning workflows are not available yet.

## Stack

React (Vite), Tailwind CSS, JavaScript (ES6+)

## Getting started

Once the Vite app is scaffolded:

```bash
npm install
npm run dev
```

Open the local URL printed in the terminal. Load a spreadsheet in the UI; nothing should appear in the Network tab except the app’s own static assets.

## License

MIT — see [LICENSE.md](LICENSE.md).
