import { RequestDTO } from "./RequestDTO";

/**
 * Request interface for getting a paginated response.
 * Filter is an object that extends RequestDTO (e.g. MailchimpUsersRequestDTO)
 * 
 * NOT USED YET
 */
export interface ApiPaginatedRequest {
    /** The starting page index */
    pageIndex: number;
    /** Size of pages */
    pageSize: number;
    filter: RequestDTO;
}
