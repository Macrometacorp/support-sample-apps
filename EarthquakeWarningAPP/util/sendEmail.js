import nodemailer from 'nodemailer';

export default async function sendEmail(to, subject, body) {
    try {
        // Create a transport object to send the email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        // Define the email options
        const mailOptions = {
            from: process.env.EMAIL,
            to,
            subject,
            text: body
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);

        console.log(`Email sent: ${info.messageId}`);
    } catch (error) {
        console.error(`Error sending email: ${error}`);
    }
}