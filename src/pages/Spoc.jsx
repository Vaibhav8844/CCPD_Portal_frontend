import { Routes, Route } from "react-router-dom";
import SpocHome from "./SpocHome";
import SpocDrive from "./SpocDrive";

export default function Spoc() {
  return (
    <Routes>
      <Route path="/" element={<SpocHome />} />
      <Route path=":company" element={<SpocDrive />} />
    </Routes>
  );
}
