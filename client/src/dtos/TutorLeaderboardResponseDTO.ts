export interface TutorLeaderboardResponseDTO {
    /**
     * Name of the tutor
     */
    tutorName: string;

    /**
     * Total sessions (given the filters in the request)
     */
    numberOfSessions: number

    /**
     * Total hours
     */
    hours: number

    /**
     * Revenue generated
     */
    revenueGenerated: number;

    /**
     * Number of recurring students
     */
    numberOfRecurringStudents: number;

    /**
     * Most recent session date
     */
    mostRecentSession: any;
}