import { ApiPaginatedRequest } from "./ApiPaginatedRequest";

/**
 * Request body DTO for filtering
 * GET /mailchimpDashboard/users
 */
export interface MailchimpUsersRequestDTO extends ApiPaginatedRequest {
    /**
     * The keyword to search for in 
     * CONCAT(First Name, " ", Last Name). If null,
     * no filter is applied.
     */
    studentNameSearchKeyword: string | null;

    /**
     * Minimum number of a sessions a user attended.
     * If null, no minimum is set.
     * (inclusive)
     */
    minNumberOfSessions: number | null;

    /**
     * Maxmimum number of a sessions a user attended.
     * If null, no maximum is set.
     * (inclusive)
     */
    maxNumberOfSessions: number | null;

    /**
     * List of account types to include in result. If null,
     * then all categories will be returned.
     * (e.g. ["Student", "Tutor", "Parent"])
     */
    accountType: string[] | null;

    /**
     * The start date (ISO 8601 format) filter for the
     * most recent session attended (inclusive).
     * If no, no filter is applied.
     * . 
     */
    startDate: string | null;

    /**
     * The end date (ISO 8601 format) filter for the 
     * most recent sesison attended (inclusive).
     * If null, no filter is applied.
     */
    endDate: string | null;
}