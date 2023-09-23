import type {RequestHandler} from "@builder.io/qwik-city";
import * as fs from "fs";
import path from "path";
import * as crypto from "crypto";
import sharp from "sharp";


export const onPost: RequestHandler = async ({request, query, json}) => {
    const name = crypto.randomBytes(20).toString("hex") + "." + query.get("ext")
    const filePath = path.join(process.env.UPLOADS_DIR as string, name);
    const fileStream = await request.arrayBuffer()
    const parsedFile = path.parse(filePath)




    await fs.promises.writeFile(parsedFile.dir + "/" + parsedFile.name + ".webp", await sharp(fileStream)
        .webp({effort: 6})
        .toBuffer())

    await fs.promises.writeFile(filePath, await sharp(fileStream)
        .toBuffer())
    json(200, {
        success: 1,
        file: {
            url: `/api/file/_download/${name}`
        }
    })

}


// export const uploadFile = server$(async (file: File) => {
//
//     return {
//         success: 1,
//         file: {
//             url: "/uploads/"
//         }
//     }
// })