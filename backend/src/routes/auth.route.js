// const express = require ('express');
import express from 'express';

const app = express.Router();

app.get( "/signup" ,(req, res) => {
    res.send("signup endpoint");
});

app.get( "/login" ,(req, res) => {
    res.send("login");
});

app.get("/logout", (req, res) => {
    res.send("logout");
});

export default app;