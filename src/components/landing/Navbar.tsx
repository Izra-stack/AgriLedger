import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollTo = (id: string) => {
    setIsOpen(false);
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div
            className="flex-shrink-0 flex items-center cursor-pointer -translate-x-3 translate-y-2"
            onClick={() => scrollTo("top")}
          >
            <img
              src="/agrilogo.png"
              alt="AgriLedger Logo"
              className="h-14 md:h-16 max-w-full w-auto object-contain"
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <button
              onClick={() => scrollTo("top")}
              className="text-brand-text hover:text-brand-dark font-medium transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollTo("features")}
              className="text-brand-text hover:text-brand-dark font-medium transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollTo("workflow")}
              className="text-brand-text hover:text-brand-dark font-medium transition-colors"
            >
              Workflow
            </button>
            <button
              onClick={() => scrollTo("community")}
              className="text-brand-text hover:text-brand-dark font-medium transition-colors"
            >
              Community
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-brand-text hover:text-brand-dark p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-6 space-y-4 shadow-lg absolute w-full">
          <button
            onClick={() => scrollTo("top")}
            className="block w-full text-left px-3 py-2 text-base font-medium text-brand-text"
          >
            Home
          </button>

          <button
            onClick={() => scrollTo("features")}
            className="block w-full text-left px-3 py-2 text-base font-medium text-brand-text"
          >
            Features
          </button>

          <button
            onClick={() => scrollTo("workflow")}
            className="block w-full text-left px-3 py-2 text-base font-medium text-brand-text"
          >
            Workflow
          </button>

          <button
            onClick={() => scrollTo("community")}
            className="block w-full text-left px-3 py-2 text-base font-medium text-brand-text"
          >
            Community
          </button>

          <button
            onClick={() => scrollTo("contact")}
            className="block w-full text-left px-3 py-2 text-base font-medium text-brand-text"
          >
            Contact
          </button>
        </div>
      )}
    </nav>
  );
}
