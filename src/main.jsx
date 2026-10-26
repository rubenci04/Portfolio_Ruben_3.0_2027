import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Me aseguro de que el elemento 'root' exista antes de intentar renderizar.
const rootElement = document.getElementById("root");

if (rootElement) {
  const app = (
    <StrictMode>
      <App />
    </StrictMode>
  );
  if (rootElement.hasChildNodes()) hydrateRoot(rootElement, app);
  else createRoot(rootElement).render(app);
} else {
  // Si no encuentra el 'root', lo notifico en la consola.
  console.error(
    "Error: No se encontró el elemento con id 'root'. La aplicación no puede montarse.",
  );
}
