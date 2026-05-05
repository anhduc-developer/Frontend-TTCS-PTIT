import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { AuthWrraper } from "./components/context/auth.context"; // Đường dẫn đến file Context của bạn
import "nprogress/nprogress.css";
import "./i18n.js"; // Initialize i18n

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthWrraper>
      <App />
    </AuthWrraper>
  </StrictMode>,
);
