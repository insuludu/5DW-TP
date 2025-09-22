import ContactForm from "../components/contactform";
import style from "../styles/page.module.css"
import Header from "../components/header";
import Footer from "../components/footer";
import { SubmitHandler, useForm } from "react-hook-form"

export default function Contact() {
    return (
      <div>
          <Header />
          <ContactForm/>
          <Footer />
      </div>
    );
  }
  