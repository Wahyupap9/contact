const {
  loadContact,
  findContact,
  deleteContact,
  saveData,
  cekDuplikat,
  editContact,
} = require("./functions/contact.js");
const express = require("express");
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");
const fs = require("fs");
const { check, validationResult } = require("express-validator");

const app = express();
app.use(cookieParser());

app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// buat file json
if (!fs.existsSync("./data")) {
  fs.mkdirSync("./data");
}

if (!fs.existsSync("./data/contact.json")) {
  fs.writeFileSync("data/contact.json", "[]", "utf-8");
}

// Routing
app.get("/", function (req, res) {
  var locals = {
    title: "ini index html",
    header: "Index Header",
    layout: "layouts/main-layout",
  };
  res.render("index", locals);
});

app.get("/about", function (req, res) {
  var locals = {
    title: "ini about html",
    header: "About Header",
    layout: "layouts/main-layout",
  };
  res.render("about", locals);
});

app.get("/contact/edit/:nama", function (req, res) {
  const contact = findContact(req.params.nama);
  res.render("edit", {
    layout: "layouts/main-layout",
    title: "Edit Data",
    contact,
    result: false,
  });
});

app.get("/contact/delete/:nama", function (req, res) {
  deleteContact(req.params.nama);
  res.redirect("/contact");
});

app.get("/contact/:nama", function (req, res) {
  const contact = findContact(req.params.nama);
  res.render("detail", {
    title: "Detail",
    contact,
    layout: "layouts/main-layout",
  });
});

app.get("/contact", function (req, res) {
  const contacts = loadContact();
  res.render("contact", { contacts, layout: "layouts/main-layout" });
});

app.post(
  "/contact/edit",
  [
    check("nama", "Nama sudah ada").custom((nama, { req }) => {
      if (cekDuplikat(nama) && nama !== req.body.oldNama) {
        return false;
      }
      return true;
      // return cekDuplikat(nama) && nama === req.body.oldNama ;
    }),
    check("email", "Email tidak valid").isEmail(),
    check("noHP", "Nomor HP tidak valid").isMobilePhone("id-ID"),
  ],
  function (req, res) {
    const result = validationResult(req);
    // res.send(result.errors);
    if (!result.isEmpty()) {
      res.render("edit", {
        layout: "layouts/main-layout",
        result: result.array(),
        contact: req.body,
      });
    } else {
      editContact(req.body);
      res.redirect("/contact");
    }
  }
);

app.post(
  "/contact/add",
  [
    check("nama", "Nama sudah ada").custom((nama) => {
      return !cekDuplikat(nama);
    }),
    check("email", "Email tidak valid").isEmail(),
    check("noHP", "Nomor HP tidak valid").isMobilePhone("id-ID"),
  ],
  function (req, res) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.render("add", {
        title: "add data",
        layout: "layouts/main-layout",
        result: result.array(),
      });
      // console.log(result.errors[0].msg);
    } else {
      saveData(req.body);
      res.redirect("/contact");
    }
    // res.send(result);
  }
);

app.get("/add", function (req, res) {
  var locals = {
    title: "ini add html",
    layout: "layouts/main-layout",
  };
  res.render("add", locals);
});

app.use(function (req, res) {
  res.sendStatus(404);
});

app.listen(3000, function (err) {
  if (err) console.log(err);
  console.log("Server listening on PORT", 3000);
});
