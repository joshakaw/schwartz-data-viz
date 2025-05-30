import React, { FC } from 'react';
import './RouterSignupsDashboard.css';
import BarChart from '../../bar-chart/bar-chart';

interface RouterSignupsDashboardProps {}

const RouterSignupsDashboard: FC<RouterSignupsDashboardProps> = () => (
  <div className="RouterSignupsDashboard">
        RouterSignupsDashboard Component
        <BarChart />
  </div>
);

export default RouterSignupsDashboard;
