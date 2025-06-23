// React and styling imports
import { FC, useState } from 'react';
import './RouterMailchimpDashboard.css';

// Custom component imports
import AccountDataTable from '../../accountDataTable/accountDataTable';

// React component imports
import { InputGroup, Form, Button, Dropdown, Col, Row, Container } from 'react-bootstrap';
import Select from 'react-select';
import CsvDownloadButton from 'react-json-to-csv';

// Data Components
import instance from "../../../utils/axios";
import Pagination from 'react-bootstrap/Pagination';
//port { ApiPaginatedRequest } from "./ApiPaginatedRequest";
import { MailchimpUsersRequestDTO } from "../../../dtos/MailchimpUsersRequestDTO";
import { MailchimpUserResponseDTO } from '../../../dtos/MailchimpUsersResponseDTO.ts';
interface RouterMailchimpDashboardProps { }

const sessionOptions = [
    { value: '0', label: 'Student' },
    { value: '1', label: 'Parent' },
    { value: '2', label: 'Tutor'}
];

const RouterMailchimpDashboard: FC<RouterMailchimpDashboardProps> = () => {
    const [selectedSession, setSelectedSession] = useState<string>('Sessions');
    const [sessionRange, setSessionRange] = useState<string | undefined>(undefined);
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [accountTypes, setAccountTypes] = useState<{ value: string, label: string }[]>([]);
    const [resJson, setResJson] = useState<Array<MailchimpUserResponseDTO>>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const reqData: MailchimpUsersRequestDTO = {
            pageIndex: 0,
            pageSize: 8,
            accountType: accountTypes.length > 0 ? accountTypes.map(opt => opt.label) : undefined,
            studentNameSearchKeyword: searchKeyword || undefined,
            minNumberOfSessions: sessionRange === '1-2' ? 1 : sessionRange === '3+' ? 3 : sessionRange === '0' ? 0 : undefined,
            maxNumberOfSessions: sessionRange === '1-2' ? 2 : sessionRange === '0' ? 0 : undefined,
            startDate: undefined,
            endDate: undefined
        };

        console.log(reqData);
        console.log(resJson);

        try {
            const response = await instance.get("mailchimpDashboard/users", { params: reqData });
            setResJson(response.data);
        } catch (err) {
            console.error("API error:", err);
        }
    };

    // **Todo********************************************************************
    let active = 1;
    let items = [];
    items.push(<Pagination.First />);
    items.push(<Pagination.Prev />);
    for (let number = 1; number <= 5; number++) {
        items.push(
            <Pagination.Item key={number} active={number === active}>
                {number}
            </Pagination.Item>,
        );
    }
    items.push(<Pagination.Next />);
    items.push(<Pagination.Last />);
    // **************************************************************************

    return (
        <>
            <Container>
                <Row>
                    <div className="RouterMailchimpDashboard">
                        <h1>Mailchimp Dashboard</h1>
                        <p>Welcome to your Mailchimp Dashboard. Here you can view campaign stats, manage subscribers, and more.</p>
                    </div>
                </Row>
                <Form className="filter-form mb-2" onSubmit={handleSubmit}>
                    <Row>
                        <Col xs={12} md={4} lg={2}>
                            <Form.Group className="search-input mb-2">
                                <Form.Control
                                    placeholder="Enter Full Student Name"
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
                                    setSelectedSession('Sessions');
                                    setSessionRange(undefined);
                                    setSearchKeyword('');
                                    setAccountTypes([]);
                                    setResJson([]);
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
                            <CsvDownloadButton className="export-button w-100" delimiter="," data={resJson} />
                        </Col>
                    </Row>
                </Form>
                <Row>
                    <Col>
                        <AccountDataTable data={resJson} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Pagination className="pagination">
                            <Pagination>{items}</Pagination>
                        </Pagination>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default RouterMailchimpDashboard;
