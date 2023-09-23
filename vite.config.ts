import {defineConfig} from "vite";
import {qwikVite} from "@builder.io/qwik/optimizer";
import {qwikCity} from "@builder.io/qwik-city/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(() => {
    return {
        plugins: [
            qwikCity({trailingSlash: false}),
            qwikVite(),
            tsconfigPaths(),
        ],
        optimizeDeps: {
            entries: [
                "@editorjs/checklist",
                "@editorjs/code",
                "@editorjs/delimiter",
                "@editorjs/editorjs",
                "@editorjs/embed",
                "@editorjs/header",
                "@editorjs/image",
                "@editorjs/inline-code",
                "@editorjs/link",
                "@editorjs/list",
                "@editorjs/marker",
                "@editorjs/paragraph",
                "@editorjs/quote",
                "@editorjs/raw",
                "@editorjs/simple-image",
                "@editorjs/table",
                "@editorjs/warning",
                "zod",
                "@qwikest/icons/tablericons",
                "@qwikest/icons",
                "@auth/core"
            ]
        },
        preview: {
            headers: {
                "Cache-Control": "public, max-age=600",
            },
        },
        server: {
            host: "0.0.0.0",
        },
    };
});
