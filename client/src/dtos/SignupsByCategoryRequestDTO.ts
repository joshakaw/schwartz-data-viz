/**
 * Request body DTO for filtering
 * GET /signupDashboard/signupsByCategory
 */
export interface SignupsByCategoryRequestDTO {
    /**
     * List of signup method categories to include in result. If null,
     * then all categories will be returned. 
     * 
     * (e.g. ["Physical Advertising", "Friend Referral"])
     */
    signupMethodCategories: string[] | null;

    /**
     * List of account types to include in result. If null,
     * then all categories will be returned.
     * (e.g. ["Student", "Tutor", "Parent"])
     */
    accountType: string[] | null;

    /**
     * The start date (ISO 8601 format) for the signups query (inclusive).
     * If no, no start date filter.
     * . 
     */
    startDate: string | null;

    /**
     * The end date (ISO 8601 format) for the signups query (inclusive).
     * If null, no end date filter.
     */
    endDate: string | null;
}