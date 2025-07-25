import React, { FC, useEffect, useState } from 'react';
import './TutorDetailComponent.css';
import instance from '../../utils/axios';
import DateRangePicker from '../DateRangePicker/DateRangePicker';
import { DateRange } from 'react-day-picker';
import { Button, Card, Col, Nav, Row } from 'react-bootstrap';
import { Chart as ChartJS } from 'chart.js'
import { Line } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';

// Register annotation
ChartJS.register(annotationPlugin)

interface TutorDetailComponentProps {
    tutorId: number;
}

interface TestResponseDTO {
    value: boolean
}

const TutorDetailComponent: FC<TutorDetailComponentProps> = ({ tutorId }) => {

    const [testState, setTestState] = useState<TestResponseDTO>({ value: false });
    const [dateRange, setDateRange] = useState<DateRange>({
        to: undefined,
        from: undefined
    })

    useEffect(function () {
        instance.get("/tutor-detail/test")
            .then(function (response) {
                setTestState(response.data as TestResponseDTO)
            })
            .catch(function (reason) {
                alert("Failed: " + reason)
            })
    }, [tutorId])

    // Test data
    const lineChartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Sessions',
                data: [5, 8, 6, 9, 4, 7, 3],
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                fill: true,
                tension: 0.4, // Smooth curve
            },
        ],
    };

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
                        yMin: 4, // The y-value where the line should be drawn
                        yMax: 4,
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
                        }
                    },
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    function isActiveAggregationOption(option: string): boolean {

        switch (option) {
            case "day":
                return false;
            case "week":
                return true;
            case "month":
                return false;
            default:
                throw new Error("Aggregation option not found!");
        }
    }

    return (
        <div className="TutorDetailComponent container">

            {/*Title and date filter*/}
            <Row>
                <Col sm={4 }>
                    <div className="title">
                        Tutor Name {tutorId }
                    </div>
                    <div className="subtitle">
                        Performance Report
                    </div>
                </Col>
                <Col sm={8} >
                    <Row>
                        <Col className="d-flex justify-content-sm-end">
                            <DateRangePicker value={dateRange} onChange={(dr) => setDateRange(dr)} defaultOption="thisMonth" />
                        </Col>
                    </Row>
                    <Row>
                        <Col className="agg-opts d-flex justify-content-sm-end">
                            <Button variant="link" active={isActiveAggregationOption("day")} className="agg-btn">By Day</Button>
                            <Button variant="link" active={isActiveAggregationOption("week")} className="agg-btn">By Week</Button>
                            <Button variant="link" active={isActiveAggregationOption("month")} className="agg-btn">By Month</Button>
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
                            <div className="stat">6.2</div>
                            Average Hours Per Week
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm={3}>
                    <Card style={{ width: "100%", height: "100%",  textAlign: "center" }}>
                        <Card.Body className="align-items-center">
                            <div className="stat">12</div>
                            Total Number of Sessions
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm={3}>
                    <Card style={{ width: "100%", height: "100%", textAlign: "center" }}>
                        <Card.Body className="align-items-center">
                            <div className="stat">84%</div>
                            Reschedule Rate
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm={3}>
                    <Card style={{ width: "100%", height: "100%", textAlign: "center" }}>
                        <Card.Body className="align-items-center">
                            <div className="stat">8</div>
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
