import { FC, useRef, useState } from 'react';
import './RouterSignupsDashboard.css';
import BarChart from '../../bar-chart/bar-chart';
import { Button, Form, Overlay } from 'react-bootstrap';
import { DateRange, DayPicker } from 'react-day-picker';
import Select from 'react-select';
import { signupOptions, userOptions } from '../../../utils/input-fields';
import NotImplementedWarning from '../../NotImplementedWarning/NotImplementedWarning';

interface RouterSignupsDashboardProps { }

const RouterSignupsDashboard: FC<RouterSignupsDashboardProps> = () => {

    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        to: undefined,
        from: undefined
    });
    const datePickerTarget = useRef(null);

    return <div className="RouterSignupsDashboard">
        <div>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Signup methods:</Form.Label>
                    <Select
                        options={signupOptions}
                        className='inner-select'
                        isMulti
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>User types:</Form.Label>
                    <Select
                        options={userOptions}
                        className='inner-select'
                        isMulti={false}
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
                                <DayPicker animate mode="range" onSelect={(range) => setDateRange(range)} selected={dateRange}></DayPicker>
                            </div>
                        )}
                    </Overlay>
                </Form.Group>
            </Form>

        </div>
        <BarChart />
        <NotImplementedWarning message="Summary box not completed." />
        <NotImplementedWarning message="Trend line chart not completed." />
    </div>
};

export default RouterSignupsDashboard;
