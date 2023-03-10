import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
    verbose: true,
    preset: 'ts-jest',
    modulePaths: [
        "<rootDir>"
    ],
};

export default config;