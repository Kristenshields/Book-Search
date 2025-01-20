const { gql } = require('apollo-server-express');

const typeDefs = gql`
type User {
  _id: ID
  username: String
  email: String
  bookCount: Int
  savedBooks: [Book]
}
  
 type Book {
    bookId: ID!
    authors: [String]
    description: String
    title: String!
    image: String
    link: String
  }

    type Auth {
      token: ID!
      user: User
    }

  type Query {
    me: User
  }

  type Mutation {
    LOGIN_USER(email: String!, password: String!): Auth
    ADD_USER(username: String!, email: String!, password: String!): Auth
    SAVE_BOOK(book: BookInput!): User
    REMOVE_BOOK(bookId: ID!): User
  }

  input BookInput {
    bookId: ID!
    authors: [String]
    description: String
    title: String!
    image: String
    link: String
  }
  `;
  
module.exports = typeDefs;