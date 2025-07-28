type TutorDetailChartCoord = {

    /**
     * Date of aggregated period
     * (For example, in case of "week" groupBy, 
     * '7/1/25', '7/8/25', '7/15/25', etc)
     */
    x: string,

    /**
     * Number of session hours hosted by this
     * tutor in the aggregated period
     */
    y: number
}


/**
 * Data will come back as an object of this interface like {data: [...]}.
 * 
 * Unlike SignupLineChartResponseDTO, data does not come back
 * in an array of this interface (since there's only one series).
 */
export interface TutorDetailChartResponseDTO {

    /**
     * Coordinate data for the tutor detail chart.
     */

    data: Array<TutorDetailChartCoord>;
}