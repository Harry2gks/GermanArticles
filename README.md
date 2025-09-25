# German Articles Quiz

A React Native/Expo app for learning German articles (der, die, das) with spaced repetition system.

## Features

- 11,649 German words across all CEFR levels (A1-C2)
- Spaced repetition system for effective learning
- Platform-specific animations (web hover, mobile press)
- Dark theme with responsive design
- Progress tracking with AsyncStorage

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run web

# Or use Expo CLI
npx expo start --web
```

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy from the project directory:
```bash
cd GermanArticles
vercel
```

4. Follow the prompts and your app will be deployed!

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will automatically detect the Expo configuration
6. Click "Deploy"

## Configuration

The app is configured for Vercel deployment with:
- `vercel.json` - Build configuration
- `.vercelignore` - Files to exclude from deployment
- Updated `package.json` with build scripts

## Build Process

Vercel will:
1. Install dependencies (`npm install`)
2. Build the web version (`npx expo export --platform web`)
3. Serve the static files from the `dist` directory

## Environment Variables

No environment variables are required for this app.

## Troubleshooting

If deployment fails:
1. Ensure all dependencies are in `package.json`
2. Check that `expo export` works locally
3. Verify the build output directory is `dist`
