import nodemailer from "nodemailer"

// Create a transporter -> paste from nodemailer page
// For production, replace with your actual SMTP server details.
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com", // copy from brevo
  port: 587,
 // secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async ({to, subject, body}) => {
    const response = await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to, 
        subject,
        html: body
    })
    return response;
}

export default sendEmail;