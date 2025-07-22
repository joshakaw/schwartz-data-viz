import React, { FC, useEffect, useState } from 'react';
import './TutorDataDashboard.css';
import { Col, Container, Row, Table, Form } from 'react-bootstrap';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import DateRangePicker from '../../DateRangePicker/DateRangePicker';
import { DateRange } from 'react-day-picker';
import { School, subjectOptions } from '../../../utils/input-fields';
import { TutorLeaderboardRequestDTO } from '../../../dtos/TutorLeaderboardRequestDTO';
import { TutorLeaderboardResponseDTO } from '../../../dtos/TutorLeaderboardResponseDTO';
import instance from '../../../utils/axios';

// Will set to proper DTO when it is complete.
interface TutorDataDashboardProps { }

const TutorDataDashboard: FC<TutorDataDashboardProps> = () => {
    const [tableData, setData] = useState<TutorLeaderboardResponseDTO[]>([]);
    const [selectedOwedFilter, setSelectedOwedFilter] = useState<string>('');
    const [owedFilter, setOwedFilter] = useState<string | undefined>(undefined);
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        to: new Date(),
        from: new Date(new Date().valueOf() - 1000 * 60 * 60 * 24 * 6)
    });

    const [selectedSession, setSelectedSession] = useState<string>('Sessions');
    const [sessionRange, setSessionRange] = useState<string | undefined>(undefined);

    async function getData() {
        const req: TutorLeaderboardRequestDTO = {
            startDate: dateRange?.from ? dateRange.from.toISOString() : undefined,
            endDate: dateRange?.to ? dateRange.to.toISOString() : undefined,
            sortBy: 'hours',
            subjects: undefined,
            locations: undefined
        }

        const response = await instance.get<Array<TutorLeaderboardResponseDTO>>("/tutorData/leaderboard", { params: req });
        setData(response.data);
    }

    useEffect(() => {
        getData();
    }, [dateRange])

    return (
        <Container>
            <Row>
                <h1>Tutor Data Dashboard</h1>
                <p>Welcome to the Tutor Data Dashboard. *put description here*</p>
            </Row>
            <Row style={{ background: 'linear-gradient(to bottom, #F5F5F5, #FFFFFF)', paddingBottom: '2rem' }} className="rounded">
                <Col style={{ paddingTop: 10 }}>
                    <Form.Control type="text" placeholder="Name" />
                </Col>
                <Col style={{ paddingTop: 10 }}>
                    <Form.Control type="text" placeholder="Email" />
                </Col>
                <Col style={{ paddingTop: 10 }}>
                    <Form.Control type="text" placeholder="Tutor" />
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
                        placeholder='Filter by amount of sessions...'
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
                            <th># of Sessions</th>
                            <th>Last Session</th>
                            <th>Hrs Tutored</th>
                            <th># of Recurring Sessions</th>
                            <th>Revenue Generated</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((data) => (
                            <tr key={data.name}>

                                {/*In the future, clicking the name will open 
                                    TutorDetail modal with data.tutorId as an input*/}
                                <td>{data.name}</td>
                                <td>{data.numberOfSessions}</td>
                                <td>{new Date(data.lastSession).toLocaleDateString()}</td>
                                <td>{data.hoursTutored}</td>
                                <td>{data.numRecurringSessions}</td>
                                <td>{data.revenueGenerated}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Row>
        </Container>
    );
}

export default TutorDataDashboard;