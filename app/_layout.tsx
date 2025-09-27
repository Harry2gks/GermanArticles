import { Stack } from 'expo-router';
import Head from 'expo-router/head';
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function Layout() {
  return (
    <>
      <Head>
        <style>{`
:root {
  --color-bg: #1E1E1E;
  --color-surface: #2E2E2E;
  --color-text: #FFFFFF;
  --color-text-secondary: #D9D9D9;
  --color-accent: #007ACC;
  --color-correct: #1e7f34;
  --color-wrong: #a11b1b;
}
body { background: var(--color-bg); color: var(--color-text); font-family: sans-serif; }
        `}</style>
      </Head>
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}


