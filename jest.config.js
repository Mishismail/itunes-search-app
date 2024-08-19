module.exports = {
    roots: ['<rootDir>/src'],
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
    },
    testEnvironment: 'jsdom', // Ensure this is set to jsdom
    moduleFileExtensions: ['js', 'jsx'],
    moduleNameMapper: {
      '\\.(css|less)$': '<rootDir>/src/mocks/styleMock.js',
      '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/src/mocks/fileMock.js',
    },
  };
  
  