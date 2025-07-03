import React, { FC } from 'react';
import './AccountsReceivableDashboard.css';
import { Container, Row, Table } from 'react-bootstrap';

// Will set to proper DTO when it is complete.
interface AccountsReceivableDashboardProps {
    data: [];
}

const AccountsReceivableDashboard: FC<AccountsReceivableDashboardProps> = () => (
    <Container>
        <Row>
            <h1>Accounts Receivable Dashboard</h1>
            <p>Welcome to the Accounts Receivable Dashboard. *put description here*</p>
        </Row>
        <Row>
            <Table striped bordered responsive>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Tutor First Name</th>
                        <th>Subject</th>
                        <th>Date of Session</th>
                        <th>Amt. Owed</th>
                    </tr>
                </thead>
                <tbody>
                    <td>hello</td>
                    <td>hello</td>
                    <td>hello</td>
                    <td>hello</td>
                    <td>hello</td>
                </tbody>
            </Table>
        </Row>
    </Container>
);

export default AccountsReceivableDashboard;
