import { useEffect } from "react";
import mainImage from "@/assets/KJK_0853.webp";
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
import { ImageLoadProvider } from "./contexts/ImageLoadContext";
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
    <ImageLoadProvider>
      <div className="relative flex min-h-svh flex-col">
        <div className="w-full max-w-2xl mx-auto flex flex-col flex-1">
          <HeaderSection />
          <main className="flex flex-1 flex-col px-4 pb-4 gap-10">
            <Image src={mainImage} />
            <GreetingSection />
            <GallerySection />
            <CalendarSection />
            <LocationSection />
            <MessageSection />
            <ImageUploadSection />
            <FooterSection />
          </main>
        </div>
      </div>
      <Toaster position="bottom-center" />
    </ImageLoadProvider>
  );
};

export default App;
