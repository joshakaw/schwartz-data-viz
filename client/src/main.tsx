import { createBrowserRouter, RouterProvider } from "react-router";

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ReactDOM from "react-dom/client";

const router = createBrowserRouter([
    { path: "/", Component: App },
    { path: "/test", element: <div>Test path</div> }
])

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
)

const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(
    <RouterProvider router={router} />
)