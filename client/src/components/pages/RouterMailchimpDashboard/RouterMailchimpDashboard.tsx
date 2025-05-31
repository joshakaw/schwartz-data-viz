import React, { FC } from 'react';
import './RouterMailchimpDashboard.css';
import AccountDataTable from '../../accountDataTable/accountDataTable';
import JsonToCsv from '../../jsonToCsv/jsonToCsv';

interface RouterMailchimpDashboardProps {}

/**
 * MailchimpDashboard Component
 * Displays a dashboard interface for Mailchimp integration.
 */
const RouterMailchimpDashboard: FC<RouterMailchimpDashboardProps> = () => (
    <>
        <div className="RouterMailchimpDashboard">
            <h1>Mailchimp Dashboard</h1>
            <p>Welcome to your Mailchimp Dashboard. Here you can view campaign stats, manage subscribers, and more.</p>

        </div>
        <div className="account-table">
            <AccountDataTable />
        </div>
        
    </>
    

    
);

export default RouterMailchimpDashboard;
