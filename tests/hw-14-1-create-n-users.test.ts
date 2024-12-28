import {test, expect} from '@playwright/test'
import {HomeworkApiClient} from "../src/controllers/homework-api-client";

let baseURL: string = 'http://node_app:3000'


test.describe('homework-14-1', () => {

    test('POST n users', async ({request}) => {
        const apiClient = await HomeworkApiClient.getInstance(request)
        await apiClient.deleteAllUsers()
        const usersCount = await apiClient.createUsers(5)
        const response = await request.get(baseURL)
        const responseBody = await response.json()
        let numberOfObjects = responseBody.length
        expect(numberOfObjects).toBe(usersCount)
        await apiClient.deleteAllUsers()
    })
})
