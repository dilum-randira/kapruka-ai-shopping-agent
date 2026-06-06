"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Bot,
  Search,
  ShoppingBag,
  ArrowRight,
  TrendingDown,
  Globe,
  Gift,
  Send,
  User,
  Check,
  Star,
  ChevronRight,
  Menu,
  X,
  DollarSign
} from "lucide-react";

// Mock inventory curated by the AI
interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageGradient: string;
  icon: string;
  category: string;
  rating: number;
  tags: string[];
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Kapruka Signature Royal Rose Bouquet",
    price: 35.0,
    originalPrice: 42.0,
    imageGradient: "from-rose-500 to-pink-600",
    icon: "🌹",
    category: "Gifts & Flowers",
    rating: 4.9,
    tags: ["Handpicked", "Same Day Delivery"]
  },
  {
    id: "2",
    name: "Ceylon Premium Gold Tea Selection",
    price: 18.5,
    imageGradient: "from-amber-600 to-yellow-800",
    icon: "☕",
    category: "Gourmet Food",
    rating: 4.8,
    tags: ["100% Organic", "Traditional Ceylon"]
  },
  {
    id: "3",
    name: "Aura Smart Ambient Light Capsule",
    price: 45.0,
    originalPrice: 59.99,
    imageGradient: "from-violet-600 to-indigo-700",
    icon: "🔮",
    category: "Tech Gadgets",
    rating: 4.7,
    tags: ["AI Voice Control", "RGB Sync"]
  },
  {
    id: "4",
    name: "Kapruka Decadent Chocolate Ganache Cake",
    price: 28.0,
    imageGradient: "from-amber-800 to-amber-950",
    icon: "🎂",
    category: "Gourmet Food",
    rating: 5.0,
    tags: ["Baker's Special", "Rich Cocoa"]
  },
  {
    id: "5",
    name: "Eco-Active Noise Cancelling Earbuds",
    price: 89.0,
    originalPrice: 120.0,
    imageGradient: "from-cyan-600 to-blue-700",
    icon: "🎧",
    category: "Tech Gadgets",
    rating: 4.6,
    tags: ["ANC 2.0", "Waterproof"]
  },
  {
    id: "6",
    name: "Velvet Night Eau de Parfum",
    price: 75.0,
    imageGradient: "from-purple-600 to-fuchsia-800",
    icon: "✨",
    category: "Gifts & Flowers",
    rating: 4.8,
    tags: ["French formulation", "Long Lasting"]
  }
];

