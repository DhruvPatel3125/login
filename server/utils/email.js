const nodemailer = require('nodemailer');

// Create a transporter using Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Send welcome email
const sendWelcomeEmail = async (email, username) => {
    try {
        const mailOptions = {
            from: {
                name: 'Your App Team',
                address: process.env.EMAIL_USER
            },
            to: process.env.EMAIL_USER,
            subject: 'Welcome to Our Platform',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Welcome ${username}!</h2>
                    <p>Thank you for registering with us. We're excited to have you on board!</p>
                    <p>You can now log in to your account and start exploring our services.</p>
                    <br>
                    <p>Best regards,</p>
                    <p>Your App Team</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Welcome email sent successfully to:', email);
        console.log('Message ID:', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending welcome email:', error);
        throw error; // Propagate error for better handling
    }
};

module.exports = {
    sendWelcomeEmail
};