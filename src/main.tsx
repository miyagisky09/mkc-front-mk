import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";
import { ConnectionProvider } from "./context/connected_context";
import { LoadingProvider } from "./context/LoadingContext";
import { ToastContainer, Slide } from "react-toastify";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <LoadingProvider>
      <ConnectionProvider>
        <App />
        <ToastContainer
          position="top-center"
          hideProgressBar={true}
          transition={Slide}
          autoClose={1200}
          theme="colored"
          closeButton={false}
        />
      </ConnectionProvider>
    </LoadingProvider>
  </React.StrictMode>
);
