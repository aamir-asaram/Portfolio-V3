import { motion, useTransform, useScroll } from "framer-motion";
import { useRef } from "react";

const Projects = () => {
  return (
    <div id="goto-projects" className="bg-neutral-800">
      <HorizontalScrollCarousel />
    </div>
  );
};

const HorizontalScrollCarousel = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-100%"]);

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-primary">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-4">
          {cards.map((card) => {
            return <Card card={card} key={card.id} />;
          })}
        </motion.div>
      </div>
    </section>
  );
};

const Card = ({ card }: { card: { url: any; title: string; id: number; live: string, source: string; description: string } }) => {
  return (
    <div
      key={card.id}
      className="group relative h-[450px] w-[450px] overflow-hidden bg-neutral-200"
    >
      <div
        style={{
          backgroundImage: `url(${card.url})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="absolute inset-0 z-0 transition-transform duration-300 group-hover:scale-110"
      >
        <div className="absolute inset-0 z-10 place-content-center w-full h-full bg-gradient-to-br from-white/20 to-white/0 hidden group-hover:grid group-hover:bg-primary/30 group-hover:backdrop-blur-xl">
          <p className="p-8 text-6xl font-black uppercase text-transparent group-hover:text-black w-full h-full">
            {card.title}
          </p>
          <p className="ml-2 pl-8 w-10/12">
            {card.description}
          </p>
          <div className="p-8 hidden group-hover:block">
            {/* if card.live != "" render button */}
            { card.live && <a className="bg-primary px-4 py-2 rounded-full hover:bg-primary/50 mr-2" href={card.live} target="_blank">View Live</a>}
            <a className="bg-primary px-4 py-2 rounded-full hover:bg-primary/50 mx-2 cursor-pointer" href={card.source} target="_blank">View Source</a>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Projects;

const cards = [

  {
    url: "/static/images/drive.png",
    title: "DriveShare",
    id: 1,
    description: "An AirBnB-like app for renting cars. Built using React, TailwindCSS and Rails",
    source: "https://github.com/Zohra-Neda/DriveShare-Back-End",
    live: "https://drive-share-app-frontend.onrender.com/",
  },
  {
    url: "/static/images/cnc.png",
    title: "Code & Coffee",
    id: 2,
    description: "A showcase site for a local coffee event. Built using HTML, CSS and JS",
    source: "https://github.com/aamir-asaram/capstone-one",
    live: "https://aamir-asaram.github.io/capstone-one/",
  },
  {
    url: "/static/images/centsible.png",
    title: "Centsible",
    id: 3,
    description: "A budgeting app that helps you track your expenses and savings. Built using Rails and TailwindCSS",
    source: "https://github.com/aamir-asaram/centsible",
    live: "https://centsible-wiq6.onrender.com",
  },
  {
    url: "/static/images/power.png",
    title: "Power Outage Tracker",
    id: 4,
    description: "A mobile app that tracks power outages across South Africa. Built using React",
    source: "https://github.com/aamir-asaram/power-outage-tracker",
    live: "https://power-outage-tracker-qzsq.onrender.com/",
  },
  {
    url: "/static/images/meal.png",
    title: "Meal Gallery",
    id: 5,
    description: "A gallery of meals from around the world. Built using HTML and JavaScript",
    source: "https://github.com/HtetWaiYan7191/meal-gallery",
    live: "https://htetwaiyan7191.github.io/meal-gallery/dist",
  },
  {
    url: "/static/images/space.png",
    title: "Space Travellers' Hub",
    id: 6,
    description: "An app that displays all SpaceX missions and Rockets. Built using React, Redux and JS",
    source: "https://github.com/Kgomotso196/Space-Travelers",
    live: "https://space-travelers-hub-i4jc.onrender.com/",
  },
  {
    url: "/static/images/math.png",
    title: "Math Magicians",
    id: 7,
    description: "A calculator app that performs basic arithmetic operations. Built using React and JS",
    source: "https://github.com/aamir-asaram/math-magicians",
    live: "https://vercel.com/aamir-asaram/math-magicians/6rFL4umGXyE8yHHXZCNT8WG6E9fe",
  },

];