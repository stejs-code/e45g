import type {NoSerialize} from '@builder.io/qwik';
import {component$, noSerialize, useSignal, useVisibleTask$} from '@builder.io/qwik';
import {routeLoader$, server$, useNavigate} from "@builder.io/qwik-city";
import {getArticle, updateArticle} from "~/app/article";
import EditorJS from "@editorjs/editorjs";
import type {z} from "zod";
import {EDITOR_JS_TOOLS} from "~/components/editor/editor";
import type { headerZod, imageZod} from "~/components/editor/editorModules";
import {editorBlockArrayZod} from "~/components/editor/editorModules";

export default component$(() => {
    const article = useArticle()
    const editor = useSignal<NoSerialize<EditorJS>>()
    const navigate = useNavigate()
    useVisibleTask$(() => {
        editor.value = noSerialize(new EditorJS({
            holder: "editorJs",
            placeholder: "content...",
            data: {
                "time": 1694885874947,
                "blocks": article.value.blocks,
                "version": "2.28.0"
            },
            minHeight: 200,
            tools: EDITOR_JS_TOOLS,
        }))
    })

    return (
        <div>
            <h1 class={"text-4xl font-bold mt-5 mb-8"}>Editing</h1>
            {/*<p class={"text-lg mb-5"}>Title: {article.value.name}</p>*/}
            {/*<p class={"text-lg mb-5"}>Content: {article.value.content}</p>*/}
            <div
                id={"editorJs"}
                class={"md:-ml-20 tm-editor-js"}/>
            <button onClick$={async () => {
                const updatedArticle = await saveEdits(article.value.id, editorBlockArrayZod.parse((await editor.value?.save())!.blocks))
                await new Promise((resolve) => setTimeout(resolve, 50))
                navigate(updatedArticle.url)
            }}>
                save
            </button>
        </div>
    );
});

export const useArticle = routeLoader$(async ({params, error}) => {
    const article = await getArticle(params.id)
    if (!article.success) throw error(404, "Article not found")

    return article.data
})

export function getFirstBlock(blocks: z.TypeOf<typeof editorBlockArrayZod>, type: string) {
    return (blocks.filter((block) => block.type === type)[0]) && blocks.filter((block) => block.type === type)[0]
}

export function removeDiacritics(str: string) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function formatURL(str: string) {
    return removeDiacritics(str).replaceAll(" ", "-").toLowerCase()
}


export const saveEdits = server$((id, blocks: z.TypeOf<typeof editorBlockArrayZod>) => {
    const newArticle = {
        id: id,
        blocks: blocks,
        content: blocks.map((block) => {
            switch (block.type) {
                case 'header':
                    return block.data.text;
                case "list":
                    return block.data.items.join(" ");
                case 'paragraph':
                    return block.data.text;
                case 'image':
                    return block.data.caption;
            }
        }).join(" "),
        image: getFirstBlock(blocks, "image") as z.infer<typeof imageZod>,
        name: (getFirstBlock(blocks, "header") as z.infer<typeof headerZod>).data.text,
        url: '/' + formatURL((getFirstBlock(blocks, "header") as z.infer<typeof headerZod>).data.text)
    }
    
    updateArticle(newArticle).then(() => null)
    return newArticle
})
