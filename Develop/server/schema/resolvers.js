const { User } = require('../models');
const { signToken } = require('../utils/auth');

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

        ADD_USER: async (_, { username, email, password }) => {
            const user = await User.create({ username, email, password });

            if (!user) {
                throw new Error('Something is wrong!');
            }

            const token = signToken(user);
            return { token, user };
        },

        LOGIN_USER: async (_, { email, password }) => {
            const user = await User.findOne({ email });

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

        

        SAVE_BOOK: async (_, { book }, context) => {
            if (!context.user) {
                throw new Error('You need to be logged in!');
            }
            try {
                const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $addToSet: { savedBooks: book } },
                { new: true, runValidators: true }
            );

            return updatedUser;
        } catch (err) {
            console.error(err);
            throw new Error('Something went wrong!');
        }
        },


        REMOVE_BOOK: async (_, { bookId }, context) => {
            if (!context.user) {
                throw new Error('You need to be logged in!');
            }

            const updatedUser = await User.findOneAndUpdate(
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









