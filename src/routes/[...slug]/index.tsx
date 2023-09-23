import {component$, useSignal} from "@builder.io/qwik";
import {RenderBlocks} from "~/components/editor/render";
import {routeLoader$, server$} from "@builder.io/qwik-city";
import type {articleZod} from "~/app/article";
import { getArticle, removeArticle, updateArticle} from "~/app/article";
import {Meilisearch} from "~/app/meilisearch";
import type {z} from "zod";
import {TbEye, TbThumbUp} from "@qwikest/icons/tablericons";

export default component$(() => {
    const article = useArticle()
    const likes = useSignal(article.value.likes)
    return (
        <article>
            <h1 class={"text-4xl font-bold mt-6 mb-4"}>{article.value.name}</h1>

            <div class={"flex items-center mb-8"}><TbThumbUp class={"mr-1"}/> {numberFormat.format(likes.value)} <TbEye
                class={"ml-3 mr-1"}/> {numberFormat.format(article.value.views)}</div>

            <RenderBlocks blocks={article.value.blocks}/>

            <button
                class={"text-blue-600 underline hover:text-purple-800 mr-5"}
                onClick$={() => {
                    history.back()
                }}>Back
            </button>
            <button
                class={"text-blue-600 underline hover:text-purple-800 mr-5"}
                onClick$={() => {
                    likeArticle(article.value.id)
                    likes.value++
                }}>Like article
            </button>
            <button
                class={"text-blue-600 underline hover:text-purple-800 mr-5"}
                onClick$={() => {
                    deleteArticle(article.value.id).then(() => history.back())
                }}>Delete article
            </button>
            <a
                class={"text-blue-600 underline hover:text-purple-800"}
                href={`/article/${article.value.id}/edit`}
            >Edit article
            </a>
        </article>
    );
});

export const numberFormat = Intl.NumberFormat('en', {notation: 'compact', maximumFractionDigits: 4});

export const useArticle = routeLoader$(async ({url, error}) => {
    console.log()

    const response = await Meilisearch.index<z.TypeOf<typeof articleZod>>("articles").search("", {
        filter: [`url = "${url.pathname}"`]
    })

    if (response.hits.length < 1) throw error(404, "Page not found")


    const article = response.hits[0]

    article.views++

    updateArticle({
        views: article.views,
        id: article.id
    }).then(() => null)

    return article


})

export const likeArticle = server$(async (id) => {
    const article = await getArticle(id)

    if (article.success) {
        updateArticle({
            likes: article.data.likes + 1,
            id: id
        }).then(() => null)
    }


})

export const deleteArticle = server$((id) => {
    return removeArticle(id)
})