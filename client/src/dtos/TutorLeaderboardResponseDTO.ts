export interface TutorLeaderboardResponseDTO {
    /**
     * Name of the tutor
     */
    name: string;

    /**
     * Total sessions (given the filters in the request)
     */
    numberOfSessions: number

    /**
     * Total hours
     */
    hoursTutored: number

    /**
     * Revenue generated
     */
    revenueGenerated: number;

    /**
     * Number of recurring students
     */
    numRecurringSessions: number;

    /**
     * Most recent session date
     */
    lastSession: any;

    /**
     * The tutor's ID
     */
    tutorId: number;
}