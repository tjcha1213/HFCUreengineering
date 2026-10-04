# HFCU Reengineering MVP

React and Vite prototype for HFCU member service flows.

## MVP modules

- Main recommendations page with reengineering rationale and pain point resolutions.
- Separate MVP page at `#/mvp` for status checking, document readiness, remote notarization, and support routing.
- Separate branch architecture page at `#/branch-architecture` with interior recommendations for queue visibility, service zoning, and customer experience.
- Hypothetical branch map for member flow, staff routing, notary work, and back-office support.

## Development

Install dependencies with `npm install`, then start the local Vite server with `npm run dev`.

Create a production build with `npm run build`; Vite writes the static app to `dist/` for hosting. This default build uses relative asset paths so it can be served from static hosts like ChatGPT Sites.

## Deployment

The repo includes a GitHub Pages workflow at `.github/workflows/deploy-pages.yml`. Every push to `main` runs `npm ci`, builds the app with `npm run build:github`, uploads `dist/`, and deploys the result through GitHub Pages.

Use `npm run build:github` when previewing the GitHub Pages artifact locally. It sets the Vite base path to `/HFCUreengineering/`, matching the repository path on GitHub Pages.
