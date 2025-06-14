// React and styling imports
import { FC, useState } from 'react';
import './RouterMailchimpDashboard.css';

// Custom component imports
import AccountDataTable from '../../accountDataTable/accountDataTable';
import { ApiPaginatedRequest } from '../../../dtos/ApiPaginatedRequest.ts';

// React component imports
import Dropdown from 'react-bootstrap/Dropdown';
import { InputGroup, Form, Button } from 'react-bootstrap';
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
    const [sessionRange, setSessionRange] = useState<string | null>(null);
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [accountTypes, setAccountTypes] = useState<{ value: string, label: string }[]>([]);
    const [resJson, setResJson] = useState<Array<MailchimpUserResponseDTO>>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const reqData: MailchimpUsersRequestDTO = {
            pageIndex: 0,
            pageSize: 8,
            accountType: accountTypes.length > 0 ? accountTypes.map(opt => opt.label) : null,
            studentNameSearchKeyword: searchKeyword || null,
            minNumberOfSessions: sessionRange === '1-2' ? 1 : sessionRange === '3+' ? 3 : sessionRange === '0' ? 0 : 0,
            maxNumberOfSessions: sessionRange === '1-2' ? 2 : sessionRange === '0' ? 0 : null,
            startDate: null,
            endDate: null
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
            <div className="RouterMailchimpDashboard">
                <h1>Mailchimp Dashboard</h1>
                <p>Welcome to your Mailchimp Dashboard. Here you can view campaign stats, manage subscribers, and more.</p>
            </div>

            <div className="top-row">
                <Form className="filter-form" onSubmit={handleSubmit}>
                    <InputGroup className="search-input">
                        <Form.Control
                            placeholder="Enter Full Student Name"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                    </InputGroup>

                    <Dropdown className="sessions">
                        <Dropdown.Toggle id="dropdown-basic">
                            {selectedSession}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => { setSelectedSession('0'); setSessionRange('0'); }}>0</Dropdown.Item>
                            <Dropdown.Item onClick={() => { setSelectedSession('1-2'); setSessionRange('1-2'); }}>1-2</Dropdown.Item>
                            <Dropdown.Item onClick={() => { setSelectedSession('3+'); setSessionRange('3+'); }}>3+</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <div className="session-select">
                        <Select
                            options={sessionOptions}
                            isMulti
                            placeholder="Account Type"
                            className="inner-select"
                            onChange={(selected) => setAccountTypes(selected as any)}
                            value={accountTypes}
                        />
                    </div>

                    <Button type="button" className="submit-button" variant="danger" onClick={() => {
                        setSelectedSession('Sessions');
                        setSessionRange(null);
                        setSearchKeyword('');
                        setAccountTypes([]);
                        setResJson([]);
                    }}>
                        Clear Filters
                    </Button>

                    <Button type="submit" className="submit-button" variant="success">
                        Apply Filters
                    </Button>
                </Form>

                {/* 
                    Takes the last submitted filter json
                    data and converts it into a csv file
                    for MailChimp compatibility.
                */}
                <CsvDownloadButton className="export-button" delimiter="," data={resJson} />
            </div>

            <div className="account-table">
                <AccountDataTable data={resJson} />
            </div>

            <Pagination className="pagination">
                <Pagination>{items}</Pagination>
            </Pagination>
        </>
    );
};

export default RouterMailchimpDashboard;
