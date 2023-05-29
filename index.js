const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const app = express();
app.use(express.static("build"));
app.use(express.json());

app.use(cors());

// Define a custom token for Morgan
morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

app.use(morgan(":method :url :body"));

// let phonebook = [
//   {
//     id: 1,
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: 2,
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: 3,
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: 4,
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
// ];

app.get("/api/persons", (request, response) => {
  Person.find({}).then((person) => {
    response.json(person);
  });
});

app.put("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  console.log("Dfds", typeof id);

  const { name, number } = request.body;

  Person.findByIdAndUpdate(
    id,
    { name, number },
    {
      new: true,
      runValidators: true,
      context: "query",
    }
  )
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const rand = parseInt(Math.random() * (200 - 5) + 5);
  const node = request.body;

  // const already = phonebook.find((item) => {
  //   // console.log("ppp", typeof item.name);
  //   // console.log("uuu", typeof node.name);
  //   return item.name === node.name;
  // });
  // console.log("pp", already);
  if (!node.name) {
    return response.status(404).json({
      error: "name missing",
    });
  }
  //else if (already) {
  //   return response.status(400).json({
  //     error: "name already taken",
  //   });
  // }
  //console.log("kkk", node);
  node.id = rand;
  //console.log("ll", node);
  //phonebook = phonebook.concat(node);

  const person = new Person({
    name: node.name,
    number: node.number,
  });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
  // const node = phonebook.find((item) => item.id === id);
  // response.json(node);
});

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findByIdAndRemove(id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));

  // const node = phonebook.filter((item) => item.id !== id);
  // //response.json(node);
  // response.status(204).end();
});

// app.get("/info", (request, response) => {
//   response.send(`Phonebook has ${phonebook.length} Records <br/>  ${Date()} `);
// });

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

// this has to be the last loaded middleware.
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});
