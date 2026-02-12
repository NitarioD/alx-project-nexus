# Frontend Demo Video

This project uses Playwright to record an MP4-style demo of the app's features.

## Prerequisites

1. **Start the frontend** (in one terminal):
   ```bash
   npm run dev
   ```

2. **API must be running** – either:
   - Local backend: `python manage.py runserver` (from `backend/`)
   - Or use the deployed API: set `VITE_API_BASE_URL` before building

3. **Install Playwright** (first time only):
   ```bash
   npm run demo:install
   ```

## Record the Demo

```bash
npm run demo:record
```

## Output

- Video is saved to: `frontend/test-results/.../video.webm`
- Full path is printed when the test runs
- To convert to MP4: use a tool like `ffmpeg`:
  ```bash
  ffmpeg -i test-results/*/video.webm demo-video.mp4
  ```

## Demo Flow

The script demonstrates:

1. **Catalog** – Product listing, counts
2. **Add to Cart** – Adding products from the grid
3. **Filters** – Toggling filter sidebar (mobile)
4. **Sort** – Changing sort order
5. **Cart** – Viewing cart, updating quantity, continue shopping
6. **Admin** – Create superuser, login, dashboard, logout
7. **Back to Catalog**

## Deployed App

To record against your deployed frontend:

```bash
DEMO_BASE_URL=https://your-frontend.vercel.app npm run demo:record
```
