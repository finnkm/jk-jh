import { useState } from "react";
import { format } from "date-fns";
import { ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/lib/firebase";

const NOW = Date.now();

export const usefirebaseStorage = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (file: File): Promise<void> => {
    setUploading(true);
    setProgress(0);

    try {
      // 파일 이름 생성 (타임스탬프 + 원본 파일명)
      const fileName = `${format(NOW, "yyyyMMdd")}-${crypto.randomUUID()}-${file.name}`;

      // Firebase Storage 참조 생성
      const storageRef = ref(storage, fileName);

      // 업로드 시작 (진행률 추적 가능)
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Promise로 래핑
      await new Promise<void>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // 진행률 업데이트
            const progressPercent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setProgress(progressPercent);
          },
          (error) => {
            // 에러 처리
            reject(error);
          },
          () => {
            // 업로드 완료
            console.log("File uploaded successfully");
            resolve();
          }
        );
      });
    } catch (error) {
      throw new Error("Failed to upload file: " + error);
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading, progress };
};
