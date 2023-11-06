import {useCallback} from "react";

function useReadText() {
    return useCallback(async (text: string) => {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);

        utterance.lang = "en-US"

        synth.speak(utterance);
    }, []);
}

export default useReadText;
