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

// Send OTP email
const sendOTPEmail = async (email, otp, username) => {
    try {
        const mailOptions = {
            from: {
                name: 'Your App Team',
                address: process.env.EMAIL_USER
            },
            to: email,
            subject: 'Email Verification OTP',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Hi ${username}!</h2>
                    <p>Your verification code is:</p>
                    <h1 style="color: #4CAF50; font-size: 40px; letter-spacing: 5px; text-align: center; margin: 20px;">
                        ${otp}
                    </h1>
                    <p>This code will expire in 10 minutes.</p>
                    <p>If you didn't request this code, please ignore this email.</p>
                    <br>
                    <p>Best regards,</p>
                    <p>Your App Team</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('OTP email sent successfully to:', email);
        console.log('Message ID:', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw error;
    }
};

module.exports = {
    sendOTPEmail
};
//email validation