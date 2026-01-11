import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-600 bg-clip-text text-transparent mb-6">
            About DevMeet
          </h1>
          <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            A Next-Generation Peer-to-Peer Learning Platform Connecting Students, Developers & Alumni
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <span className="px-4 py-2 bg-blue-500/20 border border-blue-500/40 rounded-full text-sm text-blue-300">
              🚀 Smart Matching
            </span>
            <span className="px-4 py-2 bg-purple-500/20 border border-purple-500/40 rounded-full text-sm text-purple-300">
              🤖 AI-Powered
            </span>
            <span className="px-4 py-2 bg-green-500/20 border border-green-500/40 rounded-full text-sm text-green-300">
              💬 Real-time Chat
            </span>
          </div>
        </div>

        {/* What is DevMeet - Comprehensive Section */}
        <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-3xl p-10 border border-blue-500/20 shadow-2xl mb-16">
          <div className="flex items-center mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl mr-5">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold text-white">What is DevMeet?</h2>
          </div>
          
          <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
            <p className="text-xl">
              <strong className="text-blue-400">DevMeet</strong> is an intelligent peer-to-peer learning ecosystem 
              that revolutionizes how students and developers connect, learn, and grow together. Unlike traditional 
              networking platforms, DevMeet uses advanced AI and smart algorithms to match users based on their 
              learning goals and teaching capabilities.
            </p>
            
            <p>
              The platform addresses a critical gap in the tech education landscape: finding the right study buddy 
              or mentor who aligns with your exact learning needs. Whether you want to master React, dive into 
              Machine Learning, or explore Cloud Computing, DevMeet connects you with peers who can teach what 
              you want to learn and learn what you can teach.
            </p>

            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 mt-8">
              <h3 className="text-2xl font-bold text-white mb-4">🎯 Core Purpose</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-blue-400 mr-3 text-2xl">•</span>
                  <span><strong className="text-blue-300">Smart Peer Matching:</strong> Advanced algorithm finds perfect study buddies based on complementary skills</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-3 text-2xl">•</span>
                  <span><strong className="text-purple-300">Alumni Connection:</strong> Direct access to successful alumni from top tech companies</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-3 text-2xl">•</span>
                  <span><strong className="text-green-300">24/7 AI Assistant:</strong> Google Gemini-powered learning companion for instant help</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-3 text-2xl">•</span>
                  <span><strong className="text-yellow-300">Secure Communication:</strong> Real-time messaging with email verification</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Key Features Grid */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center text-white mb-10">
            Platform Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "🎯",
                title: "Smart Matching Algorithm",
                desc: "MongoDB aggregation-based system finds peers where your learning goals align perfectly"
              },
              {
                icon: "✉️",
                title: "Email Verification",
                desc: "Secure OTP-based authentication ensures genuine users and safe connections"
              },
              {
                icon: "🤖",
                title: "AI Learning Assistant",
                desc: "Google Gemini AI provides 24/7 mentorship, code help, and personalized recommendations"
              },
              {
                icon: "👥",
                title: "Alumni Network",
                desc: "Connect with graduates from Google, Microsoft, Amazon, and other top companies"
              },
              {
                icon: "💬",
                title: "Real-time Messaging",
                desc: "Socket.IO powered instant chat with connection management"
              },
              {
                icon: "📊",
                title: "Rich Profiles",
                desc: "Showcase your skills, education, projects, and social links"
              },
              {
                icon: "🔒",
                title: "Secure & Private",
                desc: "JWT authentication, HTTP-only cookies, and bcrypt password hashing"
              },
              {
                icon: "🎓",
                title: "Learning-Focused",
                desc: "Track what you want to learn and what you can teach others"
              },
              {
                icon: "⚡",
                title: "Fast & Responsive",
                desc: "Built with React + Vite for lightning-fast performance"
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack Section */}
        <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-3xl p-10 border border-purple-500/20 shadow-2xl mb-16">
          <div className="flex items-center mb-8">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4 rounded-2xl mr-5">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold text-white">Tech Stack Behind DevMeet</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Frontend */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-2xl font-bold text-blue-400 mb-4 flex items-center">
                <span className="mr-3">🎨</span> Frontend
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">React.js 19</span>
                  <span className="text-blue-400">Core Framework</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Vite</span>
                  <span className="text-purple-400">Build Tool</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Redux Toolkit</span>
                  <span className="text-green-400">State Management</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">React Router</span>
                  <span className="text-yellow-400">Navigation</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">TailwindCSS</span>
                  <span className="text-cyan-400">Styling</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Socket.IO Client</span>
                  <span className="text-pink-400">Real-time</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Axios</span>
                  <span className="text-orange-400">HTTP Client</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">React Toastify</span>
                  <span className="text-red-400">Notifications</span>
                </div>
              </div>
            </div>

            {/* Backend */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-2xl font-bold text-green-400 mb-4 flex items-center">
                <span className="mr-3">⚙️</span> Backend
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Node.js</span>
                  <span className="text-green-400">Runtime</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Express.js 5</span>
                  <span className="text-blue-400">Framework</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">MongoDB</span>
                  <span className="text-green-500">Database</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Mongoose</span>
                  <span className="text-red-400">ODM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Socket.IO</span>
                  <span className="text-purple-400">WebSocket</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">JWT</span>
                  <span className="text-yellow-400">Authentication</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Google Gemini AI</span>
                  <span className="text-pink-400">AI Engine</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Cloudinary</span>
                  <span className="text-cyan-400">Image Storage</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
            <h3 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center">
              <span className="mr-3">🔧</span> Additional Technologies
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Nodemailer', 'Bcrypt', 'Multer', 'Validator', 'DaisyUI', 'Lucide Icons', 'React Markdown', 'Cookie Parser'].map((tech) => (
                <div key={tech} className="bg-gradient-to-r from-gray-700/50 to-gray-600/50 px-4 py-2 rounded-lg text-center text-gray-300 border border-gray-600/50">
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Developer Section */}
        <div className="bg-gradient-to-br from-green-900/30 to-teal-900/30 backdrop-blur-sm rounded-3xl p-10 border border-green-500/20 shadow-2xl mb-16">
          <div className="flex items-center mb-8">
            <div className="bg-gradient-to-r from-green-500 to-teal-600 p-4 rounded-2xl mr-5">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold text-white">Meet the Developer</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6 text-gray-300 text-lg">
              <p className="text-xl">
                Hi! I'm <strong className="text-green-400 text-2xl">Balram Prajapati</strong>, a passionate full-stack 
                developer and the creator of DevMeet.
              </p>
              
              <p>
                As someone who has experienced the challenges of finding the right learning partners and mentors 
                in the tech journey, I built DevMeet to solve this exact problem. The platform combines my expertise 
                in modern web technologies with my vision of creating a supportive, intelligent learning ecosystem.
              </p>

              <p>
                With hands-on experience in building scalable applications using the MERN stack, integrating AI 
                solutions, and designing user-centric interfaces, I've poured my knowledge and passion into making 
                DevMeet a platform that truly makes a difference.
              </p>

              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                <p className="text-xl italic text-blue-300">
                  "DevMeet represents my belief that learning is most effective when done together. Technology 
                  should connect us, not isolate us. This platform is my contribution to building a more 
                  collaborative and supportive tech community."
                </p>
                <p className="text-right text-green-400 mt-2">— Balram Prajapati</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-xl font-bold text-white mb-4">Technical Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Node.js', 'Next.js', 'MongoDB', 'Express', 'TypeScript', 'JavaScript', 'Socket.IO', 'Redux', 'TailwindCSS', 'Git', 'AWS', 'AI Integration'].map((skill) => (
                    <span key={skill} className="bg-gradient-to-r from-green-500/20 to-teal-600/20 border border-green-500/30 px-3 py-1 rounded-full text-sm text-green-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-xl font-bold text-white mb-4">Achievements</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center">
                    <span className="text-yellow-400 mr-2">🏆</span>
                    Full-stack Developer
                  </li>
                  <li className="flex items-center">
                    <span className="text-yellow-400 mr-2">🚀</span>
                    DevMeet Creator
                  </li>
                  <li className="flex items-center">
                    <span className="text-yellow-400 mr-2">💡</span>
                    AI Integration Expert
                  </li>
                  <li className="flex items-center">
                    <span className="text-yellow-400 mr-2">🎯</span>
                    Problem Solver
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 backdrop-blur-sm rounded-3xl p-10 border border-blue-500/30 shadow-2xl mb-16">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-white mb-4">Our Mission & Vision</h2>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              Driving the future of collaborative learning and professional growth in tech
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10">
            {/* Mission */}
            <div className="bg-gradient-to-br from-blue-800/30 to-blue-900/30 rounded-2xl p-8 border border-blue-500/30">
              <div className="text-center mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-5 rounded-2xl w-20 h-20 mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-blue-300 mb-4">Mission</h3>
              </div>
              <div className="space-y-4 text-gray-300">
                <p className="text-center text-lg">
                  To democratize tech education by creating an intelligent ecosystem where students and developers 
                  can seamlessly connect, learn from each other, and grow together.
                </p>
                <div className="bg-blue-900/40 rounded-xl p-4 mt-4">
                  <h4 className="font-semibold text-blue-200 mb-2">We Strive To:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">▸</span>
                      Eliminate barriers in finding perfect study partners
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">▸</span>
                      Provide AI-powered learning assistance 24/7
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">▸</span>
                      Connect students with successful alumni
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">▸</span>
                      Foster a supportive, collaborative community
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Vision */}
            <div className="bg-gradient-to-br from-purple-800/30 to-purple-900/30 rounded-2xl p-8 border border-purple-500/30">
              <div className="text-center mb-6">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-5 rounded-2xl w-20 h-20 mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-purple-300 mb-4">Vision</h3>
              </div>
              <div className="space-y-4 text-gray-300">
                <p className="text-center text-lg">
                  To become the world's leading peer-to-peer learning platform, transforming how millions learn 
                  technology through AI-driven matchmaking and collaborative education.
                </p>
                <div className="bg-purple-900/40 rounded-xl p-4 mt-4">
                  <h4 className="font-semibold text-purple-200 mb-2">Future Goals:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">▸</span>
                      Global network of learners and mentors
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">▸</span>
                      Advanced AI that personalizes learning paths
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">▸</span>
                      Integration with major tech companies
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">▸</span>
                      Impact millions of learners worldwide
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="mt-10 bg-gradient-to-r from-indigo-800/30 to-blue-800/30 rounded-2xl p-6 border border-indigo-500/30">
            <h3 className="text-2xl font-bold text-white text-center mb-6">Core Values</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: '🤝', title: 'Collaboration', desc: 'Learn together' },
                { icon: '💡', title: 'Innovation', desc: 'Cutting-edge tech' },
                { icon: '🎯', title: 'Quality', desc: 'Excellence first' },
                { icon: '🌍', title: 'Inclusivity', desc: 'Open to all' }
              ].map((value, idx) => (
                <div key={idx} className="text-center bg-gray-800/40 rounded-xl p-4 border border-gray-700/50">
                  <div className="text-3xl mb-2">{value.icon}</div>
                  <h4 className="font-bold text-white text-sm mb-1">{value.title}</h4>
                  <p className="text-gray-400 text-xs">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Support & Contact */}
        <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 backdrop-blur-sm rounded-3xl p-10 border border-amber-500/20 shadow-2xl mb-16">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-5 rounded-2xl w-24 h-24 mx-auto mb-6 flex items-center justify-center shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">Support & Get in Touch</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Your feedback helps us improve! Whether you have questions, suggestions, or just want to say hi, 
              we're here to help.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Contact Information */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="mr-3">📧</span> Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-start bg-blue-900/20 rounded-xl p-4 border border-blue-500/30">
                  <svg className="w-6 h-6 text-blue-400 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-blue-300 mb-1">Email</h4>
                    <a href="mailto:balramprajapati3263@gmail.com" className="text-gray-300 hover:text-blue-400 transition-colors">
                      balramprajapati3263@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start bg-green-900/20 rounded-xl p-4 border border-green-500/30">
                  <svg className="w-6 h-6 text-green-400 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-green-300 mb-1">GitHub</h4>
                    <a href="https://github.com/Balram04" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-green-400 transition-colors">
                      github.com/Balram04
                    </a>
                  </div>
                </div>

                <div className="flex items-start bg-purple-900/20 rounded-xl p-4 border border-purple-500/30">
                  <svg className="w-6 h-6 text-purple-400 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-purple-300 mb-1">LinkedIn</h4>
                    <a href="https://www.linkedin.com/in/balram45/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-purple-400 transition-colors">
                      linkedin.com/in/balram45/
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Support Categories */}
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="mr-3">🎯</span> How Can We Help?
              </h3>
              <div className="grid gap-3">
                {[
                  { icon: '💡', title: 'Feature Requests', desc: 'Share your ideas for new features', color: 'yellow' },
                  { icon: '🐛', title: 'Bug Reports', desc: 'Help us fix issues and improve', color: 'red' },
                  { icon: '❓', title: 'General Questions', desc: 'Ask anything about DevMeet', color: 'blue' },
                  { icon: '🤝', title: 'Partnership', desc: 'Collaborate with us', color: 'green' },
                  { icon: '⭐', title: 'Feedback', desc: 'Share your experience', color: 'purple' },
                  { icon: '📚', title: 'Documentation', desc: 'Need help using DevMeet?', color: 'cyan' }
                ].map((item, idx) => (
                  <div key={idx} className={`bg-${item.color}-900/20 border border-${item.color}-500/30 rounded-lg p-3 hover:border-${item.color}-500/50 transition-all cursor-pointer`}>
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{item.icon}</span>
                      <div>
                        <h4 className={`font-semibold text-${item.color}-300 text-sm`}>{item.title}</h4>
                        <p className="text-gray-400 text-xs">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/40 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Reach Out?</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Send us an email with your feedback, questions, or suggestions. We typically respond within 24-48 hours.
            </p>
            <a 
              href="mailto:balramprajapati3263@gmail.com?subject=DevMeet%20Support%20-%20Feedback/Suggestion&body=Hi%20Balram,%0A%0AI%20wanted%20to%20reach%20out%20regarding%20DevMeet:%0A%0A[Please%20describe%20your%20feedback,%20suggestion,%20or%20issue%20here]%0A%0AThanks%20for%20creating%20this%20amazing%20platform!%0A%0ABest%20regards,"
              className="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Send Us an Email
            </a>
          </div>
        </div>

        {/* Response Time & Commitment */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-xl mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Our Commitment to You</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-500/20 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Quick Response</h3>
              <p className="text-gray-400">We respond to all inquiries within 24-48 hours</p>
            </div>
            <div className="text-center">
              <div className="bg-green-500/20 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Continuous Improvement</h3>
              <p className="text-gray-400">Your feedback drives our development roadmap</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-500/20 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Community-Driven</h3>
              <p className="text-gray-400">Built for the community, by the community</p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center pt-8 border-t border-gray-700/50">
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-2xl p-6 border border-gray-600/50 inline-block">
            <p className="text-lg text-gray-300 mb-2">
              Built with <span className="text-red-500 animate-pulse">❤️</span> and <span className="text-blue-400">☕</span> by 
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600"> Balram Prajapati</span>
            </p>
            <p className="text-gray-400">
              DevMeet © 2026 | 
              <span className="text-blue-400"> Empowering Learners, Connecting Minds, Building Futures</span>
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <span className="text-xs bg-green-500/20 text-green-300 px-3 py-1 rounded-full border border-green-500/30">
                🚀 Always Improving
              </span>
              <span className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-500/30">
                🌟 Community-Driven
              </span>
              <span className="text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/30">
                💡 Innovation First
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
