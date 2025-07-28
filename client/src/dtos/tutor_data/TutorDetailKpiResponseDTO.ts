interface TutorDetailKpiResponseDTO {
    /**
     * Average hours tutored per week
     * in the period
     */
    avgHoursPerWeek: number;

    /**
     * Total number of sessions in the period
     */
    totalSessions: number;

    /**
     * Number of unique students
     * hosted in the period
     */
    uniqueStudents: number;

    /**
     * Recurring students. A recurring student is a student that 
     * has had >1 session with a tutor in all time.
     * (Students)
     */
    recurringStudentCount: number;

    /**
     * Total students
     */
    totalStudentCount: number;

    /**
     * Not functional, instead calculate by recurringStudentCount / totalStudentCount.
     */
    //rescheduleRate: number;
}