import { createRoot } from "react-dom/client";
import mixpanel from 'mixpanel-browser';
import App from "./App";
import "./index.css";

// Initialize Mixpanel
mixpanel.init(import.meta.env.VITE_MIXPANEL_TOKEN, {
  debug: process.env.NODE_ENV === 'development',
  track_pageview: true,
  persistence: 'localStorage'
});

// Register super properties
mixpanel.register({
  app_version: '1.0.0',
  platform: 'web',
  environment: process.env.NODE_ENV,
  viewport_width: window.innerWidth,
  viewport_height: window.innerHeight,
  language: navigator.language
});

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
