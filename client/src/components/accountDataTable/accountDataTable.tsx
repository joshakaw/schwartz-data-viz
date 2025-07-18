import Table from 'react-bootstrap/Table';
import { MailchimpUserResponseDTO } from '../../dtos/MailchimpUsersResponseDTO';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


interface AccountDataTableProps {
    data: MailchimpUserResponseDTO[];
    loading: boolean; 
}

const AccountDataTable: React.FC<AccountDataTableProps> = ({ data, loading }) => {
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
                        {loading ? (
                            // Case 1: If loading, show the skeleton loader.
                            Array.from({ length: 10 }).map((_, index) => (
                                <tr>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                </tr>
                            ))
                        ) : data.length === 0 ? (
                            // Case 2: If not loading and no data, show "No Results".
                            <tr>
                                <td colSpan={11} style={{ textAlign: 'center' }}>
                                    No results found.
                                </td>
                            </tr>
                        ) : (
                            // Case 3: If not loading and we have data, show the data.
                            data.map((account) => (
                                <tr key={account.studentId}>
                                    <td>{account.firstName}</td>
                                    <td>{account.lastName}</td>
                                    <td>{account.email}</td>
                                    <td>{`(${account.phone.substring(0, 3)})-${account.phone.substring(3, 6)}-${account.phone.substring(6)}`}</td>
                                    <td>{account.school}</td>
                                    <td>{account.accountType}</td>
                                    <td>{new Date(account.createdAt).toLocaleDateString()}</td>
                                    <td>{account.numSessions}</td>
                                    <td>{account.mostRecentSession ? new Date(account.mostRecentSession).toLocaleDateString() : 'N/A'}</td>
                                    <td>{account.mostRecentSubject}</td>
                                    <td>{account.tutor}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default AccountDataTable;


