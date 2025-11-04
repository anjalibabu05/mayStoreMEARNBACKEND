const books = require("../model/bookmodel");
// import stripe
const stripe = require('stripe')(process.env.stripeKey)

exports.addBookController = async (req, res) => {
  console.log('📘 Inside addBookController');

  const {
    tittle,
    author,
    noOfPages,
    ImageUrl,
    price,
    dPrice,
    abstract,
    publisher,
    language,
    isbn,
    category
  } = req.body;

  // ✅ Map uploaded files to filenames
  const uploadedimages = req.files?.map(file => file.filename) || [];
  console.log('🖼 Uploaded images:', uploadedimages);

  const email = req.email;
  console.log('👤 User email:', email);

  try {
    // 1️⃣ Check if userEmail is available
    if (!email) {
      return res.status(400).json({ message: "User email not found in request" });
    }

    // 2️⃣ Ensure at least one image is uploaded
    if (!uploadedimages.length) {
      return res.status(400).json({ message: "Please upload at least one image" });
    }

    // 3️⃣ Check for duplicate ISBN for this user
    const existingBook = await books.findOne({ isbn, userEmail: email });
    if (existingBook) {
      return res.status(409).json({
        message: "You have already added this book with the same ISBN!"
      });
    }

    // 4️⃣ Create and save new book
    const newBook = new books({
      tittle,
      author,
      noOfPages,
      ImageUrl,
      price,
      dPrice,
      abstract,
      publisher,
      language,
      isbn,
      category,
      uploadedimages,  // ✅ matches schema
      userEmail: email,
      status: "pending"
    });

    await newBook.save();
    console.log('✅ Book saved successfully:', newBook);

    // 5️⃣ Return success response
    return res.status(200).json({
      message: "Book added successfully",
      book: newBook
    });

  } catch (err) {
    console.error('❌ Error adding book:', err);
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message
    });
  }
};


// to get home books

exports.getHomeBookController = async (req, res) => {
  try {
    const allHomeBooks = await books.find().sort({ _id: -1 }).limit(4)
    res.status(200).json(allHomeBooks)
  } catch (err) {
    res.status(500).json(err)
  }
}

// to get all books in page
exports.getAllBookController = async (req, res) => {
  const searchKey = req.query.search || ""; // get search query or default empty
  const userEmail = req.email; // email from JWT middleware

  try {
    const query = {
      tittle: { $regex: searchKey, $options: "i" },
      userEmail: { $ne: userEmail } // exclude books added by logged-in user
    };

    const allBooks = await books.find(query);
    res.status(200).json(allBooks);
  } catch (err) {
    console.error("❌ Error fetching books:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};





// to get a specific  book 
exports.getABookController = async (req, res) => {
  const { id } = req.params
  console.log(id);

  try {
    const aBook = await books.findOne({ _id: id })
    res.status(200).json(aBook)
  } catch (err) {
    res.status(500).json(err)
  }

}
// to get all books added by user

// exports.getAllUserBookController=async (req,res)=>{
//   const email=req.payload
//   console.log(email);

//   try{
//     const allUserBook=await books.find({userEmail:email})
//     res.status(200).json(allUserBook)
//   }
//   catch(err){
//     res.status(500).json(err)
//   }

// }
// book to be in profile tab section

exports.getAllUserBookController = async (req, res) => {
  
  const email = req.email; // email from JWT middleware

  try {
    const allUserBooks = await books.find({userEmail:email});
    res.status(200).json(allUserBooks);
  } catch (err) {
    console.error("❌ Error fetching books:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};



// to get all books brought by user
exports.getAllUserBroughtBookController=async(req,res)=>{
  const email=req.email;
  console.log(email);

  try{
    const allUserBroughtBook= await books.find({brought:email})
      res.status(200).json(allUserBroughtBook)
  }
  catch(err){
    res.status(500).json(err)
  }
}




// ------------ADMIN-------------

exports.getAllBookAdminController = async (req, res) => {


  try {
    const allBooks = await books.find()
    res.status(200).json(allBooks)
  } catch (err) {
    res.status(500).json(err)
  }

}


// Aprove Controller

exports.approveBookController = async (req, res) => {
  const { _id, tittle, author, noOfPages, ImageUrl, price, dPrice, abstract, publisher, language, isbn, category, uploadedimages, status, userEmail, brought } = req.body

  console.log(_id, tittle, author, noOfPages, ImageUrl, price, dPrice, abstract, publisher, language, isbn, category, uploadedimages, status, userEmail, brought,
  );

  try {

    const existingBook = await books.findByIdAndUpdate({ _id }, { _id, tittle, author, noOfPages, ImageUrl, price, dPrice, abstract, publisher, language, isbn, category, uploadedimages, status: 'Approved', userEmail, brought }, { new: true })

    // await existingBook.save()
    res.status(200).json(existingBook)

  } catch (err) {
    res.status(500).json(err)
  }

}


exports.makePaymentController = async (req, res) => {
  const { bookDetails } = req.body;
  const brought = req.payload;
  const userEmail = req.email; // email from JWT middleware

  try {
    const bookUpdate = await books.findByIdAndUpdate(
      {
        _id: bookDetails._id,
      }, {
      title: bookDetails.title,
      author: bookDetails.author,
      noOfPages: bookDetails.noOfPages,
      ImageUrl: bookDetails.price,
      price: bookDetails.price,
      dPrice: bookDetails.dPrice,
      abstract: bookDetails.abstract.slice(0,20),
      publisher: bookDetails.publisher,
      language: bookDetails.language,
      isbn: bookDetails.isbn,
      category: bookDetails.category,
      uploadedimages: bookDetails.category,
      status: "sold",
      userEmail: bookDetails.userEmail,
      brought

    }, { new: true }


    )
    const line_item = [{
      price_data: {
        currency: "usd",
        product_data: {
          name: bookDetails.title,
          description: `${bookDetails.author} | ${bookDetails.publisher}`,
          images: [bookDetails.ImageUrl],
          metadata: {
            title: bookDetails.title,
            author: bookDetails.author,
            noOfPages: bookDetails.noOfPages,
            ImageUrl: bookDetails.price,
            price: bookDetails.price,
            dPrice: bookDetails.dPrice,
            abstract: bookDetails.abstract,
            publisher: bookDetails.publisher,
            language: bookDetails.language,
            isbn: bookDetails.isbn,
            category: bookDetails.category,
            uploadedimages: bookDetails.category,
            status: "sold",
            userEmail: bookDetails.userEmail,
            brought

          },
           // cents
      unit_amount:Math.round(bookDetails.dPrice*100)
        },
        quantity:1
      }
     
      
    }]
    // stripe checkout session
    const session = await stripe.checkout.sessions.create({
      // purchased using card
      payement_method_types: ['card'],
      // details of product that is purchased
      line_items: line_item,
      // make payment
      mode: 'payment',
      // if payment sucess-url to shown

      success_url: 'http://localhost:5173/payment-sucess',
      // if payment failed-url to shown
      cancel_url: "http://localhost:5173/payment-error",

    });
    console.log(session);
    res.status(200).json({sessionId:session.id})


  } catch (err) {
    res.status(500).json(err)
  }
};


