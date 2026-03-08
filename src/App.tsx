import React, { useState, useEffect, FormEvent, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Link, Routes, Route, useParams, useLocation } from 'react-router-dom';
import { 
  MapPin, 
  Calendar, 
  Star, 
  ArrowRight, 
  Search, 
  Menu, 
  X, 
  ChevronRight,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  PlayCircle
} from 'lucide-react';
import { Tour, Destination } from './types';

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled || !isHome ? 'bg-white/80 backdrop-blur-lg shadow-sm py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-serif text-xl italic">B</div>
          <span className={`text-2xl font-serif font-bold tracking-tight ${isScrolled || !isHome ? 'text-zinc-900' : 'text-white'}`}>BharatYatra</span>
        </Link>

        <div className={`hidden md:flex items-center gap-8 ${isScrolled || !isHome ? 'text-zinc-900' : 'text-white'}`}>
          <a href="/#destinations" className="nav-link">Destinations</a>
          <a href="/#tours" className="nav-link">Tours</a>
          <a href="/#about" className="nav-link">About</a>
          <a href="/#contact" className="nav-link">Contact</a>
          <button className="bg-primary text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-opacity-90 transition-all">
            Book Now
          </button>
        </div>

        <button className={`md:hidden ${isScrolled || !isHome ? 'text-zinc-900' : 'text-white'}`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-t border-zinc-100 p-6 flex flex-col gap-4 md:hidden shadow-xl"
          >
            <a href="/#destinations" className="text-lg font-medium" onClick={() => setIsMobileMenuOpen(false)}>Destinations</a>
            <a href="/#tours" className="text-lg font-medium" onClick={() => setIsMobileMenuOpen(false)}>Tours</a>
            <a href="/#about" className="text-lg font-medium" onClick={() => setIsMobileMenuOpen(false)}>About</a>
            <a href="/#contact" className="text-lg font-medium" onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
            <button className="bg-primary text-white px-6 py-3 rounded-xl text-center font-medium">
              Book Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
          src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=2000" 
          alt="Taj Mahal"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white/80 uppercase tracking-[0.3em] text-sm font-medium mb-4"
        >
          Experience the Soul of India
        </motion.p>
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-6xl md:text-8xl text-white font-serif mb-8 leading-tight"
        >
          Journey Through <br /> <span className="italic">Timeless Landscapes</span>
        </motion.h1>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col md:flex-row gap-4 justify-center items-center"
        >
          <button className="bg-white text-zinc-900 px-8 py-4 rounded-full font-medium flex items-center gap-2 hover:bg-zinc-100 transition-all group">
            Explore Tours <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="bg-white/10 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-full font-medium hover:bg-white/20 transition-all">
            Watch Film
          </button>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60"
      >
        <span className="text-xs uppercase tracking-widest">Scroll to discover</span>
        <div className="w-px h-12 bg-white/30 relative">
          <motion.div 
            animate={{ top: [0, 48, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-0 left-0 w-full h-4 bg-white"
          />
        </div>
      </motion.div>
    </section>
  );
};

const TourCard: React.FC<{ tour: Tour, onClick: () => void }> = ({ tour, onClick }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-72 overflow-hidden">
        <img 
          src={tour.image_url} 
          alt={tour.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full text-xs font-bold text-primary uppercase tracking-wider">
          {tour.category}
        </div>
        <div className="absolute bottom-4 right-4 bg-primary text-white px-4 py-2 rounded-2xl font-serif text-lg">
          ₹{tour.price.toLocaleString()}
        </div>
      </div>
      <div className="p-8">
        <div className="flex items-center gap-1 text-amber-500 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} fill={i < Math.floor(tour.rating) ? "currentColor" : "none"} />
          ))}
          <span className="text-zinc-400 text-xs ml-1">({tour.rating})</span>
        </div>
        <h3 className="text-2xl mb-2 group-hover:text-primary transition-colors">{tour.title}</h3>
        <div className="flex items-center gap-4 text-zinc-500 text-sm mb-4">
          <span className="flex items-center gap-1"><MapPin size={14} /> {tour.location}</span>
          <span className="flex items-center gap-1"><Calendar size={14} /> {tour.duration}</span>
        </div>
        <p className="text-zinc-600 text-sm line-clamp-2 mb-6 leading-relaxed">
          {tour.description}
        </p>
        <div className="flex items-center justify-between pt-6 border-t border-zinc-100">
          <span className="text-primary font-medium text-sm flex items-center gap-1">
            View Details <ChevronRight size={16} />
          </span>
          <div className="flex -space-x-2">
             {[1,2,3].map(i => (
               <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-zinc-200 overflow-hidden">
                 <img src={`https://i.pravatar.cc/100?u=${i + tour.id}`} alt="user" referrerPolicy="no-referrer" />
               </div>
             ))}
             <div className="w-8 h-8 rounded-full border-2 border-white bg-primary flex items-center justify-center text-[10px] text-white font-bold">
               +12
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const BookingModal = ({ tour, onClose }: { tour: Tour, onClose: () => void }) => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tour_id: tour.id,
          customer_name: formData.name,
          customer_email: formData.email
        })
      });
      if (res.ok) {
        setIsSuccess(true);
        setTimeout(onClose, 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-zinc-900/60 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-[2.5rem] overflow-hidden max-w-4xl w-full flex flex-col md:flex-row shadow-2xl"
      >
        <div className="md:w-1/2 h-64 md:h-auto relative">
          <img src={tour.image_url} alt={tour.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
            <h2 className="text-white text-3xl mb-2">{tour.title}</h2>
            <p className="text-white/80 text-sm">{tour.location} • {tour.duration}</p>
          </div>
        </div>

        <div className="md:w-1/2 p-10 relative">
          <button onClick={onClose} className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-900 transition-colors">
            <X size={24} />
          </button>

          {isSuccess ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                  <ArrowRight size={40} className="rotate-[-45deg]" />
                </motion.div>
              </div>
              <h3 className="text-2xl mb-2">Booking Confirmed!</h3>
              <p className="text-zinc-500">We've sent the details to your email. Get ready for an amazing journey!</p>
            </div>
          ) : (
            <>
              <h3 className="text-2xl mb-6">Book Your Journey</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Full Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Email Address</label>
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="pt-4">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-zinc-500">Total Price</span>
                    <span className="text-2xl font-serif text-primary">₹{tour.price.toLocaleString()}</span>
                  </div>
                  <button 
                    disabled={isSubmitting}
                    className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const DestinationsSection = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    fetch('/api/destinations')
      .then(res => res.json())
      .then(data => setDestinations(data));
  }, []);

  return (
    <section id="destinations" className="py-24 px-6 bg-paper">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-primary font-medium uppercase tracking-widest text-xs mb-2"
          >
            Explore the Incredible
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl mb-6"
          >
            Popular <span className="italic">Destinations</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {destinations.map((dest, i) => (
            <Link key={dest.id} to={`/destination/${dest.slug}`}>
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative h-[500px] rounded-[2.5rem] overflow-hidden cursor-pointer"
              >
                <img 
                  src={dest.hero_image} 
                  alt={dest.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-10 left-10 right-10">
                  <h3 className="text-white text-3xl mb-2">{dest.name}</h3>
                  <p className="text-white/70 text-sm line-clamp-2 mb-6">{dest.description}</p>
                  <div className="flex items-center gap-2 text-white font-medium text-sm group-hover:gap-4 transition-all">
                    Explore Destination <ArrowRight size={18} />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

const DestinationPage = () => {
  const { slug } = useParams();
  const [dest, setDest] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.5]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`/api/destinations/${slug}`)
      .then(res => res.json())
      .then(data => {
        setDest(data);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!dest) return <div className="h-screen flex items-center justify-center">Destination not found</div>;

  return (
    <div ref={containerRef} className="bg-paper">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <motion.div style={{ scale: heroScale, opacity: heroOpacity }} className="absolute inset-0">
          <img src={dest.hero_image} alt={dest.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
        
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-7xl md:text-9xl text-white font-serif mb-6"
          >
            {dest.name}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white/80 max-w-2xl text-lg leading-relaxed"
          >
            {dest.description}
          </motion.p>
        </div>
      </section>

      {/* Video & Highlights */}
      <section className="py-24 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="relative rounded-[3rem] overflow-hidden aspect-video bg-zinc-900 flex items-center justify-center group"
        >
          <iframe 
            src={dest.video_url} 
            className="w-full h-full"
            title={dest.name}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </motion.div>

        <div>
          <h2 className="text-4xl mb-8">Cultural <span className="italic">Highlights</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {dest.highlights.map((highlight, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-white rounded-3xl border border-zinc-100 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Star size={18} fill="currentColor" />
                </div>
                <span className="font-medium">{highlight}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Attractions */}
      <section className="py-24 px-6 bg-zinc-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl mb-4">Top <span className="italic text-primary">Attractions</span></h2>
            <p className="text-zinc-400">Must-visit places in {dest.name}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {dest.attractions.map((attr, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <div className="relative h-64 rounded-[2rem] overflow-hidden mb-6">
                  <img 
                    src={`https://picsum.photos/seed/${attr.name}/600/400`} 
                    alt={attr.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h3 className="text-2xl mb-2">{attr.name}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{attr.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl mb-8">Ready to explore <span className="italic">{dest.name}?</span></h2>
          <p className="text-zinc-500 mb-10">Book your personalized tour today and experience the magic of India.</p>
          <button className="bg-primary text-white px-10 py-4 rounded-full font-bold hover:scale-105 transition-transform">
            Plan My Trip
          </button>
        </div>
      </section>
    </div>
  );
};

const HomePage = ({ tours, setSelectedTour }: { tours: Tour[], setSelectedTour: (t: Tour) => void }) => {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTours = tours.filter(tour => {
    const matchesFilter = filter === 'All' || tour.category === filter;
    const matchesSearch = tour.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         tour.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const categories = ['All', ...new Set(tours.map(t => t.category))];

  return (
    <>
      <Hero />
      <DestinationsSection />

      {/* Search & Filter Section */}
      <section id="tours" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-primary font-medium uppercase tracking-widest text-xs mb-2"
            >
              Our Curated Collections
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl"
            >
              Discover Your Next <br /> <span className="italic">Great Adventure</span>
            </motion.h2>
          </div>

          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input 
                type="text" 
                placeholder="Search tours..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-white border border-zinc-100 rounded-full pl-12 pr-6 py-3 w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-primary/10"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${filter === cat ? 'bg-primary text-white' : 'bg-white text-zinc-500 hover:bg-zinc-50'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredTours.map(tour => (
              <TourCard key={tour.id} tour={tour} onClick={() => setSelectedTour(tour)} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredTours.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-zinc-400">No tours found matching your criteria.</p>
          </div>
        )}
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-zinc-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="relative z-10 rounded-[3rem] overflow-hidden aspect-[4/5]"
            >
              <img src="https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&q=80&w=800" alt="Culture" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary rounded-[2rem] p-8 flex flex-col justify-end hidden md:flex"
            >
              <span className="text-5xl font-serif mb-2">15+</span>
              <p className="text-sm text-white/80 uppercase tracking-widest">Years of Excellence in Indian Tourism</p>
            </motion.div>
          </div>

          <div>
            <p className="text-primary font-medium uppercase tracking-widest text-xs mb-4">Why Choose BharatYatra</p>
            <h2 className="text-5xl mb-8 leading-tight">We Don't Just Plan Trips, <br /> <span className="italic text-primary">We Craft Memories</span></h2>
            <p className="text-zinc-400 mb-10 leading-relaxed text-lg">
              At BharatYatra, we believe that travel is more than just visiting new places. It's about connecting with cultures, understanding traditions, and creating stories that last a lifetime. Our team of local experts ensures every detail of your journey is perfect.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { title: 'Local Expertise', desc: 'Deep knowledge of every corner of India.' },
                { title: 'Handpicked Stays', desc: 'Luxury palaces to boutique heritage homes.' },
                { title: 'Safe Travel', desc: 'Your safety is our top priority always.' },
                { title: '24/7 Support', desc: 'We are with you every step of the way.' }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
                    <Star size={20} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg mb-1">{item.title}</h4>
                    <p className="text-sm text-zinc-500">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const Footer = () => {
  return (
    <footer id="contact" className="bg-paper pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-serif text-xl italic">B</div>
              <span className="text-2xl font-serif font-bold tracking-tight">BharatYatra</span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed mb-8">
              Your trusted companion for exploring the incredible diversity and beauty of India. From the Himalayas to the Indian Ocean.
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-400 hover:bg-primary hover:text-white hover:border-primary transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-zinc-500 text-sm">
              {['Destinations', 'Popular Tours', 'Travel Guides', 'About Us', 'Privacy Policy'].map(item => (
                <li key={item}><a href="#" className="hover:text-primary transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-zinc-500 text-sm">
              <li className="flex items-center gap-3"><Phone size={16} className="text-primary" /> +91 98765 43210</li>
              <li className="flex items-center gap-3"><Mail size={16} className="text-primary" /> hello@bharatyatra.com</li>
              <li className="flex items-start gap-3"><MapPin size={16} className="text-primary mt-1" /> 123 Heritage Plaza, Connaught Place, New Delhi, India</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Newsletter</h4>
            <p className="text-zinc-500 text-sm mb-6">Subscribe to get the latest travel deals and stories.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Your email" className="bg-white border border-zinc-100 rounded-xl px-4 py-2 text-sm w-full focus:outline-none" />
              <button className="bg-primary text-white p-2 rounded-xl hover:bg-opacity-90 transition-all">
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-200 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-400 text-xs uppercase tracking-widest">
          <p>© 2024 BharatYatra. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-zinc-900">Terms</a>
            <a href="#" className="hover:text-zinc-900">Privacy</a>
            <a href="#" className="hover:text-zinc-900">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default function App() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);

  useEffect(() => {
    fetch('/api/tours')
      .then(res => res.json())
      .then(data => setTours(data));
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <Routes>
        <Route path="/" element={<HomePage tours={tours} setSelectedTour={setSelectedTour} />} />
        <Route path="/destination/:slug" element={<DestinationPage />} />
      </Routes>

      <Footer />

      <AnimatePresence>
        {selectedTour && (
          <BookingModal tour={selectedTour} onClose={() => setSelectedTour(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
