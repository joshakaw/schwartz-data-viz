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
        pageSize: pageSize,
        accountType: accountTypes.length > 0 ? accountTypes.map(opt => opt.label) : undefined,
        minNumberOfSessions: sessionRange === '1-2' ? 1 : sessionRange === '3+' ? 3 : sessionRange === '0' ? 0 : undefined,
        maxNumberOfSessions: sessionRange === '1-2' ? 2 : sessionRange === '0' ? 0 : undefined,
        startDate: undefined,
        endDate: undefined
    });

    // Fetch data from the backend and apply pagination
    const handleSubmit = async () => {
        const pagedParams = getRequestParams(currentPage - 1, pageSize, rowsOfData);

        try {
            const response = await instance.get("mailchimpDashboard/users", { params: pagedParams });
            const receivedData: ApiPaginatedResponse<MailchimpUserResponseDTO> = response.data;
            console.log(receivedData);

            setResJson({
                data: receivedData.data,
                totalItems: receivedData.totalItems,
                pageIndex: receivedData.pageIndex,
                pageSize: receivedData.pageSize
            });
        } catch (err) {
            console.error("API error:", err);
        }
    };

    // Reset to first page whenever filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [sessionRange, accountTypes]);

    // Re-fetch data when filters or pagination change
    useEffect(() => {
        handleSubmit();
    }, [currentPage, sessionRange, accountTypes, rowsOfData]);

    // Prevent Enter key from submitting form when using filters
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

    // Build pagination controls
    const loadPagination = () => {
        // If there's no response or no items, don't render any pagination
        if (!resJson || !resJson.totalItems) return null;

        // Calculate total number of pages based on total items and page size
        const totalPages = Math.ceil(resJson.totalItems / pageSize);
        const items = [];

        // Handler to update the current page, with bounds checking
        const handlePageChange = (page: number) => {
            if (page < 1 || page > totalPages) return;
            setCurrentPage(page);
        };

        // Always render "First" and "Previous" buttons
        items.push(<Pagination.First key="first" onClick={() => handlePageChange(1)} />);
        items.push(<Pagination.Prev key="prev" onClick={() => handlePageChange(currentPage - 1)} />);

        // If there are only a few pages, show them all
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
            // Always show the first two pages (1 and 2)
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

            // Show ellipsis after first few pages if user is far into the list
            if (currentPage > 4) {
                items.push(<Pagination.Ellipsis key="ellipsis-start" disabled />);
            }

            // Show the current page number in the middle of pagination if it's not near the start or end
            if (currentPage > 2 && currentPage < totalPages - 1) {
                items.push(
                    <Pagination.Item key={currentPage} active onClick={() => handlePageChange(currentPage)}>
                        {currentPage}
                    </Pagination.Item>
                );
            }

            // Show ellipsis before the last few pages if user is not near the end
            if (currentPage < totalPages - 3) {
                items.push(<Pagination.Ellipsis key="ellipsis-end" disabled />);
            }

            // Always show the last two pages (n-1 and n)
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

        // Always render "Next" and "Last" buttons
        items.push(<Pagination.Next key="next" onClick={() => handlePageChange(currentPage + 1)} />);
        items.push(<Pagination.Last key="last" onClick={() => handlePageChange(totalPages)} />);

        return items;
    };


    return (
        <Container>
            {/* Header */}
            <Row>
                <div className="RouterMailchimpDashboard">
                    <h1>MailChimp Dashboard</h1>
                    <p>Welcome to your MailChimp Dashboard. Here you can view campaign stats, manage subscribers, and more.</p>
                </div>
            </Row>

            {/* Filter Form */}
            <div className="filter-form mb-2">
                <Row>
                    {/* Session Range Filter */}
                    <Col xs={12} md={4} lg={2}>
                        <Form.Group className="sessions-multi-select mb-2">
                            <Form.Select
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setSelectedSession(val);
                                    setSessionRange(val);
                                }}
                                value={sessionRange}
                            >
                                <option value="">Select Sessions</option>
                                <option value="0">0</option>
                                <option value="1-2">1-2</option>
                                <option value="3+">+3</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    {/* Placeholder School Filter */}
                    <Col xs={12} md={4} lg={2}>
                        <Form.Group className="mb-2">
                            <Form.Select
                                aria-placeholder="School"
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setSelectedSession(val);
                                    setSessionRange(val);
                                }}
                            >
                                <option value="">School</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    {/* Account Type Multi-Select */}
                    <Col xs={12} md={4} lg={2}>
                        <Form.Group className="mb-2">
                            <Select
                                options={sessionOptions}
                                isMulti
                                placeholder="Account Type"
                                className="inner-select"
                                onChange={(selected) => setAccountTypes(selected as any)}
                                value={accountTypes}
                            />
                        </Form.Group>
                    </Col>

                    {/* Max Rows Selector */}
                    <Col xs={12} md={4} lg={2}>
                        <Form.Group controlId="minSessions" className="mb-2">
                            <Form.Label>Total Records to Request</Form.Label>
                            <Form.Control
                                type="number"
                                min={0}
                                value={rowsOfData}
                                onChange={(e) => setMaxRows(Number(e.target.value))}
                            />
                        </Form.Group>
                    </Col>

                    {/* Clear Filters Button */}
                    <Col xs={12} md={6} lg={1}>
                        <Button
                            type="button"
                            className="submit-button w-100 mb-2"
                            variant="danger"
                            onClick={() => {
                                setCurrentPage(1);
                                setSelectedSession('');
                                setSessionRange(undefined);
                                setAccountTypes([]);
                            }}
                        >
                            Clear
                        </Button>
                    </Col>

                    {/* CSV Export Button */}
                    <Col xs={12} md={12} lg={2}>
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
                        {loadPagination()}
                    </Pagination>
                </Col>
            </Row>
        </Container>
    );
};

export default RouterMailchimpDashboard;
