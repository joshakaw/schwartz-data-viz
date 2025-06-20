// React and styling imports
import { FC, useState, useEffect } from 'react';
import './RouterMailchimpDashboard.css';

// Custom component imports
import AccountDataTable from '../../accountDataTable/accountDataTable';

// React component imports
import { InputGroup, Form, Button, Col, Row, Container } from 'react-bootstrap';
import Select from 'react-select';
import CsvDownloadButton from 'react-json-to-csv';
import Pagination from 'react-bootstrap/Pagination';

// Data Components
import instance from "../../../utils/axios";
import { MailchimpUsersRequestDTO } from "../../../dtos/MailchimpUsersRequestDTO";
import { MailchimpUserResponseDTO } from '../../../dtos/MailchimpUsersResponseDTO.ts';
import { ApiPaginatedResponse } from '../../../dtos/ApiPaginatedResponse.ts';

interface RouterMailchimpDashboardProps { }

const sessionOptions = [
    { value: '0', label: 'Student' },
    { value: '1', label: 'Parent' },
    { value: '2', label: 'Tutor' }
];

const RouterMailchimpDashboard: FC<RouterMailchimpDashboardProps> = () => {
    const [selectedSession, setSelectedSession] = useState<string>('Sessions');
    const [sessionRange, setSessionRange] = useState<string | undefined>(undefined);
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [accountTypes, setAccountTypes] = useState<{ value: string, label: string }[]>([]);
    const [resJson, setResJson] = useState<ApiPaginatedResponse<MailchimpUserResponseDTO>>();
    const [currentPage, setCurrentPage] = useState<number>(1);

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        const reqData: MailchimpUsersRequestDTO = {
            pageIndex: currentPage - 1,
            pageSize: 8,
            accountType: accountTypes.length > 0 ? accountTypes.map(opt => opt.label) : undefined,
            studentNameSearchKeyword: searchKeyword || undefined,
            minNumberOfSessions: sessionRange === '1-2' ? 1 : sessionRange === '3+' ? 3 : sessionRange === '0' ? 0 : undefined,
            maxNumberOfSessions: sessionRange === '1-2' ? 2 : sessionRange === '0' ? 0 : undefined,
            startDate: undefined,
            endDate: undefined
        };

        try {
            const response = await instance.get("mailchimpDashboard/users", { params: reqData });
            setResJson(response.data);
        } catch (err) {
            console.error("API error:", err);
        }
    };

    useEffect(() => {
        handleSubmit();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    const loadPagination = () => {
        if (!resJson || !resJson.totalItems) return null;

        const pageSize = 8;
        const totalPages = Math.ceil(resJson.totalItems / pageSize);
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
            // First 2 pages
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
                    <Pagination.Item
                        key={currentPage}
                        active
                        onClick={() => handlePageChange(currentPage)}
                    >
                        {currentPage}
                    </Pagination.Item>
                );
            }

            if (currentPage < totalPages - 3) {
                items.push(<Pagination.Ellipsis key="ellipsis-end" disabled />);
            }

            // Last 2 pages
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
        <>
            <Container>
                <Row>
                    <div className="RouterMailchimpDashboard">
                        <h1>Mailchimp Dashboard</h1>
                        <p>Welcome to your Mailchimp Dashboard. Here you can view campaign stats, manage subscribers, and more.</p>
                    </div>
                </Row>
                <Form className="filter-form mb-2" onSubmit={(e) => {
                    setCurrentPage(1);
                    handleSubmit(e);
                }}>
                    <Row>
                        <Col xs={12} md={4} lg={2}>
                            <Form.Group className="search-input mb-2">
                                <Form.Control
                                    placeholder="Enter Student Name"
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                />
                            </Form.Group>
                        </Col>

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
                                    <option value="3+">3+</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>

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

                        <Col xs={12} md={6} lg={2}>
                            <Button
                                type="button"
                                className="submit-button w-100 mb-2"
                                variant="danger"
                                onClick={() => {
                                    setCurrentPage(1);
                                    setSelectedSession('Sessions');
                                    setSessionRange(undefined);
                                    setSearchKeyword('');
                                    setAccountTypes([]);
                                }}
                            >
                                Clear Filters
                            </Button>
                        </Col>

                        <Col xs={12} md={6} lg={2}>
                            <Button type="submit" className="submit-button w-100 mb-2" variant="success">
                                Apply Filters
                            </Button>
                        </Col>

                        <Col xs={12} md={12} lg={2}>
                            <CsvDownloadButton className="export-button w-100" delimiter="," data={resJson?.data || []} />
                        </Col>
                    </Row>
                </Form>
                <Row>
                    <Col>
                        <AccountDataTable data={resJson?.data || []} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Pagination className="pagination">
                            {loadPagination()}
                        </Pagination>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default RouterMailchimpDashboard;
