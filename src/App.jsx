import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import Workspace from "./components/Workspace";

function App() {
  return (
    <main className="main-workspace">
      <Workspace />
    </main>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

export default App;
