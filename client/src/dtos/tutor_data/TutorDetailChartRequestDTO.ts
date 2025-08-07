
/**
 * GET /tutorDetail/chart
 */
interface TutorDetailChartRequestDTO {

    /**
     * Tutor ID
     */
    id: number;

    /**
     * Specifies how the count of signups, per category,
     * in the response should be grouped. 
     * (Similar to SignupLineChartRequstDTO).
     */
    groupBy: "day" | "week" | "month";

    /**
     * The start date (ISO 8601 format) filter for the
     * query (inclusive).
     * If no, no filter is applied.
     * . 
     */
    startDate?: string;

    /**
     * The end date (ISO 8601 format) filter for the 
     * query (inclusive).
     * If undefined, no filter is applied.
     */
    endDate?: string;
}