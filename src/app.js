import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import ContohRoutes from './routes/ContohRoutes.js';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/contoh', ContohRoutes);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});


app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
