import express from 'express';//allows to create a server quickly.

import helmet from "helmet"; //increases the security of our http header returned not express
import cors from 'cors'; //allows to avoid various errors related to the HTTP CORS security.
import rateLimit from 'express-rate-limit'; //allows to limit the requests to one api to avoid server overload.

import Db from './db/db.js'; //the database connexion

import userRoutes from './routes/users.js'; //routes in charge of users
import contentRoutes from './routes/content.js'; //routes in charge of contents
import commentRoutes from './routes/comment.js'; //routes in charge of comments

const app = express(); //Express call under the constant app.

Db.sync() //sequelize method sync. to connect the backend to the database and sync models
    .then(console.log('connexion à MySQL reussite.'))
    .catch((error) => console.log(error));

//mise en place d'helmet avec la modification de la regle qui bloque les requete d'origine différentes
app.use(helmet(
    { crossOriginResourcePolicy: { policy: "same-site" } }
));
//call the cors() method of previously called package
app.use(cors());
//replace body-parser, allows to format the information sent as JSON 
app.use(express.json());


//implementation of the rules of limitation of request by IP
const limiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	max: 15, // Limit each IP to 15 requests per `window` (here, per 5 minutes)
	standardHeaders: true, //Returns the rate limit information in the `RateLimit-*` headers
	legacyHeaders: false, //Disable `X-RateLimit-*` headers 
})
//Applies rate limiting middleware to all requests
app.use(limiter);

//permet d'appeler et d'acceder aux routes et à l'ensemble de leurs fonctionnalité
app.use(contentRoutes);
app.use(userRoutes);
app.use(commentRoutes);

//To export express and all the logics linked to it in the server file.
export default app;