// Predefined AI Chat scenarios for interactive agent
const CHAT_SCENARIOS = [
  {
    trigger: "Find a premium birthday gift for my partner under $40",
    messages: [
      { sender: "user", text: "Find a premium birthday gift for my partner under $40" },
      { sender: "bot", text: "Analyzing Kapruka's premium catalog for birthday gifts under $40..." },
      { sender: "bot", text: "I found the perfect match: *Kapruka Signature Royal Rose Bouquet* ($35.00, marked down from $42.00). It includes fresh local red roses and fits well within your budget! Would you like me to add a custom birthday note?" }
    ]
  },
  {
    trigger: "Suggest the best authentic Ceylon tea package",
    messages: [
      { sender: "user", text: "Suggest the best authentic Ceylon tea package" },
      { sender: "bot", text: "Searching authentic tea estates & exporters on Kapruka..." },
      { sender: "bot", text: "Highly recommended: *Ceylon Premium Gold Tea Selection* ($18.50). Curated from the finest high-grown estates in Nuwara Eliya. 100% organic with rich aromatic notes. Shall I add it to your cart?" }
    ]
  },
  {
    trigger: "Help me find futuristic room lighting",
    messages: [
      { sender: "user", text: "Help me find futuristic room lighting" },
      { sender: "bot", text: "Querying smart-home and ambient lighting category..." },
      { sender: "bot", text: "Take a look at the *Aura Smart Ambient Light Capsule* ($45.00). It features AI voice sync, HSL spectrum ambient illumination, and a sleek modern design. Perfect for desktop or bedroom setups." }
    ]
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [maxBudget, setMaxBudget] = useState<number>(100);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Chat agent interactive states
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string }>>([
    { sender: "bot", text: "Hello! I am your Kapruka AI Shopping Concierge. What special items are you searching for today?" }
  ]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [customInput, setCustomInput] = useState<string>("");

  const handleScenarioClick = (triggerText: string) => {
    if (isTyping) return;
    const scenario = CHAT_SCENARIOS.find((s) => s.trigger === triggerText);
    if (!scenario) return;

    // Reset chat with user trigger
    setChatMessages([scenario.messages[0]]);
    setIsTyping(true);

    // Simulate thinking and responding step-by-step
    setTimeout(() => {
      setChatMessages((prev) => [...prev, scenario.messages[1]]);
      setTimeout(() => {
        setChatMessages((prev) => [...prev, scenario.messages[2]]);
        setIsTyping(false);
      }, 1500);
    }, 800);
  };

  const handleCustomSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim() || isTyping) return;

    const query = customInput.trim();
    setChatMessages((prev) => [...prev, { sender: "user", text: query }]);
    setCustomInput("");
    setIsTyping(true);

    setTimeout(() => {
      // Look for fuzzy matches in products
      const matched = MOCK_PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
      );

      let reply = "";
      if (matched.length > 0) {
        reply = `I scanned Kapruka's listings and found ${matched.length} items matching your request. Best match: *${matched[0].name}* for $${matched[0].price.toFixed(2)}. I've highlighted them in the catalog below!`;
        // Switch tab to match category if exists
        const matchedCategory = matched[0].category;
        if (["Gifts & Flowers", "Gourmet Food", "Tech Gadgets"].includes(matchedCategory)) {
          setActiveTab(matchedCategory);
        }
      } else {
        reply = `I've registered your request: "${query}". I'm scanning extended Kapruka merchant warehouses. In the meantime, feel free to explore our curated Tech, Food, and Gift sections below!`;
      }

      setChatMessages((prev) => [
        ...prev,
        { sender: "bot", text: reply }
      ]);
      setIsTyping(false);
    }, 1200);
  };

  // Filter products based on selected tab and budget
  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    const matchesTab = activeTab === "All" || product.category === activeTab;
    const matchesBudget = product.price <= maxBudget;
    return matchesTab && matchesBudget;
  });

  return (
    <div className="relative min-h-screen bg-brand-dark text-slate-100 font-sans grid-bg select-none">
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-900/20 blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-950/35 blur-[150px] pointer-events-none" />
      <div className="absolute top-[30%] left-[60%] w-[30vw] h-[30vw] rounded-full bg-indigo-900/10 blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-brand-dark/60 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center border border-cyan-300/20 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                KAPRUKA <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-extrabold text-glow">AI</span>
              </span>
              <p className="text-[10px] text-slate-400 tracking-wider uppercase">Shopping Concierge</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-cyan-400 transition-colors">Platform Features</a>
            <a href="#demo" className="hover:text-cyan-400 transition-colors">Live Demo</a>
            <a href="#curations" className="hover:text-cyan-400 transition-colors">Instant Curations</a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a 
              href="#demo"
              className="px-5 py-2.5 rounded-full text-sm font-semibold bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-slate-200"
            >
              How it works
            </a>
            <a 
              href="#demo"
              className="px-5 py-2.5 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all flex items-center gap-2 border border-cyan-400/20"
            >
              Start Shopping <Sparkles className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile menu trigger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white bg-white/5 border border-white/10"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/5 bg-brand-dark/95 backdrop-blur-lg px-4 py-6 flex flex-col gap-4"
            >
              <a 
                href="#features" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-slate-200 py-2 border-b border-white/5"
              >
                Platform Features
              </a>
              <a 
                href="#demo" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-slate-200 py-2 border-b border-white/5"
              >
                Live Demo
              </a>
              <a 
                href="#curations" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-slate-200 py-2 border-b border-white/5"
              >
                Instant Curations
              </a>
              <div className="flex flex-col gap-3 pt-4">
                <a 
                  href="#demo"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 font-semibold"
                >
                  How it works
                </a>
                <a 
                  href="#demo"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold flex items-center justify-center gap-2"
                >
                  Start Shopping <Sparkles className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col gap-24 relative z-10">
        
        {/* Hero & Interactive Assistant Section */}
        <section id="demo" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[75vh]">
          
          {/* Left Column: Heading and Sales Hooks */}
          <div className="lg:col-span-7 flex flex-col items-start text-left gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-xs font-semibold text-cyan-300"
            >
              <Sparkles className="w-3.5 h-3.5" /> Introducing Next-Gen E-Commerce Search
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-white"
            >
              Your Personal AI <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent text-glow">
                Shopping Concierge
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-xl text-base sm:text-lg text-slate-300 leading-relaxed"
            >
              Say goodbye to endless filtering and search pages. Tell our Kapruka AI what you want, who it is for, and your budget. It curates, compares, and packages the finest products in seconds.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 w-full sm:w-auto"
            >
              <a 
                href="#curations"
                className="w-full sm:w-auto px-8 py-4 text-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] transform hover:-translate-y-0.5"
              >
                Launch Concierge
              </a>
              <a 
                href="#features"
                className="w-full sm:w-auto px-8 py-4 text-center rounded-full bg-white/5 hover:bg-white/10 text-white font-semibold border border-white/10 transition-all"
              >
                Explore Features
              </a>
            </motion.div>

            {/* Quick metrics */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-3 gap-6 pt-6 border-t border-white/5 w-full mt-6"
            >
              <div>
                <span className="block text-2xl md:text-3xl font-extrabold text-white text-glow">100k+</span>
                <span className="text-xs text-slate-400">Curated Goods</span>
              </div>
              <div>
                <span className="block text-2xl md:text-3xl font-extrabold text-white text-glow">99.4%</span>
                <span className="text-xs text-slate-400">Match Accuracy</span>
              </div>
              <div>
                <span className="block text-2xl md:text-3xl font-extrabold text-white text-glow">&lt; 2s</span>
                <span className="text-xs text-slate-400">Curation Time</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Interactive AI Concierge Chat Widget */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 w-full flex flex-col h-[520px] rounded-3xl border border-white/10 card-glass overflow-hidden shadow-2xl relative"
          >
            {/* Widget Header */}
            <div className="px-5 py-4 border-b border-white/5 bg-slate-900/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.4)]">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <span className="absolute bottom-[-2px] right-[-2px] w-3 h-3 rounded-full bg-emerald-500 border-2 border-brand-dark" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-white flex items-center gap-1.5">
                    Kapruka Shopping Assistant
                  </span>
                  <span className="text-[10px] text-emerald-400 block font-medium">Agent Active &amp; Ready</span>
                </div>
              </div>
              <span className="text-xs px-2 py-1 rounded bg-white/5 text-slate-400">v1.2</span>
            </div>

            {/* Chat Messages Panel */}
            <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4 scrollbar-thin">
              {chatMessages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className="flex items-start gap-2.5 max-w-[85%]">
                    {msg.sender !== "user" && (
                      <div className="w-6 h-6 rounded-md bg-cyan-950 border border-cyan-800 flex items-center justify-center flex-shrink-0 text-[10px] text-cyan-400 mt-1">
                        AI
                      </div>
                    )}
                    <div 
                      className={`px-4 py-3 rounded-2xl text-xs md:text-sm leading-relaxed ${
                        msg.sender === "user" 
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none shadow-md" 
                          : "bg-white/5 border border-white/5 text-slate-200 rounded-tl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-2.5 max-w-[85%]">
                    <div className="w-6 h-6 rounded-md bg-cyan-950 border border-cyan-800 flex items-center justify-center flex-shrink-0 text-[10px] text-cyan-400 mt-1">
                      AI
                    </div>
                    <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/5 text-slate-200 rounded-tl-none flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400/80 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Prompt Selectors */}
            <div className="px-5 py-3 border-t border-white/5 bg-slate-900/30">
              <span className="text-[10px] text-slate-400 block mb-2 uppercase tracking-wider font-semibold">Suggested Scenarios:</span>
              <div className="flex flex-col gap-1.5">
                {CHAT_SCENARIOS.map((sc, i) => (
                  <button
                    key={i}
                    onClick={() => handleScenarioClick(sc.trigger)}
                    disabled={isTyping}
                    className="w-full text-left px-3 py-1.5 rounded-lg bg-white/5 hover:bg-blue-950/40 hover:border-cyan-500/35 border border-white/5 text-[11px] text-slate-300 truncate transition-all flex items-center justify-between group"
                  >
                    <span>&ldquo;{sc.trigger}&rdquo;</span>
                    <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input Bar */}
            <form onSubmit={handleCustomSend} className="p-3 border-t border-white/5 bg-slate-950/60 flex items-center gap-2">
              <input 
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Ask for custom gifts, gourmet food or tech..."
                disabled={isTyping}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/80 transition-colors"
              />
              <button 
                type="submit"
                disabled={isTyping}
                className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-cyan-500 text-white flex items-center justify-center transition-colors shadow-lg shadow-blue-950 disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>

        </section>

        {/* Feature Highlights Section */}
        <section id="features" className="scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400">Core Platform Features</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Designed For The Future Of E-Commerce
            </h2>
            <p className="text-sm md:text-base text-slate-400">
              Kapruka AI bridges the gap between massive online listings and your instant personal needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1 */}
            <div className="card-glass p-6 rounded-2xl flex flex-col gap-4 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-md">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Semantic Intent Search</h3>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                Describe items in plain language. Instead of searching keywords, specify the mood, context, or occasion.
              </p>
            </div>

            {/* Card 2 */}
            <div className="card-glass p-6 rounded-2xl flex flex-col gap-4 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-md">
                <TrendingDown className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Real-time Bargain Tracking</h3>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                Our AI monitors merchant inventories, signaling when prices drop or bundled discount packages align with your search.
              </p>
            </div>

            {/* Card 3 */}
            <div className="card-glass p-6 rounded-2xl flex flex-col gap-4 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-md">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Seamless Local Delivery</h3>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                Integrated directly with Kapruka’s premium Sri Lankan island-wide and global shipping network for timely fulfillment.
              </p>
            </div>

            {/* Card 4 */}
            <div className="card-glass p-6 rounded-2xl flex flex-col gap-4 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-md">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Custom Bundle Curation</h3>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                Combine cakes, fresh flowers, and imported gifts into automated premium sets. Perfect for celebratory moments.
              </p>
            </div>

          </div>
        </section>

        {/* Dynamic Curation Showcases */}
        <section id="curations" className="scroll-mt-24 border-t border-white/5 pt-20">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-12">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400">Interactive Preview</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Simulated AI Inventory Curation
              </h2>
              <p className="text-sm md:text-base text-slate-400 max-w-xl">
                Filter the concierge inventory catalog by category or refine the maximum budget below to see how our AI selects optimal product matches instantly.
              </p>
            </div>

            {/* Budget Controller */}
            <div className="w-full lg:w-72 bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 flex items-center gap-1 font-medium"><DollarSign className="w-3.5 h-3.5" /> Max Budget</span>
                <span className="text-cyan-400 font-bold text-sm">${maxBudget} USD</span>
              </div>
              <input 
                type="range"
                min="20"
                max="120"
                step="5"
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                <span>$20</span>
                <span>$70</span>
                <span>$120</span>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2.5 mb-8 border-b border-white/5 pb-6">
            {["All", "Gifts & Flowers", "Gourmet Food", "Tech Gadgets"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                  activeTab === tab
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50 border border-blue-400/20"
                    : "bg-white/5 text-slate-400 hover:text-white border border-white/5"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="card-glass rounded-2xl overflow-hidden flex flex-col border border-white/5 group"
                >
                  {/* Decorative Gradient block acting as product image */}
                  <div className={`h-40 bg-gradient-to-tr ${product.imageGradient} flex items-center justify-center text-6xl relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-300`}>
                    <span className="relative z-10 filter drop-shadow-md select-none">{product.icon}</span>
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs font-bold bg-black/40 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-sm flex items-center gap-1.5">
                        Buy with AI <ShoppingBag className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">{product.category}</span>
                        <div className="flex items-center gap-1 text-amber-400 text-xs">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{product.rating}</span>
                        </div>
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                        {product.name}
                      </h4>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {product.tags.map((tag, i) => (
                          <span key={i} className="text-[9px] bg-white/5 border border-white/5 text-slate-400 px-2 py-0.5 rounded-full font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-4">
                      <div>
                        {product.originalPrice && (
                          <span className="text-xs line-through text-slate-500 mr-2">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                        <span className="text-sm font-extrabold text-white text-glow">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                      
                      <button className="text-[11px] font-bold text-cyan-400 hover:text-white flex items-center gap-1 group/btn transition-colors">
                        Add Bundle <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredProducts.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">No products found</h4>
                  <p className="text-xs text-slate-400 mt-1">Try raising the budget slider or choosing a different tab.</p>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Brand Curation / Call To Action banner */}
        <section className="relative rounded-3xl overflow-hidden border border-cyan-500/20 bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-slate-900/60 p-8 md:p-16 text-center flex flex-col items-center gap-6 shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-cyan-500/10 blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-blue-500/10 blur-[80px] pointer-events-none" />

          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center border border-cyan-300/20 shadow-lg mb-2">
            <Bot className="w-7 h-7 text-white" />
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight max-w-xl leading-tight">
            Ready to experience the future of shopping?
          </h2>
          <p className="text-slate-300 text-sm md:text-base max-w-lg leading-relaxed">
            Get personalized curations, automated discount detection, and seamless checkout straight to your doorstep via Kapruka.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
            <a 
              href="#demo"
              className="px-8 py-4 rounded-full text-sm font-bold bg-white text-blue-950 hover:bg-slate-100 transition-all shadow-xl flex items-center justify-center gap-2"
            >
              Start shopping with AI <Sparkles className="w-4 h-4 text-blue-600" />
            </a>
            <a 
              href="https://www.kapruka.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-full text-sm font-semibold bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all text-center"
            >
              Visit Kapruka.com
            </a>
          </div>

          {/* Core Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 pt-8 border-t border-white/5 w-full mt-6 text-slate-400 text-xs">
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-cyan-400" /> Premium Curated Partners</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-cyan-400" /> 100% Secure Checkout</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-cyan-400" /> Island-wide Express Delivery</span>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-slate-950/80 py-12 mt-20 relative z-10 text-slate-500 text-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-950/80 border border-blue-900/50 flex items-center justify-center">
              <Bot className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-300">KAPRUKA AI</span>
              <p className="text-[9px] text-slate-600">Shopping Concierge</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-slate-400">
            <a href="#demo" className="hover:text-cyan-400 transition-colors">Concierge</a>
            <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
            <a href="#curations" className="hover:text-cyan-400 transition-colors">Curation Preview</a>
            <a href="https://www.kapruka.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">Official Website</a>
          </div>

          <div>
            <p>&copy; {new Date().getFullYear()} Kapruka. All rights reserved. Powered by Kapruka AI labs.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
