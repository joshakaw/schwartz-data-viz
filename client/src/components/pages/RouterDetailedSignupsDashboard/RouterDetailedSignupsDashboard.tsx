import React, { FC, useState, useEffect } from 'react';
import './RouterDetailedSignupsDashboard.css';
import Options from '../../../utils/bardata';
import DetailedSignupsOptions from './DetailedSignupsOptions/DetailedSignupsOptions';
import NotImplementedWarning from '../../NotImplementedWarning/NotImplementedWarning';
import SignupDataTable from '../../signupDataTable/signupDataTable';
import { DetailedSignupResponseDTO } from '../../../dtos/DetailedSignupResponseDTO';
import { DetailedSignupRequestDTO } from '../../../dtos/DetailedSignupRequestDTO';
import instance from '../../../utils/axios';
import DateRangePicker from '../../../components/DateRangePicker/DateRangePicker';
import { DateRange } from 'react-day-picker';
import { Container, Row, Col } from 'react-bootstrap';


interface RouterDetailedSignupsDashboardProps { }

const RouterDetailedSignupsDashboard: FC<RouterDetailedSignupsDashboardProps> = () => {
    const [sessionRange, setSessionRange] = useState<string | null>(null);

    const [signupMethodCategories, setsignupMethodCategories] = useState<{ value: string, label: string }[]>([]);
    const [freeResponseSearchKeyword, setfreeResponseSearchKeyword] = useState<string>('');
    const [accountType, setAccountType] = useState<{ value: string, label: string }[]>([]);
    const [educationLevel, seteducationLevel] = useState<{ value: string, label: string }[]>([]);
    const [resJson, setResJson] = useState<Array<DetailedSignupResponseDTO>>([]);

    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(new Date().setDate(new Date().getDate() - 7)),
        to: new Date()
    });

    useEffect(() => {
        const reqData: DetailedSignupRequestDTO = {
            pageIndex: 0,
            pageSize: 10,
            startDate: dateRange?.from?.toISOString(),
            endDate: dateRange?.to?.toISOString()
        }

        try {
            instance.get("detailedSignupsDashboard/table", { params: reqData }).then((response) => {
                setResJson(response.data);
            }).catch(err => {
                console.error("API promise error:", err);
            });
        } catch (err) {
            console.error("API synchronous error:", err);
        }
    }, [dateRange]);

    return (
        <>
            <div className="RouterDetailedSignupsDashboard">
                <DetailedSignupsOptions />
                {/*<NotImplementedWarning message="Detailed Signups table will go here according to Dylan's Project Notes" />*/}
                <DateRangePicker value={dateRange} onChange={setDateRange} />
                <SignupDataTable data={resJson} />
            </div>
        </>
    );
};

export default RouterDetailedSignupsDashboard;