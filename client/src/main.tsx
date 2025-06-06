import { BrowserRouter, createBrowserRouter, Route, Routes } from "react-router";

import './index.css'
import ReactDOM from "react-dom/client";
import RootComponent from "./components/pages/RootComponent/RootComponent.tsx";
import RouterHomeComponent from "./components/pages/RouterHomeComponent/RouterHomeComponent.tsx";
import RouterSignupsDashboard from "./components/pages/RouterSignupsDashboard/RouterSignupsDashboard.tsx";
import RouterMailchimpDashboard from "./components/pages/RouterMailchimpDashboard/RouterMailchimpDashboard.tsx";

// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import RouterDetailedSignupsDashboard from "./components/pages/RouterDetailedSignupsDashboard/RouterDetailedSignupsDashboard.tsx";

//const router = createBrowserRouter([
//    { path: "/", Component: App },
//    { path: "/test", element: <div>Test path</div> }
//])

const root = document.getElementById("root")!;

// https://reactrouter.com/start/declarative/installation

ReactDOM.createRoot(root).render(

    <BrowserRouter>
        <Routes>
            <Route path="/" element={<RootComponent />}>
                <Route index element={<RouterHomeComponent />} />
                <Route path="/mailchimp" element={<RouterMailchimpDashboard />} />
                <Route path="/signups" element={<RouterSignupsDashboard />} />
                <Route path="/detailedsignups" element={<RouterDetailedSignupsDashboard />} />
            </Route>
        </Routes>
    </BrowserRouter>
)