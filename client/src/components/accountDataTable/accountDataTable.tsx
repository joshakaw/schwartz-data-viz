import { rawAccountData } from '../../utils/data';
import Table from 'react-bootstrap/Table';

const AccountDataTable = () => {
    const data = rawAccountData;

    return (
        <div className="table-outer-scroll">
            <div className="table-inner-wrapper">
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
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
                                <td>{`(${account.phone.substring(0, 3)})-${account.phone.substring(3, 6)}-${account.phone.substring(6)}`}</td>
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
                </Table>
            </div>
        </div>
    );
};

export default AccountDataTable;
