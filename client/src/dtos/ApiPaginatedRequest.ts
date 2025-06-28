/**
 * Request interface for getting a paginated response.
 * Filter is an object that extends RequestDTO (e.g. MailchimpUsersRequestDTO)
 */
export interface ApiPaginatedRequest {
    /** 
     * The page number to fetch. The first page is 0.
     */
    pageIndex: number;

    /** 
     * Size of pages
     */
    pageSize: number;
}
