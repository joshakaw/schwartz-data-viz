export interface SignupsByCategoryResponseDTO {
    /**
     * The signup method category.
     * 
     * (e.g. ["Physical Advertising", "Friend Referral"])
     */
    category: string;
    /**
     * The number of signups for this category.
     */
    signups: number;
}