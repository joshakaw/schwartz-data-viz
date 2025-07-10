type TutoringLocations = 'In Person' | 'Online' | 'Either Works';

interface TutorLeaderboardRequestDTO {
    /**
     * The start date (ISO 8601 format) for the signups query (inclusive).
     * If no, no start date filter.
     * . 
     */
    startDate?: string;

    /**
     * The end date (ISO 8601 format) for the signups query (inclusive).
     * If undefined, no end date filter.
     */
    endDate?: string;

    /**
     * Sort by. If undefined, it will default to hours.
     */
    sortBy?: "hours" | "sessions" | "revenue" | "recurringSessions";

    /**
     * Subjects to return in the results. If undefined, all subjects 
     * will be returned in the results.
     */
    subjects?: Array<String>;

    /**
     * Locations to return in the results (e.g. In-Person, Virtual).
     * If undefined, all locations will be returned in the results.
     */
    locations?: Array<TutoringLocations>;
}