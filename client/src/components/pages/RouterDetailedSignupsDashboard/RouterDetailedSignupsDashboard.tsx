import { FC, FormEvent, useEffect, useRef, useState } from 'react';
import './RouterDetailedSignupsDashboard.css';
import SignupDataTable from '../../signupDataTable/signupDataTable';
import { DetailedSignupResponseDTO } from '../../../dtos/DetailedSignupResponseDTO';
import { DetailedSignupRequestDTO } from '../../../dtos/DetailedSignupRequestDTO';
import instance from '../../../utils/axios';
import { Col, Container, Row, Form, FormControlProps } from 'react-bootstrap';
import Select, { MultiValue } from 'react-select';
import { School, signupOptions, userOptions } from '../../../utils/input-fields';
import { DateRange } from 'react-day-picker';
import CsvDownloadButton from 'react-json-to-csv';

interface RouterDetailedSignupsDashboardProps { }

const RouterDetailedSignupsDashboard: FC<RouterDetailedSignupsDashboardProps> = () => {
    const [sessionRange, setSessionRange] = useState<string | null>(null);
    const [signupMethodCategories, setsignupMethodCategories] = useState<MultiValue<{ value: string, label: string }>>([]);
    const [freeResponseSearchKeyword, setfreeResponseSearchKeyword] = useState<string>('');
    const [accountType, setAccountType] = useState<MultiValue<{ value: string, label: string }>>([]);
    const [educationLevel, seteducationLevel] = useState <MultiValue<{ value: string, label: string }>>([]);
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        to: new Date(),
        from: new Date(new Date().valueOf() - 1000 * 60 * 60 * 24 * 6)
    });
    const [resJson, setResJson] = useState<Array<DetailedSignupResponseDTO>>([]);
    const [loading, setLoading] = useState(true);

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
        setLoading(true);
        const methodList = signupMethodCategories.map(opt => opt.value);
        const userList = accountType.map(opt => opt.value);
        const educationList = educationLevel.map(opt => opt.value);

        const jsonReq: DetailedSignupRequestDTO = {
            signupMethodCategories: methodList,
            freeResponseSearchKeyword: freeResponseSearchKeyword ? freeResponseSearchKeyword : undefined,
            startDate: dateRange?.from ? dateRange.from.toISOString() : undefined,
            endDate: dateRange?.to ? dateRange.to.toISOString() : undefined,
            accountType: userList,
            educationLevel: educationList,
            pageIndex: 0,
            pageSize: 10
        }

        instance.get("/detailedSignupsDashboard/table", { params: jsonReq }).then((response) => {
            setResJson(response.data);
        }).catch((err) => {
            console.error("API Error:", err);
        }).finally(() => {
            setLoading(false);
        });
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

    const changeKeyword = (selected: FormEvent<HTMLInputElement>) => {
        setfreeResponseSearchKeyword(selected.currentTarget.value);
    }

    //useEffect(() => {
    //    getData();
    //}, []);

    useEffect(() => {
        if (dateRange) getData();
    }, [dateRange]);

    useEffect(() => {
        if (signupMethodCategories) getData();
    }, [signupMethodCategories]);

    useEffect(() => {
        if (accountType) getData();
    }, [accountType]);

    useEffect(() => {
        if (educationLevel) getData();
    }, [educationLevel]);

    // Handle debounce for freeResponseSearchKeyword input
    useEffect(() => {
        const debounceFunction = setTimeout(() => {
            getData();
        }, 1000);
        
        return () => {
            clearTimeout(debounceFunction); // Prevents previous from triggering
        };
    }, [freeResponseSearchKeyword]);

    return (
        <Container>
            <h1>Signups Dashboard</h1>
            <p>Welcome to your Signup Dashboard. Here you can view performance of certain advertising and compare them.</p>
            <Row style={{ background: 'linear-gradient(to bottom, #F5F5F5, #FFFFFF)', paddingBottom: '2rem' }} className="rounded">
                <Col md={2}>
                    <Form.Label>Account Types:</Form.Label>
                    <Select
                        isMulti
                        options={userOptions}
                        placeholder='Select...'
                        className='inner-select'
                        onChange={changeUserType}
                    />
                </Col>
                <Col md={2}>
                    <Form.Label>Signup Methods:</Form.Label>
                    <Select
                        isMulti
                        options={signupOptions}
                        placeholder='Select...'
                        className='inner-select'
                        onChange={changeSignupMethods}
                    />
                </Col>
                <Col md={4}>
                    <Form.Group>
                        <Form.Label>Keyword: </Form.Label>
                        <Form.Control type="text" onChangeCapture={changeKeyword} />
                    </Form.Group>
                </Col>
                <Col md={2}>
                    <Form.Label>Education Level: </Form.Label>
                    <Select
                        isMulti
                        options={School}
                        placeholder='Select...'
                        className='inner-select'
                        onChange={changeEducationLevel}
                    />
                </Col>
                <Col className="d-flex align-items-center">
                    <CsvDownloadButton
                        className="export-button w-100 align-items-center"
                        delimiter=","
                        data={resJson}
                    />
                </Col>
                {/*<NotImplementedWarning message="Detailed Signups table will go here according to Dylan's Project Notes" />*/}
                </Row>
            <SignupDataTable data={resJson} loading={loading} />
        </Container>
    );
};

export default RouterDetailedSignupsDashboard;