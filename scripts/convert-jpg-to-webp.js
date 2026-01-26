import { existsSync } from "fs";
import { readdir } from "fs/promises";
import { join } from "path";
import sharp from "sharp";

const ASSETS_DIR = "./src/assets";
const WEBP_QUALITY = 85;

// 여기에 변경하고 싶은 이미지 접두사를 추가합니다.
const GALLERY_IMAGE_PREFIXES = ["KJK_0843-1"];

async function convertJpgToWebp() {
  // assets 디렉토리에서 JPG 파일 찾기
  const files = await readdir(ASSETS_DIR);
  const jpgImages = files.filter(
    (file) =>
      GALLERY_IMAGE_PREFIXES.some((prefix) => file.startsWith(prefix)) &&
      (file.endsWith(".jpg") || file.endsWith(".jpeg"))
  );

  if (jpgImages.length === 0) {
    console.log("📭 No JPG images found to convert");
    return;
  }

  console.log(`🖼️  Found ${jpgImages.length} JPG images to convert`);

  for (const file of jpgImages) {
    const inputPath = join(ASSETS_DIR, file);
    const outputPath = join(ASSETS_DIR, file.replace(/\.(jpg|jpeg)$/i, ".webp"));

    // 이미 webp 파일이 존재하면 스킵
    if (existsSync(outputPath)) {
      console.log(`⏭️  Skipping ${file} (webp already exists)`);
      continue;
    }

    try {
      const originalStats = await sharp(inputPath).metadata();
      await sharp(inputPath).webp({ quality: WEBP_QUALITY }).toFile(outputPath);
      const webpStats = await sharp(outputPath).metadata();

      console.log(
        `✅ ${file} → ${file.replace(/\.(jpg|jpeg)$/i, ".webp")}: ${originalStats.width}x${originalStats.height} (${formatFileSize(originalStats.size || 0)} → ${formatFileSize(webpStats.size || 0)})`
      );
    } catch (error) {
      console.error(`❌ Error converting ${file}:`, error.message);
    }
  }

  console.log("\n🎉 JPG to WebP conversion complete!");
}

function formatFileSize(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

convertJpgToWebp().catch(console.error);
