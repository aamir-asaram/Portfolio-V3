import NavBar from "./NavBar";
import Landing from "./Landing";
import About from "./About";
import Projects from "./Projects";
import Contact from "./Contact";

const Home = () => {
  return (
    <div className="">
      <NavBar />
      <Landing />
      <About />
      <Projects />
      <Contact />
    </div>
  );
};

export default Home;