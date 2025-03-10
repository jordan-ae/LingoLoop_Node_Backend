import { check } from "express-validator";
import { RolesEnum } from "../enums";

export const validateLoginRequest = [
  check("email", "Please enter a valid email address").isEmail(),
  check("password", "Password is required").exists(),
];

export const validateRegisterRequest = [
  check("first_name", "First name is required").exists(),
  check("last_name", "Last name is required").exists(),
  check("email", "Please enter a valid email address").isEmail(),
  check("password", "Password is required").exists(),
    check("role")
        .isIn([RolesEnum.STUDENT, RolesEnum.TUTOR])
        .withMessage("Invalid role provided, Role can either be student or tutor"),
];

export const resendEmailVerificationRequest = [
  check("email", "Please enter a valid email address").isEmail(),
];