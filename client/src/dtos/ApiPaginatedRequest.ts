/**
 * Request interface for getting a paginated response.
 * Filter is an object that extends RequestDTO (e.g. MailchimpUsersRequestDTO)
 */
export interface ApiPaginatedRequest<T> {
  /** The starting page index */
  pageIndex: number;

  /** Size of pages */
  pageSize: number;

  /**
   * Count of items available to query
   * (i.e. without pageIndex/pageSize filters applied)
   */
  totalItems: number;

  /** Data */
  data: Array<T>;
}
