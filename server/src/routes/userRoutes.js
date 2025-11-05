import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const userRoutes = express.Router();

userRoutes.post("/register", registerUser);
userRoutes.post("/login", loginUser);
userRoutes.get("/read", getAllUsers);
userRoutes.put("/update/:id", updateUser);
userRoutes.delete("/delete/:id", deleteUser);

export default userRoutes;
