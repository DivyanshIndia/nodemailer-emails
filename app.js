import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: 'OAuth2',
        user:  process.env.G_USER_EMAIL, 
        clientId: process.env.G_CLIENT_ID,
        clientSecret: process.env.G_CLIENT_SECRET,
        refreshToken: process.env.G_REFRESH_TOKEN, }
})

const mailOptions = {
    from: process.env.G_USER_EMAIL,
    to: "lusizhao9@gmail.com",
    subject : "Software Developer / Full Stack Developer",
    text : "Please to meet you"
}

transporter.sendMail(mailOptions, (error, info) => {
    if(error) {
        console.log(error)
    }
    else {
        console.log("Email sent :" + info.response)
    }
})