import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  console.warn("RESEND_API_KEY is not set");
}

export const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  from = "noreply@yourdomain.com",
  replyTo,
}: SendEmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
      reply_to: replyTo,
    });

    if (error) {
      console.error("Failed to send email:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
}

// Email templates
export const emailTemplates = {
  welcome: (name: string, productName: string) => ({
    subject: `Welcome to ${productName}!`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Welcome, ${name}!</h1>
        <p>Thanks for signing up for ${productName}. We're excited to have you on board.</p>
        <p>Here's what you can do next:</p>
        <ul>
          <li>Complete your profile</li>
          <li>Try your first action</li>
          <li>Explore the dashboard</li>
        </ul>
        <p>If you have any questions, just reply to this email.</p>
        <p>Best,<br/>The ${productName} Team</p>
      </div>
    `,
  }),

  trialReminder: (name: string, daysLeft: number, productName: string) => ({
    subject: `Your ${productName} trial ends in ${daysLeft} days`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Hi ${name},</h1>
        <p>Your free trial of ${productName} ends in ${daysLeft} days.</p>
        <p>Here's what you'll lose access to:</p>
        <ul>
          <li>All premium features</li>
          <li>Your saved data</li>
          <li>Priority support</li>
        </ul>
        <p><a href="#">Subscribe now</a> to keep full access.</p>
        <p>Best,<br/>The ${productName} Team</p>
      </div>
    `,
  }),

  subscriptionConfirmation: (name: string, plan: string, productName: string) => ({
    subject: `You're now subscribed to ${productName} ${plan}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Thanks, ${name}!</h1>
        <p>Your subscription to ${productName} ${plan} is now active.</p>
        <p>You now have access to all features included in your plan.</p>
        <p>If you have any questions, just reply to this email.</p>
        <p>Best,<br/>The ${productName} Team</p>
      </div>
    `,
  }),
};
