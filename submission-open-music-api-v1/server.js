import dotenv from 'dotenv';
import app from './src/app.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, () => {
  console.log(`Server berjalan di http://${HOST}:${PORT}`);
});