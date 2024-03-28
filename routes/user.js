import express from "express";
import bcrypt from "bcrypt";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
// import dotenv from "dotenv"
// dotenv.config()
import nodemailer from "nodemailer";
const router = express.Router();



router.post("/signup", async (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    const user = await User.findOne({ email });
    console.log(firstname, lastname, email, password)
    if (user) {
      return res.json({ message: "User already exist" });
    }
    const hashpassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashpassword,
    });
    await newUser.save();
    return res.json({
      status: true,
      message: "Record registered Successfully",
    });
  });


  router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log(email)
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({
        message: "User Does Not Exists",
      });
    }
  
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send({
        message: "Incorrect Password",
      });
    }
    const token = jwt.sign({ firstname: user.firstname }, process.env.KEY, {
        expiresIn: "1hr",
      });
      res.cookie("token", token, { httpOnly: true, maxAge: 360000 });
      return res.json({ status: true, message: "Login Successful" });
    });




    router.post("/forgot-password", async (req, res) => {
        const { email } = req.body;
        try {
          const user = await User.findOne({ email });
          if (!user) {
            return res.json({
              message: "User does not exist.Please create an Account!!",
            });
          }
      
          const token = jwt.sign({ id: user._id }, process.env.KEY, {
            expiresIn: "10m",
          });
      
          var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "swathirajan255@gmail.com",
              pass: "ibcz vplj hwqw urvc",
            },
          });
      
          var mailOptions = {
            from: "swathirajan255@gmail.com",
            to: email,
            subject: "Reset Password",
            text: `http://localhost:5173/resetPassword/${token}`,
          };
      
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.error("Error sending email:", error);
              return res.status(500).json({ message: "Error sending email" });
            } else {
              console.log("Email sent:", info.response);
              return res.json({ status: true, message: "Email sent successfully" });
            }
          });
        } catch (error) {
          console.log(error);
        }
      });



      router.post("/reset-password/:token", async (req, res) => {
        const token = req.params.token;
        const { password } = req.body;
      
        try {
          const decoded = await jwt.verify(token, process.env.KEY);
          const id = decoded.id;
          const hashpassword = await bcrypt.hash(password, 10);
          await User.findByIdAndUpdate({ _id: id }, { password: hashpassword });
          return res.json({ status: true, message: "Password Updated Successfully" });
        } catch (error) {
          return res.json("Invalid Token");
        }
      });



      export { router as UserRouter };
      