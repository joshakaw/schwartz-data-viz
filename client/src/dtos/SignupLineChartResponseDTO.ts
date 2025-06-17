export interface SignupLineChartResponseDTO {
    /** 
     * Date of last signup in this period
     * (specified in request)
     */
    date: string;

    /**
     * (e.g. "Physical Advertising" or "Friend Referral")
     */
    signupMethodCategory: string;

    /**
     * Number of signups
     */
    numberOfSignups: number;
}