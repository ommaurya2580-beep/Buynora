import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Info, Mail, Phone, MapPin, Send, HelpCircle, ChevronDown, 
  ChevronUp, ShieldCheck, FileText, Sparkles
} from 'lucide-react';
import { useToast } from '../hooks/useToast';

export const StaticPages: React.FC = () => {
  const location = useLocation();
  const { showToast } = useToast();

  const isAbout = location.pathname.includes('/about');
  const isContact = location.pathname.includes('/contact');
  const isFaq = location.pathname.includes('/faq');
  const isPrivacy = location.pathname.includes('/privacy');
  const isTerms = location.pathname.includes('/terms');

  // Contact Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // FAQ Collapsible States
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      showToast("Thank you! Your message was sent successfully.", "success");
      setName('');
      setEmail('');
      setMsg('');
      setSubmitting(false);
    }, 800);
  };

  const faqItems = [
    {
      q: "How can I track my shipment?",
      a: "Navigate to your User Dashboard and visit the 'Order History' tab. Clicking 'Track Shipment' will open a real-time vertical tracking timeline showing processing, carrier dispatch, and estimated delivery dates."
    },
    {
      q: "What is your refund and return policy?",
      a: "We offer a 30-day hassle-free return policy on all electronics, and a 14-day return window on shoes and clothing. Items must be in original unworn condition. Return shipping is completely free."
    },
    {
      q: "How do Buynora Reward Points work?",
      a: "Every purchase earns you reward points! For every dollar spent, you accumulate 10 points. Every 100 points can be redeemed at checkout for a direct $1 discount. You can also earn 150 points by sharing your referral code with friends."
    },
    {
      q: "Can I sell my own products on Buynora?",
      a: "Absolutely! Simply click on the 'Seller Dashboard' link in the profile dropdown menu, apply to be a merchant partner, and start listing your products and viewing sales analytics instantly."
    }
  ];

  return (
    <div className="max-w-3xl mx-auto pb-16 text-left space-y-8">
      
      {/* TABS: ABOUT US */}
      {isAbout && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Info className="w-6 h-6 text-indigo-500" />
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">About Buynora</h1>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Buynora is a world-class premium e-commerce ecosystem designed to deliver modularity, elegance, and extreme high-speed shopping. We specialize in curate electronics, running gear, and apparel inspired by design pioneers like Apple, Nike, and Sony.
          </p>
          <div className="glass p-6 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 space-y-4">
            <h4 className="text-sm font-bold text-gray-800 dark:text-white">Our Architecture Statement</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              We focus on premium visual states, light/dark custom properties, zero loading lag using query pre-caching, and accessible interface layouts. Our tech stack relies on Vite, React 19, Redux Toolkit, and Tailwind CSS v4.
            </p>
          </div>
        </div>
      )}

      {/* TABS: CONTACT US */}
      {isContact && (
        <div className="space-y-8">
          <div className="flex items-center gap-2">
            <Mail className="w-6 h-6 text-indigo-500" />
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">Contact Support</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            
            {/* Form */}
            <form onSubmit={handleContactSubmit} className="md:col-span-2 glass p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 space-y-4 bg-white/40 dark:bg-slate-900/40">
              <input
                type="text"
                placeholder="Full Name"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="bg-gray-100 dark:bg-slate-800 text-xs px-4 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full"
              />
              <input
                type="email"
                required
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="bg-gray-100 dark:bg-slate-800 text-xs px-4 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full"
              />
              <textarea
                placeholder="Describe your inquiry..."
                required
                rows={4}
                value={msg}
                onChange={e => setMsg(e.target.value)}
                className="bg-gray-100 dark:bg-slate-800 text-xs px-4 py-2.5 rounded-xl border border-transparent focus:border-indigo-500 outline-none w-full resize-none"
              />
              <button
                type="submit"
                disabled={submitting}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-6 rounded-xl cursor-pointer shadow flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" /> Send Message
              </button>
            </form>

            {/* Coordinates */}
            <div className="glass p-5 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 space-y-4 bg-white/40 dark:bg-slate-900/40 text-xs">
              <h4 className="font-bold uppercase tracking-wider text-gray-400 text-[10px]">Headquarters</h4>
              <div className="flex gap-2.5">
                <MapPin className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                <span className="text-gray-650 dark:text-gray-300">500 Infinite Loop, Cupertino, CA 95014</span>
              </div>
              <div className="flex gap-2.5">
                <Phone className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                <span className="text-gray-650 dark:text-gray-300">+1 (555) 019-9988</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TABS: FAQ COLLAPSIBLES */}
      {isFaq && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-indigo-500" />
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">Help & FAQs</h1>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, idx) => (
              <div 
                key={idx}
                className="glass rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-white/40 dark:bg-slate-900/40 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between text-xs font-bold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-50/50 dark:hover:bg-slate-800/20"
                >
                  <span>{item.q}</span>
                  {openFaqIndex === idx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openFaqIndex === idx && (
                  <div className="p-5 pt-0 border-t border-gray-100 dark:border-gray-800/50 text-xs text-gray-650 dark:text-gray-400 leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TABS: PRIVACY POLICY */}
      {isPrivacy && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-indigo-500" />
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">Privacy Policy</h1>
          </div>
          <div className="glass p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 space-y-4 text-xs text-gray-650 dark:text-gray-300 leading-relaxed">
            <h4 className="font-bold text-sm text-gray-900 dark:text-white">1. Information We Collect</h4>
            <p>We collect details to personalize recommendations, such as name, shipping address, wishlist records, and recently viewed lists. Credit cards are secured and processed using mock token models.</p>
            <h4 className="font-bold text-sm text-gray-900 dark:text-white">2. Cookies and Custom Preferences</h4>
            <p>Our client uses localStorage to sync light/dark styling mode, shopping cart items, and recent product visits.</p>
          </div>
        </div>
      )}

      {/* TABS: TERMS & CONDITIONS */}
      {isTerms && (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-500" />
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">Terms & Conditions</h1>
          </div>
          <div className="glass p-6 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 space-y-4 text-xs text-gray-650 dark:text-gray-300 leading-relaxed">
            <h4 className="font-bold text-sm text-gray-900 dark:text-white">1. Merchant Agreement</h4>
            <p>Merchant partners registering on the Seller Dashboard represent that all product details, stock limits, and brand names submitted to our global catalog are authentic and representable.</p>
            <h4 className="font-bold text-sm text-gray-900 dark:text-white">2. Reward Points Terms</h4>
            <p>Rewards points collected are non-transferable, have no direct legal cash equivalence outside checkout discounts, and are cleared from user balances upon point use dispatches.</p>
          </div>
        </div>
      )}

    </div>
  );
};
