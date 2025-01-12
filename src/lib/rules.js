import { z } from "zod";

export const RegisterFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).trim(),
  password: z.string()
    .min(1, { message: "Password is required" })
    .min(5, { message: "Password must be at least 5 characters" })
    .regex(/[a-zA-Z]/, { message: "Password must contain at least one letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" }),
  confirmPassword: z.string().trim(),
}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["confirmPassword"],
      message: "Passwords do not match"
    });
  }
});
