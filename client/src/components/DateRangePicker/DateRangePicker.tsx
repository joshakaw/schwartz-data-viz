import { FC, useRef, useState } from 'react';
import { Button, ButtonGroup, Dropdown, Form, Overlay } from 'react-bootstrap';
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
    const presetDateRangeSelected = (selected: string | null) => {
        const option = rangeOptions.find(opt => opt.value === selected);
        if (option) {
            const from = new Date();
            if (option.value == "7") {
                from.setDate(from.getDate() - 7);
                onChange({ from: from, to: new Date() });
            }
            if (option.value == "14") {
                from.setDate(from.getDate() - 14);
                onChange({ from: from, to: new Date() });
            }
            if (option.value == "30") {
                from.setDate(from.getDate() - 30);
                onChange({ from: from, to: new Date() });
            }
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
                <Dropdown as={ButtonGroup} onSelect={presetDateRangeSelected}>
                    <Button ref={datePickerTarget} variant="primary" onClick={() => setDatePickerOpen(!datePickerOpen)} style={{ backgroundColor: "#DC5E2C", borderColor: "transparent" }}>
                        {value ? value.from?.toLocaleDateString() + " - " + value.to?.toLocaleDateString() : "Select Date Range"}
                    </Button>

                    <Dropdown.Toggle split variant="preset" id="dropdown-split-basic" style={{ color: "white", backgroundColor: "#C25529", }}/>

                    <Dropdown.Menu>
                        {rangeOptions.map(option => (
                            <Dropdown.Item key={option.value} eventKey={option.value}>
                                {option.label}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>

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
        </>
    );
};

export default DateRangePicker;