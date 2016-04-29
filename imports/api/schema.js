import { Random } from 'meteor/random';

export const schema = [`
type User {
  username: String
  notes: [Note]
}

type Note {
  text: String
  private: Boolean
}

type Query {
  users: [User]
}

type Mutation {
  createNote(text: String!, private: Boolean): String
}

schema {
  query: Query
  mutation: Mutation
}
`];

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

const Users = Meteor.users;
const Notes = new Mongo.Collection('notes');

export const resolvers = {
  Query: {
    async users() {
      return Users.find().fetch();
    }
  },
  User: {
    async notes(user, _, context) {
      const query = { userId: user._id };

      if (!context.user || user._id !== context.user._id) {
        query.private = false;
      }

      return Notes.find(query).fetch();
    }
  },
  Mutation: {
    async createNote(_, { text, private }, { user }) {
      return Notes.insert({
        text,
        private,
        userId: user._id,
      });
    }
  }
}
