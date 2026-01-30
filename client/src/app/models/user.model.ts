/**
 * User Model - Matches backend User entity
 * 
 * TypeScript Interface = Blueprint for data structure
 * It tells TypeScript: "A User object must have these properties with these types"
 * 
 * Why? Type safety - prevents bugs by catching errors before runtime
 */
export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}


export interface User {
  id: string;              // UUID from database
  email: string;           // User's email
  firstName: string;       // First name
  lastName: string;        // Last name
  role: 'ADMIN' | 'USER';  // Union type: can only be ADMIN or USER
  isActive: boolean;       // Account status
  createdAt?: Date;        // Optional (?) - might not always be sent
  updatedAt?: Date;        // Optional
}

/**
 * Login Request DTO (Data Transfer Object)
 * What we SEND to backend when logging in
 */
export interface LoginDto {
  email: string;
  password: string;
}

/**
 * Register Request DTO
 * What we SEND when creating new account
 */
export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/**
 * Auth Response - What backend RETURNS after login
 */
export interface AuthResponse {
  accessToken: string;   // JWT token for authentication
  refreshToken: string;  // Token to get new accessToken
}
