import { FC, useEffect, useRef, useState } from 'react';
import './RouterSignupsDashboard.css';
import BarChart from '../../bar-chart/bar-chart';
import SummaryBox from '../../summary-box/summary-box'
import { Button, Col, Container, Form, Overlay, Row } from 'react-bootstrap';
import { DateRange, DayPicker } from 'react-day-picker';
import Select, { MultiValue, SingleValue } from 'react-select';
import { signupOptions, userOptions, rangeOptions, organizeOptions, weekMonthYear } from '../../../utils/input-fields';
import { SignupsByCategoryRequestDTO } from '../../../dtos/SignupsByCategoryRequestDTO';
import instance from '../../../utils/axios';
import { SignupData } from '../RouterDetailedSignupsDashboard/DetailedSignupsOptions/DetailedSignupsOptions';
import { SignupLineChartRequestDTO } from '../../../dtos/SignupLineChartRequestDTO';
import { SignupSummaryBoxRequestDTO } from '../../../dtos/SignupSummaryBoxRequestDTO';
import LineChart from '../../line-chart/line-chart';
import { SignupsByCategoryResponseDTO } from '../../../dtos/SignupsByCategoryResponseDTO';
import { SignupLineChartResponseDTO } from '../../../dtos/SignupLineChartResponseDTO';
import DateRangePicker from '../../DateRangePicker/DateRangePicker';

interface RouterSignupsDashboardProps { }

type summaryData = {
    lastWeek: number;
    thisWeek: number;
}

