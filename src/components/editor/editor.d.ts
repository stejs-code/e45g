import type {ToolConstructable, ToolSettings} from "@editorjs/editorjs/types/tools";

declare const EDITOR_JS_TOOLS: {
    [toolName: string]: ToolConstructable | ToolSettings;
}