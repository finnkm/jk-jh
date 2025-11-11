import { useState } from "react";
import { format } from "date-fns";

const NOW = Date.now();

export const useGoogleCloudStorageBucket = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (file: File): Promise<void> => {
    setUploading(true);
    setProgress(0);
    try {
      const bucketName = import.meta.env.VITE_GCS_BUCKET_NAME;
      const apiKey = import.meta.env.VITE_GCS_API_KEY;

      if (!bucketName || !apiKey) {
        throw new Error("Google Cloud Storage credentials not configured");
      }

      // 파일 이름 생성 (타임스탬프 + 원본 파일명)
      const fileName = `${format(NOW, "yyyyMMdd")}-${crypto.randomUUID()}-${file.name}`;

      // GCS XML API를 사용한 직접 업로드
      const url = `https://storage.googleapis.com/upload/storage/v1/b/${bucketName}/o?uploadType=media&name=${encodeURIComponent(fileName)}&key=${apiKey}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Upload failed: ${error}`);
      }

      // 진행률을 100%로 설정
      setProgress(100);
    } catch (error) {
      throw new Error("Failed to upload file: " + error);
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading, progress };
};
