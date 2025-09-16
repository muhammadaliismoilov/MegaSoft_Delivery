import Typesense from 'typesense';

const typesense = new Typesense.Client({
  nodes: [
    {
      host: 'localhost', // yoki server IP
      port: 8108,
      protocol: 'http',
    },
  ],
  apiKey: 'xyz', // docker-compose dagi api-key bilan bir xil bo‘lishi kerak
  connectionTimeoutSeconds: 2,
});

export default typesense;
