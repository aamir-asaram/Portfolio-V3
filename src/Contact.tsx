const Contact = () => {
  return (
      <div id="goto-contact" className="flex flex-col min-h-screen max-w-screen bg-primary pt-20 pl-6">
        <h2 className="text-4xl lg:text-6xl font-semibold">Let's keep in touch!</h2>
        <p className="text-2xl lg:text-3xl pt-10 font-medium">Pop me an email:<br /> <a href="mailto:aamirasaram2107@gmail.com" className="text-black font-normal hover:underline">aamirasaram2107@gmail.com</a></p>
        <h2 className="text-2xl lg:text-3xl pt-10 font-medium">Leave me a message:</h2>
        <h2 className="text-2xl lg:text-3xl pt-10 font-medium">Or connect with me:</h2>
      </div>
    )
}

export default Contact;