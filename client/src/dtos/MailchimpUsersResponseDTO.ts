
export interface MailchimpUserResponseDTO {
    studentId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    tutor: string; // Tutor name
    parentAccount: string | null; // This will be converted to boolean in future.
    createdAt: string;
    school: string;
    numSession: number;
    mostRecentSession: string;
    mostRecentSubject: string;
}