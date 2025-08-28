/*
 Generic API response wrapper
 Ensures all responses follow the same structure.
*/
export interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data: T;
}
