import type {RequestHandler} from "@builder.io/qwik-city";
import * as fs from "fs";
import path from "path";
import sharp from "sharp";

export const onGet: RequestHandler = async ({params, query, send, cacheControl, headers, error}) => {
    try {
        cacheControl({
            public: true,
            staleWhileRevalidate: 60 * 60 * 24 * 7,
            maxAge: 5 * 60
        })

        const width = Number(query.get("width")) || undefined,
            height = Number(query.get("height")) || undefined,
            webp = [true, "true", "1"].includes(query.get("webp") || ""),
            fileName = params.fileName


        headers.set("content-type", `image/${webp ? "webp" : path.parse(fileName).ext.substring(1)}`)
        send(200, await sharp(await fs.promises.readFile(path.join(
            process.env.UPLOADS_DIR as string,
            (webp) ? path.parse(fileName).name + ".webp" : fileName
        )))
            .resize({
                width,
                height,
                withoutEnlargement: true,
                fit: sharp.fit.outside,
            })
            .toBuffer())

    } catch (e) {
        throw error(404, "image not found")
    }


}