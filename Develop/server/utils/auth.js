const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');


// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = "2h";


  // function for our authenticated routes
  const authMiddleware = ({ req }) => {
    const authHeader = req.headers?.authorization || '';
    console.log('Authotization header:', authHeader);

     const token = authHeader.split(' ')[1];
     if (!token) {
      console.log('no token provided');
      return { user: null};
     }

     try {
      const { data } = jwt.verify(token, secret, { algorithms: ['HS256'] });
      console.log('token verified. User data:', data);
      return { user: data };
    } catch (err) {
      console.error(`Token verification error: ${err.message}`);
      if (err.name === 'TokenExpiredError') {
        throw new Error('Token has expired');
      } else {
        throw new Error('Invalid token');
    }
      }
    };
  
  module.exports = {
    authMiddleware,
    AuthenticationError: new GraphQLError('Could not authenticate user.', {
      extensions: {
        code: 'UNAUTHENTICATED',
      },
    }),
    signToken: function ({ username, email, _id }) {
      const payload = { username, email, _id };
      return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
    },
  };

  

  
