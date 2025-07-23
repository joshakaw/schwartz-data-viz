import React, { FC, useEffect, useState } from 'react';
import './TutorDataDashboard.css';
import { Col, Container, Row, Table, Form } from 'react-bootstrap';
import Select, { SingleValue } from 'react-select';
import DateRangePicker from '../../DateRangePicker/DateRangePicker';
import { DateRange } from 'react-day-picker';
import { School, subjectOptions, sortByOptions, sortByOptionsType } from '../../../utils/input-fields';
import { TutorLeaderboardRequestDTO } from '../../../dtos/TutorLeaderboardRequestDTO';
import { TutorLeaderboardResponseDTO } from '../../../dtos/TutorLeaderboardResponseDTO';
import instance from '../../../utils/axios';

// Will set to proper DTO when it is complete.
interface TutorDataDashboardProps { }

const TutorDataDashboard: FC<TutorDataDashboardProps> = () => {
    const [tableData, setData] = useState<TutorLeaderboardResponseDTO[]>([]);
    const [sortBy, setSortBy] = useState<SingleValue<{value: string, label: string}>>();
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        to: new Date(),
        from: new Date(new Date().valueOf() - 1000 * 60 * 60 * 24 * 6)
    });

    const [selectedSession, setSelectedSession] = useState<string>('Sessions');
    const [sessionRange, setSessionRange] = useState<string | undefined>(undefined);

    const changeSortBy = (selected: SingleValue<{ value: sortByOptionsType, label: string }>) => {
        setSortBy(selected);
    }

    async function getData() {
        const req: TutorLeaderboardRequestDTO = {
            startDate: dateRange?.from ? dateRange.from.toISOString() : undefined,
            endDate: dateRange?.to ? dateRange.to.toISOString() : undefined,
            sortBy: sortBy == null ? 'hours' : sortBy.value as sortByOptionsType, // lineSetup == null ? 'week' : lineSetup.value as weekMonthYear,
            subjects: undefined,
            locations: undefined
        }

        // Leave this here for further debugging purposes
        // console.log(req);

        const response = await instance.get<Array<TutorLeaderboardResponseDTO>>("/tutorData/leaderboard", { params: req });
        setData(response.data);
    }

    useEffect(() => {
        getData();
    }, [dateRange])

    useEffect(() => {
        if (sortBy) {
            getData();
        }
    }, [sortBy])

    return (
        <Container>
            <Row>
                <h1>Tutor Data Dashboard</h1>
                <p>Welcome to the Tutor Data Dashboard. *put description here*</p>
            </Row>
            <Row style={{ background: 'linear-gradient(to bottom, #F5F5F5, #FFFFFF)', paddingBottom: '2rem' }} className="rounded">
                <Col style={{ paddingTop: 10 }} md={9}>
                    <Select
                        placeholder='Sort by...'
                        options={sortByOptions}
                        onChange={setSortBy}
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