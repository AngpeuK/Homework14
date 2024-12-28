import {APIRequestContext} from 'playwright'
import {expect} from "@playwright/test"
import {StatusCodes} from "http-status-codes";

let baseURL: string = 'http://localhost:3000/users'

export class LessonApiClient3 {
    static instance3: LessonApiClient3
    private request: APIRequestContext

    private constructor(request: APIRequestContext) {
        this.request = request
    }

    public static async getInstance(request: APIRequestContext): Promise<LessonApiClient3> {
        if (!LessonApiClient3.instance3) {
            LessonApiClient3.instance3 = new LessonApiClient3(request)

        }
        return LessonApiClient3.instance3
    }

    async createUsers(users: number): Promise<number> {
        for (let i = 0; i < users; i++) {
            await this.request.post(baseURL)
        }
        return users
    }

    async deleteUsers(): Promise<void> {
        const response = await this.request.get(`${baseURL}`)
        const responseBody = await response.json()
        const numberOfObjects = responseBody.length
        let userIDs = [];
        for (let i = 0; i < numberOfObjects; i++) {
            let userID = responseBody[i].id;
            userIDs.push(userID);
        }
        for (let i = 0; i < numberOfObjects; i++) {
            let response = await this.request.delete(`${baseURL}/${userIDs[i]}`)
            expect.soft(response.status()).toBe(StatusCodes.OK)
        }
    }
}