require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const userRoutes = require('./routes/userRoutes');

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('SweatSmartly API draait!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server draait op poort ${PORT}`));
