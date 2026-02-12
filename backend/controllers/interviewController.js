const Interview = require("../models/Interview");
const { sendMail } = require("../utils/sendEmail");

exports.schedule = async (req,res)=>{
  const interview = await Interview.create(req.body);
  await sendMail(req.body.email,"Interview Scheduled",
    `Your interview is on ${req.body.date}`);
  res.json(interview);
};
