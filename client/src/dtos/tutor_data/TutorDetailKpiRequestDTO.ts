
/**
 * Request for metrics about a tutor
 * KPI = Key Performance Indicator
 * 
 * GET /tutorDetail/kpis
 */
interface TutorDetailKpiRequestDTO {
    /**
     * Tutor ID
     */
    id: number;

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
}