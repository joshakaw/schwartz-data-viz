import { FC, useEffect, useRef, useState } from 'react';
import './RouterSignupsDashboard.css';
import BarChart from '../../bar-chart/bar-chart';
import { Button, Col, Form, Overlay, Row } from 'react-bootstrap';
import { DateRange, DayPicker } from 'react-day-picker';
import Select, { MultiValue } from 'react-select';
import { signupOptions, userOptions } from '../../../utils/input-fields';
import { SignupsByCategoryRequestDTO } from '../../../dtos/SignupsByCategoryRequestDTO';
import instance from '../../../utils/axios';
import { SignupData } from '../RouterDetailedSignupsDashboard/DetailedSignupsOptions/DetailedSignupsOptions';

interface RouterSignupsDashboardProps { }

const RouterSignupsDashboard: FC<RouterSignupsDashboardProps> = () => {
    const [data, setData] = useState<SignupData[]>([]);
    const [signupMethods, setSignupMethods] = useState<MultiValue<{ value: string, label: string }>>([]);
    const [user, setUser] = useState<MultiValue<{ value: string, label: string }>>([]);
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        to: undefined,
        from: undefined
    });
    const datePickerTarget = useRef(null);

    function getData() {
        const methodList = signupMethods.map(opt => opt.value);
        const userList = user.map(opt => opt.value);

        const reqJson: SignupsByCategoryRequestDTO = {
            signupMethodCategories: methodList.length > 0 ? methodList : ['Social Media', 'Physical Advertising', 'Friend Referral', 'Email Campaign'], // real value of select. also default values to fill graph onload.
            accountType: userList.length > 0 ? userList : ['Student', 'Tutor', 'Parent'],
            startDate: dateRange?.from ? dateRange.from.toISOString() : undefined,
            endDate: dateRange?.to ? dateRange.to.toISOString() : undefined
        }

        console.log(reqJson);

        instance.get("/signupDashboard/signupsByCategory", { params: reqJson }).then((response) => {
            console.log(response.data);
            setData(response.data as SignupData[]);
            console.log(data);
        })

        return data;
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

    // Loads default filter. Also has handlers for filters to prevent getData() being called before respective changes
    useEffect(() => {
        getData();
    }, [])

    useEffect(() => {
        if (signupMethods) {
            getData();
        }
    }, [signupMethods])

    useEffect(() => {
        if (dateRange) {
            getData();
        }
    }, [dateRange])

    useEffect(() => {
        if (user) {
            getData();
        }
    }, [user])

    return <div className="RouterSignupsDashboard">
        <div>
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
                <Form.Group>
                    <Form.Label className="w-100">Date Range:</Form.Label>
                    <Button ref={datePickerTarget} variant="primary" onClick={() => setDatePickerOpen(!datePickerOpen)}>
                        {dateRange ? dateRange.from?.toDateString() + " - " + dateRange.to?.toDateString() : "Select Date Range"}
                    </Button>
                    <Overlay target={datePickerTarget.current} show={datePickerOpen} placement="bottom">
                        {({
                            placement: _placement,
                            arrowProps: _arrowProps,
                            show: _show,
                            popper: _popper,
                            hasDoneInitialMeasure: _hasDoneInitialMeasure,
                            ...props
                        }) => (
                            <div
                                {...props}
                                style={{
                                    position: 'absolute',
                                    backgroundColor: 'white',
                                    padding: '2px 10px',
                                    //color: 'white',
                                    borderRadius: 3,
                                    ...props.style,
                                }}
                            >
                                <DayPicker animate mode="range" onSelect={(range) => changeDates(range)} selected={dateRange}></DayPicker>
                            </div>
                        )}
                    </Overlay>
                </Form.Group>
            </Form>
        </div>
        <BarChart sData={data} />
        <div>
            <Row style={{ backgroundColor: '#E0DFDE' }} className="rounded">
                <Col>
                    <p className="text-center">Total signups last week:</p>
                    <h1 className="text-center">1</h1>
                </Col>
                <Col>
                    <p className="text-center">Total signups this week:</p>
                    <h1 className="text-center">2</h1>
                </Col>
            </Row>
        </div>
        <div>
            
        </div>
    </div>
};

export default RouterSignupsDashboard;
