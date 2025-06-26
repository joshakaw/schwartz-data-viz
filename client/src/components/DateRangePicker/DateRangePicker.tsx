import { FC, useRef, useState } from 'react';
import { Button, Form, Overlay } from 'react-bootstrap';
import { DateRange, DayPicker } from 'react-day-picker';
import Select, { SingleValue } from 'react-select';

// Preset date range dropdown options
const rangeOptions = [
    { value: '7', label: 'Last 7 days' },
    { value: '14', label: 'Last 14 days' },
    { value: '30', label: 'Last 30 days' },
];

// Defines the properties this component expects from its parent.
interface DateRangePickerProps {
    value: DateRange | undefined;
    onChange: (dateRange: DateRange | undefined) => void;
}

const DateRangePicker: FC<DateRangePickerProps> = ({ value, onChange }) => {
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const datePickerTarget = useRef(null);

    // Handles selection from the preset dropdown
    const presetDateRangeSelected = (selected: SingleValue<{ value: string; label: string }>) => {
        if (selected) {
            const days = parseInt(selected.value, 10);
            const from = new Date();
            from.setDate(from.getDate() - days);
            onChange({ from: from, to: new Date() });
        }
    };

    // Handles date selection directly from the calendar.
    const changeDates = (range: DateRange | undefined) => {
        onChange(range);
    };

    return (
        <>
            <Form.Group className="mb-3">
                <Form.Label className="w-100">Date Range:</Form.Label>
                <Button ref={datePickerTarget} variant="primary" onClick={() => setDatePickerOpen(!datePickerOpen)}>
                    {value ? value.from?.toDateString() + " - " + value.to?.toDateString() : "Select Date Range"}
                </Button>
                <Overlay target={datePickerTarget.current} show={datePickerOpen} placement="bottom">
                    {({ ...props }) => (
                        <div
                            {...props}
                            style={{
                                position: 'absolute',
                                backgroundColor: 'white',
                                padding: '2px 10px',
                                borderRadius: 3,
                                ...props.style,
                            }}
                        >
                            <DayPicker mode="range" onSelect={changeDates} selected={value} />
                        </div>
                    )}
                </Overlay>
            </Form.Group>

            <Form.Group>
                <Form.Label>or use a preset date range:</Form.Label>
                <Select
                    options={rangeOptions}
                    className='input-select'
                    onChange={presetDateRangeSelected}
                />
            </Form.Group>
        </>
    );
};

export default DateRangePicker;