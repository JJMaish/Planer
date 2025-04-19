import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

// Add Leaflet CSS
const leafletCss = document.createElement("link");
leafletCss.rel = "stylesheet";
leafletCss.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
leafletCss.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
leafletCss.crossOrigin = "";
document.head.appendChild(leafletCss);

// Add Font Awesome CSS
const fontAwesomeCss = document.createElement("link");
fontAwesomeCss.rel = "stylesheet";
fontAwesomeCss.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css";
document.head.appendChild(fontAwesomeCss);

// Add Inter font
const interFont = document.createElement("link");
interFont.rel = "stylesheet";
interFont.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
document.head.appendChild(interFont);

// Add title
const title = document.createElement("title");
title.textContent = "Bruges Explorer - Plan Your Perfect Trip";
document.head.appendChild(title);

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
