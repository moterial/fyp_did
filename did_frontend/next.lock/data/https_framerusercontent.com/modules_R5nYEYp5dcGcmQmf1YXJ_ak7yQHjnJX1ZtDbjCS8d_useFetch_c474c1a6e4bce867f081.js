import { useMemo } from "react";
import { colors, people, subtitles } from "https://framerusercontent.com/modules/IfULguieLXhCfyUEE9Ff/tEzrBggyjqOb3yUhD4Gt/data.js";
export function useFetch(_fake = "") {
    // Fake API call for demo purposes
    return useMemo(()=>people.map((name, i)=>({
                background: colors[i],
                name: name,
                profile: name,
                subtitle: subtitles[i]
            })
        )
    , []);
}

export const __FramerMetadata__ = {"exports":{"useFetch":{"type":"function","annotations":{"framerContractVersion":"1"}}}}