const RouterSignupsDashboard: FC<RouterSignupsDashboardProps> = () => {
    const [data, setData] = useState<SignupsByCategoryResponseDTO[]>([]);
    const [lineData, setLineData] = useState<SignupLineChartResponseDTO[]>([]);
    const [signupMethods, setSignupMethods] = useState<MultiValue<{ value: string, label: string }>>([]);
    const [lineSetup, setLineSetup] = useState<SingleValue<{ value: string, label: string }>>(); // Handles the 'organize by week/month/year filters for linechart
    const [user, setUser] = useState<MultiValue<{ value: string, label: string }>>([]);
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        to: new Date(),
        from: new Date(new Date().valueOf() - 1000 * 60 * 60 * 24 * 7)
    });
    const datePickerTarget = useRef(null);
    const [summaryBoxData, setSummaryBoxData] = useState<summaryData>({
        lastWeek: 0,
        thisWeek: 0
    });

    let lastWeekNum = 0;
    let thisWeekNum = 0;

    function getData() {
        const methodList = signupMethods.map(opt => opt.value);
        const userList = user.map(opt => opt.value);

        const reqJson: SignupsByCategoryRequestDTO = {
            signupMethodCategories: methodList.length > 0 ? methodList : ['Social Media', 'Physical Advertising', 'Friend Referral', 'Email Campaign'], // real value of select. also default values to fill graph onload.
            accountType: userList.length > 0 ? userList : ['Student', 'Tutor', 'Parent'],
            startDate: dateRange?.from ? dateRange.from.toISOString() : undefined,
            endDate: dateRange?.to ? dateRange.to.toISOString() : undefined
        }

        instance.get("/signupDashboard/signupsByCategory", { params: reqJson }).then((response) => {
            setData(response.data as SignupsByCategoryResponseDTO[]);
            // console.log(data);
        })
    }

    function getLineData() {
        const methodList = signupMethods.map(opt => opt.value);
        const userList = user.map(opt => opt.value);

        const lineJson: SignupLineChartRequestDTO = {
            groupBy: lineSetup == null ? 'week' : lineSetup.value as weekMonthYear,
            signupMethodCategories: methodList.length > 0 ? methodList : ['Social Media', 'Physical Advertising', 'Friend Referral', 'Email Campaign'], // real value of select. also default values to fill graph onload.
            accountType: userList.length > 0 ? userList : ['Student', 'Tutor', 'Parent'],
            startDate: dateRange?.from ? dateRange.from.toISOString() : undefined,
            endDate: dateRange?.to ? dateRange.to.toISOString() : undefined
        }

        instance.get("/signupDashboard/lineChart", { params: lineJson }).then((response) => {
            // I'm gonna cast this to the other signupdata for the linechart. 
            // afterwards it will strip the data according to the filters.
            // e.g.if the filters only contain 2 signuptypes it will remove the other 2
            setLineData(response.data as SignupLineChartResponseDTO[]);
            // console.log(lineData);

            
        })
    }

    // Almost works. Race condition problem between instance gets
    function getSummaryData() {
        const methodList = signupMethods.map(opt => opt.value);
        const userList = user.map(opt => opt.value);


        const summaryBoxJsonLastWk: SignupSummaryBoxRequestDTO = {
            signupMethodCategories: methodList.length > 0 ? methodList : ['Social Media', 'Physical Advertising', 'Friend Referral', 'Email Campaign'], // real value of select. also default values to fill graph onload.
            accountType: userList.length > 0 ? userList : ['Student', 'Tutor', 'Parent'],
            startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
            endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString()
        }

        instance.get("/signupDashboard/summaryBox", { params: summaryBoxJsonLastWk }).then((response) => {
            lastWeekNum = response.data[0].signupCount;
            setSummaryBoxData({ lastWeek: lastWeekNum, thisWeek: thisWeekNum });
        })

        const summaryBoxJson: SignupSummaryBoxRequestDTO = {
            signupMethodCategories: methodList.length > 0 ? methodList : ['Social Media', 'Physical Advertising', 'Friend Referral', 'Email Campaign'], // real value of select. also default values to fill graph onload.
            accountType: userList.length > 0 ? userList : ['Student', 'Tutor', 'Parent'],
            startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
            endDate: new Date().toISOString()
        }

        instance.get("/signupDashboard/summaryBox", { params: summaryBoxJson }).then((response) => {
            thisWeekNum = response.data[0].signupCount;
            setSummaryBoxData({ lastWeek: lastWeekNum, thisWeek: thisWeekNum });
        })
    }

    const changeSignupMethods = (selected: MultiValue<{ value: string, label: string }>) => {
        setSignupMethods(selected);
    }

    const changeUser = (selected: MultiValue<{ value: string, label: string }>) => {
        setUser(selected);
    }

    const changeDates = (selected: DateRange | undefined) => {
        setDateRange(selected);
    }

    const changeLineSetup = (selected: SingleValue<{ value: weekMonthYear, label: string }>) => {
        setLineSetup(selected);
    }

    // This is a janky solution but it works.
    const presetDateRangeSelected = (selected: SingleValue<{ value: string, label: string }>) => {
        if (selected) {
            if (selected.value === "7")
                setDateRange({ from: new Date(new Date().valueOf() - 1000 * 60 * 60 * 24 * 7), to: new Date() });
            if (selected.value === "14")
                setDateRange({ from: new Date(new Date().valueOf() - 1000 * 60 * 60 * 24 * 14), to: new Date() });
            if (selected.value === "30")
                setDateRange({ from: new Date(new Date().valueOf() - 1000 * 60 * 60 * 24 * 30), to: new Date() });
        }
    }

    // Loads default filter. Also has handlers for filters to prevent getData() being called before respective changes
    useEffect(() => {
        getData();
        getLineData();
        getSummaryData();
    }, [])

    useEffect(() => {
        if (signupMethods) {
            getData();
            getSummaryData();
            getLineData();
        }
    }, [signupMethods])

    useEffect(() => {
        if (dateRange) {
            getData();
            getSummaryData();
            getLineData();
        }
    }, [dateRange])

    useEffect(() => {
        if (user) {
            getData();
            getSummaryData();
            getLineData();
        }
    }, [user])

    // Only calls getLineData since this has no bearing on other 2
    useEffect(() => {
        if (lineSetup) {
            getLineData();
        }
    }, [lineSetup]) 

    return <div className="RouterSignupsDashboard">
        <Container>
            <h1>Signups Dashboard</h1>
            <p>Welcome to your Signup Dashboard. Here you can view performance of certain advertising and compare them.</p>
            <Row>
                <Col md={3}>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Signup methods:</Form.Label>
                            <Select
                                options={signupOptions}
                                className='inner-select'
                                isMulti
                                onChange={(newValue) => changeSignupMethods(newValue)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>User types:</Form.Label>
                            <Select
                                options={userOptions}
                                className='inner-select'
                                isMulti
                                onChange={(newValue) => changeUser(newValue)}
                            />
                        </Form.Group>
                        <DateRangePicker value={dateRange} onChange={setDateRange} />
                    </Form>
                </Col>
                <Col>
                    <div style={{ background: 'linear-gradient(to bottom, #F5F5F5, #FFFFFF)', paddingBottom: '5rem' }} className="rounded">
                        <h2 style={{ paddingLeft: '0.5rem' }}>Summary</h2>
                        <SummaryBox sData={{ thisWeek: summaryBoxData?.thisWeek, lastWeek: summaryBoxData?.lastWeek }} />
                    </div>
                    <div style={{ background: 'linear-gradient(to bottom, #F5F5F5, #FFFFFF)' }} className="rounded">
                        <Row>
                            <Col>
                                <h2 style={{ paddingLeft: '0.5rem' }}>Graphs:</h2>
                            </Col>
                            <Col className="d-flex align-items-center justify-content-end">
                                <Form.Group>
                                    <Select
                                        options={organizeOptions}
                                        className='input-select'
                                        placeholder='Organize line chart data by...'
                                        onChange={changeLineSetup}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <BarChart sData={data} />
                            </Col>
                            <Col>
                                <LineChart sData={lineData} />
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        </Container>
    </div>
};

export default RouterSignupsDashboard;
