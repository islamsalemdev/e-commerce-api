const express = require("express");
const app = express();
const i18n = require("i18n");

const langMiddleWare = app.use((req, res, next) => {
  const language = req.headers["accept-language"] || "ar";
  i18n.setLocale(language);
  next();
});

module.exports = langMiddleWare;
