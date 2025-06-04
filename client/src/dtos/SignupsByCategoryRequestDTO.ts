/**
 * Request body DTO for filtering
 * GET /signupDashboard/signupsByCategory
 */
export interface SignupsByCategoryRequestDTO {
  /**
   * The start date (ISO 8601 format) for the signups query (inclusive).
   * If no, no start date filter.
   * . 
   */
  startDate: string;

  /**
   * The end date (ISO 8601 format) for the signups query (inclusive).
   * If null, no end date filter.
   */
  endDate: string;

  /**
   * List of categories to include in result. If null,
   * then all categories will be returned.
   */
  categories: string[];
}