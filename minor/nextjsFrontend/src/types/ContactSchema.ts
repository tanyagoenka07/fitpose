import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().max(50, "Name must be at most 50 characters.").optional(),
  email: z.string().email("Invalid email address."),
  subject: z.enum(["Bug Report", "Feature Request", "General Inquiry",""], {
    errorMap: () => ({ message: "Please select a valid subject." }),
  }),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters.")
    .max(1000, "Message must not exceed 1000 characters."),
});

export type ContactFormData = z.infer<typeof contactSchema>;
