import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression';
import mongoose from 'mongoose'
import router from './router';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

app.use(cors({
    credentials: true,
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server =http.createServer(app);

server.listen(5500, () => {
    console.log("server listening on http://localhost:5500/");
});

const MONGO_URL = process.env.MONGOPASS;
console.log("database connected succesfully")

mongoose.Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error',(error:Error)=>console.log(error));

app.use('/', router())