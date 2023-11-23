import { motion, useTransform, useScroll } from "framer-motion";
import { useRef } from "react";

const Projects = () => {
  return (
    <div className="bg-neutral-800">
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

const Card = ({ card }: { card: { url: string; title: string; id: number; live: string, source: string; description: string } }) => {
  return (
    <div
      key={card.id}
      className="group relative h-[450px] w-[450px] overflow-hidden bg-neutral-200"
    >
      <div
        style={{
          backgroundImage: `url(${card.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="absolute inset-0 z-0 transition-transform duration-300 group-hover:scale-110"
      >
        <div className="absolute inset-0 z-10 place-content-center w-full h-full bg-gradient-to-br from-white/20 to-white/0 hidden group-hover:grid group-hover:bg-primary/30 group-hover:backdrop-blur-xl">
          <p className="p-8 text-6xl font-black uppercase text-transparent group-hover:text-black w-full h-full">
            {card.title}
          </p>
          <p className="pl-8">
            {card.description}
          </p>
          <div className="p-8 hidden group-hover:block">
            {/* if card.live != "" render button */}
            { card.live && <a className="bg-primary px-4 py-2 rounded-full hover:bg-primary/50 mr-2" href={card.live} target="_blank">View Live</a>}
            <a className="bg-primary px-4 py-2 rounded-full hover:bg-primary/50 mx-2 cursor-pointer">View Source</a>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Projects;

const cards = [
  {
    url: "./assets/me.png",
    title: "Centsible",
    id: 1,
    description: "",
    source: "",
    live: "",
  },
  {
    url: "/imgs/abstract/2.jpg",
    title: "DriveShare",
    id: 2,
    description: "",
    source: "",
    live: "",
  },
  {
    url: "./assets/cnc.png",
    title: "Code & Coffee",
    id: 3,
    description: "A showcase site for a local coffee event",
    source: "",
    live: "https://aamir-asaram.github.io/capstone-one/",
  },
  {
    url: "/imgs/abstract/4.jpg",
    title: "Title 4",
    id: 4,
    description: "",
    source: "",
    live: "",
  },
  {
    url: "/imgs/abstract/5.jpg",
    title: "Title 5",
    id: 5,
    description: "",
    source: "",
    live: "",
  },
  {
    url: "/imgs/abstract/6.jpg",
    title: "Title 6",
    id: 6,
    description: "",
    source: "",
    live: "",
  },
  {
    url: "/imgs/abstract/7.jpg",
    title: "Title 7",
    id: 7,
    description: "",
    source: "",
    live: "",
  },
];