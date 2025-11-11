import { Toaster } from "@/components/ui/sonner";
import { CalendarSection } from "./components/sections/CalendarSection";
import { FooterSection } from "./components/sections/FooterSection";
import { HeaderSection } from "./components/sections/HeaderSection";
import { ImageUploadSection } from "./components/sections/ImageUploadSection";
import { LocationSection } from "./components/sections/LocationSection";
import { MessageSection } from "./components/sections/MessageSection";
import { useAutoVersionCheck } from "./hooks/useAutoVersionCheck";

const App: React.FC = () => {
  useAutoVersionCheck();

  return (
    <>
      <div className="relative flex min-h-svh flex-col">
        <HeaderSection />
        <main className="flex flex-1 flex-col px-4 pb-4 gap-4">
          <CalendarSection />
          <LocationSection />
          <MessageSection />
          <ImageUploadSection />
          <FooterSection />
        </main>
      </div>
      <Toaster position="bottom-center" />
    </>
  );
};

export default App;
