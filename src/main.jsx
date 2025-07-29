import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ReactTogether } from "react-together";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ReactTogether
    sessionParams={{
      appId: import.meta.env['VITE_APP_ID'],
      apiKey: import.meta.env['VITE_API_KEY'],
      name: "tge-prophecy-wall",
      password: "monad2024"
    }}
  >
    <App />
  </ReactTogether>
);