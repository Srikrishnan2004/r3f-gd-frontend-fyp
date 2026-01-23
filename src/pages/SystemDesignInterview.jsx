import { Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Avatar } from "../components/Avatar";
import { RecordButton } from "../components/RecordButton";
import { Whiteboard } from "../components/Whiteboard";
import { useChat } from "../hooks/useChat";

// Helper function to convert SVG to PNG
const svgToPng = (svgString, width = 800, height = 600) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            
            // Fill with white background
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, width, height);
            
            // Draw the SVG
            ctx.drawImage(img, 0, 0, width, height);
            
            URL.revokeObjectURL(url);
            
            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error("Failed to convert canvas to PNG blob"));
                }
            }, "image/png");
        };

        img.onerror = (e) => {
            URL.revokeObjectURL(url);
            reject(e);
        };

        img.src = url;
    });
};

export const SystemDesignInterview = () => {
    const [editor, setEditor] = useState(null);
    const [manualImage, setManualImage] = useState(null);
    const { onMessageReceived } = useChat();
    const location = useLocation();
    const { sessionCode } = location.state || {};

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setManualImage(file);
            console.log("✅ Manual image selected:", file.name);
        }
    };

    const handleStopRecording = async (transcript) => {
        console.log("🎯 handleStopRecording called with transcript:", transcript);
        
        if (!transcript) {
            console.warn("⚠️ No transcript provided, skipping API call");
            return;
        }

        try {
            // 1. Prepare Form Data
            const formData = new FormData();
            formData.append("audio_text", transcript);
            if (sessionCode) {
                formData.append("session_code", sessionCode);
                console.log("✅ Session code appended:", sessionCode);
            } else {
                console.warn("⚠️ No session code found in location state");
            }

            // 2. Capture Whiteboard Image as PNG (backend requires PNG/JPEG/WebP)
            let imageBlob = null; 
            let svgString = null;
            let svgWidth = 800;
            let svgHeight = 600;

            // Priority 1: Manual Upload
            if (manualImage) {
                console.log("✅ Using manually uploaded diagram");
                imageBlob = manualImage;
            } 
            // Priority 2: Auto Capture (fallback)
            else if (editor) {
                try {
                    // DEBUG: Inspect editor object to find correct export method
                    console.log("🔍 Inspecting Tldraw Editor:", editor);
                    // ... (keep diag logs if useful, or remove)
                    
                    const shapeIds = Array.from(editor.getCurrentPageShapeIds());
                    console.log("📐 Whiteboard shapes found:", shapeIds.length);
                    
                    if (shapeIds.length > 0) {
                        // Attempt to find getSvg or equivalent
                        if (typeof editor.getSvg === 'function') {
                            const svg = await editor.getSvg(shapeIds);
                            if (svg) {
                                svgWidth = parseInt(svg.getAttribute("width")) || 800;
                                svgHeight = parseInt(svg.getAttribute("height")) || 600;
                                svgString = new XMLSerializer().serializeToString(svg);
                                console.log("✅ Whiteboard SVG captured via getSvg");
                            }
                        } else {
                            console.warn("⚠️ editor.getSvg is not a function. Check console for available methods.");
                        }
                    }
                } catch (svgError) {
                    console.warn("⚠️ Could not capture whiteboard shapes:", svgError);
                }
            }
            
            // If no whiteboard content, create a blank placeholder SVG
            if (!svgString) {
                console.log("📝 Creating blank placeholder image");
                svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
                    <rect width="100%" height="100%" fill="white"/>
                    <text x="400" y="300" text-anchor="middle" fill="#999" font-family="Arial" font-size="20">
                        (No whiteboard drawing)
                    </text>
                </svg>`;
            }
            
            // If no image captured (and no manual upload), create placeholder
            if (!imageBlob && !svgString) {
                 // ... create placeholder svgString ... 
            }

            if (!imageBlob && svgString) {
                 console.log("🔄 Converting SVG to PNG...");
                 imageBlob = await svgToPng(svgString, svgWidth, svgHeight);
            }
            
            if (!imageBlob) {
                 // Final fallback if everything failed
                 console.log("📝 Creating blank placeholder image");
                 const base64Png = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY/j///8BAAH/AaeR+gAAAAAASUVORK5CYII=";
                 const res = await fetch(`data:image/png;base64,${base64Png}`);
                 imageBlob = await res.blob();
            }

            formData.append("image", imageBlob, "whiteboard.png");
            console.log("✅ PNG image attached to form data");

            // 3. Call API
            console.log("📤 Making API call to http://localhost:3000/interview/analyze");
            const response = await fetch("http://localhost:3000/interview/analyze", {
                method: "POST",
                headers: {
                    "Authorization": "Basic " + btoa("fyp:fyp")
                },
                body: formData,
            });

            console.log("📥 API Response status:", response.status);
            
            if (!response.ok) {
                console.error("❌ API Error:", response.status, response.statusText);
                return;
            }

            const data = await response.json();

            // 4. Process Response & Play Audio
            // 4. Process Response & Play Audio
            if (data.audioBase64) {
                 const message = {
                     text: data.feedback,
                     audio: data.audioBase64,
                     lipsync: data.lipSyncData,
                     facialExpression: "smile",
                     animation: "Talking_1",
                 };

                 onMessageReceived(message);
            } else if (data.audioUrl) {
                // Fallback for backward compatibility
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
                        animation: "Talking_1",
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
            <div className="w-1/2 h-full border-l border-gray-200 relative">
                <Whiteboard onMount={setEditor} />
                <div className="absolute bottom-4 right-4 z-10 flex gap-2">
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        className="hidden" 
                        id="diagram-upload"
                    />
                    <label 
                        htmlFor="diagram-upload" 
                        className={`px-4 py-2 rounded-lg cursor-pointer font-bold transition-colors shadow-md text-sm ${
                            manualImage ? "bg-green-500 hover:bg-green-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                        }`}
                    >
                        {manualImage ? "Diagram Uploaded!" : "Upload Diagram"}
                    </label>
                </div>
            </div>
        </div>
    );
};
