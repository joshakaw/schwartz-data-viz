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
//port { ApiPaginatedRequest } from "./ApiPaginatedRequest";
import { MailchimpUsersRequestDTO } from "../../../dtos/MailchimpUsersRequestDTO";
import { MailchimpUserResponseDTO } from '../../../dtos/MailchimpUsersResponseDTO.ts';
interface RouterMailchimpDashboardProps { }

const sessionOptions = [
    { value: '1', label: 'Student' },
    { value: '2', label: 'Parent' },
    { value: '3', label: 'Tutor' }
];

const RouterMailchimpDashboard: FC<RouterMailchimpDashboardProps> = () => {
    const [selectedSession, setSelectedSession] = useState<string>('Sessions');
    const [resJson, setResJson] = useState<Array<MailchimpUserResponseDTO>>([]);

    var reqData: MailchimpUsersRequestDTO = {
        accountType: ["Tutor"],
        studentNameSearchKeyword: null,
        minNumberOfSessions: null,
        maxNumberOfSessions: null,
        startDate: null,
        endDate: null,
        pageIndex: 0,
        pageSize: 10
    }
    instance.get("mailchimpDashboard/users", { params: reqData }).then((response) => {
        setResJson(response.data);
    }).catch((reason) => {
        console.error(reason)
    })

    return (
        <>
            <div className="RouterMailchimpDashboard">
                <h1>Mailchimp Dashboard</h1>
                <p>Welcome to your Mailchimp Dashboard. Here you can view campaign stats, manage subscribers, and more.</p>
            </div>

            <div className="top-row">
                <Form className="filter-form" onSubmit={(e) => {
                    e.preventDefault();
                    console.log("Filter form submitted");
                }}>
                    <InputGroup className="search-input">
                        <Form.Control placeholder="Search" aria-label="Search" />
                    </InputGroup>

                    {/*
                        Changes value based on selected value.    
                    */}
                    <Dropdown className="sessions">
                        <Dropdown.Toggle id="dropdown-basic">{selectedSession}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => setSelectedSession('0')}>0</Dropdown.Item>
                            <Dropdown.Item onClick={() => setSelectedSession('1-2')}>1-2</Dropdown.Item>
                            <Dropdown.Item onClick={() => setSelectedSession('3+')}>3+</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    {/*
                        Allows multi-selection of values.
                        The filter will take into account
                        all of the selected options.
                    */}
                    <div className="session-select">
                        <Select
                            options={sessionOptions}
                            isMulti
                            placeholder="Filter by Sessions"
                            className="inner-select"
                        />
                    </div>

                    {/*
                        Reverts all filter options to their
                        default state.
                    */}
                    <Button type="button" className="submit-button" variant="danger">
                        Clear Filters
                    </Button>

                    {/*
                        Applies all selected filter options
                        to the table. If all filter options
                        are left empty, the tabel will default
                        to showing all data.
                    */}
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
                {/*<Button className="export-button" variant="primary">Export CSV</Button>*/}
            </div>

            <div className="account-table">
                <AccountDataTable data={resJson} />
            </div>
        </>
    );
};

export default RouterMailchimpDashboard;
