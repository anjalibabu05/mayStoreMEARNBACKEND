const jobs = require('../model/jobModel');

// Add a new job
exports.addJobController = async (req, res) => {
  const { title, location, jType, salary, qualification, experience, description } = req.body;
  console.log(title, location, jType, salary, qualification, experience, description);

  try {
    const existingJob = await jobs.findOne({ title, location });
    if (existingJob) {
      return res.status(400).json("Job already exists");
    }

    const newJob = new jobs({ title, location, jType, salary, qualification, experience, description });
    await newJob.save();

    res.status(200).json(newJob);
  } catch (err) {
    console.error("❌ Error in addJobController:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get all jobs (with fallback for old 'tittle' field)
exports.getAllJobController = async (req, res) => {
  const searchKey = req.query.search || "";
  try {
    let allJobs = await jobs.find({
      $or: [
        { title: { $regex: searchKey, $options: "i" } },
        { tittle: { $regex: searchKey, $options: "i" } }, // support old data
      ],
    });

    // Normalize field name for frontend
    allJobs = allJobs.map(job => ({
      ...job._doc,
      title: job.title || job.tittle || "",
    }));

    res.status(200).json(allJobs);
  } catch (err) {
    console.error("❌ Error in getAllJobController:", err);
    res.status(500).json({ error: err.message });
  }
};

// Delete a job
exports.deleteAJobController = async (req, res) => {
  const { id } = req.params;
  try {
    await jobs.findByIdAndDelete(id);
    res.status(200).json("Deleted successfully");
  } catch (err) {
    console.error("❌ Error in deleteAJobController:", err);
    res.status(500).json({ error: err.message });
  }
};
