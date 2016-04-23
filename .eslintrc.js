module.exports = {
  "parser": "babel-eslint",
  "rules": {
    "graphql/template-strings": ['error', {
      schemaJson: require('./schema.json')
    }]
  },
  plugins: [
    'graphql'
  ]
}
