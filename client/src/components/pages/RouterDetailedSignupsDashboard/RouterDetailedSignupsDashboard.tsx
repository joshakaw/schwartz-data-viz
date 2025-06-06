import React, { FC } from 'react';
import './RouterDetailedSignupsDashboard.css';
import Options from '../../../utils/bardata';
import DetailedSignupsOptions from './DetailedSignupsOptions/DetailedSignupsOptions';
import NotImplementedWarning from '../../NotImplementedWarning/NotImplementedWarning';

interface RouterDetailedSignupsDashboardProps { }

const RouterDetailedSignupsDashboard: FC<RouterDetailedSignupsDashboardProps> = () => (
    <div className="RouterDetailedSignupsDashboard">
        <DetailedSignupsOptions />
        <NotImplementedWarning message="Detailed Signups table will go here according to Dylan's Project Notes" />
    </div>
);

export default RouterDetailedSignupsDashboard;

