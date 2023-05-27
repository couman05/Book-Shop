import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "test",
});

app.get("/", (req, res) => {
  res.json("hello");
});


app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // TODO: Implement validation for username and password

    // Check if the username already exists in the database
    db.query('SELECT * FROM utilizatori WHERE username = ?', [username], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'An error occurred while checking username' });
        }

        if (result.length > 0) {
            return res.status(409).json({ error: 'Username already exists' });
        }

        // TODO: Hash the password before storing it in the database

        // Insert the new user into the database
        db.query('INSERT INTO utilizatori (username, password) VALUES (?, ?)', [username, password], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'An error occurred while registering the user' });
            }

            return res.status(201).json({ message: 'User registered successfully' });
        });
    });
});


app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // TODO: Implement validation for username and password

    // Check if the username and password match a user in the database
    db.query('SELECT * FROM utilizatori WHERE username = ?', [username], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'An error occurred while logging in' });
        }

        if (result.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // TODO: Compare the hashed password stored in the database with the provided password

        return res.status(200).json({ message: 'Login successful' });
    });
});











app.get("/books", (req, res) => {
  const q = "SELECT * FROM books";
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
});

app.post("/books", (req, res) => {
  const q = "INSERT INTO books(`title`, `desc`, `price`, `cover`) VALUES (?)";

  const values = [
    req.body.title,
    req.body.desc,
    req.body.price,
    req.body.cover,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

app.delete("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q = " DELETE FROM books WHERE id = ? ";

  db.query(q, [bookId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

app.put("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q = "UPDATE books SET `title`= ?, `desc`= ?, `price`= ?, `cover`= ? WHERE id = ?";

  const values = [
    req.body.title,
    req.body.desc,
    req.body.price,
    req.body.cover,
  ];

  db.query(q, [...values,bookId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

app.listen(8800, () => {
  console.log("Connected to backend.");
});
