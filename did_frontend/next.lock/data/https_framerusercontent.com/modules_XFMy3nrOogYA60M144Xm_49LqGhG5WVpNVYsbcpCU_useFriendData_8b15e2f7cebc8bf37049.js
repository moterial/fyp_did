import { useMemo } from "react";
import { useFetch } from "https://framerusercontent.com/modules/R5nYEYp5dcGcmQmf1YXJ/ak7yQHjnJX1ZtDbjCS8d/useFetch.js";
// Hook for using live friend data
export function useFriendData(count = 4) {
    const data = useFetch("https://realdata.dev/friends");
    const trimmedData = useMemo(()=>data.slice(0, count)
    , [
        count
    ]);
    return trimmedData;
}

export const __FramerMetadata__ = {"exports":{"useFriendData":{"type":"function","annotations":{"framerContractVersion":"1"}}}}
//# sourceMappingURL=./useFriendData.map