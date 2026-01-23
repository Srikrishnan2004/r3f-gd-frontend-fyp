import { useRef, useState, useEffect } from "react";

export const RecordButton = ({ onStopRecording, onTranscriptChange }) => {
    const [recording, setRecording] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [interimTranscript, setInterimTranscript] = useState("");
    const recognitionRef = useRef(null);
    const finalTranscriptRef = useRef("");
    const interimTranscriptRef = useRef(""); // Track interim text synchronously

    // Notify parent of transcript changes
    useEffect(() => {
        if (onTranscriptChange) {
            onTranscriptChange(transcript, interimTranscript);
        }
    }, [transcript, interimTranscript, onTranscriptChange]);

    const startRecording = () => {
        try {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                alert("Browser does not support Speech Recognition");
                return;
            }

            // Reset transcripts
            setTranscript("");
            setInterimTranscript("");
            finalTranscriptRef.current = "";
            interimTranscriptRef.current = "";

            const recognition = new SpeechRecognition();
            recognition.lang = "en-US";
            recognition.interimResults = true; // Enable real-time results
            recognition.continuous = true; // Keep listening until stopped
            recognition.maxAlternatives = 1;

            recognition.onstart = () => {
                console.log("🎤 Recording started");
                setRecording(true);
            };

            recognition.onresult = (event) => {
                let interim = "";
                let final = "";

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const result = event.results[i];
                    if (result.isFinal) {
                        final += result[0].transcript + " ";
                    } else {
                        interim += result[0].transcript;
                    }
                }

                // Accumulate final transcript
                if (final) {
                    finalTranscriptRef.current += final;
                    setTranscript(finalTranscriptRef.current.trim());
                    console.log("✅ Final transcript:", finalTranscriptRef.current.trim());
                }

                // Update interim transcript (real-time preview)
                interimTranscriptRef.current = interim;
                setInterimTranscript(interim);
                if (interim) {
                    console.log("💬 Interim:", interim);
                }
            };

            recognition.onerror = (event) => {
                console.error("❌ Speech recognition error:", event.error);
                // Don't stop on 'no-speech' error, keep listening
                if (event.error !== 'no-speech') {
                    setRecording(false);
                }
            };

            recognition.onend = () => {
                console.log("🔚 Recognition ended");
                // Recognition ended - don't auto-restart, let stopRecording handle it
            };

            recognitionRef.current = recognition;
            recognition.start();
        } catch (error) {
            console.error("Error accessing microphone:", error);
        }
    };

    const stopRecording = () => {
        console.log("🛑 Stopping recording...");
        
        if (recognitionRef.current) {
            recognitionRef.current.onend = null; // Prevent any handlers
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }
        setRecording(false);
        
        // Combine final + any remaining interim transcript
        let fullText = finalTranscriptRef.current.trim();
        if (interimTranscriptRef.current) {
            fullText += " " + interimTranscriptRef.current;
            fullText = fullText.trim();
        }
        
        console.log("📝 Full transcript to send:", fullText);
        
        setInterimTranscript("");
        interimTranscriptRef.current = "";
        
        // Call the callback with the combined transcript
        if (onStopRecording && fullText) {
            console.log("📤 Calling onStopRecording with:", fullText);
            onStopRecording(fullText);
        } else {
            console.warn("⚠️ No transcript to send or onStopRecording not provided");
        }
    };

    const toggleRecording = () => {
        if (recording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const fullTranscript = transcript + (interimTranscript ? " " + interimTranscript : "");

    return (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
            {/* Real-time Transcript Display */}
            {(recording || fullTranscript) && (
                <div className="w-80 max-h-32 overflow-y-auto bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white text-sm">
                    {fullTranscript ? (
                        <p>
                            <span className="text-white">{transcript}</span>
                            {interimTranscript && (
                                <span className="text-gray-400 italic"> {interimTranscript}</span>
                            )}
                        </p>
                    ) : (
                        <p className="text-gray-400 italic">Listening... Start speaking</p>
                    )}
                </div>
            )}

            {/* Recording Status Indicator */}
            {recording && (
                <div className="flex items-center gap-2 text-white text-xs">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    <span>Recording</span>
                </div>
            )}

            {/* Record Button */}
            <button
                onClick={toggleRecording}
                className={`p-4 rounded-full shadow-lg transition-all duration-300 ${
                    recording ? "bg-red-500 scale-110 animate-pulse" : "bg-white hover:bg-gray-100"
                }`}
                title={recording ? "Stop Recording" : "Start Recording"}
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
        </div>
    );
};
