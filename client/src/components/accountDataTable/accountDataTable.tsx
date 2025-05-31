import { useState } from 'react';
import { rawAccountData } from '../../utils/data';
import './accountDataTable.css';

const AccountDataTable = () => {
    const data = rawAccountData;
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 5;

    // Pagination logic
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = data.slice(indexOfFirstEntry, indexOfLastEntry);

    const totalPages = Math.ceil(data.length / entriesPerPage);

    return (
        <>
            <div className="table-wrapper">
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
                        {currentEntries.map((account) => (
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
            </div>
            <div className="pagination-controls">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="prev-btn"
                >
                    Prev
                </button>
                <span> Page {currentPage} of {totalPages} </span>
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="next-btn"
                >
                    Next
                </button>
            </div>
        </>
    );
};

export default AccountDataTable;
