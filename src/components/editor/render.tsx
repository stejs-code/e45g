import type {z} from "zod";
import type {editorBlockArrayZod} from "~/components/editor/editorModules";
import {component$} from "@builder.io/qwik";
import {
    Image,
} from 'qwik-image';
import {getFirstBlock} from "~/routes/article/[id]/edit";

export interface RenderBlocksProps {
    blocks: z.TypeOf<typeof editorBlockArrayZod>
}

export const RenderBlocks = component$<RenderBlocksProps>(({blocks}) => {
    return <>
        {blocks.map((block) => {
            if (block.id === getFirstBlock(blocks, "header").id) return
            switch (block.type) {
                case 'header':
                    switch (block.data.level) {
                        case 1:
                            return <h1 dangerouslySetInnerHTML={block.data.text}></h1>;
                        case 2:
                            return <h2 dangerouslySetInnerHTML={block.data.text}></h2>;
                        case 3:
                            return <h3 dangerouslySetInnerHTML={block.data.text}></h3>
                        case 4:
                            return <h4 dangerouslySetInnerHTML={block.data.text}></h4>
                        case 5:
                            return <h5 dangerouslySetInnerHTML={block.data.text}></h5>
                        case 6:
                            return <h6 dangerouslySetInnerHTML={block.data.text}></h6>
                        default:
                            return <h2 dangerouslySetInnerHTML={block.data.text}></h2>;
                    }
                case "list":
                    return <ul>{block.data.items.map((item, index) => (
                        <li key={index} dangerouslySetInnerHTML={item}></li>
                    ))}</ul>
                case 'paragraph':
                    return <p dangerouslySetInnerHTML={block.data.text}></p>;
                case 'image':
                    return <div class={" overflow-hidden mb-4"}>
                        <Image
                            layout="constrained"
                            objectFit="fill"
                            width={728}
                            // height={500}
                            loading={"eager"}
                            decoding={"sync"}
                            placeholder="#e6e6e6"
                            src={block.data.file.url}
                            alt={block.data.caption}/>

                        {block.data.caption && <p class={"py-2 text-slate-600  m-0 text-center"}>
                            {block.data.caption}
                        </p>}

                    </div>;
            }
        })}
    </>
})

