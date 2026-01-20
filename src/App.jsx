import { Loader } from "@react-three/drei";
import { Leva } from "leva";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { GroupDiscussion } from "./pages/GroupDiscussion";
import { SystemDesignInterview } from "./pages/SystemDesignInterview";

function App() {
  return (
    <BrowserRouter>
      <Loader />
      <Leva hidden />
      <Routes>
        <Route path="/" element={<Navigate to="/group-discussion" />} />
        <Route path="/group-discussion" element={<GroupDiscussion />} />
        <Route path="/interview" element={<SystemDesignInterview />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
