import React from 'react';
import BarChart from './components/bar-chart/bar-chart'
import Options from './utils/data'

/**
 * 
 * 
 */
const SignupDashboard: React.FC = () => {
    return (
        <div className="signup-dashboard">
            <h1>Signup Dashboard</h1>
            <p>Here you can read data about who's signing up for Schwartz Tutoring, and the types of people who are doing so.</p>

            <Options />
            <BarChart />
        </div>
    );
};

export default SignupDashboard;