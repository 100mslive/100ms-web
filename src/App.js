import { Thing } from "@100mslive/sdk-components";
import { Avatar, Header } from "@100mslive/sdk-components";

function App() {
  return (
    <div className="bg-black h-screen w-full">
      <div>
        <Header />
      </div>
      <Thing>Hiii</Thing>
      <Avatar label="Nikhil" />
    </div>
  );
}

export default App;
