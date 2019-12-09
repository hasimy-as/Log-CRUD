import express from "express";
import alert from "alert-node";
import db from "../database/db";

const Route = express.Router();

Route.get("/login", (req, res) => {
  res.render("login");
});

Route.get("/register", (req, res) => res.render("register"));

Route.get("/", (req, res) => {
  if (req.session.loggedin) {
    res.render("homepage");
  } else {
    alert("Silahkan masuk dulu!");
    res.redirect("/login");
  }
});

Route.post("/authlog", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  if (email && password) {
    db.query(sql, [email, password], (err, rows) => {
      if (err) throw err;
      if (rows.length > 0) {
        req.session.loggedin = true;
        req.session.email = email;
        res.redirect("/");
      } else {
        alert("Wrong credentials!");
        res.redirect("/login");
      }
      res.end();
    });
  }
});

Route.post("/authreg", (req, res) => {
  let dataRegistered = {
    nama: req.body.nama,
    email: req.body.email,
    password: req.body.password
  };
  db.query("INSERT INTO users SET ?", dataRegistered, (err, results) => {
    if (err) throw err;
    console.log("data berhasil masuk dengan hasil", results);
    alert("Data anda teregistrasi!");
    res.redirect("/login");
  });
});

Route.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) throw err;
    res.redirect("/login");
  });
});

export default Route;
