import { createRoot } from 'react-dom/client'
import React from 'react'
import {BrowserRouter, Route, Router, Link, Navigate} from 'react-router-dom';
import App from './App.jsx'
import './index.css'

// Import your publishable key

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    
      <App />
   
  </BrowserRouter>
)



