export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// password
export const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;
/*
At least one uppercase letter.
At least one lowercase letter.
At least one digit.
At least one special character.
.{8,}: Minimum of 8 characters total
*/
