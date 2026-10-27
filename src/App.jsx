import { MotionConfig } from "framer-motion";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Skills from "./components/Skills/Skills";
import Projects from "./components/Projects/Projects";
import Footer from "./components/Footer/Footer";
import Contact from "./components/Contact/Contact";
import Background from "./components/Background/Background";
import About from "./components/About/About";
import { useState } from "react";
import ProjectDialog from "./components/Projects/ProjectDialog";

export default function App() {
  const [category, setCategory] = useState("all");
  const [detailProject, setDetailProject] = useState(null);
  const [spaceEnabled, setSpaceEnabled] = useState(true);
  const explore = (next, projectId) => {
    setCategory(next);
    requestAnimationFrame(() => {
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const catalog = document.getElementById('catalog');
      const target = projectId ? catalog?.querySelector(`[data-project="${projectId}"]`) : catalog;
      target?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'start' });
      (projectId ? target?.querySelector('h4') : document.getElementById('catalog-heading'))?.focus({ preventScroll: true });
      if (target && !reduced) {
        target.classList.remove('teleport-arrival');
        requestAnimationFrame(() => target.classList.add('teleport-arrival'));
        setTimeout(() => target.classList.remove('teleport-arrival'), 1100);
      }
    });
  };
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">
        Saltar al contenido
      </a>
      <Background enabled={spaceEnabled}/>
      <Navbar />
      <main id="main">
        <Hero onExploreCategory={explore} onOpenProject={setDetailProject} spaceEnabled={spaceEnabled} onSpaceEnabledChange={setSpaceEnabled}/>
        <Projects category={category} onCategoryChange={setCategory} onOpenProject={setDetailProject}/>
        <Skills />
        <About />
        <Contact />
      </main>
      <Footer />
      <ProjectDialog project={detailProject} onClose={()=>setDetailProject(null)}/>
    </MotionConfig>
  );
}
