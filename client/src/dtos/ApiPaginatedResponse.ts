/**
 * Interface for response returned from server.
 * 
 * NOT USED YET
 */
export interface ApiPaginatedResponse {
    pageIndex: number;
    pageSize: number;
    count: number;
    totalPages: number;
    data: Array<Object>;
}