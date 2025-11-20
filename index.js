import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// PostgreSQL connection
const db = new pg.Client({
  user: "postgres",      // replace with your PostgreSQL username
  host: "localhost",
  database: "birdsfinder",       // replace with your DB name
  password: "Gaby@123",  // replace with your PostgreSQL password
  port: 5432,
});
db.connect();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // serve CSS
app.set("view engine", "ejs");

// GET home page
app.get("/", (req, res) => {
  res.render("index", { result: null, error: null });
});

// POST search
app.post("/search", async (req, res) => {
  const input = req.body.query.trim();

  try {
    let queryText, values;
    let resultText = "";

    // First check if input matches a bird
    queryText = "SELECT country FROM birds WHERE LOWER(bird_name) = LOWER($1)";
    values = [input];
    let result = await db.query(queryText, values);

    if (result.rows.length > 0) {
      resultText = `${input} is from ${result.rows[0].country}.`;
      return res.render("index", { result: resultText, error: null });
    }

    // Otherwise check if input matches a country
    queryText = "SELECT bird_name FROM birds WHERE LOWER(country) = LOWER($1)";
    values = [input];
    result = await db.query(queryText, values);

    if (result.rows.length > 0) {
      const birds = result.rows.map(r => r.bird_name).join(", ");
      resultText = `Birds from ${input}: ${birds}`;
      return res.render("index", { result: resultText, error: null });
    }

    // Nothing found
    res.render("index", { result: null, error: "No results found." });

  } catch (err) {
    console.error(err);
    res.render("index", { result: null, error: "Database error." });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
