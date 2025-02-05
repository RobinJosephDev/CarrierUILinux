import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import UserProvider from "./UserProvider"; // Import the UserProvider
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css'; 

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </StrictMode>
);
