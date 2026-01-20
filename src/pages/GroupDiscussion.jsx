import { Canvas } from "@react-three/fiber";
import { Experience } from "../components/Experience";
import { UI } from "../components/UI";

export const GroupDiscussion = () => {
    return (
        <>
            <UI />
            <Canvas shadows camera={{ position: [0, 0, 1], fov: 30 }}>
                <Experience />
            </Canvas>
        </>
    );
};
