This is the frontend for AI Project — Business Idea Generator built with Next.js and Tailwind CSS.

## Tech stack
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4 and `@tailwindcss/typography` plugin
- PostCSS with `autoprefixer`
- ReactMarkdown with `remark-gfm` and `remark-breaks` for rendering markdown returned by the backend

## Quick start
1. Install dependencies

```bash
cd frontend
npm install
# or
pnpm install
```

2. Create a `.env.local` file to set the backend API base URL (this is used by the app to connect to the backend's SSE endpoint):

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

3. Run the dev server

```bash
npm run dev
```

4. Open `http://localhost:3000` in your browser.

## Important config notes
- `app/globals.css` includes Tailwind directives and custom `@apply` rules for the `.prose` class. The `tailwind.config.js` was configured to include `html` and `css` files in `content` globs so utility classes used in CSS files are available.
- We use `NEXT_PUBLIC_API_BASE_URL` in `app/page.tsx` to connect to the backend SSE stream at `/stream`.

## Build and run (production)
Build the app:

```bash
npm run build
npm start
```

For deployment, Vercel is recommended for the Next.js app; for other hosts, make sure to set production env variables and configure the host and port properly.

## Troubleshooting
- If you see `Cannot apply unknown utility class` errors during build/dev, make sure:
	- Content globs in `tailwind.config.js` include files that reference classes (including `.css` files) and that `postcss.config.mjs` contains `tailwindcss` plugin and `autoprefixer`.
	- You have installed dependencies and restarted the dev server after changing tailwind configurations.
- If SSE is failing to stream data, verify that the backend is running and that `NEXT_PUBLIC_API_BASE_URL` points to the correct address.

## Contributing
- The project uses standard `Next.js` conventions — pages are under `app/`.
- Tailwind configuration is available under `tailwind.config.js`.

## License
This project follows the license in the repository root.
