import React, { FC, useState } from 'react';
import './RouterDetailedSignupsDashboard.css';
import Options from '../../../utils/bardata';
import DetailedSignupsOptions from './DetailedSignupsOptions/DetailedSignupsOptions';
import NotImplementedWarning from '../../NotImplementedWarning/NotImplementedWarning';
import SignupDataTable from '../../signupDataTable/signupDataTable';
import { DetailedSignupResponseDTO } from '../../../dtos/DetailedSignupResponseDTO';
import { DetailedSignupRequestDTO } from '../../../dtos/DetailedSignupRequestDTO';
import instance from '../../../utils/axios';


interface RouterDetailedSignupsDashboardProps { }

const RouterDetailedSignupsDashboard: FC<RouterDetailedSignupsDashboardProps> = () => {
    const [sessionRange, setSessionRange] = useState<string | null>(null);

    const [signupMethodCategories, setsignupMethodCategories] = useState<{ value: string, label: string }[]>([]);
    const [freeResponseSearchKeyword, setfreeResponseSearchKeyword] = useState<string>('');
    const [accountType, setAccountType] = useState<{ value: string, label: string }[]>([]);
    const [educationLevel, seteducationLevel] = useState<{ value: string, label: string }[]>([]);
    const [resJson, setResJson] = useState<Array<DetailedSignupResponseDTO>>([]);

    const reqData: DetailedSignupRequestDTO = {
        pageIndex: 0,
        pageSize: 10
    }

    console.log(reqData);
    console.log(resJson);

    try {
        const response = instance.get("detailedSignupsDashboard/table", { params: reqData }).then((response) => {
            setResJson(response.data);
        })
        
    } catch (err) {
        console.error("API error:", err);
    }

    return (
        <>
            <div className="RouterDetailedSignupsDashboard">
                <DetailedSignupsOptions />
                {/*<NotImplementedWarning message="Detailed Signups table will go here according to Dylan's Project Notes" />*/}
                <SignupDataTable data={resJson} />
            </div>
        </>
    );
};

export default RouterDetailedSignupsDashboard;

