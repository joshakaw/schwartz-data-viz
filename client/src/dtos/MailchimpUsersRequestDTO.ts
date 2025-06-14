import { ApiPaginatedRequest } from "./ApiPaginatedRequest";

/**
 * Request body DTO for filtering
 * GET /mailchimpDashboard/users
 */
export interface MailchimpUsersRequestDTO extends ApiPaginatedRequest {
    /**
     * The keyword to search for in 
     * CONCAT(First Name, " ", Last Name). If undefined,
     * no filter is applied.
     */
    studentNameSearchKeyword?: string;

    /**
     * Minimum number of a sessions a user attended.
     * If null, no minimum is set.
     * (inclusive)

     */
    minNumberOfSessions?: number;

    /**
     * Maxmimum number of a sessions a user attended.
     * If null, no maximum is set.
     * (inclusive)
     * If undefined, no maximum is set.
     */
    maxNumberOfSessions?: number;

    /**
     * List of account types to include in result. If undefined,
     * then all categories will be returned.
     * (e.g. ["Student", "Tutor", "Parent"])
     */
    accountType?: string[];

    /**
     * The start date (ISO 8601 format) filter for the
     * most recent session attended (inclusive).
     * If no, no filter is applied.
     * . 
     */
    startDate?: string;

    /**
     * The end date (ISO 8601 format) filter for the 
     * most recent sesison attended (inclusive).
     * If undefined, no filter is applied.
     */
    endDate?: string;
}