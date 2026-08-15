import { useState } from 'react';
import { Link } from 'react-router';
import type { Route } from './+types/contact';

export const meta: Route.MetaFunction = () => {
  return [
    { title: 'Contact Us | TimeCrafts VIP Concierge' },
    { name: 'description', content: 'Contact TimeCrafts luxury horology concierge for order inquiries, watch servicing, and private boutique appointments.' },
  ];
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'general',
    orderNumber: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API request delay
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="contact-page font-sans min-h-screen bg-white text-primary pb-20 select-none">
      {/* 1. TOP HERO BANNER */}
      <section className="relative w-full h-[28vh] min-h-[240px] max-h-[320px] overflow-hidden flex items-center justify-center bg-[#121212] text-white">
        <div className="absolute inset-0 z-0">
          <img
            src="https://cdn.shopify.com/s/files/1/0972/7393/8288/files/banner28851842.jpg?v=1786783815"
            alt="TimeCrafts Concierge"
            className="w-full h-full object-cover object-center opacity-50 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/70"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <nav className="flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#d4af37] mb-3">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-300 font-light">Contact Concierge</span>
          </nav>
          <h1 className="text-3xl sm:text-5xl font-normal tracking-tight uppercase mb-2">
            Get in Touch
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 font-light max-w-xl mx-auto">
            Our horology specialists are dedicated to assisting you with order inquiries, watch care, and private consultations.
          </p>
        </div>
      </section>

      {/* 2. MAIN CONTENT AREA */}
      <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Contact Form (7 Columns) */}
          <div className="lg:col-span-7 bg-white border border-gray-200 p-6 sm:p-10 shadow-sm">
            <div className="mb-8">
              <span className="text-accent text-[11px] font-bold uppercase tracking-[0.25em] block mb-1">
                Direct Message
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary uppercase">
                Send Us a Message
              </h2>
              <p className="text-xs text-gray-500 font-light mt-1">
                Fill out the form below and a client advisor will respond within 24 business hours.
              </p>
            </div>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 p-8 text-center space-y-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto text-xl">
                  ✓
                </div>
                <h3 className="text-lg font-bold text-emerald-900 uppercase tracking-wider">
                  Message Sent Successfully
                </h3>
                <p className="text-xs text-emerald-700 font-light max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="font-semibold">{formData.name}</span>. Your inquiry has been routed to our VIP Concierge team. We will contact you at <span className="font-semibold">{formData.email}</span> shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', inquiryType: 'general', orderNumber: '', message: '' });
                  }}
                  className="mt-4 px-6 py-2.5 bg-primary text-white text-xs font-bold uppercase tracking-widest hover:bg-[#d4af37] hover:text-black transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      Full Name <span className="text-accent">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Alexander Wright"
                      className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 text-xs font-light text-primary placeholder-gray-400 focus:outline-none focus:border-primary focus:bg-white transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      Email Address <span className="text-accent">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="alexander@example.com"
                      className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 text-xs font-light text-primary placeholder-gray-400 focus:outline-none focus:border-primary focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 text-xs font-light text-primary placeholder-gray-400 focus:outline-none focus:border-primary focus:bg-white transition-all"
                    />
                  </div>

                  {/* Inquiry Type */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      Inquiry Topic
                    </label>
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 text-xs font-light text-primary focus:outline-none focus:border-primary focus:bg-white transition-all"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="order">Order Status & Tracking</option>
                      <option value="servicing">Watch Servicing & Repair</option>
                      <option value="appointment">Private Showroom Appointment</option>
                      <option value="corporate">Bespoke & Corporate Orders</option>
                    </select>
                  </div>
                </div>

                {/* Order Number (Conditional) */}
                {formData.inquiryType === 'order' && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      Order Number
                    </label>
                    <input
                      type="text"
                      value={formData.orderNumber}
                      onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                      placeholder="#TC-1042"
                      className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 text-xs font-light text-primary focus:outline-none focus:border-primary focus:bg-white transition-all"
                    />
                  </div>
                )}

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Message <span className="text-accent">*</span>
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How may our concierge assist you today?"
                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 text-xs font-light text-primary placeholder-gray-400 focus:outline-none focus:border-primary focus:bg-white transition-all resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-primary hover:bg-[#d4af37] text-white hover:text-black text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-md cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending Message...' : 'Send Message to Concierge'}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Boutique Info & Location Cards (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Flagship Showroom Card */}
            <div className="bg-[#121212] text-white p-6 sm:p-8 border border-gray-800 shadow-lg">
              <span className="text-[#d4af37] text-[10px] font-bold uppercase tracking-[0.3em] block mb-2">
                Flagship Boutique
              </span>
              <h3 className="text-xl font-normal uppercase tracking-wider text-white mb-4">
                TimeCrafts New York
              </h3>

              <div className="space-y-4 text-xs font-light text-gray-300 leading-relaxed">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <strong className="block text-white font-medium">Showroom Address</strong>
                    740 Fifth Avenue, 18th Floor<br />
                    New York, NY 10019, United States
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h32a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10a2 2 0 012-2h32a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2z" />
                  </svg>
                  <div>
                    <strong className="block text-white font-medium">Direct Telephone</strong>
                    +1 (800) 555-TIMECRAFT<br />
                    +1 (212) 555-0199
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <strong className="block text-white font-medium">Client Support Email</strong>
                    concierge@timecrafts.com<br />
                    support@timecrafts.com
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-gray-800">
                  <svg className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <strong className="block text-white font-medium">Operating Hours</strong>
                    Mon – Sat: 10:00 AM – 7:00 PM EST<br />
                    Sun: By Private Appointment
                  </div>
                </div>
              </div>
            </div>

            {/* VIP Appointments Box */}
            <div className="bg-gray-50 border border-gray-200 p-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
                Private Showroom Consultations
              </h4>
              <p className="text-xs text-gray-600 font-light leading-relaxed mb-4">
                Schedule a one-on-one session with our master horologist to preview limited-edition releases, request custom engravings, or evaluate vintage trade-ins.
              </p>
              <a
                href="mailto:concierge@timecrafts.com?subject=Request%20Private%20Appointment"
                className="inline-block w-full py-3 bg-white border border-primary hover:bg-primary hover:text-white text-primary text-center text-xs font-bold uppercase tracking-widest transition-colors duration-300"
              >
                Request Private Appointment
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
