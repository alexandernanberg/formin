module.exports = {
  verbose: true,
  setupFilesAfterEnv: ['react-testing-library/cleanup-after-each'],
  transform: {
    '^.+\\.m?js$': 'babel-jest',
  },
}
