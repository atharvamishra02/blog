"use client";
import { useState } from "react";

import Link from "next/link";

export default function ContactPage(){
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now we'll just simulate submission
    console.log('Contact form submitted', formData);
    setSubmitted(true);
    setTimeout(()=>{
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 2500);
  };

  return (
    <div className="min-h-screen relative">
      {/* Background video retained for consistency */}
      <video autoPlay loop muted playsInline className="fixed inset-0 w-full h-full object-cover z-0">
        <source src="/bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="fixed inset-0 bg-black/30 z-10"></div>

      <div className="relative z-20">
       

        <main className="max-w-3xl mx-auto px-4 py-12">
          <div className="rounded-lg shadow-md p-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Get in touch</h2>

            {submitted ? (
              <div className="text-center py-8">
                <div className="text-green-600 text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Thanks — we got your message!</h3>
                <p className="text-gray-600 dark:text-gray-300">We&apos;ll respond as soon as possible.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Your Name" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-black dark:border-gray-600 dark:text-white" required />
                  <input type="email" placeholder="Your Email" value={formData.email} onChange={(e)=>setFormData({...formData, email: e.target.value})} className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-black dark:border-gray-600 dark:text-white" required />
                </div>
                <input type="text" placeholder="Subject" value={formData.subject} onChange={(e)=>setFormData({...formData, subject: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-black dark:border-gray-600 dark:text-white" required />
                
                <div className="flex gap-4">
                  <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">Send Message</button>
                  <Link href="/" className="inline-flex items-center px-4 py-2 bg-white border rounded-lg">Back</Link>
                </div>
              </form>
            )}
          </div>
        </main>

        
      </div>
    </div>
  );
}
