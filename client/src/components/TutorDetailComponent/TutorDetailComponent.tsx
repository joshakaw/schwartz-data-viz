// @ts-ignore
import React, { FC, useEffect, useState } from 'react';
import './TutorDetailComponent.css';
import instance from '../../utils/axios';
import DateRangePicker from '../DateRangePicker/DateRangePicker';
import { DateRange } from 'react-day-picker';
// @ts-ignore
import { Button, Card, Col, Nav, Row } from 'react-bootstrap';
import { Chart as ChartJS, ChartOptions } from 'chart.js'
import { Line } from 'react-chartjs-2';
import annotationPlugin, { AnnotationOptions } from 'chartjs-plugin-annotation';
import { TutorInfoRequestDTO } from '../../dtos/tutor_data/TutorInfoRequestDTO'
import { TutorInfoResponseDTO } from '../../dtos/tutor_data/TutorInfoResponseDTO'
import { TutorDetailKpiRequestDTO } from '../../dtos/tutor_data/TutorDetailKpiRequestDTO'
import { TutorDetailKpiResponseDTO } from '../../dtos/tutor_data/TutorDetailKpiResponseDTO'
import { TutorDetailChartRequestDTO } from '../../dtos/tutor_data/TutorDetailChartRequestDTO'
import { TutorDetailChartResponseDTO } from '../../dtos/tutor_data/TutorDetailChartResponseDTO'
import { dayWeekMonth } from '../../utils/input-fields'


// Register annotation
ChartJS.register(annotationPlugin)

interface TutorDetailComponentProps {
    tutorId: number;
    datesPicked: DateRange;
}

interface TestResponseDTO {
    value: boolean
}

