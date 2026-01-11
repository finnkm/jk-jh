import { useEffect } from "react";
import image11 from "@/assets/KJK_0037.jpg";
import image1 from "@/assets/KJK_0843.jpg";
import mainImage from "@/assets/KJK_0853.jpg";
import image2 from "@/assets/KJK_0984.jpg";
import image3 from "@/assets/KJK_1179.jpg";
import image4 from "@/assets/KJK_1703.jpg";
import image13 from "@/assets/KJK_1911.jpg";
import image14 from "@/assets/KJK_1992.jpg";
import image5 from "@/assets/KJK_2158.jpg";
import image12 from "@/assets/KJK_2307.jpg";
import image6 from "@/assets/KJK_2504.jpg";
import image10 from "@/assets/KJK_2589.jpg";
import image8 from "@/assets/KJK_2842.jpg";
import image9 from "@/assets/KJK_2932.jpg";
import image7 from "@/assets/KJK_3048.jpg";
import { Image } from "@/components/Image";
import { Toaster } from "@/components/ui/sonner";
import { CalendarSection } from "./components/sections/CalendarSection";
import { FooterSection } from "./components/sections/FooterSection";
import { GallerySection } from "./components/sections/GallerySection";
import { GreetingSection } from "./components/sections/GreetingSection";
import { HeaderSection } from "./components/sections/HeaderSection";
import { ImageUploadSection } from "./components/sections/ImageUploadSection";
import { LocationSection } from "./components/sections/LocationSection";
import { MessageSection } from "./components/sections/MessageSection";
import { useAutoVersionCheck } from "./hooks/useAutoVersionCheck";
import { logAnalyticsEvent } from "./lib/firebase";

const App: React.FC = () => {
  useAutoVersionCheck();

  // 페이지 방문 트래킹
  useEffect(() => {
    logAnalyticsEvent("page_view", {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
    });
  }, []);

  return (
    <>
      <div className="relative flex min-h-svh flex-col">
        <div className="w-full max-w-2xl mx-auto flex flex-col flex-1">
          <HeaderSection />
          <main className="flex flex-1 flex-col px-4 pb-4 gap-10">
            <Image src={mainImage} />
            <GreetingSection />
            <GallerySection
              images={[
                image1,
                image2,
                image3,
                image4,
                image5,
                image6,
                image7,
                image8,
                image9,
                image10,
                image11,
                image12,
                image13,
                image14,
              ]}
            />
            <CalendarSection />
            <LocationSection />
            <MessageSection />
            <ImageUploadSection />
            <FooterSection />
          </main>
        </div>
      </div>
      <Toaster position="bottom-center" />
    </>
  );
};

export default App;
