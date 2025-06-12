/**
 * Request body DTO for filtering
 * GET ---------
 */
export interface DetailedSignupRequestDTO {
    /**
     * List of signup method categories to include in result. If undefined,
     * then all categories will be returned. 
     * 
     * (e.g. ["Physical Advertising", "Friend Referral"])
     */
    signupMethodCategories?: string[];

    /**
     * The keyword to search in the 'how they heard about us' free response.
     */
    freeResponseSearchKeyword?: string;

    /**
     * The start date (ISO 8601 format) for the query (inclusive).
     * If no, no start date filter.
     * . 
     */
    startDate?: string;

    /**
     * The end date (ISO 8601 format) for the query (inclusive).
     * If undefined, no end date filter.
     */
    endDate?: string;

    /**
     * List of account types to include in result. If undefined,
     * then all categories will be returned.
     * (e.g. ["Student", "Tutor", "Parent"])
     */
    accountType?: string[];

    /**
     * List of education levels to include in result.
     * If undefined, then all education levels will be returned.
     * 
     * (e.g. ["K-12", "University"])
     */
    educationLevel?: string[];
}