import { Navbar } from "@/components/euphoria/Navbar";
import { Hero } from "@/components/euphoria/Hero";
import { About } from "@/components/euphoria/About";
import { EuphoriaExperience } from "@/components/euphoria/EuphoriaExperience";
import { CategoryCards } from "@/components/euphoria/CategoryCards";
import { ReliveTheEnergy } from "@/components/euphoria/ReliveTheEnergy";
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
        <About />
        <EuphoriaExperience />
        <CategoryCards />
        <ReliveTheEnergy />
        <Sponsors />
      </main>
      <Footer />
    </div>
  );
}
