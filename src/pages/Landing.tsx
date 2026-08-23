import { Navbar } from "@/components/euphoria/Navbar";
import { Hero } from "@/components/euphoria/Hero";
import { About } from "@/components/euphoria/About";
import { CategoryCards } from "@/components/euphoria/CategoryCards";
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
        <CategoryCards />
        <Sponsors />
      </main>
      <Footer />
    </div>
  );
}
