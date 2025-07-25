import { BrowserRouter, createBrowserRouter, Route, Routes } from "react-router";

import ReactDOM from "react-dom/client";
import RootComponent from "./components/pages/RootComponent/RootComponent.tsx";
import RouterHomeComponent from "./components/pages/RouterHomeComponent/RouterHomeComponent.tsx";
import RouterSignupsDashboard from "./components/pages/RouterSignupsDashboard/RouterSignupsDashboard.tsx";
import RouterMailchimpDashboard from "./components/pages/RouterMailchimpDashboard/RouterMailchimpDashboard.tsx";
import AccountsReceivableDashboard from "./components/pages/AccountsReceivableDashboard/AccountsReceivableDashboard.tsx";
import TutorDataDashboard from "./components/pages/TutorDataDashboard/TutorDataDashboard.tsx";

// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-day-picker/style.css"; // React Daypicker styling
import './index.css'


import RouterDetailedSignupsDashboard from "./components/pages/RouterDetailedSignupsDashboard/RouterDetailedSignupsDashboard.tsx";
import TutorDetailComponent from "./components/TutorDetailComponent/TutorDetailComponent.tsx";

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
                <Route path="/accounts-receivable" element={<AccountsReceivableDashboard />} />
                <Route path="/tutor-data" element={<TutorDataDashboard />} />
                <Route path="/signups" element={<RouterSignupsDashboard />} />
                <Route path="/detailedsignups" element={<RouterDetailedSignupsDashboard />} />
                <Route path="/tutordetail" element={<TutorDetailComponent tutorId={123} />} />
            </Route>
        </Routes>
    </BrowserRouter>
)