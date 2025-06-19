/**
 * Reusable option objects for the Select component.
 */

import { Options, OptionsOrGroups } from "react-select";

export type OptionType = {
    value: string;
    label: string;
}

export type weekMonthYear = 'week' | 'month' | 'year';

export const signupOptions: Options<{value: string, label: string}> = [
    { value: 'Social Media', label: 'Social Media' },
    { value: 'Physical Advertising', label: 'Physical Advertising' },
    { value: 'Friend Referral', label: 'Friend Referral' },
    { value: 'Email Campaign', label: 'Email Campaign' },
];

export const userOptions: Options<{ value: string, label: string }> = [
    { value: 'Students', label: 'Students' },
    { value: 'Parents', label: 'Parents' },
    { value: 'Tutors', label: 'Tutors' }
];

export const rangeOptions: Options<{ value: string, label: string }> = [
    { value: '7', label: 'Last 7 days' },
    { value: '14', label: 'Last 14 days' },
    { value: '30', label: 'Last month' }
];

export const organizeOptions: Options<{ value: weekMonthYear, label: string }> = [
    { value: 'week', label: 'By week' },
    { value: 'month', label: 'By month' },
    { value: 'year', label: 'By year' }
];

const School: Options<{ value: string, label: string }> = [
    { value: 'K-12', label: 'K-12' },
    { value: 'University', label: 'University' },
];