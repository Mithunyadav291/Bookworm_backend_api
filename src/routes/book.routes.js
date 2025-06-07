import express from "express";
import { addBook, deleteBook, getbookByuser, getBooks } from "../controllers/book.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router =express.Router();

router.post("/addbook",protectRoute,addBook)

router.get("/getbooks",protectRoute,getBooks)
router.delete("/delete/:bookid",protectRoute,deleteBook)
router.get("/getuserBook",protectRoute,getbookByuser)

export default router;