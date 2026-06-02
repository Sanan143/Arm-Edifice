import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/919113551616?text=Hi%20ARM%20Edifice%2C%20I%20need%20a%20quotation%20for%20aluminium%20work."
      target="_blank"
      rel="noopener"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full flex items-center justify-center shadow-elegant animate-pulse-ring transition-smooth hover:scale-110"
      style={{ backgroundColor: "#25D366" }}
    >
      <MessageCircle className="h-7 w-7 text-white" fill="white" strokeWidth={0} />
      <MessageCircle className="absolute h-6 w-6" style={{ color: "#25D366" }} />
    </a>
  );
}