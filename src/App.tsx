import { Toaster } from "@/components/ui/sonner";
import { CalendarSection } from "./components/sections/CalendarSection";
import { FooterSection } from "./components/sections/FooterSection";
import { HeaderSection } from "./components/sections/HeaderSection";
import { LocationSection } from "./components/sections/LocationSection";
import { useAutoVersionCheck } from "./hooks/useAutoVersionCheck";

const App: React.FC = () => {
  useAutoVersionCheck();

  return (
    <>
      <div className="w-screen h-screen flex justify-center">
        <div className="h-full w-full flex flex-col p-4 gap-4 relative max-w-xl">
          <HeaderSection />
          <CalendarSection />
          <LocationSection />
          <FooterSection />
        </div>
      </div>
      <Toaster position="top-center" />
    </>
  );
};

export default App;
