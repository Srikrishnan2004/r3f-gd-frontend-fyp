import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";

export const Whiteboard = ({ onMount }) => {
    return (
        <div className="w-full h-full relative">
            <Tldraw onMount={onMount} />
        </div>
    );
};
