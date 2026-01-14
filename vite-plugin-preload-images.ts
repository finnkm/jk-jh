import { readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import type { Plugin } from "vite";
import { loadEnv } from "vite";

const GALLERY_IMAGE_PREFIXES = [
  "KJK_0635",
  "KJK_0853_1",
  "KJK_0984",
  "KJK_1138",
  "KJK_1179",
  "KJK_1382",
  "KJK_1703",
  "KJK_1802",
  "KJK_1911",
  "KJK_2160",
  "KJK_2307",
  "KJK_2589",
  "KJK_3207",
  "MAIN",
];

export function preloadGalleryImages(base: string = "/jk-jh/"): Plugin {
  return {
    name: "preload-gallery-images",
    apply: "build",
    async writeBundle(options) {
      const outDir = options.dir || "dist";
      const assetsDir = join(outDir, "assets");
      const indexPath = join(outDir, "index.html");

      try {
        // 환경 변수 로드
        const env = loadEnv("production", process.cwd(), "");
        const siteUrl = env.VITE_SITE_URL || "";

        // dist/assets에서 갤러리 이미지 파일 찾기
        const files = await readdir(assetsDir);
        const galleryImages = files.filter((file) =>
          GALLERY_IMAGE_PREFIXES.some((prefix) => file.startsWith(prefix) && file.endsWith(".webp"))
        );

        if (galleryImages.length === 0) {
          console.warn("⚠️  No gallery images found to preload");
          return;
        }

        // index.html 읽기
        let html = await readFile(indexPath, "utf-8");

        // 기존 preload 링크 제거 (갤러리 이미지)
        html = html.replace(/<link\s+rel="preload"[^>]*KJK_\d+[^>]*>/gi, "");

        // preload 링크 생성
        const preloadLinks = galleryImages
          .map((file) => {
            const href = `${base}assets/${file}`;
            const fullUrl = siteUrl ? `${siteUrl}${href}` : href;
            return `    <link rel="preload" as="image" href="${fullUrl}" fetchpriority="high" />`;
          })
          .join("\n");

        // </head> 태그 앞에 preload 링크 추가
        if (html.includes("</head>")) {
          html = html.replace("</head>", `${preloadLinks}\n  </head>`);
        } else {
          // </head>가 없으면 <head> 태그 안에 추가
          html = html.replace("</head>", `${preloadLinks}\n  </head>`);
        }

        // index.html 저장
        await writeFile(indexPath, html, "utf-8");
        console.log(`✅ Added ${galleryImages.length} gallery image preload links to index.html`);
      } catch (error) {
        console.error("❌ Error adding preload links:", error);
      }
    },
  };
}
