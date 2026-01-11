import { X, MapPin, Briefcase, Calendar, Award, Link as LinkIcon, Github, Linkedin, Twitter, Instagram, FileText } from 'lucide-react';

const AlumniProfileModal = ({ alumni, onClose }) => {
  if (!alumni) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900 border border-purple-500/30 rounded-2xl max-w-4xl w-full shadow-2xl max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-800/80 hover:bg-gray-700 rounded-full transition-all z-10"
        >
          <X className="w-6 h-6 text-gray-300" />
        </button>

        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 p-8 border-b border-gray-700/50">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <img
              src={alumni.photoUrl || `https://ui-avatars.com/api/?name=${alumni.name}&background=random&size=200`}
              alt={alumni.name}
              className="w-32 h-32 rounded-full border-4 border-purple-500 shadow-xl"
            />
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {alumni.name}
              </h2>
              <p className="text-xl text-purple-400 font-semibold mb-1">
                {alumni.currentRole}
              </p>
              <p className="text-lg text-gray-300 flex items-center justify-center md:justify-start gap-2">
                <Briefcase className="w-5 h-5" />
                {alumni.currentCompany}
              </p>
              {alumni.location && (
                <p className="text-gray-400 flex items-center justify-center md:justify-start gap-2 mt-2">
                  <MapPin className="w-4 h-4" />
                  {alumni.location}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 space-y-6">
          {/* Education Info */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
              🎓 Education
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {alumni.collegeName && (
                <div>
                  <p className="text-gray-400 text-sm">College</p>
                  <p className="text-white font-semibold text-lg">{alumni.collegeName}</p>
                </div>
              )}
              <div>
                <p className="text-gray-400 text-sm">Graduation Year</p>
                <p className="text-white font-semibold text-lg flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {alumni.graduationYear}
                </p>
              </div>
              {alumni.degree && (
                <div className="md:col-span-2">
                  <p className="text-gray-400 text-sm">Branch / Degree</p>
                  <p className="text-white font-semibold text-lg">{alumni.degree}</p>
                </div>
              )}
            </div>
          </div>

        

          {/* Expertise */}
          {alumni.expertise && alumni.expertise.length > 0 && (
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Expertise & Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {alumni.expertise.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-purple-500/30 text-purple-200 rounded-full text-sm font-medium border border-purple-400/30 hover:bg-purple-500/40 transition-all"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Interview Process */}
          {alumni.interviewProcess && (alumni.interviewProcess.rounds || alumni.interviewProcess.description || alumni.interviewProcess.tips?.length > 0) && (
            <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                💼 Interview Journey & Experience
              </h3>
              
              <div className="space-y-4">
                {alumni.interviewProcess.rounds && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Number of Rounds</p>
                    <p className="text-white text-lg font-semibold">
                      {alumni.interviewProcess.rounds} Rounds
                    </p>
                  </div>
                )}

                {alumni.interviewProcess.difficulty && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Difficulty Level</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      alumni.interviewProcess.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                      alumni.interviewProcess.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {alumni.interviewProcess.difficulty}
                    </span>
                  </div>
                )}

                {alumni.interviewProcess.description && (
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Interview Experience & Process</p>
                    <p className="text-gray-300 leading-relaxed bg-gray-800/50 p-4 rounded-lg whitespace-pre-wrap">
                      {alumni.interviewProcess.description}
                    </p>
                  </div>
                )}

                {alumni.interviewProcess.tips && alumni.interviewProcess.tips.length > 0 && (
                  <div>
                    <p className="text-gray-400 text-sm mb-2">💡 Tips & Insights</p>
                    <ul className="space-y-2">
                      {alumni.interviewProcess.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-300 bg-gray-800/50 p-3 rounded-lg">
                          <span className="text-green-400 mt-1">✓</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Social Links */}
          {alumni.socialLinks && Object.values(alumni.socialLinks).some(link => link) && (
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
                <LinkIcon className="w-5 h-5" />
                Connect with {alumni.name.split(' ')[0]}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {alumni.socialLinks.linkedin && (
                  <a
                    href={alumni.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg transition-all group"
                  >
                    <Linkedin className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                    <span className="text-white font-medium">LinkedIn</span>
                  </a>
                )}
                {alumni.socialLinks.github && (
                  <a
                    href={alumni.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-700/30 hover:bg-gray-700/50 border border-gray-600/30 rounded-lg transition-all group"
                  >
                    <Github className="w-5 h-5 text-gray-300 group-hover:scale-110 transition-transform" />
                    <span className="text-white font-medium">GitHub</span>
                  </a>
                )}
                {alumni.socialLinks.twitter && (
                  <a
                    href={alumni.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-sky-600/20 hover:bg-sky-600/30 border border-sky-500/30 rounded-lg transition-all group"
                  >
                    <Twitter className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />
                    <span className="text-white font-medium">Twitter</span>
                  </a>
                )}
                {alumni.socialLinks.instagram && (
                  <a
                    href={alumni.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/30 rounded-lg transition-all group"
                  >
                    <Instagram className="w-5 h-5 text-pink-400 group-hover:scale-110 transition-transform" />
                    <span className="text-white font-medium">Instagram</span>
                  </a>
                )}
                {alumni.socialLinks.portfolio && (
                  <a
                    href={alumni.socialLinks.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg transition-all group md:col-span-2"
                  >
                    <LinkIcon className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                    <span className="text-white font-medium">Portfolio Website</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlumniProfileModal;
