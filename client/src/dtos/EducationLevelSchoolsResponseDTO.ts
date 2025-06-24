
type SchoolType = "elementary" | "middle" | "high" | "college"
export interface EducationLevelSchoolsResponseDTO {
    /**
     * An array of school names, along with their corresponding SchoolType.
     * e.g. {'schoolName': 'Ornport Middle', 'schoolType': 'middle'}
     */
    schoolNames: Array<{ schoolName: string, schoolType: SchoolType }>;
    /** 
     * An array of all possible school types.
     * e.g. "elementary", "middle", "high", "college"
     * */
    schoolTypes: Array<{ schoolType: SchoolType }>;
}