type SignupLineChartCoord = {

    /**
     * Date of last signup in this period
     * (specified in request)
     */
    x: string,

    /**
     * Number of signups
     */
    y: number
}
/**
 * Data response comes back in an Array of this DTO.
 */
export interface SignupLineChartResponseDTO {

    /**
     * Signup method category this data belongs to
     * (e.g. "Physical Advertising" or "Friend Referral")
     */
    signupMethodCategory: string

    /**
     * Coordinate data for the signup category.
     */

    data: Array<SignupLineChartCoord>;
}