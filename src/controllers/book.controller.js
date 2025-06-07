import cloudinary from "../lib/cloudinary.js";
import Book from "../models/Book.js";

export const addBook=async(req,res)=>{
    try {
        const {title,rating,image,caption}=req.body;

        if(!title || !caption || !rating || !image){
            return res.status(400).json({message:"Please provide all the fields"})
        }


        //  console.log("📤 Uploading image to Cloudinary...");
        //  console.log(image)
        const uploadResponse=await cloudinary.uploader.upload(image);
        //  console.log("✅ Upload success:", uploadResponse.secure_url);
        const imageUrl=uploadResponse.secure_url;
         
        const newBook=new Book({
            title,
            caption,
            rating,
            image:imageUrl,
            user:req.user._id
        })
        await newBook.save();
        res.status(201).json({
          book:newBook,
          message:"Book added successfully!"
        })
    } catch (error) {
        // console.log("error in addbook controller",error.message);
         res.status(500).json({
        message: "Internal server error",
              
    });
    }
}

export const getBooks=async(req,res)=>{

    // const reponse=await fetch("https://localhost:3000/api/book/getbooks?page=1&limit=5")

    try {
        const page=req.query.page || 1;
        const limit=req.query.limit || 5;
        const skip=(page-1)*limit;

        const books=await Book.find().sort({createdAt:-1}).skip(skip)
        .limit(limit).populate("user","username profileImage")
        if(!books || books.length===0){
            return res.status(404).json({message:"No Books found"})
        }
        const totalBooks=await Book.countDocuments()
         res.status(200).json({
            books:books,
            currentPage:page,
            totalBooks:totalBooks,
            totalPages:Math.ceil(totalBooks/limit),
            message:"Books fetched successfully!"
         })
    } catch (error) {
        
        console.log("error in addbook controller",error.message);
        res.status(500).json({message:"Internal server error"})
    }
}

export const deleteBook=async(req,res)=>{
    try {
        const bookid=req.params.bookid
        const book=await Book.findById(bookid)

        if(!book) return res.status(404).json({message:"Book not found!"})


        //check if user is the creator of the book
        if(book.user.toString()!==req.user._id.toString()){
            return res.status(401).json({message:"Unauthorized"})

        }
        // delete image from cloudinary as well
        // https://res.cloudinary.com//dfjhdkf/image/upload/jfhdkjfhjkf/kjdfhdjfh/image123.png
        // publicId= image123
        if(book.image && book.image.includes("cloudinary")){
            try {
                const publicId=book.image.split("/").pop().split(".")[0]
                await cloudinary.uploader.destroy(publicId)
            } catch (error) {
                console.log("error deleting image from cloudinay",error)
            }
        }

        await book.deleteOne();
        res.status(200).json({message:"Book deleted successfully."})

    } catch (error) {
        console.log("Error deleting book",error)
        res.status(500).json({message:"Internal Server error"})

    }
}

export const getbookByuser=async(req,res)=>{
    try {
        const books=await Book.find({user:req.user._id}).sort({createdAt:-1})
        res.status(200).json(books)
    } catch (error) {
          console.log("get user books error",error)
        res.status(500).json({message:"Internal Server error"})

    }
}