# Welcome to Springboard!

A personal dashboard that helps you spring into action, every day. Built with React Router.

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📅 Calendar integration (iCal support)
- ⚙️ Per-install configuration with persistent storage
- 🎵 "Now Playing" display
- 📖 [React Router docs](https://reactrouter.com/)

## Configuration

Springboard uses a persistent configuration system powered by Keyv with SQLite backend. Configure your installation by visiting the Settings page at `/settings`.

### Available Settings

- **User Name**: Personalize the greeting with your name
- **Calendar URL**: Integrate your calendar (iCal URL from Google Calendar, Outlook, etc.)
- **Now Playing**: Display currently playing music information

Configuration is stored in `config.sqlite` and persists across restarts.

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
