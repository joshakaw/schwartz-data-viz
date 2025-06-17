export interface SignupSummaryBoxRequestDTO {
    /**
     * List of signup method categories to include in result. If undefined,
     * then all categories will be returned. 
     * 
     * (e.g. ["Physical Advertising", "Friend Referral"])
     */
    signupMethodCategories?: string[];

    /**
     * List of account types to include in result. If undefined,
     * then all categories will be returned.
     * (e.g. ["Student", "Tutor", "Parent"])
     */
    accountType?: string[];

    /**
     * The start date (ISO 8601 format) for the signups query (inclusive).
     * If no, no start date filter.
     * . 
     */
    startDate?: string;

    /**
     * The end date (ISO 8601 format) for the signups query (inclusive).
     * If undefined, no end date filter.
     */
    endDate?: string;
}