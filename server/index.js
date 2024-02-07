import express from "express";
import { PORT, mongoURL } from "./config.js";
import mongoose from "mongoose";

const app = express();

mongoose.connect(mongoURL)
    .then( () => {
        console.log("Connected");
        app.listen( PORT , () => {
            console.log('App is Listening');
        });
    }).catch( (error) => {
        console.log(error);
    });
