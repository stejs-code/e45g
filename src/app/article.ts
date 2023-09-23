import {z} from "zod";
import {Meilisearch} from "~/app/meilisearch";
import {editorBlockArrayZod, imageZod} from "~/components/editor/editorModules";


export const articleZod = z.object({
    id: z.string(),
    name: z.string().max(50),
    content: z.string(),
    created: z.date(),
    views: z.number().default(0),
    likes: z.number().default(0),
    blocks: editorBlockArrayZod,
    image: imageZod.optional(),
    url: z.string()
})

const index = Meilisearch.index<z.TypeOf<typeof articleZod>>('articles')

export async function createArticle(article: z.input<typeof articleZod>) {
    try {

        await index.addDocuments([articleZod.parse(article)])

        return {success: true}
    } catch (e) {
        console.log(e)
        return {success: false}
    }

}

export async function removeArticle(id: z.TypeOf<typeof articleZod["shape"]["id"]>) {
    try {
        await index.deleteDocument(id);

        return {success: true}
    } catch (e) {
        console.log(e)
        return {success: false}
    }
}


export async function getArticle(id: z.TypeOf<typeof articleZod["shape"]["id"]>): Promise<{
    success: true,
    data: z.TypeOf<typeof articleZod>
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

export async function listArticle() {
    try {
        return {success: true, data: (await index.search("", {limit: 1000, sort: ["views:desc"]})).hits}

    } catch (e) {
        console.log(e)
        return {success: false}
    }
}

export const updateArticleZod = articleZod.partial().merge(z.object({
    id: articleZod.shape.id
}))

export async function updateArticle(article: z.input<typeof updateArticleZod>) {
    try {
        await index.updateDocuments([updateArticleZod.parse(article)])

        return {success: true}
    } catch (e) {
        console.log(e)
        return {success: false}
    }

}


//createArticle({id: "UHHHHHH", name: "GUMMY ELEPHANT", content: "GUMMY ELEPHANT UUUUHHHHH", created: new Date(), views: 69420100, likes:99999999})