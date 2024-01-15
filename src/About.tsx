import { scrollToContact } from "./NavBar";
import { NavLink } from "react-router-dom";

const About = () => {
  const mySkills = [
    'Java', 'Python', 'React', 'Vue', 'Redux', 'Bootstrap',
    'Ruby', 'Ruby on Rails', 'SQL', 'Git', 'GitHub', 'Webpack', 'Jest',
    'ESLint', 'VSCode', 'Figma', 'Markdown', 'Tailwind CSS', 'JavaScript', 'Linux'
  ];

  return (
    <div id="goto-about" className="relative z-50 flex flex-col md:flex-row lg:flex-row flex-wrap justify-around items-center text-white bg-black rounded-xl pt-[15%] pb-[10%] lg:py-[5%]">
      <h2 className="mb-8 lg:mb-0 pl-10 lg:pl-[6%] w-full text-3xl font-semibold">About me</h2>
      <p className="w-4/5 lg:w-2/5 text-xl">
        <span className="about-me">My name is Aamir</span> and I am a full-stack web developer with a passion for bridging the gap between the imagination and reality using code.
        <br /><br />I am a dedicated <span className="about-me">home barista</span> and I believe that the <span className="about-me">consistency</span> and <span className="about-me">attention to detail</span> required to make a good cup of coffee are the same qualities that make a good developer.
        <br /><br />If you like my ideas, have any concepts for a project or would like to collaborate, please feel free to <span className="about-me cursor-pointer hover:underline" id="goto-contact" onClick={scrollToContact}>contact me</span>!
      </p>
      <div className="w-full md:w-1/5 lg:w-1/3 text-black p-8 lg:rounded-xl my-4">
        <h2 className="text-white text-2xl font-semibold underline pl-4 mb-3">Skills</h2>
        <ul className="pl-1 w-full flex flex-wrap p-0">
          {mySkills.map((item, index) => (
            <li className="w-fit bg-primaryHover text-white rounded-full px-4 m-1" key={index} >{item}</li>
          ))}
        </ul>
      </div>
      <NavLink to={"/certificates"} className="hover:bg-primaryHover hover:scale-110 text-center bg-primary text-black text-2xl font-semibold w-4/5 lg:w-1/5 py-2 rounded-lg mt-4">
        VIEW MY CERTIFICATES
      </NavLink>
    </div>
  );
}

export default About;