import { NextApiRequest, NextApiResponse } from 'next';
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'School Management API',
      version: '1.0.0',
    },
  },
  apis: ['./src/app/api/v1/**/*.ts'], // path to API docs
};

const spec = swaggerJsdoc(options);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(spec);
}