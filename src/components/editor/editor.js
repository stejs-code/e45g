import List from '@editorjs/list'
import Image from '@editorjs/image'
import Header from '@editorjs/header'
import Marker from '@editorjs/marker'

export const EDITOR_JS_TOOLS = {
    // embed: Embed,
    // table: Table,
    // warning: Warning,
    // code: Code,
    // linkTool: LinkTool,
    // raw: Raw,
    // quote: Quote,
    // checklist: CheckList,
    // delimiter: Delimiter,
    // inlineCode: InlineCode,
    // simpleImage: SimpleImage,


    image: {
        class: Image,
        config: {
            uploader: {
                /**
                 *
                 * @param file {File}
                 * @return {Promise<void>}
                 */
                async uploadByFile(file) {
                        return (await fetch(`/api/file/_upload?ext=${file.name.split(".").pop()}`, {
                        body: await file.arrayBuffer(),
                        method: "POST",

                    })).json()
                }
            }
        }
    },
    marker: Marker,
    header: {
        class: Header,
        inlineToolbar: ['link']
    },
    list: {
        class: List,
        inlineToolbar: true
    },
}
