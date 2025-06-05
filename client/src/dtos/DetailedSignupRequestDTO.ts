import { RequestDTO } from "./RequestDTO";

/**
 * Request body DTO for filtering
 * GET ---------
 */
export interface DetailedSignupRequestDTO extends RequestDTO {
    /**
     * List of signup method categories to include in result. If null,
     * then all categories will be returned. 
     * 
     * (e.g. ["Physical Advertising", "Friend Referral"])
     */
    signupMethodCategories: string[] | null;

    /**
     * The keyword to search in the 'how they heard about us' free response.
     */
    freeResponseSearchKeyword: string | null;

    /**
     * The start date (ISO 8601 format) for the query (inclusive).
     * If no, no start date filter.
     * . 
     */
    startDate: string | null;

    /**
     * The end date (ISO 8601 format) for the query (inclusive).
     * If null, no end date filter.
     */
    endDate: string | null;

    /**
     * List of account types to include in result. If null,
     * then all categories will be returned.
     * (e.g. ["Student", "Tutor", "Parent"])
     */
    accountType: string[] | null;

    /**
     * List of education levels to include in result.
     * If null, then all education levels will be returned.
     * 
     * (e.g. ["K-12", "University"])
     */
    educationLevel: string[] | null
}