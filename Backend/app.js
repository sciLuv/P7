import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import contentRoutes from './routes/content.js';
import userRoutes from './routes/users.js';
import commentRoutes from './routes/comment.js';
import Db from './db/db.js';


const app = express();

app.use(express.json());

app.use(contentRoutes);
app.use(userRoutes);
app.use(commentRoutes);

Db.sync()
    .then(console.log('connexion à la bdd'))
    .catch((error) => console.log(error));

app.listen(process.env.PORT, () => console.log('le serveur backend est en route'));
