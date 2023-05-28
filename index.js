const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("build"));
// Define a custom token for Morgan
morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

app.use(morgan(":method :url :body"));

let phonebook = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(phonebook);
});

app.post("/api/persons", (request, response) => {
  const rand = parseInt(Math.random() * (200 - 5) + 5);
  const node = request.body;
  const already = phonebook.find((item) => {
    // console.log("ppp", typeof item.name);
    // console.log("uuu", typeof node.name);
    return item.name === node.name;
  });
  console.log("pp", already);
  if (!node.name) {
    return response.status(404).json({
      error: "name missing",
    });
  } else if (already) {
    return response.status(400).json({
      error: "name already taken",
    });
  }
  //console.log("kkk", node);
  node.id = rand;
  //console.log("ll", node);
  phonebook = phonebook.concat(node);

  response.json(node);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const node = phonebook.find((item) => item.id === id);
  response.json(node);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const node = phonebook.filter((item) => item.id !== id);
  //response.json(node);
  response.status(204).end();
});
app.get("/info", (request, response) => {
  response.send(`Phonebook has ${phonebook.length} Records <br/>  ${Date()} `);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});
