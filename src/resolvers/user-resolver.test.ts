import Sequelize from "sequelize/types/sequelize";
import { graphQlCall } from "../test-utils/graphQlCall";
import { testConnect } from "../test-utils/testConn";
import { UserTvShow } from "../dto/model/user-tv-show.model";
import { mockMutations } from "../test-utils/mockMutations";
import { variableValues } from "../test-utils/mockVariableValues";
import { TvShow } from "../dto/model/tv-show.model";
import { User } from "../dto/model/user-model";

let conn: Sequelize
let registerUserResponse: any
let createTvShowMutationResponse: any

beforeAll(async () => {
    conn = await testConnect()

    if (!registerUserResponse) {
        registerUserResponse = await graphQlCall({
            source: mockMutations.registerUserMutation,
            variableValues: variableValues.userInput
        })
    }

    if (!createTvShowMutationResponse) {
        createTvShowMutationResponse = await graphQlCall({
            source: mockMutations.createTvShowMutation,
            variableValues: variableValues.tvShowInput
        })
    }
})

afterAll(async () => {
    await conn.close()
})

describe('Mutations', () => {
    it("should register an user with success", async () => {
        expect(registerUserResponse).toMatchObject({
            data: {
                registerUser: {
                    name: variableValues.userInput.name,
                    email: variableValues.userInput.email
                }
            }
        })
    })

    it('should create a favorite TV show from a user with success', async () => {
        const userTvShowInput = {
            userId: '1',
            tvShowId: '1'
        }

        const createFavoriteMutationResponse = await graphQlCall({
            source: mockMutations.createFavoriteShow,
            variableValues: userTvShowInput
        })
        const tvShowResponse = await TvShow.findOne({ where: { id: createFavoriteMutationResponse.data?.addFavorite.tvShowId } });
        expect(tvShowResponse?.name).toMatch(variableValues.tvShowInput.name)
    });

    it('should remove a favorite TV show from a user with success', async () => {
        const userTvShowInput = {
            userId: '1',
            tvShowId: '1'
        }

        const removeFavoriteShowMutationResponse = await graphQlCall({
            source: mockMutations.removeFavoriteShow,
            variableValues: userTvShowInput
        })
        
        expect(removeFavoriteShowMutationResponse.data?.removeFavorite).toBe(true)
    });

})





