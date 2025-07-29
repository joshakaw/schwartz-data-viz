import React, { FC, FormEvent, useEffect, useState } from 'react';
import './TutorDataDashboard.css';
import { Col, Container, Row, Table, Form, Modal, Button } from 'react-bootstrap';
import Select, { SingleValue } from 'react-select';
import DateRangePicker from '../../DateRangePicker/DateRangePicker';
import { DateRange } from 'react-day-picker';
import { School, subjectOptions, sortByOptions, sortByOptionsType } from '../../../utils/input-fields';
import { TutorLeaderboardRequestDTO } from '../../../dtos/TutorLeaderboardRequestDTO';
import { TutorLeaderboardResponseDTO } from '../../../dtos/TutorLeaderboardResponseDTO';
import instance from '../../../utils/axios';
import TutorDetailComponent from '../../TutorDetailComponent/TutorDetailComponent'

// Will set to proper DTO when it is complete.
interface TutorDataDashboardProps { }

const TutorDataDashboard: FC<TutorDataDashboardProps> = () => {
    const [tableData, setData] = useState<TutorLeaderboardResponseDTO[]>([]);
    const [sortBy, setSortBy] = useState<SingleValue<{value: string, label: string}>>();
    const [dateRange, setDateRange] = useState<DateRange>({
        to: new Date(),
        from: new Date(new Date().valueOf() - 1000 * 60 * 60 * 24 * 6)
    });

    const [selectedSession, setSelectedSession] = useState<string>('Sessions');
    const [sessionRange, setSessionRange] = useState<string | undefined>(undefined);

    const [showModal, setShowModal] = useState(false);
    const [currTutorID, setTutorID] = useState<number>(0);
    const [name, setName] = useState<string>('');

    const changeName = (selected: FormEvent<HTMLInputElement>) => {
        setName(selected.currentTarget.value);
    }

    async function getData() {
        const req: TutorLeaderboardRequestDTO = {
            startDate: dateRange?.from ? dateRange.from.toISOString() : undefined,
            endDate: dateRange?.to ? dateRange.to.toISOString() : undefined,
            sortBy: sortBy == null ? 'hours' : sortBy.value as sortByOptionsType, // lineSetup == null ? 'week' : lineSetup.value as weekMonthYear,
            tutorNameSearch: name.length > 0 ? name : undefined,
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

    // Handle debounce for freeResponseSearchKeyword input
    useEffect(() => {
        const debounceFunction = setTimeout(() => {
            console.log('hi');
            getData();
        }, 1000);

        return () => {
            clearTimeout(debounceFunction); // Prevents previous from triggering
        };
    }, [name]);

    const handleModalOpen = (id: number) => {
        setTutorID(id);
        setShowModal(true);
    }
    const handleModalClose = () => setShowModal(false);

    return (
        <Container>
            <Modal show={showModal} onHide={handleModalClose} size="lg">
                <Modal.Header closeButton>
                    Tutor Details
                </Modal.Header>
                <Modal.Body>
                    <TutorDetailComponent tutorId={currTutorID} datesPicked={dateRange} />
                </Modal.Body>
            </Modal>
            <Row>
                <h1>Tutor Data Dashboard</h1>
                <p>Welcome to the Tutor Data Dashboard. *put description here*</p>
            </Row>
            <Row style={{ background: 'linear-gradient(to bottom, #F5F5F5, #FFFFFF)', paddingBottom: '2rem' }} className="rounded">
                <Col style={{ paddingTop: 10 }} md={4}>
                    <Form.Label>Sort by:</Form.Label>
                    <Select
                        placeholder='Select...'
                        options={sortByOptions}
                        onChange={setSortBy}
                    />
                </Col>
                <Col style={{ paddingTop: 10 }} md={4}>
                    <Form.Label>Name Search:</Form.Label>
                    <Form.Control type="text" onChangeCapture={changeName} />
                </Col>
                <Col style={{ paddingTop: 10 }} md={4}>
                    <Form.Label>Date Range:</Form.Label>
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
                            <th>Avg Hrs/WK</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((data) => (
                            <tr key={data.name}>

                                {/*In the future, clicking the name will open 
                                    TutorDetail modal with data.tutorId as an input*/}
                                <td><u style={{ color: '#0000EE', cursor: 'pointer' }} onClick={() => handleModalOpen(data.tutorId)}>{data.name}</u></td>
                                <td>{data.numberOfSessions}</td>
                                <td>{new Date(data.lastSession).toLocaleDateString()}</td>
                                <td>{data.hoursTutored}</td>
                                <td>{data.numRecurringSessions ? data.numRecurringSessions : "-"}</td>
                                <td>{data.revenueGenerated}</td>
                                <td>{data.avgHoursPerWeek.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Row>
        </Container>
    );
}

export default TutorDataDashboard;