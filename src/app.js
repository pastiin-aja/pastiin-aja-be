import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import FraudRoutes from './routes/FraudRoutes.js'
import UserRoutes from './routes/UserRoutes.js'
import AuthRoutes from './routes/AuthRoutes.js'

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors());

app.use('/', FraudRoutes)
app.use('/user', UserRoutes)
app.use('/', AuthRoutes)

app.get('/', (req, res) => {
  res.send('Hello, World!');
});


app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
