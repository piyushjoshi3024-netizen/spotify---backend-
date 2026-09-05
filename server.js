require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/db');

connectDB();
console.log("JWT_SECRET =", process.env.JWT_SECRET);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});


