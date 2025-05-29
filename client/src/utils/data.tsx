// utils/data.ts
export interface SignupData {
    category: string;
    signups: number;
}

export interface AccountData {
    ssid: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: number;
    school: string;
    account_type: string;
    creation_date: string;
    sessions: number;
    recent_session: string;
    recent_subject: string;
    recent_tutor: string;
}

// Example raw data
export const rawSignupData: SignupData[] = [
    { category: 'Social Media', signups: 15 },
    { category: 'Physical Advertising', signups: 10 },
    { category: 'Friend Referral', signups: 8 },
    { category: 'Social Media', signups: 7 },
    { category: 'Email Campaign', signups: 12 }
];

export const rawAccountData: AccountData[] = [
    {
        ssid: 1,
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@gmail.com",
        phone: 1234567890,
        school: "Example High School",
        account_type: "Student",
        creation_date: "2023-01-01",
        sessions: 5,
        recent_session: "2023-10-01",
        recent_subject: "Math",
        recent_tutor: "Jane Smith"
    },
    {
        ssid: 2,
        first_name: "Alice",
        last_name: "Johnson",
        email: "alice.johnson@gmail.com",
        phone: 9876543210,
        school: "Example High School",
        account_type: "Parent",
        creation_date: "2023-02-15",
        sessions: 3,
        recent_session: "2023-10-02",
        recent_subject: "Science",
        recent_tutor: "John Doe"
    },
    {
        ssid: 3,
        first_name: "Michael",
        last_name: "Lee",
        email: "michael.lee@gmail.com",
        phone: 5551234567,
        school: "Riverdale Academy",
        account_type: "Student",
        creation_date: "2023-03-20",
        sessions: 7,
        recent_session: "2023-09-15",
        recent_subject: "History",
        recent_tutor: "Emily Chen"
    },
    {
        ssid: 4,
        first_name: "Sophia",
        last_name: "Nguyen",
        email: "sophia.nguyen@gmail.com",
        phone: 4449876543,
        school: "Riverdale Academy",
        account_type: "Parent",
        creation_date: "2023-04-10",
        sessions: 2,
        recent_session: "2023-09-20",
        recent_subject: "English",
        recent_tutor: "Michael Lee"
    },
    {
        ssid: 5,
        first_name: "David",
        last_name: "Martinez",
        email: "david.martinez@gmail.com",
        phone: 3216549870,
        school: "Lincoln High",
        account_type: "Student",
        creation_date: "2023-05-05",
        sessions: 4,
        recent_session: "2023-09-28",
        recent_subject: "Chemistry",
        recent_tutor: "Sarah Kim"
    },
    {
        ssid: 6,
        first_name: "Emma",
        last_name: "Wilson",
        email: "emma.wilson@gmail.com",
        phone: 2223334444,
        school: "Lincoln High",
        account_type: "Parent",
        creation_date: "2023-06-01",
        sessions: 6,
        recent_session: "2023-10-05",
        recent_subject: "Biology",
        recent_tutor: "David Martinez"
    },
    {
        ssid: 7,
        first_name: "Liam",
        last_name: "Brown",
        email: "liam.brown@gmail.com",
        phone: 7778889999,
        school: "Evergreen Prep",
        account_type: "Student",
        creation_date: "2023-07-18",
        sessions: 3,
        recent_session: "2023-09-30",
        recent_subject: "Physics",
        recent_tutor: "Emma Wilson"
    },
    {
        ssid: 8,
        first_name: "Olivia",
        last_name: "Davis",
        email: "olivia.davis@gmail.com",
        phone: 8887776666,
        school: "Evergreen Prep",
        account_type: "Parent",
        creation_date: "2023-08-12",
        sessions: 5,
        recent_session: "2023-10-03",
        recent_subject: "Geography",
        recent_tutor: "Liam Brown"
    },
    {
        ssid: 9,
        first_name: "Noah",
        last_name: "Anderson",
        email: "noah.anderson@gmail.com",
        phone: 1112223333,
        school: "Central High",
        account_type: "Student",
        creation_date: "2023-09-01",
        sessions: 8,
        recent_session: "2023-10-06",
        recent_subject: "Economics",
        recent_tutor: "Olivia Davis"
    },
    {
        ssid: 10,
        first_name: "Isabella",
        last_name: "Taylor",
        email: "isabella.taylor@gmail.com",
        phone: 9990001111,
        school: "Central High",
        account_type: "Parent",
        creation_date: "2023-10-01",
        sessions: 1,
        recent_session: "2023-10-07",
        recent_subject: "Literature",
        recent_tutor: "Noah Anderson"
    }
];
