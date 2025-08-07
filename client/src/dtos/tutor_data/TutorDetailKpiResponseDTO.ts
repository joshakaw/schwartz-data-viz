interface TutorDetailKpiResponseDTO {
    /**
     * Average hours tutored per week
     * in the period
     */
    avgHoursPerWeek: number;


    /**
     * The number of sessions the tutor had with a repeat student
     * in the time period. (A repeat student is a student
     * who has had a session with this tutor previously)
     * 
     * Note: A session in this case is defined as a
     * meeting between a student and teacher pair. A session in the
     * database can hold multiple of these pairs, so it can be true
     * that a session will have multiple "sessions" in the sense of
     * this statistic.
     */
    repeatSessionCount: number;

    /**
     * Total number of sessions in the period
     * 
     * Note: A session in this case is defined as a
     * meeting between a student and teacher pair. A session in the
     * database can hold multiple of these pairs, so it can be true
     * that a session will have multiple "sessions" in the sense of
     * this statistic.
     */
    totalSessions: number;

    /**
     * Repeat Rate: repeat session count / number of sessions
     */

    /**
     * Number of unique students
     * hosted in the period
     */
    uniqueStudents: number;

    /**
     * Total students taught in period. 
     * 
     * (Note there can be more than one student in a session,
     * so this can be different than totalSessions)
     */
    totalStudentCount: number;

    // NOT IMPLEMENTED: Dylan does not want to see
    // this KPI. Replacement is repeatSessionCount.
    ///**
    // * Recurring students. A recurring student is a student that
    // * has had >1 session with a tutor in all time.
    // * (Students)
    // *
    // * RENAME to repeatStudentCount
    // */
    //recurringStudentCount: number;
}