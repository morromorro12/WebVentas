import { createRoot } from "react-dom/client";
import App from "./App";
import { startMetaTracking } from "./lib/meta";
import "./index.css";

startMetaTracking();

createRoot(document.getElementById("root")!).render(<App />);
