import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import Navbar from './frontend/Commponents/nvabar.jsx'

createRoot(document.getElementById('root')).render(
  // <BrowserRouter>

  <BrowserRouter> 
    <Navbar/>
    <App />
   </BrowserRouter> 
   /* </BrowserRouter> */
)
