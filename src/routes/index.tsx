import {component$} from "@builder.io/qwik";
import type {DocumentHead} from "@builder.io/qwik-city";
import {routeLoader$, server$} from "@builder.io/qwik-city";
import {createArticle, listArticle, removeArticle} from "~/app/article";
import {faker} from "@faker-js/faker";
import {TbEye, TbThumbUp} from "@qwikest/icons/tablericons";
import {Image} from "qwik-image";
import {formatURL} from "~/routes/article/[id]/edit";
import {numberFormat} from "~/routes/[...slug]";


export const create = server$(async () => {
        const name = faker.company.name()
        return await createArticle({
            id: faker.string.uuid(),
            name: name,
            content: faker.lorem.paragraphs(20),
            created: new Date(),
            blocks: [],
            image: {
                "id": "1DK07OPdJD",
                "type": "image",
                "data": {
                    "file": {
                        "url": "/uploads/430a15c62a3772095a0242eca0e528fa395862c7.jpg"
                    },
                    "caption": "",
                    "withBorder": false,
                    "stretched": false,
                    "withBackground": false
                }
            },
            url: '/' + formatURL(name)
        })
    }
)


export default component$(() => {

    const articles = useArticles()
    // const store = useStore({
    //     count: articles.value.data?.total || 0,
    // });


    return <>
        <h1 class={"text-5xl font-bold mt-10 mb-4"}>Articles</h1>


        {/*<button class={"text-2xl text-blue-600 underline"} onClick$={async ()=>{*/}
        {/*    console.log(await create());*/}
        {/*}}>Create Article</button>*/}

        {/*<button class={"text-2xl text-blue-600 underline flex"} onClick$={async ()=>{*/}
        {/*    console.log(await deleteAll());*/}
        {/*}}>Delete Articles</button>*/}


        {/*<p>Count: {store.count}</p>*/}
        {/*<button class={"border-8 border-sky-500"} onClick$={() => {store.count+=1}}>ClIcK mE</button>*/}
        {articles.value.data?.map((article, index) => (
            <>

                {(index !== 0) && <hr class={"dark:border-slate-800"}/>}

                <div key={index} class={"my-4 flex flex-col sm:flex-row sm:items-stretch"}>
                    <a href={article.url} class={"w-full aspect-video overflow-hidden sm:max-w-xs"}>
                        <Image
                            layout="constrained"
                            objectFit="cover"
                            width={640}
                            height={350}
                            placeholder="#e6e6e6"
                            src={article.image?.data.file.url}
                            alt={article.image?.data.caption}
                            class={""}/>
                    </a>
                    <div class={"mt-4 sm:mt-0 sm:ml-6"}>
                        <h1 class={"text-xl font-bold"}>{article.name}</h1>
                        <div class={"flex items-center"}>
                            {/* FIXME: icons aren't rendering in preview */}
                            <TbThumbUp class={"mr-1"}/>
                            {numberFormat.format(article.likes)}
                            <TbEye class={"ml-3 mr-1"}/>
                            {numberFormat.format(article.views)}</div>


                        <p dangerouslySetInnerHTML={article.content.slice(0, 400) + ((article.content.length > 400) && "...")}></p>
                        <a class={"text-blue-600 underline hover:text-blue-900"} href={article.url}>Full article</a>
                    </div>
                </div>


            </>
        ))}


    </>
  );
});

export const head: DocumentHead = {
    title: "Welcome to Qwik",
    meta: [
        {
            name: "description",
            content: "Qwik site description",
        },
    ],
};
