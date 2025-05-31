// utils/data.ts\

// The more I think about this, I may need to make a SQL call here when getting the data.

// Both this and SignupData will be cobbled together via server call. A list of signups will need to be created for a given timeframe which will then be funneled into this.
// BarChart.tsx will not change. only thing changing is the data on it. which is currently supplied here

import * as React from 'react';
import { useState, useEffect } from 'react';

export interface SignupData {
    category: string;
    signups: number;
}
//export interface Signup {
//    category: string;
//    userType: string;
//    date: Date;
//}

// Example data until we have a server connection
//export const signups: Signup[] = [
//    { category: "Social Media", date: new Date("2025-04-03"), userType: "Tutor" },
//    { category: "Email Campaign", date: new Date("2025-04-07"), userType: "Parent" },
//    { category: "Physical Advertising", date: new Date("2025-04-12"), userType: "Student" },
//    { category: "Friend Referral", date: new Date("2025-04-15"), userType: "Tutor" },
//    { category: "Social Media", date: new Date("2025-04-20"), userType: "Student" },
//    { category: "Email Campaign", date: new Date("2025-04-25"), userType: "Parent" },
//    { category: "Physical Advertising", date: new Date("2025-04-29"), userType: "Tutor" },
//    { category: "Friend Referral", date: new Date("2025-05-01"), userType: "Student" },
//    { category: "Social Media", date: new Date("2025-05-05"), userType: "Parent" },
//    { category: "Email Campaign", date: new Date("2025-05-09"), userType: "Tutor" },
//    { category: "Physical Advertising", date: new Date("2025-05-12"), userType: "Student" },
//    { category: "Friend Referral", date: new Date("2025-05-17"), userType: "Parent" },
//    { category: "Social Media", date: new Date("2025-05-20"), userType: "Tutor" },
//    { category: "Email Campaign", date: new Date("2025-05-23"), userType: "Student" },
//    { category: "Physical Advertising", date: new Date("2025-05-27"), userType: "Parent" },
//    { category: "Friend Referral", date: new Date("2025-05-30"), userType: "Tutor" },
//    { category: "Social Media", date: new Date("2025-04-08"), userType: "Student" },
//    { category: "Email Campaign", date: new Date("2025-04-14"), userType: "Parent" },
//    { category: "Physical Advertising", date: new Date("2025-04-19"), userType: "Tutor" },
//    { category: "Friend Referral", date: new Date("2025-04-24"), userType: "Student" },
//    { category: "Social Media", date: new Date("2025-05-03"), userType: "Parent" },
//    { category: "Email Campaign", date: new Date("2025-05-08"), userType: "Tutor" },
//    { category: "Physical Advertising", date: new Date("2025-05-14"), userType: "Student" },
//    { category: "Friend Referral", date: new Date("2025-05-18"), userType: "Parent" },
//    { category: "Social Media", date: new Date("2025-05-25"), userType: "Tutor" },
//    { category: "Email Campaign", date: new Date("2025-05-28"), userType: "Student" },
//    { category: "Physical Advertising", date: new Date("2025-04-05"), userType: "Parent" },
//    { category: "Friend Referral", date: new Date("2025-04-10"), userType: "Tutor" },
//    { category: "Social Media", date: new Date("2025-04-16"), userType: "Student" },
//    { category: "Email Campaign", date: new Date("2025-04-21"), userType: "Parent" }
//];


// Example raw data.
export const rawSignupData: SignupData[] = [
    { category: 'Social Media', signups: 15 },
    { category: 'Physical Advertising', signups: 10 },
    { category: 'Friend Referral', signups: 8 },
    { category: 'Email Campaign', signups: 12 }
];

// Hi tarik

const Options = () => {
    const [timeframe, setTimeframe] = useState("default");
    const [userType, setUserType] = useState("default");
    // const [rawSignupData, setRawSignupData] = useState<SignupData[]>([]);

    const TimeframeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTimeframe(event.target.value);
        // SQL Call with new timeframe and curr usertype
    };

    const UserTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setUserType(event.target.value);
        // SQL Call with new usertype and curr usertype
    };

    //useEffect(() => {
    //    const filteredSignups: Signup[] = signups.filter(signup => {
    //        const now = new Date();
    //        const daysAgo = timeframe !== "default" ? parseInt(timeframe) : null;
    //        const withinTimeframe = daysAgo ? (now.getTime() - signup.date.getTime()) / (1000 * 60 * 60 * 24) <= daysAgo : true;
    //        const matchesUserType = userType === "default" || signup.userType === userType;

    //        return withinTimeframe && matchesUserType;
    //    });

    //    const filteredData = filteredSignups.reduce((acc, signup) => {
    //        const existingCategory = acc.find(data => data.category === signup.category);
    //        if (existingCategory) {
    //            existingCategory.signups += 1;
    //        } else {
    //            acc.push({ category: signup.category, signups: 1 });
    //        }
    //        return acc;
    //    }, [] as SignupData[]);

    //    setRawSignupData(filteredData);
    //    console.log("Chart Data:", rawSignupData);
    //}, [timeframe, userType]);



    return (
        <div>
            <label>Timeframe: </label>
            <select name="timeframe" onChange={TimeframeChange}>
                <option value="default">Overall</option>
                <option value="7">Last 7 Days</option>
                <option value="14">Last 14 Days</option>
                <option value="30">Last 30 Days</option>
            </select>
            <br></br>
            <label>User types: </label>
            <select name="userType" onChange={UserTypeChange}>
                <option value="default">All users</option>
                <option value="Students">Students</option>
                <option value="Parents">Parents</option>
                <option value="Tutors">Tutors</option>
            </select>
        </div>
    );
}

export default Options;