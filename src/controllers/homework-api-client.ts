import {APIRequestContext} from 'playwright'
import {expect} from "@playwright/test"
import {StatusCodes} from "http-status-codes";

let baseURL: string = 'https://node_app:3000'

export class HomeworkApiClient {
    static instance: HomeworkApiClient
    static number: HomeworkApiClient
    private request: APIRequestContext

    private constructor(request: APIRequestContext) {
        this.request = request
    }

    public static async getInstance(request: APIRequestContext): Promise<HomeworkApiClient> {
        if (!HomeworkApiClient.instance) {
            HomeworkApiClient.instance = new HomeworkApiClient(request)

        }
        return HomeworkApiClient.instance
    }

    async createUsers(users: number): Promise<number> {
    for (let i = 0; i < users; i++) {
        let attempts = 0
        const maxAttempts = 200

        while (attempts < maxAttempts) {
            const response = await this.request.post(baseURL)
            if (!response.ok) {
                console.error(`Ошибка: ${response.status} - ${response.statusText}`);
                const errorBody = await response.text()  // Получить текстовый ответ для анализа
                console.error(errorBody)
                return
            }
            const responseBody = await response.json()

            
            if (response.status() >= 200 && response.status() < 300) {
                break
            }
            attempts++
        }
    }

    return users
}

    async deleteUsers(count: number): Promise<void> {
        const response = await this.request.get(baseURL)
        const responseBody = await response.json()
        const numberOfObjects = responseBody.length
        const usersToDelete = Math.min(count, numberOfObjects)
        let userIDs = []
        for (let i = 0; i < numberOfObjects; i++) {
            let userID = responseBody[i].id;
            userIDs.push(userID)
        }
        for (let i = 0; i < usersToDelete; i++) {
            let response = await this.request.delete(`${baseURL}/${userIDs[i]}`)
            expect.soft(response.status()).toBe(StatusCodes.OK)
            console.log(`Deleted ${usersToDelete} users.`)
        }
    }

    async deleteAllUsers(): Promise<void> {
        const response = await this.request.get(baseURL)
        const responseBody = await response.json()
        const numberOfObjects = responseBody.length
        let userIDs = [];
        for (let i = 0; i < numberOfObjects; i++) {
            let userID = responseBody[i].id
            userIDs.push(userID);
        }
        for (let i = 0; i < numberOfObjects; i++) {
            let response = await this.request.delete(`${baseURL}/${userIDs[i]}`)
            expect.soft(response.status()).toBe(StatusCodes.OK)
        }
    }

    async checkAllUsersDeleted(): Promise<void> {
        const response = await this.request.get(baseURL)
        expect(response.status()).toBe(StatusCodes.OK)
        const responseBody = await response.text()
        expect(responseBody).toBe('[]');
    }


    async getUserDataByIndex(index: number): Promise<any> {
        const response = await this.request.get(baseURL)
        const responseBody = await response.json()

        const users: any[] = []
        for (let i = 0; i < responseBody.length; i++) {
            let allUsers = responseBody[i]
            users.push(allUsers)
        }

        if (index >= 0 && index < users.length) {
            const selectedUser = users[index]
            console.log(`User at index ${index}:`, selectedUser)
            return selectedUser
        } else {
            console.log('Index out of bounds')
            return null
        }
    }
}
