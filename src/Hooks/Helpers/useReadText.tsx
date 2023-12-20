import { useCallback, useState } from "react";

function useReadText() {

    const [onEnd, setOnEnd] = useState<(this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => any>(() => {});
    const play = useCallback(async (text: string) => {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);

        utterance.lang = "en-US"

        utterance.onend = onEnd;
        synth.speak(utterance);
    }, []);

    return {
        onEnd,
        setOnEnd,
        play,
    }
}

export default useReadText;
