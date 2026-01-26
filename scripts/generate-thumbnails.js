import { existsSync } from "fs";
import { mkdir, readdir } from "fs/promises";
import { basename, join } from "path";
import sharp from "sharp";

const ASSETS_DIR = "./src/assets";
const THUMBNAILS_DIR = "./src/assets/thumbnails";
const THUMBNAIL_WIDTH = 400; // 썸네일 너비 (갤러리 그리드용)
const THUMBNAIL_QUALITY = 80;

// 여기에 변경하고 싶은 이미지 접두사를 추가합니다.
const GALLERY_IMAGE_PREFIXES = ["KJK_2842"];

async function generateThumbnails() {
  // 썸네일 디렉토리 생성
  if (!existsSync(THUMBNAILS_DIR)) {
    await mkdir(THUMBNAILS_DIR, { recursive: true });
    console.log(`📁 Created thumbnails directory: ${THUMBNAILS_DIR}`);
  }

  // assets 디렉토리에서 갤러리 이미지 찾기
  const files = await readdir(ASSETS_DIR);
  const galleryImages = files.filter(
    (file) => GALLERY_IMAGE_PREFIXES.some((prefix) => file.startsWith(prefix)) && file.endsWith(".webp")
  );

  console.log(`🖼️  Found ${galleryImages.length} gallery images`);

  for (const file of galleryImages) {
    const inputPath = join(ASSETS_DIR, file);
    const outputPath = join(THUMBNAILS_DIR, file);

    try {
      await sharp(inputPath)
        .resize(THUMBNAIL_WIDTH, THUMBNAIL_WIDTH, {
          fit: "cover",
          position: "center",
        })
        .webp({ quality: THUMBNAIL_QUALITY })
        .toFile(outputPath);

      const originalStats = await sharp(inputPath).metadata();
      const thumbStats = await sharp(outputPath).metadata();

      console.log(
        `✅ ${file}: ${originalStats.width}x${originalStats.height} → ${thumbStats.width}x${thumbStats.height}`
      );
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  }

  console.log("\n🎉 Thumbnail generation complete!");
}

generateThumbnails().catch(console.error);
