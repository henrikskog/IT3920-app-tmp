import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app';
import axios from "axios";

// Setup of axios defaults for services
axios.defaults.baseURL = `http://${location.host}:3000/api/v1`;
axios.defaults.withCredentials = true

// React Root on website
const container = document.getElementById("root")
if(container){
    const root = createRoot(container)
    root.render(
      <App />
    );
}

else {
    console.error("HEEELP, NOOO ROOOOOTTTTT!")
}
