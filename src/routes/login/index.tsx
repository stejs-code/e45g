import {component$} from "@builder.io/qwik";
import {Form, routeAction$, server$, zod$} from "@builder.io/qwik-city";

import {Meilisearch} from "~/app/meilisearch";
import {z} from "zod";
import type {userZod} from "~/app/user";
import crypto from "crypto";
import {redis} from "~/app/redis";


export default component$(() => {
    const action = useLoginAction()
    return <>
        <Form action={action}>
            <input name="login" placeholder={"Nickname or Email"} value={"semiiiik"}/>
            <input name="password" placeholder={"Password"} value={"semiiiik"}/>
            <button type="submit">Login</button>
        </Form>
        {action.value?.error}
    </>
})

export const useLoginAction = routeAction$(async (data, {cookie,}) => {

    const loginResponse = await login(data)
    if (loginResponse.success) {
        const date = new Date()
        date.setDate(date.getDate() + 1);
        cookie.set("session", loginResponse.sessionID, {
            expires: date
        })
    }
    return loginResponse
}, zod$({
    login: z.string(),
    password: z.string()
}));

export const login = server$(async (data): Promise<{ success: false, error: string } | {
    success: true,
    sessionID: string
}> => {
    const searchResponse = await Meilisearch.index("users").search("", {
        filter: `email = "${data.login}" OR nickname = "${data.login}"`
    })
    if (!searchResponse.hits.length) return {success: false, error: "User does not exist."};
    const user = searchResponse.hits[0] as z.infer<typeof userZod>


    const [hashedPassword, salt] = user.password.split(":")

    const hash = crypto.createHmac("sha512", salt)
    hash.update(data.password)

    if (crypto.timingSafeEqual(Buffer.from(hash.digest("hex")), Buffer.from(hashedPassword))) {
        const sessionID = crypto.randomBytes(32).toString("hex")
        await redis.setEx("session:" + sessionID, 24 * 60 * 60, JSON.stringify(user))

        return {success: true, sessionID: sessionID}
    }
    return {success: false, error: "Invalid password."}

})