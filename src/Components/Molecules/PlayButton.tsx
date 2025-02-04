import React, { FC, useCallback } from "react";
import useReadText from "Hooks/Helpers/useReadText";

interface PlayButtonProps {
    text: string,
    isDark?: boolean
}
const PlayButton: FC<PlayButtonProps> = ({ text, isDark = false }) => {
    const colorStyles = isDark ? "text-black hover:text-gray-900" : "text-white hover:text-gray-200"
    const { play } = useReadText();

    const playMe = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        play(text);
    }, [play, text]);

    return (
        <div data-testid="play-button" className={`absolute bottom-1 left-2 text-lg cursor-pointer ${colorStyles}`} onClick={playMe}>
            <i className="fa-solid fa-volume-high"></i>
        </div>
    )
}

export default PlayButton