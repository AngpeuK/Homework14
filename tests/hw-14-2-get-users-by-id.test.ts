import {test, expect} from '@playwright/test'
import {HomeworkApiClient2} from "../src/controllers/homework-api-client2"

let baseURL: string = 'http://localhost:3000/users'

test.describe('homework-14-2', () => {
        test('Get user data by ID (using index)', async ({request}) => {
            const apiClient = await HomeworkApiClient2.getInstance(request)
            await apiClient.deleteAllUsers()
            const usersCount = await apiClient.createUsers(20)
            const response = await request.get(`${baseURL}`)
            const responseBody = await response.json()
            let numberOfObjects = responseBody.length
            expect(numberOfObjects).toBe(usersCount)
            const userData = await apiClient.getUserDataByIndex(2)

            if (userData) {
                expect(userData).toHaveProperty('id')
                expect(userData).toHaveProperty('name')
                expect(userData).toHaveProperty('email')
                expect(userData).toHaveProperty('phone')
                console.log(userData)
                await apiClient.deleteAllUsers()
            } else {
                console.log('No user found or invalid index.')
                await apiClient.deleteAllUsers()
            }
            await apiClient.deleteAllUsers()
        })
    })
