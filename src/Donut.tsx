import { NavLink } from "react-router-dom";

const Donut = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-black text-primary">
      <h1 className="text-5xl font-semibold mt-8 mb-4">Certificates</h1>
      <p className="w-4/5 text-center text-lg lg:text-2xl mb-4">All below certificates were obtained from the US-based remote full-stack development school <a className="hover:text-primaryHover underline" href="https://www.microverse.org/">Microverse</a>. You can view them on <a className="underline hover:text-primaryHover" href="https://www.credential.net/profile/aamirasaram458431/wallet">Accredible.</a></p>
      <div className="flex flex-row flex-wrap justify-center">
        {certificates.map((certificate) => {
          return (
            <div className="lg:w-2/5 w-4/5 p-2 flex flex-wrap">
              <img src={certificate} alt="" />
            </div>
          );
        })}
      </div>

      <NavLink to="/" className="hover:bg-primaryHover hover:scale-110 text-center bg-primary text-black text-2xl font-semibold w-[76%] lg:w-1/5 py-2 rounded-lg my-8">BACK TO PORTFOLIO</NavLink>
    </div>
  );
}

export default Donut;

const certificates = [
  "/static/images/Certificate/html.JPG",
  "/static/images/Certificate/js.JPG",
  "/static/images/Certificate/react.JPG",
  "/static/images/Certificate/ruby.JPG",
  "/static/images/Certificate/rails.JPG",
  "/static/images/Certificate/fullstack.JPG",
];
