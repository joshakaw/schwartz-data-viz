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
    <div className="RootComponent">
        <NavbarComponent />
        <Outlet />
    </div>
);

export default RootComponent;
