import React, { FC } from 'react';
import './RootComponent.css';
import { Outlet, useLocation } from 'react-router';
import { Link } from 'react-router';
import NavbarComponent from '../../NavbarComponent/NavbarComponent';
import TabsComponent from '../../TabsComponent/TabsComponent';

interface RootComponentProps { }

/* 
    The Outlet displays the nested 
    routes (e.g. '/signups'), defined in main.tsx 
*/

const RootComponent: FC<RootComponentProps> = () => {

    const location = useLocation(); // Get the current location object

    // Define the paths where TabsComponent should be visible
    const showTabsPaths = ['/signups', '/detailedsignups'];

    // Check if the current pathname is one of the desired paths
    const shouldShowTabs = showTabsPaths.includes(location.pathname);

    return(
    <div className="RootComponent" style={{ display: 'flex', flexDirection: 'column', height: "100vh" }}>
            <NavbarComponent />
            {shouldShowTabs && <TabsComponent links={[{ relativeUrl: "/signups", title: "Summary" }, { relativeUrl: "/detailedsignups", title: "Detailed" }]} />}
        <div className="outlet" style={{ flex:1, width:"100%", maxWidth:"1400px", margin: "auto", paddingTop: "20px", paddingLeft: "10px", paddingRight: "10px"}}>
            <Outlet />
        </div>
    </div>)
};

export default RootComponent;
