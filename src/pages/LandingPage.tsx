import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import Workflow from '../components/landing/Workflow';
import SupportCTA from '../components/landing/SupportCTA';
import Footer from '../components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen font-sans flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <Workflow />
        <SupportCTA />
      </main>
      <Footer />
    </div>
  );
}
