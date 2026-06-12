const books = require("../model/bookmodel");
const stripe = require('stripe')(process.env.stripeKey);

exports.addBookController = async (req, res) => {
  const { tittle, author, noOfPages, imageUrl, price, dPrice, abstract, publisher, language, isbn, category } = req.body;
  const uploadimages = req.files?.map(file => file.filename) || [];
  const email = req.email;

  try {
    if (!email) return res.status(400).json({ message: "User email not found in request" });
    if (!uploadimages.length) return res.status(400).json({ message: "Please upload at least one image" });

    const existingBook = await books.findOne({ isbn, userEmail: email });
    if (existingBook) return res.status(409).json({ message: "You have already added this book with the same ISBN!" });

    const newBook = new books({
      tittle, author, noOfPages, imageUrl, price, dPrice, abstract,
      publisher, language, isbn, category, uploadimages, userEmail: email, status: "pending"
    });

    await newBook.save();
    return res.status(200).json({ message: "Book added successfully", book: newBook });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

exports.getHomeBookController = async (req, res) => {
  try {
    const allHomeBooks = await books.find({ status: 'Approved' }).sort({ _id: -1 }).limit(4);
    res.status(200).json(allHomeBooks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching home books", error: err.message });
  }
};

exports.getAllBookController = async (req, res) => {
  const searchKey = req.query.search || "";
  const userEmail = req.email;

  try {
    const query = {
      tittle: { $regex: searchKey, $options: "i" },
      userEmail: { $ne: userEmail }
    };
    const allBooks = await books.find(query);
    res.status(200).json(allBooks);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

exports.getABookController = async (req, res) => {
  const { id } = req.params;
  try {
    const aBook = await books.findById(id);
    if (!aBook) return res.status(404).json({ message: "Book not found" });
    res.status(200).json(aBook);
  } catch (err) {
    res.status(500).json({ message: "Error fetching book", error: err.message });
  }
};

exports.getAllUserBookController = async (req, res) => {
  const email = req.email;
  try {
    const allUserBooks = await books.find({ userEmail: email });
    res.status(200).json(allUserBooks);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

exports.getAllUserBroughtBookController = async (req, res) => {
  const email = req.email;
  try {
    const allUserBroughtBook = await books.find({ brought: email });
    res.status(200).json(allUserBroughtBook);
  } catch (err) {
    res.status(500).json({ message: "Error fetching brought books", error: err.message });
  }
};

exports.getAllBookAdminController = async (req, res) => {
  try {
    const allBooks = await books.find();
    res.status(200).json(allBooks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching books", error: err.message });
  }
};

exports.approveBookController = async (req, res) => {
  const { _id } = req.body;
  try {
    const existingBook = await books.findByIdAndUpdate(
      _id,
      { ...req.body, status: 'Approved' },
      { new: true }
    );
    if (!existingBook) return res.status(404).json({ message: "Book not found" });
    res.status(200).json(existingBook);
  } catch (err) {
    res.status(500).json({ message: "Error approving book", error: err.message });
  }
};

exports.makePaymentController = async (req, res) => {
  const { bookDetails } = req.body;
  const userEmail = req.email;

  try {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    await books.findByIdAndUpdate(
      bookDetails._id,
      { status: "sold", brought: userEmail },
      { new: true }
    );

    const line_items = [{
      price_data: {
        currency: "usd",
        product_data: {
          name: bookDetails.tittle || bookDetails.title,
          description: `${bookDetails.author} | ${bookDetails.publisher}`,
        },
        unit_amount: Math.round(bookDetails.dPrice * 100)
      },
      quantity: 1
    }];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${baseUrl}/payment-sucess`,
      cancel_url: `${baseUrl}/payment-error`,
    });

    res.status(200).json({ sessionId: session.id });
  } catch (err) {
    res.status(500).json({ message: "Payment error", error: err.message });
  }
};
