module.exports = {
    transform: {
        '\\.(ts|js)$': '<rootDir>/node_modules/ts-jest',
    },
    moduleFileExtensions: [
        'ts',
        'tsx',
        'js',
        'jsx',
        'json',
    ],
    testEnvironment: 'jest-environment-jsdom',
    testRegex: 'src/.*\\.spec.(js|ts)$',
    setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
    collectCoverageFrom: [
        'src/**/*.{js,ts}',
    ],
    coveragePathIgnorePatterns: [
        '\\.mock\\.(js|ts)$',
        '\\.typedef\\.(js|ts)$',
    ],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },
};
