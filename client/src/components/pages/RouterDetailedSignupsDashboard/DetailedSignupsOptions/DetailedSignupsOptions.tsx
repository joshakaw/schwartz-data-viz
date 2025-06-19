import React, { FC } from 'react';
import './DetailedSignupsOptions.css';

import { useState, useRef } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Select from 'react-select';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import { Overlay } from 'react-bootstrap';


interface DetailedSignupsOptionsProps { }

const DetailedSignupsOptions: FC<DetailedSignupsOptionsProps> = () => {
    const [timeframe, setTimeframe] = useState<Date[] | undefined>();
    const [userType, setUserType] = useState("default");
    const [schoolType, setSchoolType] = useState("default");
    const [signupType, setSignupType] = useState("default");
    const [isOpen, setOpen] = useState(false);


    const target = useRef(null);

    // const [rawSignupData, setRawSignupData] = useState<SignupData[]>([]);

    const UserTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setUserType(event.target.value);
        // SQL Call with new usertype and curr usertype
    };

    const SchoolChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        console.log(schoolType);
        setSchoolType(event.target.value);
        // SQL Call with new usertype and curr usertype
    };

    const SignupChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        alert(signupType);
        setSignupType(event.target.value);
        // SQL Call with new usertype and curr usertype
    };

    return (
        <Container fluid style={{ marginBottom: "20px" }}>
            <h1>Filters</h1>
            <Row>
                <Col md={3}>
                    <Form.Label>Signup Methods:</Form.Label>
                    <Select
                        options={Signup}
                        placeholder='Please select signup method'
                        className='inner-select'
                    />
                </Col>
                <Col md={3}>
                    <Form.Label>Account Types:</Form.Label>
                    <Select
                        options={User}
                        isMulti
                        placeholder='Please select account type(s)'
                        className='inner-select'
                    />
                </Col>
                <Col md={3}>
                    <Form.Label>School type: </Form.Label>
                    <Select
                        options={School}
                        placeholder='Please select school type'
                        className='inner-select'
                    />
                </Col>
                <Col>
                    <Form.Label>Date range: </Form.Label><br />
                    <Button ref={target} onClick={() => setOpen(!isOpen)}>Select Date Range</Button>
                    <Overlay target={target.current} show={isOpen} placement="bottom">
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
                                    backgroundColor: 'rgba(100, 20, 20, 1)',
                                    padding: '2px 10px',
                                    color: 'white',
                                    borderRadius: 3,
                                    ...props.style,
                                }}
                            >
                                <DayPicker animate mode="range"></DayPicker>
                            </div>
                        )}
                    </Overlay>
                </Col>
            </Row>
        </Container>
    );
}
export default DetailedSignupsOptions;


export interface SignupData {
    category: string;
    signups: number;
}

// Example raw data.
export const rawSignupData: SignupData[] = [
    { category: 'Social Media', signups: 15 },
    { category: 'Physical Advertising', signups: 10 },
    { category: 'Friend Referral', signups: 8 },
    { category: 'Email Campaign', signups: 12 }
];

const Signup = [
    { value: 'Social Media', label: 'Social Media' },
    { value: 'Physical Advertising', label: 'Physical Advertising' },
    { value: 'Friend Referral', label: 'Friend Referral' },
    { value: 'Email Campaign', label: 'Email Campaign' },
];

const User = [
    { value: 'Students', label: 'Students' },
    { value: 'Parents', label: 'Parents' },
    { value: 'Tutors', label: 'Tutors' }
];

const School = [
    { value: 'K-12', label: 'K-12' },
    { value: 'University', label: 'University' },
];