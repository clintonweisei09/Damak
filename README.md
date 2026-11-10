<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/e7ddb122-42d8-4944-a5bf-6563f9d8d21f

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env` and set your `GEMINI_API_KEY`
3. Configure the Daraja values in `.env`: `MPESA_CONSUMER_KEY`, `MPESA_CONSUMER_SECRET`, `MPESA_PASSKEY`, and `MPESA_SHORTCODE`. Keep the credentials server-side and never commit `.env`.
4. Use `MPESA_ENVIRONMENT="sandbox"` while testing. For real payments, set it to `"production"` and set `APP_URL` to this app's public HTTPS origin so Safaricom can reach `/api/mpesa/callback`.
5. Run the app:
   `npm run dev`

## Deploy the M-Pesa API

GitHub Pages only hosts the static frontend. Deploy the Express API separately
with the included `render.yaml` Blueprint. Render supplies `RENDER_EXTERNAL_URL`,
which the API uses for the Safaricom callback URL.

1. In Render, create a Blueprint from this repository and review the service
   plan before applying it.
2. Set `MPESA_ENVIRONMENT`, `MPESA_SHORTCODE`, `MPESA_CONSUMER_KEY`,
   `MPESA_CONSUMER_SECRET`, and `MPESA_PASSKEY` in the Render service's private
   environment settings. Do not put credentials in the repository or frontend.
3. After the API service is live, add a GitHub Actions repository variable named
   `VITE_API_BASE_URL` with the service's public HTTPS origin (for example,
   `https://damak-farm-api.onrender.com`) and rerun the Pages deployment. The
   value is a public service URL, not a credential.
4. Verify the API at `/api/mpesa/status` on the Render service before testing a
   payment. Use Safaricom sandbox credentials for sandbox tests; switch to
   production only with the matching live shortcode and passkey.
