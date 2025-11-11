import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { usefirebaseStorage } from "@/hooks/usefirebaseStorage";
import { logAnalyticsEvent } from "@/lib/firebase";

export const ImageUploadSection: React.FC = () => {
  const [isUploadingState, setIsUploadingState] = useState(false);
  const [uploadedSize, setUploadedSize] = useState(0);
  const [totalSize, setTotalSize] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, uploading } = usefirebaseStorage();

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);

      // 이미지 파일만 필터링
      const imageFiles = fileArray.filter((file) => file.type.startsWith("image/"));

      if (imageFiles.length === 0) {
        toast.error("이미지 파일만 업로드할 수 있어요.");
        return;
      }

      // 필터링된 파일이 원본보다 적으면 알림
      if (imageFiles.length < fileArray.length) {
        toast.warning(`${fileArray.length - imageFiles.length}개의 파일은 이미지가 아니어서 제외되었어요.`);
      }

      setIsUploadingState(true);
      const total = imageFiles.reduce((acc, file) => acc + file.size, 0);
      setTotalSize(total);
      let uploaded = 0;

      console.log("Selected files:", imageFiles);

      try {
        // 모든 파일을 동시에 업로드
        await Promise.all(
          imageFiles.map(async (file) => {
            try {
              await uploadFile(file);
              uploaded += file.size;
              setUploadedSize(uploaded);
              console.log("Upload successful:", file.name);
            } catch (error) {
              console.error("Upload failed:", file.name, error);
            }
          })
        );
        toast.success("모든 사진이 성공적으로 업로드되었어요!");
        
        // Analytics 이벤트 로깅
        logAnalyticsEvent("image_upload", {
          file_count: imageFiles.length,
          total_size_mb: parseFloat(totalMB),
        });
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("사진 업로드 중 오류가 발생했어요. 다시 시도해주세요.");
      }

      setIsUploadingState(false);
      setUploadedSize(0);
      setTotalSize(0);
    }
  };

  const uploadedMB = (uploadedSize / (1024 * 1024)).toFixed(2);
  const totalMB = (totalSize / (1024 * 1024)).toFixed(2);
  const overallProgress = totalSize > 0 ? Math.round((uploadedSize / totalSize) * 100) : 0;
  const remainingTime = uploading
    ? `(약 ${Math.round(((totalSize - uploadedSize) / totalSize) * 10)} 초 남음)`
    : undefined;

  return (
    <>
      <section className="w-full flex items-center justify-center">
        {isUploadingState ? (
          <Item variant="outline" className="w-full">
            <ItemMedia variant="icon">
              <Spinner />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>
                사진을 업로드 하고있어요...
                <br />
                ‼️ 창을 닫거나 새로고침하시면 업로드가 중단될 수 있어요. ‼️
              </ItemTitle>
              <ItemDescription>
                {uploadedMB} MB / {totalMB} MB {remainingTime ?? ""}
              </ItemDescription>
            </ItemContent>
            <ItemActions className="hidden sm:flex">
              <Button variant="outline" size="sm" onClick={() => setIsUploadingState(false)}>
                취소
              </Button>
            </ItemActions>
            <ItemFooter>
              <Progress value={overallProgress} />
            </ItemFooter>
          </Item>
        ) : (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>축하의 순간을 공유해주세요</CardTitle>
              <CardDescription>결혼식장에서 담은 아름다운 추억을 신랑신부에게 전해주세요.</CardDescription>
            </CardHeader>
            <CardFooter className="flex-col gap-2">
              <Button type="button" className="w-full" onClick={handleButtonClick}>
                사진 올리기
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept="image/*"
                multiple
              />
            </CardFooter>
          </Card>
        )}
      </section>
    </>
  );
};
