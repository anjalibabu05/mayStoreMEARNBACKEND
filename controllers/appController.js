const applications = require('../model/appModel');
// add application
exports.addApplicationController = async (req, res) => {
  try {
    const { fullname, jobTitle, qualifications, email, phone, coverletter } = req.body;
    const resume = req.file ? req.file.filename : null;

    console.log("📥 Data received:", { fullname, jobTitle, qualifications, email, phone, coverletter, resume });

    // Validate required fields
    if (!fullname || !email || !jobTitle || !resume) {
      return res.status(400).json("Missing required fields");
    }

    // Prevent duplicate applications
    const existingApplication = await applications.findOne({ jobTitle, email });
    if (existingApplication) {
      return res.status(400).json("Already applied for this job");
    }

    const newApplication = new applications({
      fullname,
      jobTitle,
      qualifications,
      email,
      phone,
      coverletter,
      resume
    });

    await newApplication.save();

    res.status(201).json({ message: "Application submitted successfully", application: newApplication });

  } catch (err) {
    console.error("❌ Error in addApplicationController:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// get application
exports.getAllApplicationController = async (req, res) => {
  try {
    const allApplications = await applications.find();
    res.status(200).json(allApplications);
  } catch (err) {
    console.error("❌ Error in getAllApplicationController:", err);
    res.status(500).json({ error: err.message });
  }
};
