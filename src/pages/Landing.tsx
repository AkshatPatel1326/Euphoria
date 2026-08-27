import { Navbar } from "@/components/euphoria/Navbar";
import { Hero } from "@/components/euphoria/Hero";
import { CinematicReveal } from "@/components/euphoria/CinematicReveal";
import { About } from "@/components/euphoria/About";
import { CategoryCards } from "@/components/euphoria/CategoryCards";
import { Glimpses } from "@/components/euphoria/Glimpses";
import { Sponsors } from "@/components/euphoria/Sponsors";
import { Footer } from "@/components/euphoria/Footer";
import { SmoothCursor } from "@/components/magicui/smooth-cursor";

export default function Landing() {
  return (
    <div className="min-h-screen bg-euphoria-dark text-white overflow-x-hidden">
      <SmoothCursor />
      <Navbar />
      <main>
        <Hero />
        <CinematicReveal />
        <About />
        <CategoryCards />
        <Glimpses />
        <Sponsors />
      </main>
      <Footer />
    </div>
  );
}
