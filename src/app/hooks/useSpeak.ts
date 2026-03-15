import { useCallback, useRef, useState } from "react";

export function useSpeak() {
  const [speaking, setSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cacheRef = useRef<Map<string, string>>(new Map()); // text → object URL

  const speak = useCallback(async (text: string, onEnd?: () => void) => {
    // Stop any current audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setSpeaking(true);

    try {
      // Use cached URL if available
      let url = cacheRef.current.get(text);

      if (!url) {
        const res = await fetch("/api/speak", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });

        if (!res.ok) throw new Error("TTS failed");

        const blob = await res.blob();
        url = URL.createObjectURL(blob);
        cacheRef.current.set(text, url);
      }

      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        setSpeaking(false);
        onEnd?.();
      };
      audio.onerror = () => setSpeaking(false);

      await audio.play();
    } catch (e) {
      console.error("Speech error:", e);
      setSpeaking(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setSpeaking(false);
  }, []);

  return { speak, stop, speaking };
}