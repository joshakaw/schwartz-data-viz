// utils/data.ts
export interface SignupData {
    category: string;
    signups: number;
}

// Example raw data
export const rawSignupData: SignupData[] = [
    { category: 'Social Media', signups: 15 },
    { category: 'Physical Advertising', signups: 10 },
    { category: 'Friend Referral', signups: 8 },
    { category: 'Social Media', signups: 7 },
    { category: 'Email Campaign', signups: 12 }
];