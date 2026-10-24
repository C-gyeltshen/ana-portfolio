import Hero from "@/components/hero/Hero";
import About from "@/components/about/About";
import ContentHeading from "@/components/content/ContentHeading";
import Projects from "@/components/projects/Projects";
import Footer from "@/components/ui/Footer";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <About />
        <ContentHeading />
        <Projects />
      </main>
      <Footer />
    </>
  );
}
