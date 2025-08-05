interface TutorDetailKpiResponseDTO {
    /**
     * Average hours tutored per week
     * in the period
     */
    avgHoursPerWeek: number;


    /**
     * The number of sessions the tutor had with a repeat student
     * in the time period.
     */
    repeatSessionCount: number;

    /**
     * Total number of sessions in the period
     */
    totalSessions: number;

    /**
     * Repeat Rate: repeat session count / number of sessions
     * 
     * ONLY COUNT SESSIONS WITH ONE STUDENT
     */

    /**
     * Number of unique students
     * hosted in the period
     */
    uniqueStudents: number;

    /**
     * Recurring students. A recurring student is a student that 
     * has had >1 session with a tutor in all time.
     * (Students)
     * 
     * RENAME to repeatStudentCount
     */
    recurringStudentCount: number;

    /**
     * Total students taught in period. 
     * 
     * (Note there can be more than one student in a session,
     * so this can be different than totalSessions)
     */
    totalStudentCount: number;

}