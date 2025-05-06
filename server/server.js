const express = require('express');
const app = express();
const router = require('./router/auth-router');

app.use(express.json());

app.use("/api/auth", router);

const PORT = 5000;
app.listen(PORT, 'localhost', () => {
    console.log(`Server is running on: http://localhost:${PORT}`);
});
