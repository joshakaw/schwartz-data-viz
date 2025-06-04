import { FC, useState } from 'react';
import './RouterMailchimpDashboard.css';
import AccountDataTable from '../../accountDataTable/accountDataTable';

import Dropdown from 'react-bootstrap/Dropdown';
import { InputGroup, Form, Button } from 'react-bootstrap';
import Select from 'react-select';

interface RouterMailchimpDashboardProps { }

const sessionOptions = [
    { value: '1', label: 'Student' },
    { value: '2', label: 'Parent' },
    { value: '3', label: 'Tutor' }
];

const RouterMailchimpDashboard: FC<RouterMailchimpDashboardProps> = () => {
    const [selectedSession, setSelectedSession] = useState<string>('Sessions');

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

                    <Dropdown className="sessions">
                        <Dropdown.Toggle id="dropdown-basic">{selectedSession}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => setSelectedSession('0')}>0</Dropdown.Item>
                            <Dropdown.Item onClick={() => setSelectedSession('1-2')}>1-2</Dropdown.Item>
                            <Dropdown.Item onClick={() => setSelectedSession('3+')}>3+</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <div className="session-select">
                        <Select
                            options={sessionOptions}
                            isMulti
                            placeholder="Filter by Sessions"
                            className="inner-select"
                        />
                    </div>

                    <Button type="submit" className="submit-button" variant="success">
                        Apply Filters
                    </Button>
                </Form>

                <Button className="export-button" variant="primary">Export CSV</Button>
            </div>

            <div className="account-table">
                <AccountDataTable />
            </div>
        </>
    );
};

export default RouterMailchimpDashboard;
