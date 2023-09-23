import {z} from "zod";

export const editorBlockBaseZod = z.object({
    id: z.string().optional(),
    data: z.record(z.string()),
    type: z.string()
})

export const headerZod = editorBlockBaseZod.merge(z.object({
    type: z.literal("header"),
    data: z.object({
        text: z.string(),
        level: z.number().min(1).max(6)
    })
}))


export const paragraphZod = editorBlockBaseZod.merge(z.object({
    type: z.literal("paragraph"),
    data: z.object({
        text: z.string(),
    })
}))


export const listZod = editorBlockBaseZod.merge(z.object({
    type: z.literal("list"),
    data: z.object({
        style: z.union([z.literal("ordered"), z.literal("unordered")]),
        items: z.array(z.string())
    })
}))

export const imageZod = editorBlockBaseZod.merge(z.object({
    type: z.literal("image"),
    data: z.object({
        file: z.object({
            url: z.string()
        }),
        caption: z.string(),
        withBorder: z.boolean(),
        stretched: z.boolean(),
        withBackground: z.boolean()
    })
}))

export const editorBlockZod = z.discriminatedUnion("type", [headerZod, paragraphZod, listZod, imageZod])

export const editorBlockArrayZod = editorBlockZod.array()