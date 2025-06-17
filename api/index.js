require("dotenv").config();
const config = require("./config.json");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const cors = require("cors");
const { authenticateToken } = require("./utilities");
const upload = require("./multer");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const Transaction = require("./models/transactionModel");
const User = require("./models/userModel");
const TravelStory = require("./models/travelStoryModel");
const axios = require("axios");

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

// Serve frontend static files for deployment
//const __dirnameResolved = path.resolve();
//app.use(express.static(path.join(__dirnameResolved, '/client/dist')));
//app.get('*', (req, res) => {
 // res.sendFile(path.join(__dirnameResolved, 'client', 'dist', 'index.html'));
//});

// Create Account
app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ error: true, message: "All fields are required" });
  }

  const isUser = await User.findOne({ email });
  if (isUser) {
    return res.status(400).json({ error: true, message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    fullName,
    email,
    password: hashedPassword,
  });

  await user.save();

  const accessToken = jwt.sign(
    { userId: user.id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "72h" }
  );

  return res.status(201).json({
    error: false,
    user: { fullName: user.fullName, email: user.email },
    accessToken,
    message: "Registration successful",
  });
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const accessToken = jwt.sign(
    { userId: user.id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "72h" }
  );

  return res.json({
    error: false,
    message: "Login successful",
    user: { fullName: user.fullName, email: user.email },
    accessToken,
  });
});

// Get User
app.get("/get-user", authenticateToken, async (req, res) => {
  const { userId } = req.user;
  const isUser = await User.findOne({ _id: userId });

  if (!isUser) {
    return res.sendStatus(401);
  }

  return res.json({ user: isUser, message: "" });
});

