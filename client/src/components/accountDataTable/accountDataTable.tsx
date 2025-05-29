'use client'; // This directive must be at the very top

import { useState, useEffect } from 'react';
import "./accountDataTable.css";

interface AccountData {
    ssid: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: number;
    school: string;
    account_type: string;
    creation_date: string;
    sessions: number;
    recent_session: string;
    recent_subject: string;
    recent_tutor: string;
}

interface AccountDataTableProps {
  data: AccountData[];
}

const AccountDataTable: React.FC<AccountDataTableProps> = ({ data }) => {
    return (
        <table className="account-data-table">
            <thead>
                <tr className="colName">
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>School</th>
                    <th>Account Type</th>
                    <th>Creation Date</th>
                    <th>Sessions</th>
                    <th>Recent Session</th>
                    <th>Recent Subject</th>
                    <th>Recent Tutor</th>
                </tr>
            </thead>
            <tbody>
                {data.map((account) => (
                    <tr key={account.ssid}>
                        <td>{account.first_name}</td>
                        <td>{account.last_name}</td>
                        <td>{account.email}</td>
                        <td>{account.phone}</td>
                        <td>{account.school}</td>
                        <td>{account.account_type}</td>
                        <td>{account.creation_date}</td>
                        <td>{account.sessions}</td>
                        <td>{account.recent_session}</td>
                        <td>{account.recent_subject}</td>
                        <td>{account.recent_tutor}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default AccountDataTable;