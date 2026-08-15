# Throughput — Website Speed Checker

A simple, free website speed-checking tool powered by Google's PageSpeed
Insights API (the same engine as pagespeed.web.dev).

## Deploying on Vercel

1. Push this folder to a GitHub repository.
2. On [vercel.com](https://vercel.com), click **Add New → Project** and
   import that repository.
3. Before deploying, add an **Environment Variable**:
   - Name: `GOOGLE_API_KEY`
   - Value: your Google PageSpeed Insights API key
4. Click **Deploy**.

That's it — no build command needed. Vercel will automatically serve
`index.html` as a static page and `api/pagespeed.js` as a serverless
function.

## Why the API key isn't in the code

The key lives only in Vercel's environment variables and is read on the
server side, inside `api/pagespeed.js`. It never reaches the browser, so
it's safe to make this repository public.
