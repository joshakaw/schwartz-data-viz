import React, { FC } from 'react';
import './RouterSignupsDashboard.css';
import BarChart from '../../bar-chart/bar-chart';
import Options from '../../../utils/bardata';
import { Container } from 'react-bootstrap';

interface RouterSignupsDashboardProps {}

const RouterSignupsDashboard: FC<RouterSignupsDashboardProps> = () => (
  <div className="RouterSignupsDashboard">
    <Options />
    <BarChart />
  </div>
);

export default RouterSignupsDashboard;
