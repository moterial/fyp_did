import { useConstant } from "https://framerusercontent.com/modules/ExNgrA7EJTKUPpH6vIlN/M5fttmqD6cHt7sJo18U0/useConstant.js";
const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
export function randomID(length = 5) {
    return Array(length).fill(0).map(()=>BASE62[Math.floor(Math.random() * BASE62.length)]
    ).join("");
}
export function useRandomID(length = 5) {
    return useConstant(()=>randomID(length)
    );
}

export const __FramerMetadata__ = {"exports":{"randomID":{"type":"function"},"useRandomID":{"type":"function"}}}
//# sourceMappingURL=./randomID.map