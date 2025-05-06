//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Principal from './pages/Principal.tsx';


createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  //   <App />
  // </StrictMode>,
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Principal />} />
      <Route path="/inicio" element={<App />} />
    </Routes>
  </BrowserRouter>
)
