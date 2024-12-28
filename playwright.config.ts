import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    use: {
        baseURL: 'https://node_app:3000/users',  // Adjust to your actual API base URL
    },
    workers: 1
});
