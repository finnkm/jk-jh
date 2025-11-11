import { useState } from "react";
import axios from "axios";

export const useUploadToR2 = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadToR2 = async (file: File) => {
    setUploading(true);
    setProgress(0);
    try {
      // Cloudflare Images Direct Creator Upload 사용
      const accountId = import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID;
      const apiToken = import.meta.env.VITE_CLOUDFLARE_API_TOKEN;

      if (!accountId || !apiToken) {
        throw new Error("Cloudflare credentials not configured");
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
          onUploadProgress: (event) => {
            if (event.total) {
              const percentage = Math.round((event.loaded / event.total) * 100);
              setProgress(percentage);
            }
          },
        }
      );

      // Cloudflare Images 응답 형식에 맞게 반환
      return {
        id: response.data.result.id,
        url: response.data.result.variants[0], // 첫 번째 variant URL
        variants: response.data.result.variants,
      };
    } catch (error) {
      throw new Error("Failed to upload file: " + error);
    } finally {
      setUploading(false);
    }
  };

  return { uploadToR2, uploading, progress };
};
