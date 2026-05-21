import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { ReviewApp } from "./features/review/ui/ReviewApp";
import "./shared/styles/tokens.css";
import "./shared/styles/globals.css";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <ReviewApp />
  </StrictMode>,
);
