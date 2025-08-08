// React and styling imports
import { FC, useState, useEffect } from 'react';
import './RouterMailchimpDashboard.css';

// Custom component imports
import AccountDataTable from '../../accountDataTable/accountDataTable';

// React component imports
import { Form, Col, Row, Container } from 'react-bootstrap';
import Select from 'react-select';
import CsvDownloadButton from 'react-json-to-csv';
import Pagination from 'react-bootstrap/Pagination';
import CreatableSelect from 'react-select/creatable';       
import { Tooltip } from 'react-tooltip';

// Data handling and DTO imports
import instance from "../../../utils/axios";
import { MailchimpUsersRequestDTO } from "../../../dtos/MailchimpUsersRequestDTO";
import { MailchimpUserResponseDTO } from '../../../dtos/MailchimpUsersResponseDTO.ts';
import { ApiPaginatedResponse } from '../../../dtos/ApiPaginatedResponse.ts';

// ** tree-select import and styles **
import { TreeSelect } from 'primereact/treeselect';
import 'primereact/resources/themes/bootstrap4-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css'
import { TreeSelectSelectionKeysType, TreeSelectChangeEvent } from 'primereact/treeselect';

// Options for multi-select (account types)
const sessionOptions = [
    { value: '0', label: 'Student' },
    { value: '1', label: 'Parent' },
    { value: '2', label: 'Tutor' }
];

