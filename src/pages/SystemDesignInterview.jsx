import { Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import { Avatar } from "../components/Avatar";
import { RecordButton } from "../components/RecordButton";
import { Whiteboard } from "../components/Whiteboard";
import { useChat } from "../hooks/useChat";
import { getSnapshot } from "tldraw";

export const SystemDesignInterview = () => {
    const [editor, setEditor] = useState(null);
    const { onMessageReceived } = useChat();

    const handleStopRecording = async (transcript) => {
        if (!editor || !transcript) return;

        try {
            // 1. Capture Whiteboard Image
            const { document, session } = getSnapshot(editor.store);
            const svg = await editor.getSvg(Array.from(editor.getCurrentPageShapeIds()));

            if (!svg) {
                console.error("Could not generate SVG from whiteboard");
                return;
            }

            const svgString = new XMLSerializer().serializeToString(svg);
            const blob = new Blob([svgString], { type: "image/svg+xml" });

            // 2. Prepare Form Data
            const formData = new FormData();
            formData.append("image", blob, "whiteboard.svg");
            formData.append("audio_text", transcript);

            // 3. Call API
            const response = await fetch("http://localhost:3000/interview/analyze", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                console.error("API Error:", response.statusText);
                return;
            }

            const data = await response.json();

            // 4. Process Response & Play Audio
            if (data.audioUrl) {
                // Fetch Audio Blob and Convert to Base64 (because Avatar expects base64)
                const audioResp = await fetch(`http://localhost:3000${data.audioUrl}`);
                const audioBlob = await audioResp.blob();

                const reader = new FileReader();
                reader.readAsDataURL(audioBlob);
                reader.onloadend = () => {
                    const base64Audio = reader.result.split(",")[1]; // Remove "data:audio/...;base64," prefix

                    const message = {
                        text: data.feedback,
                        audio: base64Audio,
                        lipsync: data.lipSyncData,
                        facialExpression: "smile",
                        animation: "Talking",
                    };

                    onMessageReceived(message);
                };
            }

            console.log("Analysis Result:", data);

        } catch (error) {
            console.error("Error analyzing interview:", error);
        }
    };

    return (
        <div className="flex w-full h-full h-screen">
            <div className="w-1/2 h-full bg-slate-900 relative">
                <Canvas shadows camera={{ position: [0, 0, 5], fov: 30 }}>
                    <Environment preset="sunset" />
                    <Avatar position={[0, -3, 0]} scale={2} />
                </Canvas>
                <RecordButton onStopRecording={handleStopRecording} />
            </div>
            <div className="w-1/2 h-full border-l border-gray-200">
                <Whiteboard onMount={setEditor} />
            </div>
        </div>
    );
};
