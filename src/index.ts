import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import {Request, Response} from "express";
import * as cors from 'cors'
import * as helmet from 'helmet'
import ROUTES from './routes'

const PORT = process.env.PORT || 3000 

createConnection().then(async () => {

    // create express app
    const app = express();

    //Meddlewares
    app.use(cors())
    app.use(helmet())

    app.use(express.json());
    
    // Routes
    app.use('/', ROUTES)

    // start express server esto es un call back
    app.listen(PORT, () => console.log(`Server running on port: ${ PORT }`));


}).catch(error => console.log(error));