const RouterMailchimpDashboard: FC = () => {
    // Un-comment useStates if needed

    // Add 'setSelectedSchool' if used
    const [selectedSchool] = useState<string>('');
    const [sessionRange, setSessionRange] = useState<string | undefined>(undefined);
    const [accountTypes, setAccountTypes] = useState<{ value: string, label: string }[]>([]);
    const [resJson, setResJson] = useState<ApiPaginatedResponse<MailchimpUserResponseDTO>>();
    const [fullData, setFullData] = useState<MailchimpUserResponseDTO[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [rowsOfData, setMaxRows] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);
    const [loading, setLoading] = useState(true);
    const [selectedSchools, setSelectedSchools] = useState<TreeSelectSelectionKeysType>({});
    // @ts-ignore
    const [treeData, setTreeData] = useState<any[]>([]);


    // Params for the data that will go into the table
    const getRequestParams = (pageIndex: number, pageSize: number, limit: number | undefined, schools: Set<string>): MailchimpUsersRequestDTO => ({
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
        endDate: undefined,
        schools: Array.from(schools)
    });

    // Handles changing data based on filters to give to the table
    const handleSubmit = async () => {
        setLoading(true);
        const fetchLimit = rowsOfData || 10000;
        const selectedLeafKeys = getSelectedLeafKeys(treeData, selectedSchools);
        const allParams = getRequestParams(0, fetchLimit, fetchLimit, selectedLeafKeys);

        try {
            const response = await instance.get("mailchimpDashboard/users", { params: allParams });
            const receivedData: ApiPaginatedResponse<MailchimpUserResponseDTO> = response.data;
            let data = receivedData.data;

            // Filter by selected schools if any are selected
            
            //if (selectedLeafKeys.size > 0) {
            //    data = data.filter((user: MailchimpUserResponseDTO) => {
            //        const school = user.school || '';
            //        return selectedLeafKeys.has(school);
            //    });
            //}

            // Sorting by session range (if needed)
            if (sessionRange === undefined) {
                setFullData(data);

                // Apply pagination after filtering the data
                const paginatedSlice = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);
                setResJson({
                    data: paginatedSlice,
                    totalItems: data.length,
                    pageIndex: currentPage - 1,
                    pageSize
                });
            } else {
                const sortedData = [...data].sort((a, b) => (a.numSessions ?? 0) - (b.numSessions ?? 0));
                setFullData(sortedData);

                // Apply pagination after sorting and filtering
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
    }, [currentPage, sessionRange, accountTypes, rowsOfData, pageSize, selectedSchool, selectedSchools]);

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


    interface SchoolName {
        schoolName: string;
        schoolType: string;
    }

    interface SchoolType {
        schoolType: string;
    }

    // Grabs all of the unique school names from the account data
    // used for school select filter
    useEffect(() => {
        const fetchSchools = async () => {
            try {
                const res = await instance.get("/educationLevelSchools");
                const data = res.data;
                //console.log(JSON.stringify(data, null, 2));

                const transformed = data.schoolTypes
                    .sort((a: SchoolType, b: SchoolType) => a.schoolType.localeCompare(b.schoolType))
                    // Explicit typing for schoolType
                    .map(({ schoolType }: SchoolType) => { 
                        const children = data.schoolNames
                            // Explicit type for school
                            .filter((school: SchoolName) => school.schoolType === schoolType)  
                            // Explicit types for a and b
                            .sort((a: SchoolName, b: SchoolName) => a.schoolName.localeCompare(b.schoolName))  
                            .map((school: SchoolName) => ({
                                label: school.schoolName,
                                value: school.schoolName,
                                key: `${school.schoolName}`,
                            }));

                        return {
                            label: capitalizeWords(`${schoolType} schools`),
                            value: schoolType,
                            key: schoolType,
                            children: children,
                        };
                    });

                // console.log(JSON.stringify(transformed, null, 2));
                setTreeData(transformed);
            } catch (error) {
                console.error('Error fetching schools:', error);
            }
        };

        fetchSchools();
    }, []);

    const handleTreeChange = (e: TreeSelectChangeEvent) => {
        // Log the value to inspect
        // console.log('TreeSelect Changed:', e.value);

        // Assert that e.value is of type TreeSelectSelectionKeysType
        if (e.value && typeof e.value === 'object') {
            // We assert e.value to be of type TreeSelectSelectionKeysType
            const selectedSchoolsObject = e.value as TreeSelectSelectionKeysType;

            // Log the selectedSchools object to ensure it's what we expect
            console.log('Selected Schools Object:', selectedSchoolsObject);

            // Update selectedSchools with the entire object
            setSelectedSchools(selectedSchoolsObject);
        } else {
            // If no schools are selected, reset the selectedSchools state
            setSelectedSchools({});
        }
    };

    // @ts-ignore
    // Helper function to capitalize words
    function capitalizeWords(str: string) {
        if (typeof str !== 'string') return '';
        return str.replace(/\b\w/g, l => l.toUpperCase());
    }

    // Helper function that removes spaces, uppercase characters, and special characters.
    // It then adds hyphens in between words.
    // Creates a browser friendly version of a string (eg. Hello World! -> hello-world)
    function slugify(str: string) {
        if (typeof str !== 'string') return '';
        return str
            .toLowerCase()
            .replace(/\s+/g, '-')  // Replace spaces with hyphens
            .replace(/[^a-z0-9\-]/g, '')  // Remove non-alphanumeric characters
            .replace(/-+/g, '-');  // Replace consecutive hyphens with a single one
    }

    // Type guards for selection map entries
    const isBool = (v: unknown): v is boolean => typeof v === 'boolean';
    const isStateObj = (v: unknown): v is { checked: boolean; partialChecked: boolean } =>
        !!v && typeof v === 'object' && 'checked' in (v as any);

    // Collect selected leaf node keys given treeData + selectionKeys
    function getSelectedLeafKeys(
        nodes: any[],
        selection: TreeSelectSelectionKeysType
    ): Set<string> {
        const out = new Set<string>();

        const visit = (node: any) => {
            const entry = (selection as any)?.[node.key];
            const isChecked = isBool(entry) ? entry : isStateObj(entry) ? entry.checked : false;

            if (isChecked) {
                // If a branch is checked, include all its descendant leaves
                if (!node.children || node.children.length === 0) {
                    out.add(node.key);
                } else {
                    node.children.forEach(visit);
                }
                return;
            }

            // If not checked at this node, still traverse children in case some are individually checked
            if (node.children && node.children.length > 0) {
                node.children.forEach(visit);
            }
        };

        nodes.forEach(visit);
        return out;
    }


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
                    {/* School Filter */}
                    <Col xs={12} md={4} lg={2}>
                        <Form.Group className="mb-2">
                            <Form.Label>School</Form.Label>
                            <TreeSelect
                                value={selectedSchools}
                                onChange={handleTreeChange}
                                options={treeData} 
                                placeholder="Select schools"
                                selectionMode="checkbox"
                                display="chip"
                                className="w-100"
                            />
                        </Form.Group>
                    </Col>

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
                                data-tooltip-id="session-range-filter-tooltip"
                                data-tooltip-content="Add a custom range, or pick from pre-selected."
                                data-tooltip-place="top"
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
                            <Tooltip
                                id="session-range-filter-tooltip"
                                openOnClick={true}
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
                                data-tooltip-id="limit-filter-tooltip"
                                data-tooltip-content="If zero, no limit will be placed."
                                data-tooltip-place="bottom"
                                data-tooltip-delay-show={1000}
                                type="number"
                                min={0}
                                value={rowsOfData}
                                onChange={(e) => setMaxRows(Number(e.target.value))}
                            />
                            <Tooltip
                                id="limit-filter-tooltip"
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
