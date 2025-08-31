import { useAutoVersionCheck } from "./hooks/useAutoVersionCheck";
import { NaverMap } from "./components/NaverMap";
import { MusicPlayer } from "./components/MusicPlayer";

const App: React.FC = () => {
  useAutoVersionCheck();

  return (
    <div className="w-screen h-screen flex justify-center items-center flex-col">
      <div className="max-w-5xl w-full h-full flex items-center flex-col p-4 gap-4 relative">
        <MusicPlayer />
        <NaverMap />
      </div>
    </div>
  );
};

export default App;
