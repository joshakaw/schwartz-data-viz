import React, { FC, useState } from 'react';
import './RouterDetailedSignupsDashboard.css';
import Options from '../../../utils/bardata';
import DetailedSignupsOptions from './DetailedSignupsOptions/DetailedSignupsOptions';
import NotImplementedWarning from '../../NotImplementedWarning/NotImplementedWarning';
import SignupDataTable from '../../signupDataTable/signupDataTable';
import { DetailedSignupResponseDTO } from '../../../dtos/DetailedSignupResponseDTO';
import { DetailedSignupRequestDTO } from '../../../dtos/DetailedSignupRequestDTO';


interface RouterDetailedSignupsDashboardProps { }

const RouterDetailedSignupsDashboard: FC<RouterDetailedSignupsDashboardProps> = () => {
    //const [sessionRange, setSessionRange] = useState<string | null>(null);
    //const [searchKeyword, setSearchKeyword] = useState<string>('');
    //const [accountTypes, setAccountTypes] = useState<{ value: string, label: string }[]>([]);
    //const [resJson, setResJson] = useState<Array<DetailedSignupResponseDTO>>([]);

    //const reqData: DetailedSignupRequestDTO = {
    //    name: null,
    //    accountType: null,
    //    signupMethodCategory: null,
    //    freeResponseText: null,
    //    dateOfSignup: null,
    //    school: null,
    //    //schoolType: null,
    //    numberOfSessions: null
    //};

    //console.log(reqData);
    //console.log(resJson);

    //try {
    //    const response = await instance.get("mailchimpDashboard/users", { params: reqData });
    //    setResJson(response.data);
    //} catch (err) {
    //    console.error("API error:", err);
    //}

    return (
        <>
            <div className="RouterDetailedSignupsDashboard">
                <DetailedSignupsOptions />
                {/*<NotImplementedWarning message="Detailed Signups table will go here according to Dylan's Project Notes" />*/}
                <SignupDataTable data={[]} />
            </div>
        </>
    );
};

export default RouterDetailedSignupsDashboard;

