import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: "prompt",
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
          cleanupOutdatedCaches: true,
          maximumFileSizeToCacheInBytes: 5000000,
          runtimeCaching: [
            {
              urlPattern: /\.mp3$/,
              handler: "CacheFirst",
              options: {
                cacheName: "audio-cache",
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
              },
            },
          ],
        },
        includeAssets: ["favicon.ico"],
        manifest: {
          name: "JK-JH App",
          short_name: "JK-JH",
          description: "JK-JH React App with Auto Update",
          theme_color: "#ffffff",
          background_color: "#ffffff",
        },
      }),
    ],
    base: "/jk-jh/",
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      __SITE_TITLE__: JSON.stringify(env.SITE_TITLE || ""),
      __SITE_DESCRIPTION__: JSON.stringify(env.SITE_DESCRIPTION || ""),
      __SITE_URL__: JSON.stringify(env.SITE_URL || ""),
    },
  };
});
