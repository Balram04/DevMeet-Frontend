import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-4">
            About DevMeet
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Connecting developers worldwide through meaningful professional relationships
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* About DevMeet */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-xl">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl mr-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white">What is DevMeet?</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>
                <strong className="text-blue-400">DevMeet</strong> is a professional networking platform specifically designed for developers, 
                engineers, and tech professionals. Our mission is to create meaningful connections that foster 
                collaboration, knowledge sharing, and career growth in the tech industry.
              </p>
              <p>
                Whether you're a seasoned developer looking to mentor others, a junior developer seeking guidance, 
                or someone looking to build your professional network, DevMeet provides the perfect platform to 
                connect with like-minded individuals.
              </p>
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-white mb-3">Key Features:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    Professional developer profiles
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    Real-time messaging and chat
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    Connection requests and networking
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    Skill-based matching system
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-2">✓</span>
                    Tech community feed and updates
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* About Developer */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-xl">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-green-500 to-teal-600 p-3 rounded-xl mr-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white">About the Developer</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p>
                Hi! I'm <strong className="text-green-400">Balram Prajapati</strong>, a passionate full-stack developer 
                who believes in the power of community and collaboration in the tech world.
              </p>
              <p>
                With expertise in modern web technologies including React, Node.js, and various database systems, 
                I created DevMeet to address the need for a dedicated platform where developers can connect, 
                share knowledge, and grow together professionally.
              </p>
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-white mb-3">Technical Skills:</h3>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Node.js',"Next.js", 'MongoDB', 'Express.js', 'JavaScript', 'TypeScript', 'Git', 'AWS'].map((skill) => (
                    <span key={skill} className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/30 px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-6">
                <p className="text-sm text-gray-400">
                  "Building DevMeet has been an incredible journey of learning and growth. I'm excited to see 
                  how this platform helps developers connect and create amazing things together!"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20 shadow-xl mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Our Mission & Vision</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Mission</h3>
              <p className="text-gray-300">
                To create a thriving ecosystem where developers can easily connect, collaborate, and accelerate 
                their professional growth through meaningful relationships and knowledge exchange.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Vision</h3>
              <p className="text-gray-300">
                To become the go-to platform for tech professionals worldwide, fostering innovation and 
                collaboration that drives the future of technology and software development.
              </p>
            </div>
          </div>
        </div>

        {/* Support & Contact */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-xl text-center">
          <div className="mb-6">
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Get in Touch</h2>
            <p className="text-xl text-gray-300 mb-6">
              Have suggestions, feedback, or need support? I'd love to hear from you!
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-2">Support & Suggestions</h3>
              <p className="text-gray-300 mb-4">
                For any questions, suggestions, or technical support, feel free to reach out:
              </p>
              <a 
                href="mailto:balramprajapati@example.com?subject=DevMeet Support - Feedback/Suggestion&body=Hi Balram,%0A%0AI wanted to reach out regarding DevMeet:%0A%0A[Please describe your feedback, suggestion, or issue here]%0A%0AThanks for creating this amazing platform!%0A%0ABest regards,"
                className="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email: balramprajapati@example.com
              </a>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 mt-8">
              <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4">
                <h4 className="font-semibold text-green-400 mb-1">Feature Requests</h4>
                <p className="text-sm text-gray-300">Share your ideas for new features</p>
              </div>
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4">
                <h4 className="font-semibold text-blue-400 mb-1">Bug Reports</h4>
                <p className="text-sm text-gray-300">Help us improve by reporting issues</p>
              </div>
              <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-4">
                <h4 className="font-semibold text-purple-400 mb-1">General Feedback</h4>
                <p className="text-sm text-gray-300">Share your thoughts and experiences</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12 pt-8 border-t border-gray-700/50">
          <p className="text-gray-400">
            Built with ❤️ by Balram Prajapati | DevMeet © 2025 | 
            <span className="text-blue-400"> Connecting Developers Worldwide</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
