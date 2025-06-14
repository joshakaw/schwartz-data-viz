import Table from 'react-bootstrap/Table';
import { DetailedSignupResponseDTO } from '../../dtos/DetailedSignupResponseDTO';

interface DetailedSignupTableProps {
    data: DetailedSignupResponseDTO[];
}

const SignupDataTable: React.FC<DetailedSignupTableProps> = ({ data }) => {
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
                        {data.map((account) => (
                            <tr>
                                <td>{account.name}</td>
                                <td>{account.accountType}</td>
                                <td>{account.signupMethodCategory}</td>
                                <td>{account.freeResponseText}</td>
                                <td>{account.dateOfSignup}</td>
                                <td>{account.school}</td>
                                <td>{account.numberOfSessions}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
}

export default SignupDataTable;