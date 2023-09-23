import {MeiliSearch} from "meilisearch";
import {isBrowser} from "@builder.io/qwik/build";


export const Meilisearch = new MeiliSearch({
    host: 'http://localhost:7700',
    apiKey: (isBrowser) ? "" : process.env.MEILISEARCH_MASTER_KEY
})
