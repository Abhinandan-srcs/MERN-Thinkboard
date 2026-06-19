import { StrictMode } from 'react' //Helps finding bugs
import { createRoot } from 'react-dom/client' //This creates the React root.
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router"
import {Toaster} from "react-hot-toast"
import { ClerkProvider } from "@clerk/clerk-react"

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
        <App />
        <Toaster/>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>,
)
