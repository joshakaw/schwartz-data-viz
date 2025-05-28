import { createBrowserRouter, RouterProvider } from "react-router";

import './index.css'
import App from './App.tsx'
import ReactDOM from "react-dom/client";

const router = createBrowserRouter([
    { path: "/", Component: App },
    { path: "/test", element: <div>Test path</div> }
])

const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(
    <RouterProvider router={router} />
)