// React and styling imports
import { FC, useState, useEffect } from 'react';
import './RouterMailchimpDashboard.css';

// Custom component imports
import AccountDataTable from '../../accountDataTable/accountDataTable';

// React component imports
import { Form, Button, Col, Row, Container } from 'react-bootstrap';
import Select from 'react-select';
import CsvDownloadButton from 'react-json-to-csv';
import Pagination from 'react-bootstrap/Pagination';
import CreatableSelect from 'react-select/creatable';

// Data handling and DTO imports
import instance from "../../../utils/axios";
import { MailchimpUsersRequestDTO } from "../../../dtos/MailchimpUsersRequestDTO";
import { MailchimpUserResponseDTO } from '../../../dtos/MailchimpUsersResponseDTO.ts';
import { ApiPaginatedResponse } from '../../../dtos/ApiPaginatedResponse.ts';
import { EducationLevelSchoolsResponseDTO } from '../../../dtos/EducationLevelSchoolsResponseDTO.ts';

// Options for multi-select (account types)
const sessionOptions = [
    { value: '0', label: 'Student' },
    { value: '1', label: 'Parent' },
    { value: '2', label: 'Tutor' }
];

const RouterMailchimpDashboard: FC = () => {
    // UI & filter state
    const [selectedSession, setSelectedSession] = useState<string>('Sessions');
    const [sessionRange, setSessionRange] = useState<string | undefined>(undefined);
    const [accountTypes, setAccountTypes] = useState<{ value: string, label: string }[]>([]);

    // Data state
    const [resJson, setResJson] = useState<ApiPaginatedResponse<MailchimpUserResponseDTO>>();
    const [fullData, setFullData] = useState<MailchimpUserResponseDTO[]>([]);
    const [schoolJson, setSchoolJson] = useState<EducationLevelSchoolsResponseDTO>();

    // Pagination and filter settings
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [rowsOfData, setMaxRows] = useState<number>(0);
    const pageSize = 8;

    // Builds request object based on current filter state
    const getRequestParams = (pageIndex: number, pageSize: number, limit: number | undefined): MailchimpUsersRequestDTO => ({
        limit,
        pageIndex,
        pageSize,
        accountType: accountTypes.length > 0 ? accountTypes.map(opt => opt.label) : undefined,
        minNumberOfSessions: sessionRange === '1-2' ? 1 : sessionRange === '3+' ? 3 : sessionRange === '0' ? 0 : undefined,
        maxNumberOfSessions: sessionRange === '1-2' ? 2 : sessionRange === '0' ? 0 : undefined,
        startDate: undefined,
        endDate: undefined
    });

    // Fetch and store full data (used for pagination + CSV export)
    const handleSubmit = async () => {
        const fetchLimit = rowsOfData || 10000;
        const allParams = getRequestParams(0, fetchLimit, fetchLimit);

        try {
            // Recieves user account data.
            const response = await instance.get("mailchimpDashboard/users", { params: allParams });
            const receivedData: ApiPaginatedResponse<MailchimpUserResponseDTO> = response.data;

            setFullData(receivedData.data);

            const paginatedSlice = receivedData.data.slice((currentPage - 1) * pageSize, currentPage * pageSize);
            setResJson({
                data: paginatedSlice,
                totalItems: receivedData.data.length,
                pageIndex: currentPage - 1,
                pageSize
            });
        } catch (err) {
            console.error("API error:", err);
        }
    };

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [sessionRange, accountTypes]);

    // Re-fetch all data on filter or rows change
    useEffect(() => {
        handleSubmit();
    }, [currentPage, sessionRange, accountTypes, rowsOfData]);

    // Re-slice data for pagination when currentPage or fullData changes
    useEffect(() => {
        if (!fullData.length) return;

        const paginatedSlice = fullData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
        setResJson({
            data: paginatedSlice,
            totalItems: fullData.length,
            pageIndex: currentPage - 1,
            pageSize
        });
    }, [currentPage, fullData]);

    // Prevent Enter key from submitting filter form
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                const target = event.target as HTMLElement;
                const isInput = ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName);
                if (isInput) {
                    event.preventDefault();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // Loads the unique school data when the page loads
    useEffect(() => {
        const fetchSchools = async () => {
            try {
                const schoolsResponse = await instance.get("/educationLevelSchools");
                const uniqueSchools: EducationLevelSchoolsResponseDTO = schoolsResponse.data;
                setSchoolJson(uniqueSchools);

                // REMOVE **TEST**
                console.log(uniqueSchools);
            } catch (error) {
                console.error("Error fetching schools:", error);
            }
        };

        fetchSchools();
    }, []);

    // Pagination controls
    const loadPagination = (totalItems: number | undefined, pageSizeNum: number) => {
        if (typeof totalItems === "undefined" || !totalItems) return null;

        const totalPages = Math.ceil(totalItems / pageSizeNum);
        const items = [];

        const handlePageChange = (page: number) => {
            if (page < 1 || page > totalPages) return;
            setCurrentPage(page);
        };

        items.push(<Pagination.First key="first" onClick={() => handlePageChange(1)} />);
        items.push(<Pagination.Prev key="prev" onClick={() => handlePageChange(currentPage - 1)} />);

        if (totalPages <= 6) {
            for (let number = 1; number <= totalPages; number++) {
                items.push(
                    <Pagination.Item
                        key={number}
                        active={number === currentPage}
                        onClick={() => handlePageChange(number)}
                    >
                        {number}
                    </Pagination.Item>
                );
            }
        } else {
            for (let number = 1; number <= 2; number++) {
                items.push(
                    <Pagination.Item
                        key={number}
                        active={number === currentPage}
                        onClick={() => handlePageChange(number)}
                    >
                        {number}
                    </Pagination.Item>
                );
            }

            if (currentPage > 4) {
                items.push(<Pagination.Ellipsis key="ellipsis-start" disabled />);
            }

            if (currentPage > 2 && currentPage < totalPages - 1) {
                items.push(
                    <Pagination.Item key={currentPage} active onClick={() => handlePageChange(currentPage)}>
                        {currentPage}
                    </Pagination.Item>
                );
            }

            if (currentPage < totalPages - 3) {
                items.push(<Pagination.Ellipsis key="ellipsis-end" disabled />);
            }

            for (let number = totalPages - 1; number <= totalPages; number++) {
                items.push(
                    <Pagination.Item
                        key={number}
                        active={number === currentPage}
                        onClick={() => handlePageChange(number)}
                    >
                        {number}
                    </Pagination.Item>
                );
            }
        }

        items.push(<Pagination.Next key="next" onClick={() => handlePageChange(currentPage + 1)} />);
        items.push(<Pagination.Last key="last" onClick={() => handlePageChange(totalPages)} />);

        return items;
    };

    return (
        <Container>
            <Row>
                <div className="RouterMailchimpDashboard">
                    <h1>MailChimp Dashboard</h1>
                    <p>Welcome to your MailChimp Dashboard. Here you can view campaign stats, manage subscribers, and more.</p>
                </div>
            </Row>

            {/* Filter Form */}
            <div className="filter-form mb-2">
                <Row>
                    <Col xs={12} md={4} lg={2}>
                        <Form.Group className="sessions-multi-select mb-2">
                            <Form.Label>Num of Sessions</Form.Label>
                            <CreatableSelect
                                isClearable
                                value={sessionRange ? { value: sessionRange, label: sessionRange } : null}
                                onChange={(selected) => {
                                    const val = selected?.value || '';
                                    setSelectedSession(val);
                                    setSessionRange(val);
                                }}
                                options={[
                                    { value: '0', label: '0' },
                                    { value: '1-2', label: '1-2' },
                                    { value: '3+', label: '+3' }
                                ]}
                            />
                        </Form.Group>

                    </Col>

                    <Col xs={12} md={4} lg={2}>
                        <Form.Group className="mb-2">
                            <Form.Label>Edu. Level</Form.Label>
                            <Form.Select
                                value={selectedSession}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setSelectedSession(val);
                                    setSessionRange(val);
                                }}
                            >
                                <option value="" disabled hidden>Select...</option>
                                {schoolJson?.schoolNames?.map((school, index) => (
                                    <option key={`${index}-${school.schoolName}-${school.schoolType}`} value={school.schoolName}>
                                        {school.schoolName}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    <Col xs={12} md={4} lg={2}>
                        <Form.Group className="mb-2">
                            <Form.Label>Account Type</Form.Label>
                            <Select
                                options={sessionOptions}
                                isMulti
                                className="inner-select"
                                onChange={(selected) => setAccountTypes(selected as any)}
                                value={accountTypes}
                            />
                        </Form.Group>
                    </Col>

                    <Col xs={12} md={4} lg={2}>
                        <Form.Group controlId="minSessions" className="mb-2">
                            <Form.Label>Records Limit</Form.Label>
                            <Form.Control
                                type="number"
                                min={0}
                                value={rowsOfData}
                                onChange={(e) => setMaxRows(Number(e.target.value))}
                            />
                        </Form.Group>
                    </Col>

                    <Col xs={12} md={8} lg={2}>
                        <CsvDownloadButton
                            className="export-button w-100"
                            delimiter=","
                            data={fullData}
                        />
                    </Col>
                </Row>
            </div>

            {/* Data Table */}
            <Row>
                <Col>
                    <AccountDataTable data={resJson?.data || []} />
                </Col>
            </Row>

            {/* Showing results count */}
            {resJson?.totalItems && (
                <Row className="mb-2">
                    <Col className="text-center">
                        <p>
                            Showing rows {resJson.pageIndex * resJson.pageSize + 1}-{resJson.pageIndex * resJson.pageSize + resJson.data.length} of {resJson.totalItems} rows
                        </p>
                    </Col>
                </Row>
            )}

            {/* Pagination */}
            <Row>
                <Col>
                    <Pagination className="pagination">
                        {loadPagination(resJson?.totalItems, pageSize)}
                    </Pagination>
                </Col>
            </Row>
        </Container>
    );
};

export default RouterMailchimpDashboard;