const TutorDetailComponent: FC<TutorDetailComponentProps> = ({ tutorId, datesPicked }) => {
    // Handles the showing of the line as well as where the line is placed, alongside UI active elements
    const [activeButton, setActiveButton] = useState<number>(2);
    const [avgLine, setAvgLine] = useState<number>(2);
    const [showLine, setShowLine] = useState<boolean>(true);
    const [savedOption, setSavedOption] = useState<dayWeekMonth>('week');

    const [name, setName] = useState<string>('Fetching...');
    const [avgHrs, setAvgHrs] = useState<number>(0);
    const [numOfSessions, setNumOfSessions] = useState<number>(0);
    const [uniqueStudents, setUniqueStudents] = useState<number>(0);
    const [rescheduleRate, setRescheduleRate] = useState<number>(0);
    const [repeats, setRepeats] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);

    const [lineData, setLineData] = useState<TutorDetailChartResponseDTO>({ data: [] });

    // @ts-ignore
    const [testState, setTestState] = useState<TestResponseDTO>({ value: false });
    const [dateRange, setDateRange] = useState<DateRange>({
        to: datesPicked.to,
        from: datesPicked.from
    })

    const changeDates = (selected: DateRange) => {
        setDateRange(selected);
    }

    useEffect(function () {
        instance.get("/tutor-detail/test")
            .then(function (response) {
                setTestState(response.data as TestResponseDTO)
            })
            .catch(function (reason) {
                alert("Failed: " + reason)
            })
    }, [tutorId])

    const lineChartData = {
        labels: lineData?.data?.map(item => new Date(item.date).toLocaleDateString()),
        datasets: [
            {
                label: "Hours",
                data: lineData?.data?.map(item => item.sessionHours),
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                fill: true,
                tension: 0.4, // Smooth curve
            }
        ]
    }

    const lineChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            annotation: {
                annotations: {
                    line1: {
                        type: 'line',
                        yMin: avgLine, // The y-value where the line should be drawn
                        yMax: avgLine,
                        borderColor: 'rgb(255, 99, 132)',
                        borderWidth: 4,
                        label: {
                            display: true, // or "enabled: true" if using older versions
                            content: 'Minimum Expected Hours',
                            position: 'start', // or 'start', 'center'
                            backgroundColor: 'rgba(255, 99, 132, 0.8)',
                            color: 'white',
                            font: {
                                weight: 'bold'
                            },
                            padding: 6
                        },
                        display: showLine
                    },
                } satisfies Record<string, AnnotationOptions<'line'>>, 
            }
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    } satisfies ChartOptions<'line'>;

    // Handles showing average lines, option chosen, and reruns getData() to get data in accordance with current options
    function isActiveAggregationOption(option: string): boolean {
        // console.log(option);
        switch (option) {
            case "day":
                setShowLine(false);
                setSavedOption(option as dayWeekMonth);
                setActiveButton(1);
                getData(option);
                return false;
            case "week":
                setAvgLine(2);
                setShowLine(true);
                setSavedOption(option as dayWeekMonth);
                setActiveButton(2);
                getData(option);
                return true;
            case "month":
                setAvgLine(8.7);
                setShowLine(true);
                setSavedOption(option as dayWeekMonth);
                setActiveButton(3);
                getData(option);
                return false;
            default:
                throw new Error("Aggregation option not found!");
        }

    }

    async function getName() {
        const req: TutorInfoRequestDTO = {
            id: tutorId
        }

        const response = await instance.get<TutorInfoResponseDTO>("/tutorDetail/info", { params: req });
        setName(response.data.name);
    }

    async function getKPIs() {
        const req: TutorDetailKpiRequestDTO = {
            id: tutorId,
            startDate: dateRange?.from ? dateRange.from?.toISOString() : undefined,
            endDate: dateRange?.to ? dateRange.to?.toISOString() : undefined
        }

        const response = await instance.get<TutorDetailKpiResponseDTO>("/tutorDetail/kpis", { params: req });
        setAvgHrs(response.data.avgHoursPerWeek);
        setNumOfSessions(response.data.totalSessions);
        setUniqueStudents(response.data.uniqueStudents);
        setRepeats(response.data.repeatSessionCount);
        setTotal(response.data.totalSessions);
        setRescheduleRate((response.data.repeatSessionCount / response.data.totalSessions) * 100); // Prevents percentages from being displayed as 0.whatever
    }

    async function getChart(grouper: string) {
        const req: TutorDetailChartRequestDTO = {
            id: tutorId,
            groupBy: grouper as dayWeekMonth,
            startDate: dateRange?.from ? dateRange.from?.toISOString() : undefined,
            endDate: dateRange?.to ?dateRange.to?.toISOString() : undefined
        }

        // For some reason, this actually converts the data.
        const response = await instance.get("/tutorDetail/chart", { params: req });
        setLineData(response);
    }

    function getData(grouper: string) {
        getChart(grouper);
        getKPIs();
    }

    // Onload
    useEffect(() => {
        getName();
        getData('week');
        isActiveAggregationOption('week');
    }, [])

    useEffect(() => {
        getData(savedOption);
    }, [dateRange])

    // This only does getChart() as KPIs do not use the savedOption value
    useEffect(() => {
        getChart(savedOption);
    }, [savedOption])

    return (
        <div className="TutorDetailComponent container">

            {/*Title and date filter*/}
            <Row>
                <Col sm={4 }>
                    <div className="title">
                        { name }
                    </div>
                    <div className="subtitle">
                        Performance Report
                    </div>
                </Col>
                <Col sm={8} >
                    <Row>
                        <Col className="d-flex justify-content-sm-end">
                            <DateRangePicker value={dateRange} onChange={changeDates} zIndex={10000} />
                        </Col>
                    </Row>
                    <Row>
                        <Col className="agg-opts d-flex justify-content-sm-end">
                            <Button variant="link" onClick={() => isActiveAggregationOption("day")} className={`agg-btn ${activeButton === 1 ? "active" : ""}`}>By Day</Button>
                            <Button variant="link" onClick={() => isActiveAggregationOption("week")} className={`agg-btn ${activeButton === 2 ? "active" : ""}`}>By Week</Button>
                            <Button variant="link" onClick={() => isActiveAggregationOption("month")} className={`agg-btn ${activeButton === 3 ? "active" : ""}`}>By Month</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>

            {/*Chart*/}
            <Row>

                <Line data={lineChartData} options={lineChartOptions} style={{maxHeight: "50vh"}} />

            </Row>
            <br></br>
            {/*Stats*/}
            <Row>
                <Col sm={3}>
                    <Card style={{ width: "100%", height: "100%",  textAlign: "center" }}>
                        <Card.Body className="align-items-center">
                            <div className="stat">{ avgHrs.toFixed(2) }</div>
                            Average Hours Per Week
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm={3}>
                    <Card style={{ width: "100%", height: "100%",  textAlign: "center" }}>
                        <Card.Body className="align-items-center">
                            <div className="stat">{ numOfSessions }</div>
                            Total Number of Sessions
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm={3}>
                    <Card style={{ width: "100%", height: "100%", textAlign: "center" }}>
                        <Card.Body className="align-items-center">
                            <div className="stat">{ rescheduleRate.toFixed(2) }%</div>
                            Repeat Rate
                            <Row>
                                <p style={{ fontSize: '12px', color: 'gray' }}>{repeats} <span>&divide;</span> { total }</p>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm={3}>
                    <Card style={{ width: "100%", height: "100%", textAlign: "center" }}>
                        <Card.Body className="align-items-center">
                            <div className="stat">{ uniqueStudents }</div>
                            Number of Unique Students
                        </Card.Body>
                    </Card>
                </Col>
            </Row>


            {/*Current Tutor Id: {tutorId}<br />*/}
            {/*Test state: {testState.value ? "True" : "False" }*/}

        </div>
    )
}

export default TutorDetailComponent;
