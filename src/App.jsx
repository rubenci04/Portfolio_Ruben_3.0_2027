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
  const explore = next => {
    setCategory(next);
    requestAnimationFrame(() => {
      document.getElementById("catalog")?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
      document.getElementById("catalog-heading")?.focus({ preventScroll: true });
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
