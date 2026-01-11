
const Footer = () => {
  return (
    <div className='relative bottom-0 left-0 right-0 z-10'>
      <footer className="bg-gray-800/90 backdrop-blur-sm border-t border-gray-700/50 text-white">
        {/* Main Footer Content */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* Brand Section */}
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
               <a href="/About"> DevMeet</a>
              </h3>
              
              <div className="  flex items-center justify-center md:justify-start gap-3 text-sm font-medium">
                <span className="flex items-center gap-1 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  <span className="text-base">🤝</span>Connect
                </span>
                <span className="text-gray-500">•</span>
                <span className="flex items-center gap-1 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  <span className="text-base">📚</span>Learn
                </span>
                <span className="text-gray-500">•</span>
                <span className="flex items-center gap-1 bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                  <span className="text-base">🚀</span>Grow
                </span>
              </div>
              </div>
            

            {/* Social Links */}
            <div className="flex space-x-3">
              <a href="https://x.com/BalramP15319081" className="bg-blue-600 hover:bg-blue-700 transition-colors p-2 rounded-full">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/balram45/" className="bg-blue-600 hover:bg-blue-700 transition-colors p-2 rounded-full">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="https://github.com/Balram04" className="bg-blue-600 hover:bg-blue-700 transition-colors p-2 rounded-full">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700/50">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
              <p className="text-gray-400 text-xs mb-2 md:mb-0">
                © {new Date().getFullYear()} DevMeet. All rights reserved.
              </p>
              <div className="flex items-center space-x-4 text-xs">
                <a href="/About" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
                <a href="/About" className="text-gray-400 hover:text-white transition-colors">Terms</a>
                <a href="/About" className="text-gray-400 hover:text-white transition-colors">Support</a>
                {/* Admin Access Button */}
                <a 
                  href="/admin/login" 
                  className="ml-2 bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-700 hover:to-blue-700 text-white px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center gap-1"
                  title="Admin Portal"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Admin
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}


export default Footer