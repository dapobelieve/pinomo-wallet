# Pinomo Frontend

## Setup

```bash
npm install
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required variables:
- `NUXT_PUBLIC_BASE_URL` - API backend URL (default: http://localhost:8000)
- `NUXT_PUBLIC_PUSHER_KEY` - Pusher key for real-time updates
- `NUXT_PUBLIC_PUSHER_CLUSTER` - Pusher cluster

## Development

```bash
npm run dev
```

Runs on `http://localhost:3005`

## Build

```bash
npm run build
npm run preview
```
