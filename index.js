import express from 'express';
import 'dotenv/config';
import userRoute from './routes/userRoute.js';


const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended:true }));

app.use('/api/v1/users', userRoute)


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});