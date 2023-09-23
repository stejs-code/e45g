import {z} from "zod";
import {Meilisearch} from "~/app/meilisearch";
import crypto from "crypto";


export const userZod = z.object({
    id: z.string(),
    name: z.string(),
    password: z.string(),
    email: z.string(),
    nickname: z.string(),
    likes: z.array(z.string().describe("article id")),
    role: z.union([
        z.literal("reader").describe("ten kdo čte"),
        z.literal("creator").describe("píše články"),
        z.literal("admin").describe("*perms")
    ])
})

const index = Meilisearch.index<z.TypeOf<typeof userZod>>('users')

export async function createUser(user: z.input<typeof userZod>) {
    try {



        const salt = crypto.randomBytes(10).toString("hex")
        const hash = crypto.createHmac("sha512", salt)

        hash.update(user.password)
        user.password = hash.digest("hex") + ":" + salt

        await index.addDocuments([userZod.parse(user)])

        return {success: true}
    } catch (e) {
        console.log(e)
        return {success: false}
    }
}

export async function removeUser(id: z.TypeOf<typeof userZod["shape"]["id"]>) {
    try {
        await index.deleteDocument(id);

        return {success: true}
    } catch (e) {
        console.log(e)
        return {success: false}
    }
}


export async function getUser(id: z.TypeOf<typeof userZod["shape"]["id"]>): Promise<{
    success: true,
    data: z.TypeOf<typeof userZod>
} | {
    success: false
}> {
    try {
        return {success: true, data: await index.getDocument(id)}

    } catch (e) {
        console.log(e)
        return {success: false}

    }
}

export async function listUsers() {
    try {
        return {success: true, data: (await index.search("", {limit: 1000})).hits}

    } catch (e) {
        console.log(e)
        return {success: false}
    }
}

export const updateUserZod = userZod.partial().merge(z.object({
    id: userZod.shape.id
}))

export async function updateUser(user: z.input<typeof updateUserZod>) {
    try {
        await index.updateDocuments([updateUserZod.parse(user)])

        return {success: true}
    } catch (e) {
        console.log(e)
        return {success: false}
    }
}



