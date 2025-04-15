const sql = require('mssql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dbConfig = require('../config/db');

exports.register = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    await sql.connect(dbConfig);
    const hashedPassword = await bcrypt.hash(password, 10);

    await sql.query`
      INSERT INTO [User] (username, email, password_hash, role)
      VALUES (${username}, ${email}, ${hashedPassword}, ${role})
    `;

    res.status(201).json({ message: 'Gebruiker geregistreerd' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Fout bij registratie' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    await sql.connect(dbConfig);
    const result = await sql.query`SELECT * FROM [User] WHERE email = ${email}`;
    const user = result.recordset[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ message: 'Ongeldige login' });
    }

    const token = jwt.sign(
      { userId: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Fout bij inloggen' });
  }
};