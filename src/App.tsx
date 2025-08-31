import { useAutoVersionCheck } from "./hooks/useAutoVersionCheck";
import { NaverMap } from "./components/NaverMap";
import { MusicPlayer } from "./components/MusicPlayer";

const App: React.FC = () => {
  useAutoVersionCheck();

  return (
    <div className="w-screen h-screen flex justify-center items-center flex-col">
      <MusicPlayer />
      <NaverMap />
    </div>
  );
};

export default App;
