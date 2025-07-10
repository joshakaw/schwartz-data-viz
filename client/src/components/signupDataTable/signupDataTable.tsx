import Table from 'react-bootstrap/Table';
import { DetailedSignupResponseDTO } from '../../dtos/DetailedSignupResponseDTO';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

interface DetailedSignupTableProps {
    data: DetailedSignupResponseDTO[];
    loading: boolean;
}

const SignupDataTable: React.FC<DetailedSignupTableProps> = ({ data, loading }) => {
    return (
        <div className="table-outer-scroll">
            <div className="table-inner-wrapper">
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Signup Method</th>
                            <th>How They Heard About Us</th>
                            <th>Date</th>
                            <th>School</th>
                            <th>Sessions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            // Case 1: If loading is true, show the skeleton loader.
                            Array.from({ length: 8 }).map((_, index) => (
                                <tr key={index}>
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
                                <td colSpan={7} style={{ textAlign: 'center' }}>
                                    No results found.
                                </td>
                            </tr>
                        ) : ( data.map((account) => (
                            // Case 3: If not loading and we have data, show the data.
                            <tr>
                                <td>{account.name}</td>
                                <td>{account.accountType}</td>
                                <td>{account.signupMethodCategory}</td>
                                <td>{account.freeResponseText}</td>
                                <td>{new Date(account.dateOfSignup).toDateString()}</td>
                                <td>{account.school}</td>
                                <td>{account.numberOfSessions}</td>
                            </tr>
                        )))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
}

export default SignupDataTable;