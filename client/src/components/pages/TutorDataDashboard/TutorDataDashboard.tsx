// @ts-ignore
import React, { FC, FormEvent, useEffect, useState } from 'react';
import './TutorDataDashboard.css';
// @ts-ignore
import { Col, Container, Row, Table, Form, Modal, Button } from 'react-bootstrap';
// @ts-ignore
import Select, { SingleValue } from 'react-select';
import DateRangePicker from '../../DateRangePicker/DateRangePicker';
import { DateRange } from 'react-day-picker';
// @ts-ignore
import { School, subjectOptions, sortByOptions, sortByOptionsType } from '../../../utils/input-fields';
import { TutorLeaderboardRequestDTO } from '../../../dtos/TutorLeaderboardRequestDTO';
import { TutorLeaderboardResponseDTO } from '../../../dtos/TutorLeaderboardResponseDTO';
import instance from '../../../utils/axios';
import TutorDetailComponent from '../../TutorDetailComponent/TutorDetailComponent'
import DataTable, { TableColumn } from 'react-data-table-component';
// @ts-ignore
import { FaSort } from 'react-icons/fa';

interface TutorDataDashboardProps { }

const TutorDataDashboard: FC<TutorDataDashboardProps> = () => {
    const [tableData, setData] = useState<TutorLeaderboardResponseDTO[]>([]);
    // @ts-ignore
    const [sortBy, setSortBy] = useState<SingleValue<{value: string, label: string}>>();
    const [dateRange, setDateRange] = useState<DateRange>({
        to: new Date(),
        from: new Date(new Date().valueOf() - 1000 * 60 * 60 * 24 * 6)
    });

    // What is this for?
    // @ts-ignore
    const [selectedSession, setSelectedSession] = useState<string>('Sessions');
    // @ts-ignore
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

    // For react-data-table-component
    const cols: TableColumn<TutorLeaderboardResponseDTO>[] = [
        {
            name: 'Name*',
            selector: row => row.name,
            format: (cell) => <u style={{ color: '#0000EE', cursor: 'pointer' }} onClick={() => handleModalOpen(cell.tutorId)}>{cell.name}</u>,
            sortable: true
        },
        {
            name: '# of Sessions*',
            selector: row => row.numberOfSessions,
            sortable: true,
        },
        {
            name: 'Last Session*',
            selector: row => row.lastSession,
            sortable: true
        },
        {
            name: 'Hrs Tutored*',
            selector: row => row.hoursTutored,
            sortable: true
        },
        {
            name: '# of Recurring Sessions*',
            selector: row => row.numRecurringSessions,
            sortable: true
        },
        {
            name: 'Revenue Generated*',
            selector: row => row.revenueGenerated,
            sortable: true
        },
        {
            name: 'Avg Hrs/WK*',
            selector: row => row.avgHoursPerWeek.toFixed(2),
            sortable: true
        }
    ]

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
            getData();
        }, 1000);

        return () => {
            clearTimeout(debounceFunction); // Prevents previous from triggering
        };
    }, [name]);

    // Makes sure the modal opens and closes as needed
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
                <p>Welcome to the Tutor Data Dashboard. Here you can view the performance of tutors and review specific tutor metrics.</p>
            </Row>
            <Row style={{ background: 'linear-gradient(to bottom, #F5F5F5, #FFFFFF)', paddingBottom: '2rem' }} className="rounded">
                <Col style={{ paddingTop: 10 }} md={6}>
                    <Form.Label>Name Search:</Form.Label>
                    <Form.Control type="text" onChangeCapture={changeName} placeholder='Type Name Here...'/>
                </Col>
                <Col style={{ paddingTop: 10 }} md={4}>
                    <Form.Label>Date Range:</Form.Label>
                    <DateRangePicker value={dateRange} onChange={setDateRange} />
                </Col>
            </Row>
            <Row>
                <p style={{ fontSize:'12px', color:'gray'}}>* indicates sortable.</p>
                <DataTable
                    columns={cols}
                    data={tableData}
                    pagination
                />
            </Row>
        </Container>
    );
}

export default TutorDataDashboard;