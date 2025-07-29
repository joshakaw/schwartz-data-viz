import { FC, useEffect, useRef, useState } from 'react';
import { Button, ButtonGroup, Dropdown, Form, Overlay } from 'react-bootstrap';
import { DateRange, DayPicker } from 'react-day-picker';
import "./DateRangePicker.css"

// Preset date range dropdown options
const rangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: '7', label: 'Last 7 Days' },
    { value: '14', label: 'Last 14 Days' },
    { value: 'thisMonth', label: 'This Month' },
    { value: '30', label: 'Last 30 Days' },
    { value: 'fallSemester', label: 'Fall Semester' },
    { value: 'springSemester', label: 'Spring Semester' },
    { value: 'lastYear', label: 'Last 365 Days' },
    { value: 'allTime', label: 'All Time' }
];

// Defines the properties this component expects from its parent.
interface DateRangePickerProps {
    value: DateRange | undefined;
    onChange: (dateRange: DateRange) => void;
    defaultOption?: string;
    zIndex?: number | 100;
}

const DateRangePicker: FC<DateRangePickerProps> = ({ value, onChange, defaultOption, zIndex }) => {
    const [openMenu, setOpenMenu] = useState<'calendar' | 'presets' | null>(null);
    const datePickerTarget = useRef(null);

    // Select defaultOption preset on mount, if defined
    useEffect(() => {
        if (defaultOption) {
            presetDateRangeSelected(defaultOption)
        }
    }, [])

    function isDateBefore(currDate: Date, targetDate: Date) {
        return currDate < targetDate;
    }

    const presetDateRangeSelected = (selected: string | null) => {
        const option = rangeOptions.find(opt => opt.value === selected);
        if (option) {
            let from: Date | undefined = new Date();
            let to: Date | undefined = new Date();

            switch (option.value) {
                case 'today':
                    from.setHours(0, 0, 0, 0);
                    to.setHours(23, 59, 59, 999);
                    break;

                case 'yesterday':
                    from.setDate(from.getDate() - 1);
                    from.setHours(0, 0, 0, 0);
                    to.setDate(to.getDate() - 1);
                    to.setHours(23, 59, 59, 999);
                    break;

                case 'thisMonth':
                    // Range from the first day of the month to the current date
                    from = new Date(to.getFullYear(), to.getMonth(), 1);
                    to = new Date();
                    break;

                case 'fallSemester':
                    // Range from August 15 to December 15 of the year
                    if (isDateBefore(new Date(), new Date(new Date().getFullYear(), 7, 15))) {
                        from = new Date(to.getFullYear() - 1, 7, 20);
                        to = new Date(to.getFullYear() - 1, 11, 20);
                    } else {
                        from = new Date(to.getFullYear(), 7, 20);
                        to = new Date(to.getFullYear(), 11, 20);
                    }
                    break;

                case 'springSemester':
                    // Range from January 15 to May 15 of the year
                    if (isDateBefore(new Date(), new Date(new Date().getFullYear(), 0, 15))) {
                        from = new Date(to.getFullYear() - 1, 0, 20);
                        to = new Date(to.getFullYear() - 1, 4, 20);
                    } else {
                        from = new Date(to.getFullYear(), 0, 20);
                        to = new Date(to.getFullYear(), 4, 20);
                    }
                    break;

                case 'lastYear':
                    // Range from the first day of the month to the current date
                    from.setDate(new Date().getDate() - 365);
                    to = new Date();
                    break;

                case 'allTime':
                    // Starts from: 09/14/2017 (beginning of Schwartz Tutoring)
                    from = new Date(2017, 8, 14);
                    to = new Date();
                    break;

                default:
                    const days = parseInt(option.value, 10);
                    from.setDate(from.getDate() - (days - 1));
                    from.setHours(0, 0, 0, 0);
                    to = new Date();
                    break;
            }

            onChange({ from, to });
            setOpenMenu(null);
        }
    };

    const handleCalendarToggle = () => {
        setOpenMenu(prev => (prev === 'calendar' ? null : 'calendar'));
    };

    const changeDates = (range: DateRange | undefined) => {
        if (typeof range == "undefined") {
            onChange({ to: undefined, from: undefined })
        } else {
            onChange(range);
        }
    };

    return (
        <div className="DateRangePicker">
            <Form.Group className="mb-3">
                <Dropdown
                    as={ButtonGroup}
                    onSelect={presetDateRangeSelected}
                    show={openMenu === 'presets'}
                    onToggle={(isOpen) => setOpenMenu(isOpen ? 'presets' : null)}
                >
                    <Button
                        ref={datePickerTarget}
                        variant="primary"
                        onClick={handleCalendarToggle}
                        className="button-section"
                    >
                        {value && typeof value.to != "undefined" ? `${value.from?.toLocaleDateString()} - ${value.to?.toLocaleDateString()}` : "Select Date Range"}
                    </Button>

                    <Dropdown.Toggle
                        split
                        variant="preset"
                        id="dropdown-split-basic"
                        className="dropdown-section"
                    />

                    <Dropdown.Menu>
                        {rangeOptions.map(option => (
                            <Dropdown.Item key={option.value} eventKey={option.value}>
                                {option.label}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>

                <Overlay
                    target={datePickerTarget.current}
                    show={openMenu === 'calendar'}
                    placement="bottom"
                >
                    {({ ...props }) => (
                        <div
                            {...props}
                            style={{
                                zIndex: zIndex,
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
        </div>
    );
};

export default DateRangePicker;