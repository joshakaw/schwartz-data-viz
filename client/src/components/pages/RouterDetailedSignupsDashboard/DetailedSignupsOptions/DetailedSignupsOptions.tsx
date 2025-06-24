import { FC } from 'react';
import './DetailedSignupsOptions.css';

import { useState, useRef } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Select, { MultiValue } from 'react-select';
import { DateRange, DayPicker } from 'react-day-picker';
import { Overlay } from 'react-bootstrap';
import { userOptions, signupOptions, School } from '../../../../utils/input-fields'


interface DetailedSignupsOptionsProps { }

const DetailedSignupsOptions: FC<DetailedSignupsOptionsProps> = () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        to: new Date(),
        from: new Date(new Date().valueOf() - 1000 * 60 * 60 * 24 * 7)
    });
    const [userTypes, setUserTypes] = useState<MultiValue<{ value: string, label: string }>>([]);
    const [schoolTypes, setSchoolTypes] = useState<MultiValue<{ value: string, label: string }>>([]);
    const [signupTypes, setSignupTypes] = useState<MultiValue<{ value: string, label: string }>>([]);;
    const [isOpen, setOpen] = useState(false);

    const target = useRef(null);

    const UserTypeChange = (selected: MultiValue<{ value: string, label: string }>) => {
        setUserTypes(selected);
        // SQL Call with new usertype and curr usertype
    };

    const SchoolChange = (selected: MultiValue<{ value: string, label: string }>) => {
        setSchoolTypes(selected);
        // SQL Call with new usertype and curr usertype
    };

    const signupChange = (selected: MultiValue<{ value: string, label: string }>) => {
        setSignupTypes(selected);
        // SQL Call with new usertype and curr usertype
    };

    function getData() {

    }

    return (
        <Container fluid style={{ marginBottom: "20px" }}>
            <h1>Filters</h1>
            <Row>
                <Col md={3}>
                    <Form.Label>Signup Methods:</Form.Label>
                    <Select
                        isMulti
                        options={signupOptions}
                        placeholder='Please select signup method'
                        className='inner-select'
                        onChange={signupChange}
                    />
                </Col>
                <Col md={3}>
                    <Form.Label>Account Types:</Form.Label>
                    <Select
                        isMulti
                        options={userOptions}
                        placeholder='Please select account type(s)'
                        className='inner-select'
                    />
                </Col>
                <Col md={3}>
                    <Form.Label>School type: </Form.Label>
                    <Select
                        isMulti
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

// Presuming Josh updates data to this.
export interface LineSignupData {
    date: number;
    socialMedSignups: number;
    physicalAdvSignups: number;
    friendRefSignups: number;
    emailCampaignSignups: number;
}

// Example raw data.
export const rawSignupData: SignupData[] = [
    { category: 'Social Media', signups: 15 },
    { category: 'Physical Advertising', signups: 10 },
    { category: 'Friend Referral', signups: 8 },
    { category: 'Email Campaign', signups: 12 }
];