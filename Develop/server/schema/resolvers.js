const { User } = require('../models');
const { signToken, } = require('../utils/auth');

const resolvers = {
    Query: {

        me: async (_, __, context) => {
            if (!context.user) {
                throw new Error('You need to be logged in!');
            }

            const foundUser = await User.findOne({
                $or: [
                    { _id: context.user._id },
                    { username: context.user.username }
                ],
            });

            if (!foundUser) {
                throw new Error('No user found with this id!');
            }
            
            return foundUser;
        },
    },

    Mutation: {

        addUser: async (_, { username, email, password }) => {
            const user = await User.create({ username, email, password });

            if (!user) {
                throw new Error('Something is wrong!');
            }

            const token = signToken(user);
            return { token, user };
        },

        loginUser: async (_, { email, password }) => {
            const user = await User.findOne({ email, password });

            if (!user) {
                throw new Error('No user with this email found!');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new Error('Incorrect password!');
            }

            const token = signToken(user);
            return { token, user };
        },

        

        saveBook: async (_, { bookData }, context) => {
            if (!context.user) {
                throw new Error('You need to be logged in!');
            }
            try {
                const updatedUser = await User.findByIdAndUpdate(
                { _id: context.user._id },
                { $addToSet: { savedBooks: bookData } },
                { new: true, runValidators: true }
            );

            return updatedUser;
        } catch (err) {
            console.error(err);
            throw new Error('Something went wrong!');
        }
        },


        removeBook: async (_, { bookId }, context) => {
            if (!context.user) {
                throw new Error('You need to be logged in!');
            }

            const updatedUser = await User.findAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId } } },
                { new: true }
            );

            if (!updatedUser) {
                throw new Error('No user found with this id!');
            }

            return updatedUser;
        },
    },
};

module.exports = resolvers;









