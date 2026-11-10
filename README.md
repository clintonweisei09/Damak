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
