"use server"
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail({
    name,
    email,
    subject,
    message,
  }: {
    name?: string;
    email: string;
    subject: string;
    message: string;
  }) {
    if ([name, email, subject, message].some((value) => !value?.trim())) {
      return {
        statusCode: 400,
        success: false,
        message: "All fields are required.",
      };
    }
  
    try {
      await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>', 
        to: "siddh907729@gmail.com", 
        subject: `New Contact Form Submission: ${subject}`,
        html: `
          <p><strong>Name:</strong> ${name || "Anonymous"}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong> ${message}</p>
        `,
      });
  
      return {
        statusCode: 200,
        success: true,
        message: "Email sent successfully!",
      };
    } catch (error) {
      return {
        statusCode: 500,
        success: false,
        message: "Error sending email. Try again later.",error,
      };
    }
  }