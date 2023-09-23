import {component$} from "@builder.io/qwik";
import {Form, routeAction$, zod$} from "@builder.io/qwik-city";
import {createUser} from "~/app/user";
import {userZod} from "~/app/user";
import crypto from "crypto";


export const formZod = userZod.pick({
    name: true,
    nickname: true,
    email: true,
    password: true
})


export default component$(() => {
    const action = useAddUser();

    return <>
        <div>
            <Form action={action}>
                <input name="name" placeholder={"name"}/>
                <input name="nickname" placeholder={"nickname"}/>
                <input name="email" placeholder={"email"}/>
                <input name="password" placeholder={"password"}/>
                <button type="submit">Register</button>
            </Form>


        </div>
    </>
})


export const useAddUser = routeAction$(async (data) => {
    return await createUser(({
        id: crypto.randomBytes(20).toString("hex"),
        name: data.name,
        nickname: data.nickname,
        password: data.password,
        email: data.email,
        likes: [],
        role: "reader"
    }));
}, zod$(formZod.shape));
