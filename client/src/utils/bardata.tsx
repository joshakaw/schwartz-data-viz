// utils/data.ts\

// The more I think about this, I may need to make a SQL call here when getting the data.

// Both this and SignupData will be cobbled together via server call. A list of signups will need to be created for a given timeframe which will then be funneled into this.
// BarChart.tsx will not change. only thing changing is the data on it. which is currently supplied here

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Select from 'react-select';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import { Overlay } from 'react-bootstrap';

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

const Options = () => {
    const [timeframe, setTimeframe] = useState<Date[] | undefined>();
    const [userType, setUserType] = useState("default");
    const [schoolType, setSchoolType] = useState("default");
    const [signupType, setSignupType] = useState("default");

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

    //useEffect(() => {
    //    const filteredSignups: Signup[] = signups.filter(signup => {
    //        const now = new Date();
    //        const daysAgo = timeframe !== "default" ? parseInt(timeframe) : null;
    //        const withinTimeframe = daysAgo ? (now.getTime() - signup.date.getTime()) / (1000 * 60 * 60 * 24) <= daysAgo : true;
    //        const matchesUserType = userType === "default" || signup.userType === userType;

    //        return withinTimeframe && matchesUserType;
    //    });

    //    const filteredData = filteredSignups.reduce((acc, signup) => {
    //        const existingCategory = acc.find(data => data.category === signup.category);
    //        if (existingCategory) {
    //            existingCategory.signups += 1;
    //        } else {
    //            acc.push({ category: signup.category, signups: 1 });
    //        }
    //        return acc;
    //    }, [] as SignupData[]);

    //    setRawSignupData(filteredData);
    //    console.log("Chart Data:", rawSignupData);
    //}, [timeframe, userType]);

    // Not putting this with the other ones since this isn't related to data stuff.
    const [isOpen, setOpen] = useState(false);

    return (
        <Container fluid>
            <h1>Filters</h1>
            <Row>
                <Col md={4}>
                    <Form.Label>Signup Methods:</Form.Label>
                    <Select
                        options={Signup}
                        placeholder='Please select signup method'
                        className='inner-select'
                    />
                </Col>
                <Col md={4}>
                    <Form.Label>Account Types:</Form.Label>
                    <Select
                        options={User}
                        isMulti
                        placeholder='Please select account type(s)'
                        className='inner-select'
                    />
                </Col>
                <Col md={4}>
                    <Form.Label>School type: </Form.Label>
                    <Select
                        options={School}
                        placeholder='Please select school type'
                        className='inner-select'
                    />
                </Col>
            </Row>

            <Row>
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
            </Row>
        </Container>
    );
}

export default Options;