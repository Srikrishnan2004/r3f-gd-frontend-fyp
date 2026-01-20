import { useRef, useState } from "react";

export const RecordButton = ({ onStopRecording }) => {
    const [recording, setRecording] = useState(false);
    const recognitionRef = useRef(null);

    const startRecording = () => {
        try {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                alert("Browser does not support Speech Recognition");
                return;
            }

            const recognition = new SpeechRecognition();
            recognition.lang = "en-US";
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            recognition.onstart = () => {
                setRecording(true);
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                console.log("Transcript:", transcript);
                if (onStopRecording) {
                    onStopRecording(transcript);
                }
            };

            recognition.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setRecording(false);
            };

            recognition.onend = () => {
                setRecording(false);
            };

            recognitionRef.current = recognition;
            recognition.start();
        } catch (error) {
            console.error("Error accessing microphone:", error);
        }
    };

    const stopRecording = () => {
        if (recognitionRef.current && recording) {
            recognitionRef.current.stop();
        }
    };

    const toggleRecording = () => {
        if (recording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    return (
        <button
            onClick={toggleRecording}
            className={`absolute bottom-8 left-1/2 -translate-x-1/2 p-4 rounded-full shadow-lg transition-all duration-300 \${
        recording ? "bg-red-500 scale-110 animate-pulse" : "bg-white hover:bg-gray-100"
      }`}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke={recording ? "white" : "currentColor"}
                className="w-6 h-6"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                />
            </svg>
        </button>
    );
};
