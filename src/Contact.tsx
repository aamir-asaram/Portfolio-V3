import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Clear form input values
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div id="goto-contact" className="flex flex-col justify-around items-center lg:flex-row lg:items-center lg:justify-around h-screen max-w-screen pt-20">
      <div className="w-10/12 flex justify-center">
        <a href="https://docs.google.com/document/d/1rywuRspQ3iU5hLmfXay_Z35_IJKpplL2otKaQy_bciw/edit?usp=sharing" target="_blank" className="bg-black text-primary text-3xl font-semibold w-fit h-full py-4 px-6 rounded-lg hover:bg-black/80 hover:scale-110">GET MY RESUME</a>
      </div>
      <div className="bg-black p-6 rounded-xl flex flex-col items-center justify-center text-white h-fit py-8 w-10/12 lg:w-1/2">
        <h2 className="text-2xl lg:text-3xl mb-4 font-medium">Leave me a message:</h2>
        <form id="contact-form" action="https://formspree.io/f/moqoqzez" method="POST" onSubmit={handleSubmit} className="flex flex-col w-full text-black">
          <input type="text" name="Name" id="" placeholder="Name" className="my-2 p-2 w-full text-black" required value={name} onChange={(e) => setName(e.target.value)} />
          <input type="email" name="Email" id="" placeholder="Email" className="my-2 p-2 w-full text-black" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <textarea name="Message" id="" placeholder="Message" className="my-2 p-2 w-full text-black" required value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
          <button type="submit" className="bg-primary hover:bg-primary/90 text-black text-2xl font-semibold w-full py-2 rounded-lg mt-4">Submit</button>
        </form>
      </div>
      <div className="w-10/12 flex flex-col items-center">
        <h2 className="text-2xl lg:text-3xl pt-10 -mt-14 mb-14 font-medium">Or connect with me:</h2>
        <div className="flex justify-center lg:relative fixed bottom-8 bg-black/50 text-white py-3 rounded-full z-[1000000]">
          <a href="https://github.com/aamir-asaram" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faGithub} className="text-2xl lg:text-4xl mx-5 hover:scale-110"></FontAwesomeIcon>
          </a>
          <a href="https://www.linkedin.com/in/aamir-asaram/" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faLinkedin} className="text-2xl lg:text-4xl mx-5 hover:scale-110"></FontAwesomeIcon>
          </a>
          <a href="https://twitter.com/aaaaamir_" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faTwitter} className="text-2xl lg:text-4xl mx-5 hover:scale-110"></FontAwesomeIcon>
          </a>
          <a href="mailto:aamirasaram2107@gmail.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faEnvelope} className="text-2xl lg:text-4xl mx-5 hover:scale-110"></FontAwesomeIcon>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Contact;