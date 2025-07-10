 # Node.js Authentication & Payment App

## Project Overview
This project is a Node.js/Express web application that provides:
- User registration and login (with OTP email verification)
- Social login with Google (OAuth2)
- Payment integration (Razorpay)
- Email notifications (using Nodemailer)
- Secure session management

---

## Features

### 1. **User Registration & Login with OTP**
- Users can register with email, username, phone, and password.
- On registration, an OTP is sent to the user's email for verification.
- Login requires email and password. If the user is not verified, an OTP is sent for verification.

### 2. **Google OAuth Login**
- Users can log in using their Google account.
- After Google authentication, an OTP is sent to the user's Google email for verification.
- Only after OTP verification is the session established.

### 3. **Email Notifications (Nodemailer)**
- All OTPs are sent via email using Nodemailer and Gmail SMTP.
- Email credentials are securely managed via environment variables.

### 4. **Payment Integration (Razorpay)**
- Users can make payments via Razorpay from the home page.
- Payment status is verified and displayed to the user.

### 5. **Session Management**
- User sessions are managed using `express-session`.
- (For production, use a persistent session store like MongoDB or Redis.)

---

## Project Structure

```
login/server/
├── controllers/         # Route controllers (auth, payment)
├── middlewares/         # Custom middleware (validation)
├── models/              # Mongoose models (User)
├── public/              # Static assets (CSS, JS)
├── router/              # Express routers
├── utils/               # Utility modules (passport, email, db)
├── validators/          # Joi validation schemas
├── views/               # EJS templates
├── server.js            # Main server file
├── Dockerfile           # Docker build instructions
├── .dockerignore        # Docker ignore file
├── package.json         # Node.js dependencies
└── README.md            # Project documentation
```

---

## Environment Variables
Create a `.env` file in `login/server/` with the following:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/yourdbname
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
JWT_SECRET_KEY=your-jwt-secret
RAZORPAY_KEY_ID=your-razorpay-key
```

- **EMAIL_USER/EMAIL_PASS:** Use Gmail and an App Password (not your main password).
- **GOOGLE_CLIENT_ID/SECRET:** Get from Google Cloud Console (OAuth2 credentials).
- **RAZORPAY_KEY_ID:** Get from Razorpay dashboard.

---

## Local Development Setup

1. **Install dependencies:**
   ```sh
   cd login/server
   npm install
   ```
2. **Set up your `.env` file** as above.
3. **Start MongoDB** (locally or use MongoDB Atlas).
4. **Run the app:**
   ```sh
   npm start
   # or for auto-reload during development
   npx nodemon server.js
   ```
5. **Visit:** [http://localhost:5000](http://localhost:5000)

---

## Docker Usage

### **Build the Docker image:**
```sh
docker build -t myapp .
```

### **Run the Docker container:**
```sh
docker run -p 5000:5000 --env-file .env myapp
```
- Make sure your `.env` file is in the same directory where you run the command.
- MongoDB must be accessible from inside the container (use a public MongoDB URI or Docker Compose for local MongoDB).

### **Push to Docker Hub:**
```sh
docker tag myapp yourdockerhubusername/myapp
# Login to Docker Hub if needed
docker login
# Push the image
docker push yourdockerhubusername/myapp
```

---

## Functionality Explained

### **1. Registration & OTP Verification**
- User registers → OTP sent to email → User enters OTP → Account verified.
- OTP is valid for 10 minutes.

### **2. Login**
- User logs in with email/password.
- If not verified, OTP is sent again for verification.
- If verified, user is redirected to the home page.

### **3. Google OAuth Login**
- User clicks "Login with Google".
- Google OAuth flow starts, user selects account.
- After Google login, OTP is sent to the Google email.
- User must enter OTP to complete login.

### **4. Nodemailer Email Sending**
- Uses Gmail SMTP to send OTP emails.
- All email logic is in `utils/email.js`.

### **5. Payment Integration**
- On the home page, user can make a payment (₹500) via Razorpay.
- Payment order is created and verified via Razorpay API.
- Payment status is shown to the user.

---

## Useful Docker Commands

- **Build image:**
  ```sh
  docker build -t myapp .
  ```
- **Run container:**
  ```sh
  docker run -p 5000:5000 --env-file .env myapp
  ```
- **View running containers:**
  ```sh
  docker ps
  ```
- **Stop a container:**
  ```sh
  docker stop <container_id>
  ```
- **View logs:**
  ```sh
  docker logs <container_id>
  ```

---

## Notes
- For production, use a persistent session store (e.g., MongoDB, Redis) instead of the default MemoryStore.
- Make sure your Gmail account allows SMTP/app passwords.
- For local MongoDB, ensure the container can access your host's MongoDB (or use Docker Compose).
- Keep your `.env` file secure and **never commit it to version control**.

---

## License
MIT
