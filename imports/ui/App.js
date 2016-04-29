import React, { Component } from 'react';
import { connect } from 'react-apollo';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Accounts } from 'meteor/std:accounts-ui';

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY'
});

const App = ({ userId, data, mutate }) => {
  return (
    <div>
      <Accounts.ui.LoginForm />
      { data.loading ? "Loading..." : <Users users={data.users} /> }
      { userId && <PostNote mutate={mutate} refetch={data.refetch}/> }
    </div>
  )
}

const Users = ({ users }) => (
  <ul>
    { users.map(({ username, notes }) => (
      <li>
        <h3>{ username }</h3>
        <ul>
          { notes.map(({ private, text }) => (
            <p>{ (private ? "🔒 " : "") + text }</p>
          )) }
        </ul>
      </li>
    )) }
  </ul>
)

const PostNote = ({ mutate, refetch }) => {
  function onSubmit(event) {
    event.preventDefault();

    mutate({
      mutation: `
        mutation postReply($text: String!, $private: Boolean) {
          createNote(text: $text, private: $private)
        }
      `,
      variables: {
        text: event.target.text.value,
        private: event.target.private.checked,
      }
    }).then(() => refetch())
  }

  return (
    <form onSubmit={onSubmit}>
      <input name="text" />
      <label>
        Private
        <input type="checkbox" name="private" />
      </label>
    </form>
  );
};

// This container brings in Apollo GraphQL data
const AppWithData = connect({
  mapQueriesToProps() {
    return {
      data: {
        query: `
          {
            users {
              username
              notes {
                private
                text
              }
            }
          }
        `,
        forceFetch: true,
      },
    };
  },
})(App);

// This container brings in Tracker-enabled Meteor data
const AppWithUserId = createContainer(() => {
  return {
    userId: Meteor.userId(),
  };
}, AppWithData);

export default AppWithUserId;
