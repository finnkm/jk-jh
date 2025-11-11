import { useState } from "react";
import CryptoJS from "crypto-js";
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
      const accessKeyId = import.meta.env.VITE_GCS_ACCESS_KEY_ID;
      const secretAccessKey = import.meta.env.VITE_GCS_SECRET_ACCESS_KEY;

      if (!bucketName || !accessKeyId || !secretAccessKey) {
        throw new Error("Google Cloud Storage credentials not configured");
      }

      // 파일 이름 생성 (타임스탬프 + 원본 파일명)
      const fileName = `${format(NOW, "yyyyMMdd")}-${crypto.randomUUID()}-${file.name}`;

      // 직접 XML API로 PUT 요청
      const url = `https://${bucketName}.storage.googleapis.com/${encodeURIComponent(fileName)}`;

      // RFC 1123 형식의 날짜 생성
      const now = new Date();
      const dateString = now.toUTCString();

      // Content-MD5는 선택사항이므로 빈 문자열
      const contentMD5 = "";
      const contentType = file.type || "application/octet-stream";

      // 서명 생성 (x-goog-date를 사용하므로 date는 빈 문자열)
      const stringToSign = `PUT\n${contentMD5}\n${contentType}\n\nx-goog-date:${dateString}\n/${bucketName}/${fileName}`;
      const signature = CryptoJS.HmacSHA1(stringToSign, secretAccessKey).toString(CryptoJS.enc.Base64);

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": contentType,
          "x-goog-date": dateString,
          Authorization: `GOOG1 ${accessKeyId}:${signature}`,
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
