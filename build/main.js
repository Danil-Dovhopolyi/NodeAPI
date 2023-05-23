import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import AuthRoutes from './routes/AuthRoutes.js';
import cors from 'cors';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerConfig from './swagger/swagger.js';
dotenv.config();
const mongoString = process.env.DB_URL || '';
const database = mongoose.connection;
mongoose.connect(mongoString);
const app = express();
const swaggerSpec = swaggerJsDoc(swaggerConfig);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
database.on('error', (error) => {
    console.log(error);
});
database.once('connected', () => {
    console.log('Database Connected');
});
app.use(cors());
app.use(express.json());
app.use('/auth', AuthRoutes);
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
//# sourceMappingURL=main.js.map