import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    use: {
        baseURL: 'http://node_app:3000',  // Adjust to your actual API base URL
    },
    workers: 1
});
