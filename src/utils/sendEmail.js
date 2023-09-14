import nodemailer from "nodemailer";
import env from "dotenv"
env.config()

export const sendEmail = async (options) => {
  
  const transporter = nodemailer.createTransport({
    service:"gmail.com",
    secure: true,
    auth: {
      user: process.env.smtp_email, 
      pass: process.env.smtp_password, 
    },
  });
  // verify transporter
  transporter.verify((err,success) => {
    if(err){
      console.log(err)
      console.log("error in transporter")
    }else{
      console.log('success')
    }
})

  // send mail with defined transport object
  const message = {
    from: process.env.EmailedFrom,
    to: options.email,
    subject: options.subject,
    text: options.message
  }; 

  const info = await transporter.sendMail(message);
  
}