// Image Upload
app.post("/image-upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: true, message: "No image uploaded" });
    }
    const imageUrl = `http://localhost:8000/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Delete Image
app.delete("/delete-image", async (req, res) => {
  const { imageUrl } = req.query;
  if (!imageUrl) {
    return res.status(400).json({ error: true, message: "imageUrl parameter is required" });
  }

  try {
    const filename = path.basename(imageUrl);
    const filePath = path.join(__dirname, "uploads", filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.status(200).json({ message: "Image deleted successfully" });
    } else {
      res.status(404).json({ error: true, message: "Image not found" });
    }
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Add Travel Story
app.post("/add-travel-story", authenticateToken, async (req, res) => {
  const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
  const { userId } = req.user;

  if (!title || !story || !visitedLocation || !imageUrl || !visitedDate) {
    return res.status(400).json({ error: true, message: "All fields are required" });
  }

  const parsedVisitedDate = new Date(parseInt(visitedDate));

  try {
    const newTravelStory = new TravelStory({
      title,
      story,
      visitedLocation,
      userId,
      imageUrl,
      visitedDate: parsedVisitedDate,
    });

    await newTravelStory.save();
    res.status(201).json({ story: newTravelStory, message: "Added successfully" });
  } catch (error) {
    res.status(400).json({ error: true, message: error.message });
  }
});

// Get All Travel Stories
app.get("/get-all-stories", authenticateToken, async (req, res) => {
  const { userId } = req.user;

  try {
    const travelStories = await TravelStory.find({ userId }).sort({ isFavourite: -1 });
    res.status(200).json({ stories: travelStories });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Delete Travel Story
app.delete("/delete-story/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    const travelStory = await TravelStory.findOne({ _id: id, userId });

    if (!travelStory) {
      return res.status(404).json({ error: true, message: "Travel story not found" });
    }

    await TravelStory.deleteOne({ _id: id });

    const imageUrl = travelStory.imageUrl;
    const filename = path.basename(imageUrl);
    const filePath = path.join(__dirname, "uploads", filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(200).json({ message: "Travel story deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Fix the update favorite status
app.put("/update-is-favourite/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { isFavourite } = req.body;
  const { userId } = req.user;

  try {
    const travelStory = await TravelStory.findOne({ _id: id, userId });

    if (!travelStory) {
      return res.status(404).json({ error: true, message: "Travel story not found" });
    }

    travelStory.isFavourite = isFavourite;
    await travelStory.save();
    res.status(200).json({ story: travelStory, message: "Updated successfully" });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Edit Travel Story
app.put("/edit-story/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
  const { userId } = req.user;

  try {
    const travelStory = await TravelStory.findOne({ _id: id, userId });

    if (!travelStory) {
      return res.status(404).json({ error: true, message: "Travel story not found" });
    }

    if (title) travelStory.title = title;
    if (story) travelStory.story = story;
    if (visitedLocation) travelStory.visitedLocation = visitedLocation;
    if (imageUrl) travelStory.imageUrl = imageUrl;
    if (visitedDate) travelStory.visitedDate = new Date(parseInt(visitedDate));

    await travelStory.save();

    res.status(200).json({ story: travelStory, message: "Story updated successfully" });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Search travel stories
app.get('/search', authenticateToken, async (req, res) => {
  const { userId } = req.user;
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: true, message: 'Search query is required' });
  }

  try {
    const searchResults = await TravelStory.find({
      userId: userId,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { story: { $regex: query, $options: 'i' } },
        { visitedLocation: { $regex: query, $options: 'i' } },
      ],
    }).sort({ isFavourite: -1 });

    res.status(200).json({ stories: searchResults });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Filter travel stories by date range
app.get('/travel-stories/filter', authenticateToken, async (req, res) => {
  const { userId } = req.user;
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ error: true, message: 'Start and end dates are required' });
  }

  try {
    const start = new Date(parseInt(startDate));
    const end = new Date(parseInt(endDate));

    const filteredStories = await TravelStory.find({
      userId: userId,
      visitedDate: { $gte: start, $lte: end },
    }).sort({ isFavourite: -1 });

    res.status(200).json({ stories: filteredStories });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

 // POST route to start a payment
app.post("/initialize-payment", authenticateToken, async (req, res) => {
	const { phoneNumber, email, name, provider, amount } = req.body;
  
	try {
	  // ✅ Step 1: Fetch operators from correct endpoint
	  const opRes = await axios.get(
		"https://api.paychangu.com/mobile-money",
		{
		  headers: {
			Authorization: `Bearer ${process.env.PAYCHANGU_SECRET}`,
		  },
		}
	  );
  
	  // ✅ Step 2: Find the matching operator (e.g., "Airtel Money", "TNM Mpamba")
	  const operator = opRes.data.data.find(op =>
		op.name.toLowerCase().includes(provider.toLowerCase())
	  );
  
	  if (!operator) {
		return res.status(400).json({
		  message: `Mobile money operator '${provider}' not found.`,
		});
	  }
  
	  // ✅ Step 3: Initialize mobile money payment
	  const initRes = await axios.post(
		"https://api.paychangu.com/mobile-money/payments/initialize",
		{
		  mobile_money_operator_ref_id: operator.ref_id,
		  mobile: phoneNumber,
		  amount: amount.toString(),
		  charge_id: "" + Math.floor(Math.random() * 1e9 + 1),
		  email,
		  first_name: name.split(" ")[0] || "",
		  last_name: name.split(" ")[1] || "",
		},
		{
		  headers: {
			accept: "application/json",
			"content-type": "application/json",
			Authorization: `Bearer ${process.env.PAYCHANGU_SECRET}`,
		  },
		}
	  );
  
	  console.log("PayChangu response:", initRes.data);
	  res.status(200).json({ data: initRes.data });
	  
	} catch (err) {
	  console.error("Error initializing payment:", err.response?.data || err.message);
	  res.status(500).json({
		message: "Failed to initialize payment",
		error: err.response?.data || err.message,
	  });
	}
  });
  
  // Route to verify the status of a payment
app.get("/verify-charge/:chargeId", authenticateToken, async (req, res) => {
	try {
	  const { chargeId } = req.params; // Get charge ID from URL
  
	  // Send GET request to PayChangu to verify payment
	  const response = await axios.get(
		`https://api.paychangu.com/mobile-money/payments/${chargeId}/verify`,
		{
		  headers: {
			accept: "application/json",
			"content-type": "application/json",
			Authorization: `Bearer ${process.env.PAYCHANGU_SECRET}`,
		  },
		}
	  );
  
	  console.log(response.data); // Show result from PayChangu
	  res.status(200).json({ data: response?.data }); // Send response to frontend
	} catch (error) {
	  res.status(500).json({ message: error });
	  console.log(error);
	}
  });
  
  
  // Route to update the user's payment status
app.post("/updatePaymentStatus", authenticateToken, async (req, res) => {
	const { email } = req.body; // Get user’s email from request
	console.log(email);
  
	// Find the user and mark them as paid
	const updatedUser = await User.findOneAndUpdate(
	  { email },      // Search by email
	  { paid: true }, // Set paid = true
	  { new: true }   // Return updated user
	);
  
	// Save the transaction details in your database
	const transaction = await new Transaction(req.body);
	await transaction.save(); // Store it in MongoDB
  
	res.status(200).json(updatedUser); // Send updated user back to frontend
  });
  

app.listen(8000, () => console.log("Server running on port 8000"));
module.exports = app;
