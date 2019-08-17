module.exports = {
  verbose: true,
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  transform: {
    '^.+\\.m?js$': 'babel-jest',
  },
}
