const Razorpay = require('razorpay');
const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env; // Assuming you are using environment variables for keys

// Initialize Razorpay instance
const razorpayInstance = new Razorpay({
    key_id: RAZORPAY_KEY_ID, // Use environment variable
    key_secret: RAZORPAY_KEY_SECRET // Use environment variable
});

// Controller function to create a Razorpay order
exports.createOrder = async (req, res) => {
    try {
        // You can get amount and currency from the request body if needed
        const options = {
            amount: 50000, // Amount in paise (e.g., 50000 paise = ₹500)
            currency: "INR", // Currency code
            receipt: "order_rcptid_" + Date.now(), // Unique receipt ID
            // notes: { key1: "value1", key2: "value2" } // Optional notes
        };

        const order = await razorpayInstance.orders.create(options);

        res.json(order); // Send the order details back to the frontend

    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({ error: "Failed to create order", details: error.message });
    }
};

// TODO: Implement the payment verification controller function here
exports.verifyPayment = async (req, res) => {
    // This function will be called by the frontend after successful payment
    // It needs to verify the payment signature received from Razorpay
    console.log("Payment verification endpoint hit.", req.body);
    res.status(501).json({ message: "Payment verification not implemented yet." });
}; 