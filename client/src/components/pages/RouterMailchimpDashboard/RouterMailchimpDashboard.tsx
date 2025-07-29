// React and styling imports
import { FC, useState, useEffect } from 'react';
import './RouterMailchimpDashboard.css';
import 'react-dropdown-tree-select/dist/styles.css';

// Custom component imports
import AccountDataTable from '../../accountDataTable/accountDataTable';

// React component imports
import { Form, Col, Row, Container } from 'react-bootstrap';
import Select from 'react-select';
import ReactSelect from 'react-select';
import DropdownTreeSelect from "react-dropdown-tree-select";
import CsvDownloadButton from 'react-json-to-csv';
import Pagination from 'react-bootstrap/Pagination';
import CreatableSelect from 'react-select/creatable';

// Data handling and DTO imports
import instance from "../../../utils/axios";
import { MailchimpUsersRequestDTO } from "../../../dtos/MailchimpUsersRequestDTO";
import { MailchimpUserResponseDTO } from '../../../dtos/MailchimpUsersResponseDTO.ts';
import { ApiPaginatedResponse } from '../../../dtos/ApiPaginatedResponse.ts';
import { EducationLevelSchoolsResponseDTO } from '../../../dtos/EducationLevelSchoolsResponseDTO.ts';
import { OptionType } from '../../../utils/input-fields.ts';
import { getDefaultClassNames } from 'react-day-picker';
import { defaultProps } from 'react-select/base';

// Options for multi-select (account types)
const sessionOptions = [
    { value: '0', label: 'Student' },
    { value: '1', label: 'Parent' },
    { value: '2', label: 'Tutor' }
];

