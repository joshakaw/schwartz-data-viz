import React, { FC, useEffect, useRef, useState } from 'react';
import './RouterDetailedSignupsDashboard.css';
import Options from '../../../utils/bardata';
import DetailedSignupsOptions from './DetailedSignupsOptions/DetailedSignupsOptions';
import SignupDataTable from '../../signupDataTable/signupDataTable';
import { DetailedSignupResponseDTO } from '../../../dtos/DetailedSignupResponseDTO';
import { DetailedSignupRequestDTO } from '../../../dtos/DetailedSignupRequestDTO';
import instance from '../../../utils/axios';
import { Col, Container, Row, Form, Button, Overlay } from 'react-bootstrap';
import Select, { MultiValue } from 'react-select';
import { School, signupOptions, userOptions } from '../../../utils/input-fields';
import { DateRange, DayPicker } from 'react-day-picker';


interface RouterDetailedSignupsDashboardProps { }

const RouterDetailedSignupsDashboard: FC<RouterDetailedSignupsDashboardProps> = () => {
    const [sessionRange, setSessionRange] = useState<string | null>(null);
    const [signupMethodCategories, setsignupMethodCategories] = useState<MultiValue<{ value: string, label: string }>>([]);
    const [freeResponseSearchKeyword, setfreeResponseSearchKeyword] = useState<string>('');
    const [accountType, setAccountType] = useState<MultiValue<{ value: string, label: string }>>([]);
    const [educationLevel, seteducationLevel] = useState <MultiValue<{ value: string, label: string }>>([]);
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        to: new Date(),
        from: new Date(new Date().valueOf() - 1000 * 60 * 60 * 24 * 7)
    });
    const [resJson, setResJson] = useState<Array<DetailedSignupResponseDTO>>([]);

    // Wanna keep this here if there's a reason Tyler set this up seperately
    //const reqData: DetailedSignupRequestDTO = {
    //    pageIndex: 0,
    //    pageSize: 10
    //}

    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const datePickerTarget = useRef(null);

    //console.log(reqData);
    //console.log(resJson);

    //try {
    //    const response = instance.get("detailedSignupsDashboard/table", { params: reqData }).then((response) => {
    //        setResJson(response.data);
    //    })

    //} catch (err) {
    //    console.error("API error:", err);
    //}

    // Fetches data for the data table
    function getData() {
        const methodList = signupMethodCategories.map(opt => opt.value);
        const userList = accountType.map(opt => opt.value);
        const educationList = educationLevel.map(opt => opt.value);

        const jsonReq: DetailedSignupRequestDTO = {
            signupMethodCategories: methodList,
            freeResponseSearchKeyword: '',
            startDate: dateRange?.from ? dateRange.from.toISOString() : undefined,
            endDate: dateRange?.to ? dateRange.to.toISOString() : undefined,
            accountType: userList,
            educationLevel: educationList,
            pageIndex: 0,
            pageSize: 10
        }

        console.log("Request: ", jsonReq);

        try {
            instance.get("/detailedSignupsDashboard/table", { params: jsonReq }).then((response) => {
                console.log("Response: ", response.data);
                setResJson(response.data);
            })
        } catch (err) {
            console.error("API Error:", err);
        }
    }

    // Calls for filter changes
    const changeDates = (selected: DateRange | undefined) => {
        setDateRange(selected);
    }

    const changeSignupMethods = (selected: MultiValue<{ value: string, label: string }>) => {
        setsignupMethodCategories(selected);
    }

    const changeUserType = (selected: MultiValue<{ value: string, label: string }>) => {
        setAccountType(selected);
    }

    const changeEducationLevel = (selected: MultiValue<{ value: string, label: string }>) => {
        seteducationLevel(selected);
    }

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        if (dateRange) getData();
        getData();
    }, [dateRange]);

    useEffect(() => {
        if (signupMethodCategories) getData();
        getData();
    }, [signupMethodCategories]);

    useEffect(() => {
        if (accountType) getData();
        getData();
    }, [accountType]);

    useEffect(() => {
        if (educationLevel) getData();
        getData();
    }, [educationLevel]);

    return (
        <Container>
            <Row style={{ paddingBottom: '2rem' }}>
                <Col md={3}>
                    <Form.Label>Signup Methods:</Form.Label>
                    <Select
                        isMulti
                        options={signupOptions}
                        placeholder='Please select signup method(s)'
                        className='inner-select'
                        onChange={changeSignupMethods}
                    />
                </Col>
                <Col md={3}>
                    <Form.Label>Account Types:</Form.Label>
                    <Select
                        isMulti
                        options={userOptions}
                        placeholder='Please select account type(s)'
                        className='inner-select'
                        onChange={changeUserType}
                    />
                </Col>
                <Col md={3}>
                    <Form.Label>Education Level: </Form.Label>
                    <Select
                        isMulti
                        options={School}
                        placeholder='Please select education level'
                        className='inner-select'
                        onChange={changeEducationLevel}
                    />
                </Col>
                <Col>
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
                </Col>
            </Row>
            <div className="RouterDetailedSignupsDashboard">
                <SignupDataTable data={resJson} />
            </div>
        </Container>
    );
};

export default RouterDetailedSignupsDashboard;

