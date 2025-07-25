import React, { FC, useState } from 'react';
import './AccountsReceivableDashboard.css';
import { Col, Container, Row, Table, Form } from 'react-bootstrap';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import DateRangePicker from '../../DateRangePicker/DateRangePicker';
import { DateRange } from 'react-day-picker';
import { School, subjectOptions } from '../../../utils/input-fields';

// Will set to proper DTO when it is complete.
interface AccountsReceivableDashboardProps { }



const AccountsReceivableDashboard: FC<AccountsReceivableDashboardProps> = () => {
    const [selectedOwedFilter, setSelectedOwedFilter] = useState<string>('');
    const [owedFilter, setOwedFilter] = useState<string | undefined>(undefined);
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        to: new Date(),
        from: new Date(new Date().valueOf() - 1000 * 60 * 60 * 24 * 6)
    });

    const [selectedSession, setSelectedSession] = useState<string>('Sessions');
    const [sessionRange, setSessionRange] = useState<string | undefined>(undefined);

    return (
        <Container>
            <Row>
                <h1>Accounts Receivable Dashboard</h1>
                <p>Welcome to the Accounts Receivable Dashboard. *put description here*</p>
            </Row>
            <Row style={{ background: 'linear-gradient(to bottom, #F5F5F5, #FFFFFF)', paddingBottom: '2rem' }} className="rounded">
                <Col style={{ paddingTop: 10 }}>
                    <Form.Control type="text" placeholder="Name" />
                </Col>
                <Col style={{ paddingTop: 10 }}>
                    <Form.Control type="text" placeholder="Phone #" />
                </Col>
                <Col style={{ paddingTop: 10 }}>
                    <Form.Control type="text" placeholder="Email" />
                </Col>
                <Col style={{ paddingTop: 10 }}>
                    <Form.Control type="text" placeholder="Tutor" />
                </Col>
                <Col style={{ paddingTop: 10 }}>
                    <Select
                        isMulti
                        options={subjectOptions}
                        placeholder='Subject(s)'
                        className='inner-select'
                    />
                </Col>
                <Col style={{ paddingTop: 10 }}>
                    <CreatableSelect
                        isClearable
                        value={owedFilter ? { value: owedFilter, label: owedFilter } : null}
                        onChange={(selected) => {
                            const val = selected?.value || '';
                            setOwedFilter(val);
                        }}
                        options={[
                            { value: '$10', label: '$10' },
                            { value: '$20', label: '$20' },
                            { value: '$30', label: '$30' },
                            { value: '$40', label: '$40' },
                        ]}
                        placeholder='Filter by owed amount...'
                    />
                </Col>
                <Col>
                    <DateRangePicker value={dateRange} onChange={setDateRange} />
                </Col>
            </Row>
            <Row>
                <Table striped bordered responsive>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Tutor First Name</th>
                            <th>Subject</th>
                            <th>Date of Session</th>
                            <th>Amt. Owed</th>
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </Table>
            </Row>
        </Container>
    );
}

export default AccountsReceivableDashboard;
