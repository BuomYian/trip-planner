import "./App.css";
import "./index.css";
import Hero from "./components/custom/Hero";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <>
      {/* Hero */}
      <Hero />
      <Toaster />
    </>
  );
}

export default App;
