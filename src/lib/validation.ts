import { z } from "zod";

// Lead form validation schema
export const leadSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  phone: z
    .string()
    .trim()
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number is too long")
    .regex(/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\./0-9]*$/, "Invalid phone number format"),
  message: z
    .string()
    .trim()
    .max(1000, "Message must be less than 1000 characters")
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
  project: z.string().trim().optional().or(z.literal("")),
});

// Chat message validation schema
export const chatMessageSchema = z.object({
  user_message: z
    .string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(1000, "Message must be less than 1000 characters"),
});

export type LeadFormData = z.infer<typeof leadSchema>;
export type ChatMessageData = z.infer<typeof chatMessageSchema>;
