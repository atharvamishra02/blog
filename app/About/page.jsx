"use client";
import Link from "next/link";
import { useState } from "react";

export default function About() {
  const [activeTab, setActiveTab] = useState("story");

  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "Lead Developer & Writer",
      bio: "Passionate full-stack developer with 5+ years of experience in web technologies. Loves sharing knowledge and helping others grow in their coding journey.",
      image: "👨‍💻",
      skills: ["JavaScript", "React", "Node.js", "Python", "AWS"]
    },
    {
      name: "Sarah Chen",
      role: "UI/UX Designer & Content Creator",
      bio: "Creative designer who bridges the gap between beautiful design and functional user experience. Writes about design trends and best practices.",
      image: "👩‍🎨",
      skills: ["Figma", "Adobe Creative Suite", "CSS", "Design Systems", "User Research"]
    },
    {
      name: "Mike Rodriguez",
      role: "DevOps Engineer & Technical Writer",
      bio: "Infrastructure enthusiast who makes complex deployment processes simple. Shares insights about cloud technologies and automation.",
      image: "👨‍🔧",
      skills: ["Docker", "Kubernetes", "CI/CD", "Cloud Architecture", "Monitoring"]
    }
  ];

  const achievements = [
    { number: "50+", label: "Articles Published" },
    { number: "10k+", label: "Monthly Readers" },
    { number: "500+", label: "Community Members" },
    { number: "3", label: "Years Running" }
  ];

  return (
    <div className="min-h-screen relative font-main">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-0"
      >
        <source src="/bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Video Overlay */}
      <div className="fixed inset-0 bg-black/30 z-10"></div>
      
      {/* Content Wrapper */}
      <div className="relative z-20">
        {/* Header */}
      

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12 rounded-lg p-8">
            <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">
              About Our Blog
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover the story behind our passion for sharing knowledge, building community, 
              and helping developers grow their skills in the ever-evolving world of technology.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className=" rounded-lg shadow-md mb-8">
            <div className="flex border-b ">
              {[
                { id: "story", label: "Our Story", icon: "📖" },
                { id: "team", label: "Meet the Team", icon: "👥" },
                { id: "mission", label: "Mission & Values", icon: "🎯" },
                { id: "stats", label: "Achievements", icon: "🏆" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-6 py-4 text-center transition-colors ${
                    activeTab === tab.id
                      ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="  rounded-lg shadow-md p-8">
            {activeTab === "story" && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Our Story</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">How It All Started</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      What began as a simple personal blog in 2021 has grown into a thriving community 
                      of developers, designers, and tech enthusiasts. We started with a simple goal: 
                      make complex web development concepts accessible to everyone.
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      Our first article about &quot;Getting Started with React&quot; received overwhelming 
                      positive feedback, and we knew we were onto something special.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Where We Are Today</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Today, we publish weekly articles covering everything from beginner tutorials 
                      to advanced architectural patterns. Our content spans multiple technologies 
                      and frameworks, always focusing on practical, real-world applications.
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      We&apos;ve built more than just a blog – we&apos;ve created a learning community where 
                      developers support and inspire each other.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "team" && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Meet Our Team</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {teamMembers.map((member, index) => (
                    <div key={index} className="text-center">
                      <div className="text-6xl mb-4">{member.image}</div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                        {member.name}
                      </h3>
                      <p className="text-blue-600 dark:text-blue-400 font-medium mb-4">
                        {member.role}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                        {member.bio}
                      </p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {member.skills.map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "mission" && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Mission & Values</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                      🚀 Our Mission
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      To democratize web development education by creating high-quality, 
                      accessible content that empowers developers at every stage of their journey. 
                      We believe that knowledge should be shared freely and that everyone deserves 
                      the opportunity to learn and grow in tech.
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                      💡 Our Vision
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      To be the go-to resource for developers seeking practical, up-to-date 
                      information about web technologies. We envision a world where learning 
                      to code is accessible, enjoyable, and supported by a strong community.
                    </p>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Core Values</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      { icon: "🎓", title: "Education First", desc: "Every piece of content is designed to teach and inspire learning." },
                      { icon: "🤝", title: "Community", desc: "We foster an inclusive environment where everyone can contribute and grow." },
                      { icon: "⚡", title: "Innovation", desc: "We stay current with the latest technologies and best practices." },
                      { icon: "🔍", title: "Quality", desc: "We maintain high standards in everything we publish and create." },
                      { icon: "🌍", title: "Accessibility", desc: "Our content is designed to be accessible to developers worldwide." },
                      { icon: "🚀", title: "Growth", desc: "We believe in continuous learning and helping others achieve their goals." }
                    ].map((value, index) => (
                      <div key={index} className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                        <div className="text-3xl mb-2">{value.icon}</div>
                        <h4 className="font-semibold text-gray-800 dark:text-white mb-2">{value.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{value.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "stats" && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Our Achievements</h2>
                
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="text-center p-6 ">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                        {achievement.number}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 font-medium">
                        {achievement.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Recent Milestones</h3>
                  <div className="space-y-4">
                    {[
                      { date: "2024", milestone: "Launched our community Discord server with 500+ active members" },
                      { date: "2024", milestone: "Published our comprehensive JavaScript ES6+ guide series" },
                      { date: "2023", milestone: "Reached 10,000 monthly readers milestone" },
                      { date: "2023", milestone: "Partnered with leading tech companies for guest content" },
                      { date: "2022", milestone: "Launched our first interactive coding tutorials" },
                      { date: "2021", milestone: "Published our first article and founded the blog" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                        <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium">
                          {item.date}
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">{item.milestone}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Call to Action */}
          <div className="mt-12  text-white">
            <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
            <p className="text-lg mb-6 opacity-90">
              Ready to be part of our growing community of developers? 
              Connect with us and start your learning journey today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Read Our Blog
              </Link>
              <Link 
                href="/Contact"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Get In Touch
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-800/90 dark:bg-gray-900/90 backdrop-blur-sm text-white py-8 mt-12">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p>&copy; 2024 My Blog Website. Built with Next.js and Tailwind CSS.</p>
            <div className="flex justify-center space-x-4 mt-4">
              <a href="#" className="hover:text-blue-400 transition-colors">🐦 Twitter</a>
              <a href="#" className="hover:text-blue-400 transition-colors">💼 LinkedIn</a>
              <a href="#" className="hover:text-blue-400 transition-colors">🐱 GitHub</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}