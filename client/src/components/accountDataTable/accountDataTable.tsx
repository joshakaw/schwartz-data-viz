import Table from 'react-bootstrap/Table';
import { MailchimpUserResponseDTO } from '../../dtos/MailchimpUsersResponseDTO';


interface AccountDataTableProps {
    data: MailchimpUserResponseDTO[];
}

const AccountDataTable: React.FC<AccountDataTableProps> = ({ data }) => {
    return (
        <div className="table-outer-scroll">
            <div className="table-inner-wrapper">
                <Table striped bordered responsive>
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
                            <tr key={account.studentId}>
                                <td>{account.firstName}</td>
                                <td>{account.lastName}</td>
                                <td>{account.email}</td>
                                <td>{`(${account.phone.substring(0, 3)})-${account.phone.substring(3, 6)}-${account.phone.substring(6)}`}</td>
                                <td>{account.school}</td>
                                <td>{account.parentAccount}</td>
                                <td>{new Date(account.createdAt).toLocaleString()}</td>
                                <td>{account.numSession}</td>
                                <td>{new Date(account.mostRecentSession).toLocaleString()}</td>
                                <td>{account.mostRecentSubject}</td>
                                <td>{account.tutor}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default AccountDataTable;


