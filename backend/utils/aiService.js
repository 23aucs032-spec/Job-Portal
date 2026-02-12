import axios from "axios";

export const matchResume = async (resumeText, jobText) => {
  const res = await axios.post("http://localhost:5000/match", {
    resume: resumeText,
    job: jobText
  });
  return res.data.score;
};
