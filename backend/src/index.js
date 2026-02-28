import dotenv from 'dotenv';
import app from './app.js';
import connectDB  from './database/dbConnect.js';

dotenv.config();

connectDB()
.then(() => {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
})
.catch((error) => {
    console.error('Failed to connect to the database:', error);
    process.exit(1); // Exit the process with failure
});