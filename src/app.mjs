import Express from 'express';
import bodyParser from 'body-parser';
import Boom from '@hapi/boom';
// import { startConnection } from './src/mongo/index.mjs';
import filtro from './handlers/filters/index.mjs';
import { PORT } from './commons/env.mjs';
import uploadFiles from './controllers/files/uploadFiles.mjs';
import buildContainer from './container/buildContainer.mjs';

const app = Express();
app.use(bodyParser.json());

app.use(buildContainer);

// Ruta que permite subir varias imagenes (solo se puede con un filtro de momento)
app.post('/upload', uploadFiles);

app.use('/image', filtro);

app.use((error, req, res, next) => {
  if (error) {
    const err = Boom.isBoom(error) ? error : Boom.internal(error);
    const { statusCode } = err.output;
    const { payload } = err.output;
    return res.status(statusCode).json(payload);
  }

  return next;
});

app.get('/', (req, res) => {
  res.send('Hola');
});

export default app();
