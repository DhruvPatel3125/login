const Razorpay = require('razorpay');
const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;

const razorpayInstance = new Razorpay({
    key_id: RAZORPAY_KEY_ID, 
    key_secret: RAZORPAY_KEY_SECRET 
});

exports.createOrder = async (req, res) => {
    try {
       
        const options = {
            amount: 50000, 
            currency: "INR", 
            receipt: "order_rcptid_" + Date.now(),
           
        };

        const order = await razorpayInstance.orders.create(options);

        res.json(order);

    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({ error: "Failed to create order", details: error.message });
    }
};


exports.verifyPayment = async (req, res) => {
   
    console.log("Payment verification endpoint hit.", req.body);
    res.status(501).json({ message: "Payment verification not implemented yet." });
}; 