const RouterMailchimpDashboard: FC = () => {
    const [selectedSchool, setSelectedSchool] = useState<string>('');
    const [sessionRange, setSessionRange] = useState<string | undefined>(undefined);
    const [accountTypes, setAccountTypes] = useState<{ value: string, label: string }[]>([]);
    const [resJson, setResJson] = useState<ApiPaginatedResponse<MailchimpUserResponseDTO>>();
    const [fullData, setFullData] = useState<MailchimpUserResponseDTO[]>([]);
    const [schoolJson, setSchoolJson] = useState<EducationLevelSchoolsResponseDTO>();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [rowsOfData, setMaxRows] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);
    const [loading, setLoading] = useState(true);

    const getRequestParams = (pageIndex: number, pageSize: number, limit: number | undefined): MailchimpUsersRequestDTO => ({
        limit,
        pageIndex,
        pageSize,
        accountType: accountTypes.length > 0 ? accountTypes.map(opt => opt.label) : undefined,
        minNumberOfSessions: (() => {
            if (!sessionRange) return undefined;
            if (sessionRange === '0') return 0;
            if (sessionRange === '1-2') return 1;
            if (sessionRange === '3+') return 3;
            if (!isNaN(Number(sessionRange))) return Number(sessionRange);
            return undefined;
        })(),
        maxNumberOfSessions: (() => {
            if (!sessionRange) return undefined;
            if (sessionRange === '0') return 0;
            if (sessionRange === '1-2') return 2;
            return undefined;
        })(),
        startDate: undefined,
        endDate: undefined
    });

    const handleSubmit = async () => {
        setLoading(true);
        const fetchLimit = rowsOfData || 10000;
        const allParams = getRequestParams(0, fetchLimit, fetchLimit);

        try {
            const response = await instance.get("mailchimpDashboard/users", { params: allParams });
            const receivedData: ApiPaginatedResponse<MailchimpUserResponseDTO> = response.data;

            // Apply local filtering for selectedSchool
            // Currently filtering via client-side due to no request in dto
            // Does not work with session Range because of this
            // Must clear school in order to make session range work
            let data = receivedData.data;

            // If there is no value in the sessionRange filter, it won't sort the data by the sessionRange
            if (sessionRange === undefined) {
                setFullData(data);

                const paginatedSlice = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);
                setResJson({
                    data: paginatedSlice,
                    totalItems: data.length,
                    pageIndex: currentPage - 1,
                    pageSize
                });
            } else {
                // Sorts the data by ascending order from the min value of the sessionRange value
                const sortedData = [...data].sort((a, b) => (a.numSessions ?? 0) - (b.numSessions ?? 0));
                setFullData(sortedData);

                const paginatedSlice = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
                setResJson({
                    data: paginatedSlice,
                    totalItems: sortedData.length,
                    pageIndex: currentPage - 1,
                    pageSize
                });
            }

        } catch (err) {
            console.error("API error:", err);
        } finally {
            setLoading(false);
        }
    };

    // Sets the pagination to page one every time the page loads or refreshes
    useEffect(() => {
        setCurrentPage(1);
    }, [sessionRange, accountTypes, pageSize, selectedSchool]);

    // Handles the submit after any of the filters change
    useEffect(() => {
        handleSubmit();
    }, [currentPage, sessionRange, accountTypes, rowsOfData, pageSize, selectedSchool]);

    // Sets the data of the current paginated page
    useEffect(() => {
        if (!fullData.length) return;

        const paginatedSlice = fullData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
        setResJson({
            data: paginatedSlice,
            totalItems: fullData.length,
            pageIndex: currentPage - 1,
            pageSize
        });
    }, [currentPage, fullData]);

    // Makes sure that the form objects can't be submited via key press
    // The page would refresh and clear filters if enabled
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                const target = event.target as HTMLElement;
                const isInput = ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName);
                if (isInput) {
                    event.preventDefault();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // Grabs all of the unique school names from the account data
    // used for school select filter
    useEffect(() => {
        async function fetchSchools() {
            const res = await instance.get("/educationLevelSchools");
            const data = res.data;

            // Flatten schoolNames if it's nested
            // Helps with mapping to the select
            const flattenedSchoolNames = Array.isArray(data.schoolNames?.[0])
                ? data.schoolNames[0]
                : data.schoolNames;

            setSchoolJson({
                schoolNames: flattenedSchoolNames,
                schoolTypes: data.schoolTypes,
            });

            console.log(schoolJson);
        }

        fetchSchools();
    }, []);

    const schoolTreeData = [
        {
            label: 'Elementary Schools',
            value: 'elementary',
            children: [
                { label: 'James Elementary', value: 'james' },
                { label: 'Main Elementary', value: 'main' },
            ],
        },
        {
            label: 'Middle Schools',
            value: 'middle',
            children: [
                { label: `St. Mary's Middle`, value: 'stmarys' },
                { label: 'Oakwood Middle', value: 'oakwood' },
            ],
        },
        {
            label: 'High Schools',
            value: 'high',
            children: [
                { label: 'Lincoln High', value: 'lincoln' },
                { label: 'Jefferson High', value: 'jefferson' },
            ],
        },
        {
            label: 'College',
            value: 'college',
            children: [
                { label: 'Miami University', value: 'miami' },
                { label: 'University if Cincinati', value: 'cincinati' },
            ],
        },
    ];

    // Sets up the pagination based on the total amount of data and the set pages size
    const loadPagination = (totalItems: number | undefined, pageSizeNum: number) => {
        if (typeof totalItems === "undefined" || !totalItems) return null;
        const totalPages = Math.ceil(totalItems / pageSizeNum);

        // Array for all buttons in the pagination page selection bar
        const items = [];

        // Changes the page dynamically whenever a new option in the pagination bar is clicked
        const handlePageChange = (page: number) => {
            if (page < 1 || page > totalPages) return;
            setCurrentPage(page);
        };

        // Adds all of the buttons to the items array. (inludes: first, prev, all of the numbered pages, next, last)
        items.push(<Pagination.First key="first" onClick={() => handlePageChange(1)} />);
        items.push(<Pagination.Prev key="prev" onClick={() => handlePageChange(currentPage - 1)} />);

        if (totalPages <= 6) {
            for (let number = 1; number <= totalPages; number++) {
                items.push(
                    <Pagination.Item
                        key={number}
                        active={number === currentPage}
                        onClick={() => handlePageChange(number)}
                    >
                        {number}
                    </Pagination.Item>
                );
            }
        } else {
            for (let number = 1; number <= 2; number++) {
                items.push(
                    <Pagination.Item
                        key={number}
                        active={number === currentPage}
                        onClick={() => handlePageChange(number)}
                    >
                        {number}
                    </Pagination.Item>
                );
            }

            if (currentPage > 4) items.push(<Pagination.Ellipsis key="ellipsis-start" disabled />);
            if (currentPage > 2 && currentPage < totalPages - 1) {
                items.push(
                    <Pagination.Item key={currentPage} active onClick={() => handlePageChange(currentPage)}>
                        {currentPage}
                    </Pagination.Item>
                );
            }
            if (currentPage < totalPages - 3) items.push(<Pagination.Ellipsis key="ellipsis-end" disabled />);

            for (let number = totalPages - 1; number <= totalPages; number++) {
                items.push(
                    <Pagination.Item
                        key={number}
                        active={number === currentPage}
                        onClick={() => handlePageChange(number)}
                    >
                        {number}
                    </Pagination.Item>
                );
            }
        }

        items.push(<Pagination.Next key="next" onClick={() => handlePageChange(currentPage + 1)} />);
        items.push(<Pagination.Last key="last" onClick={() => handlePageChange(totalPages)} />);

        return items;
    };

    return (
        <Container>
            <Row>
                <div className="RouterMailchimpDashboard">
                    <h1>MailChimp Dashboard</h1>
                    <p>Welcome to your MailChimp Dashboard. Here you can view campaign stats, manage subscribers, and more.</p>
                </div>
            </Row>

            <div className="filter-form mb-2">
                <Row style={{ background: 'linear-gradient(to bottom, #F5F5F5, #FFFFFF)', paddingBottom: '2rem' }} className="rounded">
                    {/* Education Level Filter */}
                    <Col xs={12} md={4} lg={2}> 
                        <Form.Group className="mb-2">
                            <Form.Label>School</Form.Label>
                            <DropdownTreeSelect
                                data={schoolTreeData}
                                className="bootstrap-demo"
                            />
                        </Form.Group>
                    </Col>

                    {/*<Col xs={12} md={4} lg={2}>*/}
                    {/*    <Form.Group className="mb-2">*/}
                    {/*        <Form.Label>School</Form.Label>*/}
                    {/*        <Form.Select*/}
                    {/*            value={selectedSchool}*/}
                    {/*            onChange={(e) => {*/}
                    {/*                const val = e.target.value;*/}
                    {/*                setSelectedSchool(val);*/}
                    {/*            }}*/}
                    {/*        >*/}
                    {/*            <option value="">Select...</option>*/}
                    {/*            {schoolJson?.schoolNames?.map((school) => (*/}
                    {/*                <option key={`${school.schoolName}`} value={school.schoolName}>*/}
                    {/*                    {school.schoolName}*/}
                    {/*                </option>*/}
                    {/*            ))}*/}
                    {/*        </Form.Select>*/}
                    {/*    </Form.Group>*/}
                    {/*</Col>*/}

                    {/* Account Type Filter */}
                    <Col xs={12} md={4} lg={2}>
                        <Form.Group className="mb-2">
                            <Form.Label>Account Type</Form.Label>
                            <Select
                                options={sessionOptions}
                                isMulti
                                className="inner-select"
                                onChange={(selected) => setAccountTypes(selected as any)}
                                value={accountTypes}
                            />
                        </Form.Group>
                    </Col>

                    {/* Session Range Filter */}
                    <Col xs={12} md={4} lg={2}>
                        <Form.Group className="sessions-multi-select mb-2">
                            <Form.Label>Num of Sessions</Form.Label>
                            <CreatableSelect
                                isClearable
                                value={sessionRange ? { value: sessionRange, label: sessionRange } : null}
                                onChange={(selected) => {
                                    const rawVal = selected?.value || '';
                                    const isPredefined = ['0', '1-2', '3+'].includes(rawVal);
                                    if (isPredefined) {
                                        setSessionRange(rawVal);
                                    } else {
                                        const numericOnly = rawVal.replace(/\D/g, '');
                                        if (numericOnly) {
                                            setSessionRange(numericOnly);
                                        } else {
                                            setSessionRange(undefined);
                                        }
                                    }
                                }}
                                options={[
                                    { value: '0', label: '0' },
                                    { value: '1-2', label: '1-2' },
                                    { value: '3+', label: '+3' }
                                ]}
                            />
                        </Form.Group>
                    </Col>

                    {/* Page Size Filter */}
                    <Col xs={12} md={6} lg={2}>
                        <Form.Group className="mb-2">
                            <Form.Label>Records Per Page</Form.Label>
                            <Form.Select
                                value={pageSize}
                                onChange={(e) => setPageSize(Number(e.target.value))}
                            >
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    {/* Record/Data Limit Filter */}
                    <Col xs={12} md={6} lg={2}>
                        <Form.Group controlId="minSessions" className="mb-2">
                            <Form.Label>Records Limit</Form.Label>
                            <Form.Control
                                type="number"
                                min={0}
                                value={rowsOfData}
                                onChange={(e) => setMaxRows(Number(e.target.value))}
                            />
                        </Form.Group>
                    </Col>

                    {/* CSV Export Button */}
                    <Col xs={12} md={12} lg={2} className="d-flex align-items-center">
                        <CsvDownloadButton
                            className="export-button w-100"
                            delimiter=","
                            data={fullData}
                        />
                    </Col>
                </Row>
            </div>

            <Row>
                <Col>
                    <AccountDataTable data={resJson?.data || []} loading={loading} />
                </Col>
            </Row>

            {/* Adds text to show witch results are currently being shown on the paginated page */}
            {resJson?.totalItems && (
                <Row className="mb-2">
                    <Col className="text-center">
                        <p>
                            Showing rows {resJson.pageIndex * resJson.pageSize + 1}-{resJson.pageIndex * resJson.pageSize + resJson.data.length} of {resJson.totalItems} rows
                        </p>
                    </Col>
                </Row>
            )}

            {/* adds the pagination to the page by calling the loadPagination function from above */}
            <Row>
                <Col>
                    <Pagination className="pagination">
                        {loadPagination(resJson?.totalItems, pageSize)}
                    </Pagination>
                </Col>
            </Row>
        </Container>
    );
};

export default RouterMailchimpDashboard;
