const express = require('express');
const path = require('path');
const { ApolloServer, gql } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schema');
const db = require('./config/connection');
const { authMiddleware } = require('./utils/auth');


const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    try {
      const decoded = jwt.verify(token, 'secret');
      return { user: decoded };
    } catch (e) {
      return { user: null };
    }
  },
});
  
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }

 server.applyMiddleware({ app });

  db.once('open', () => {
    app.listen(PORT, () => 
      console.log(`🌍 Now listening on localhost:${PORT}`)
    );
});

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
  
  module.exports = server;
  
