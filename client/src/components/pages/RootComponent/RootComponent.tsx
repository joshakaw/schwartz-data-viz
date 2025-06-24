import React, { FC } from 'react';
import './RootComponent.css';
import { Outlet } from 'react-router';
import { Link } from 'react-router';
import NavbarComponent from '../../NavbarComponent/NavbarComponent';

interface RootComponentProps { }

/* 
    The Outlet displays the nested 
    routes (e.g. '/signups'), defined in main.tsx 
*/

const RootComponent: FC<RootComponentProps> = () => (
    <div className="RootComponent" style={{ display: 'flex', flexDirection: 'column', height: "100vh" }}>
        <NavbarComponent />

        <div className="outlet" style={{ flex:1, width:"100%", maxWidth:"1400px", margin: "auto", paddingTop: "20px", paddingLeft: "10px", paddingRight: "10px"}}>
            <Outlet />
        </div>
    </div>
);

export default RootComponent;
