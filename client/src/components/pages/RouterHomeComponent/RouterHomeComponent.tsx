import React, { FC } from 'react';
import './RouterHomeComponent.css';

interface RouterHomeComponentProps { }

const RouterHomeComponent: FC<RouterHomeComponentProps> = () => (
    <div className="RouterHomeComponent">
        This is a website for Schwartz Tutoring to visualize
        company data on multiple dashboards, including signup,
        customer, and tutor metrics.
    </div>
);

export default RouterHomeComponent;
