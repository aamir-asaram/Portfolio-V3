import { useEffect, useState } from "react";

export const scrollToContact = () => {
  const projects = document.getElementById('goto-projects');
  const pos = projects ? projects.offsetTop + projects.offsetHeight : 0;
  window.scrollTo({
    top: pos,
    behavior: 'smooth',
  });
}

const NavBar = () => {
  // check where the user is on the page and highlight the appropriate nav item
  const [active, setActive] = useState('home');
  const handleScroll = () => {
    const currentScrollPos = scrollY;
    const about = document.getElementById('goto-about');
    const projects = document.getElementById('goto-projects');
    if (about && currentScrollPos < about.offsetTop) {
      setActive('home');
    } else if (about && projects && currentScrollPos < projects.offsetTop - 2) {
      setActive('about');
    } else if (projects && currentScrollPos < (projects.offsetTop + projects.offsetHeight - 2)) {
      setActive('projects');
    } else {
      setActive('contact');
    }
  };
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id:any) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <nav className="fixed top-0 z-[100000] w-full">
      <ul className="flex justify-around items-center text-white bg-black/50 backdrop-blur-xl p-4">
        <li className="cursor-pointer" onClick={() => scrollTo('goto-home')}>
          <span className={active === 'home' ? 'text-primary' : ''}>Home</span>
        </li>
        <li className="cursor-pointer" onClick={() => scrollTo('goto-about')}>
          <span className={active === 'about' ? 'text-primary' : ''}>About</span>
        </li>
        <li className="cursor-pointer" onClick={() => scrollTo('goto-projects')}>
          <span className={active === 'projects' ? 'text-primary' : ''}>Projects</span>
        </li>
        <li className="cursor-pointer" onClick={() => scrollToContact()}>
          <span className={active === 'contact' ? 'text-primary' : ''}>Contact</span>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;