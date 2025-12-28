import { api } from "./client";

export async function getAcademicYear() {
  const res = await api.get("/academic-year");
  return res.data.academicYear;
}

export async function setAcademicYear(academicYear) {
  const res = await api.post("/academic-year", { academicYear });
  return res.data.academicYear;
}
