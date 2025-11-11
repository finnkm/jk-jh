import React, { useRef, useState } from "react";
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
import { useUploadToR2 } from "@/hooks/useUploadToR2";

export const ImageUploadSection: React.FC = () => {
  const [isUploadingState, setIsUploadingState] = useState(false);
  const [uploadedSize, setUploadedSize] = useState(0);
  const [totalSize, setTotalSize] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadToR2, uploading, progress } = useUploadToR2();

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setIsUploadingState(true);
      const total = Array.from(files).reduce((acc, file) => acc + file.size, 0);
      setTotalSize(total);
      let uploaded = 0;

      console.log("Selected files:", Array.from(files));
      for (const file of files) {
        try {
          const result = await uploadToR2(file);
          uploaded += file.size;
          setUploadedSize(uploaded);
          console.log("Upload successful:", result);
        } catch (error) {
          console.error("Upload failed:", error);
        }
      }
      setIsUploadingState(false);
    }
  };

  const remainingSize = totalSize - uploadedSize;
  const remainingTime = uploading ? `(약 ${Math.round((remainingSize / totalSize) * 10)} 초 남음)` : undefined;

  return (
    <>
      <section className="w-full flex items-center justify-center">
        {isUploadingState ? (
          <Item variant="outline" className="w-full">
            <ItemMedia variant="icon">
              <Spinner />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>사진을 업로드 하고있어요...</ItemTitle>
              <ItemDescription>
                {uploadedSize} MB / {totalSize} MB {remainingTime ?? ""}
              </ItemDescription>
            </ItemContent>
            <ItemActions className="hidden sm:flex">
              <Button variant="outline" size="sm" onClick={() => setIsUploadingState(false)}>
                취소
              </Button>
            </ItemActions>
            <ItemFooter>
              <Progress value={progress} />
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
              <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} multiple />
            </CardFooter>
          </Card>
        )}
      </section>
    </>
  );
};
