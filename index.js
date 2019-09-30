// implement your API here
const express = require("express");
const userData = require("./data/db.js");

const app = express();
// json middleware to tell express how to read data
app.use(express.json());

// get users
app.get("/api/users", (req, res) => {
  console.log(userData.find());
  userData
    .find()
    .then(users => res.status(200).json(users))
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ error: "The users information could not be retrieved." });
    });
});

// POST add a new user
// app.post("/api/users", (req, res) => {
//   console.log(req.body);
//   const user = req.body;
//   userData.insert(user)
//     // .then(({ id }) => userData.findById(id))
//     .then(userId => {
//       userData.findById(userId.id)
//         .then(user => {
//           res.status(201).json(user);
//         })
//         .catch(err => {
//           console.log(err);
//           res.status(500).json({ error: "Server error retrieving user" });
//         });
//     })
//     .catch(err => {
//       console.log(err);
//       res
//         .status(400)
//         .json({ errorMessage: "Please provide name and bio for the user." });
//     });
// });

app.post('/api/users', (req, res) => {
  console.log(req.body);
  const { name, bio } = req.body;
  if (!name || !bio) {
    res.status(400).json({ error: "Requires name and bio" });
  }
  userData.insert({ name, bio })
    .then(({ id }) => {
      userData.findById(id)
        .then(user => {
          res.status(201).json(user);
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({ error: "Server error retrieving user"});
        })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: "There was an error while saving the user to the database"})
    })
})

// get user by id
app.get("/api/users/:id", (req, res) => {
  const { id } = req.params;
  // console.log(req.params)
  userData
    .findById(id)
    .then(user => {
      console.log("user: ", user);
      if (user) {
        res.status(200).json(user);
      } else {
        res
          .status(404)
          .json({
            error: `The user with the specified ID ${id} does not exist.`
          });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: `User info cannot be retrieved` });
    });
});

const port = 5000;
app.listen(port, () => console.log(`Server started on ${port}`));
