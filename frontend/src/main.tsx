import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setBaseUrl } from "@/lib/api";

// Configure the Orval-generated API client to point at the correct backend.
// VITE_API_URL should be set to the Express server origin (e.g. http://localhost:3000).
// The generated hooks use relative paths like /api/auth/register — prepending
// the base URL ensures they reach the Express API in local dev and on every deployment.
const apiUrl = import.meta.env.VITE_API_URL as string | undefined;
if (apiUrl) {
  setBaseUrl(apiUrl);
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}

createRoot(document.getElementById("root")!).render(<App />);
