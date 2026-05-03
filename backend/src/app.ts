import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { accountController } from './dependencies';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('API is running');
});

app.post('/accounts', accountController.register.bind(accountController));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
