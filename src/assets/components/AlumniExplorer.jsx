import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../config/api';
import { authUtils } from '../../utils/auth';
import NavBar from '../components/Navbar';
import AlumniProfileModal from './AlumniProfileModal';
import { Search, Filter, Building2, Calendar, GraduationCap, X } from 'lucide-react';

const AlumniExplorer = () => {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    fetchAlumni();
  }, [selectedCompany, selectedCollege, selectedYear]);

  const fetchAlumni = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCompany) params.append('company', selectedCompany);
      if (selectedCollege) params.append('college', selectedCollege);
      if (selectedYear) params.append('year', selectedYear);
      if (searchTerm) params.append('search', searchTerm);

      const res = await axios.get(`${API_BASE_URL}/alumni?${params}`, {
        withCredentials: true,
        headers: authUtils.getAuthHeaders()
      });

      if (res.data.success) {
        setAlumni(res.data.alumni);
      }
    } catch (error) {
      console.error('Error fetching alumni:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch alumni');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAlumni();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCompany('');
    setSelectedCollege('');
    setSelectedYear('');
  };

  const getUniqueCompanies = () => {
    return [...new Set(alumni.map(a => a.currentCompany).filter(Boolean))].sort();
  };

  const getUniqueColleges = () => {
    return [...new Set(alumni.map(a => a.collegeName).filter(Boolean))].sort();
  };

  const getYearRange = () => {
    const years = [];
    for (let year = 2025; year >= 2015; year--) {
      years.push(year.toString());
    }
    return years;
  };

  const hasActiveFilters = searchTerm || selectedCompany || selectedCollege || selectedYear;

  if (loading) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
          <div className="text-white text-xl">Loading alumni...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black pt-16 sm:pt-20 px-2 sm:px-4 pb-6 sm:pb-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-4 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2 sm:mb-4">
               Alumni Explorer
            </h1>
            <p className="text-gray-300 text-sm sm:text-lg">
              Connect with successful alumni from top companies and learn from their journey
            </p>
            <div className="mt-2 sm:mt-4 flex items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                {alumni.length} Alumni Available
              </span>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg sm:rounded-xl p-3 sm:p-6 border border-gray-700/50 mb-4 sm:mb-8 shadow-xl">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-white text-sm sm:text-base font-semibold flex items-center gap-1.5 sm:gap-2">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                Search & Filter Alumni
              </h3>
              <div className="flex gap-1.5 sm:gap-2">
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="px-2 py-1 text-[10px] sm:text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-md sm:rounded-lg transition-all flex items-center gap-0.5 sm:gap-1 font-medium"
                  >
                    <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    <span className="hidden sm:inline">Clear</span>
                  </button>
                )}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-2 py-1 text-[10px] sm:text-xs bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-md sm:rounded-lg transition-all md:hidden font-medium"
                >
                  {showFilters ? 'Hide' : 'Show'} Filters
                </button>
              </div>
            </div>

            <div className={`space-y-3 sm:space-y-4 ${showFilters ? 'block' : 'hidden md:block'}`}>
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, role, or expertise..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </form>

              {/* Filter Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                {/* College Filter */}
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-purple-400 pointer-events-none" />
                  <select
                    value={selectedCollege}
                    onChange={(e) => setSelectedCollege(e.target.value)}
                    className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer transition-all"
                  >
                    <option value="">All Colleges</option>
                    {getUniqueColleges().map((college, idx) => (
                      <option key={idx} value={college}>{college}</option>
                    ))}
                  </select>
                </div>

                {/* Company Filter */}
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-blue-400 pointer-events-none" />
                  <select
                    value={selectedCompany}
                    onChange={(e) => setSelectedCompany(e.target.value)}
                    className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer transition-all"
                  >
                    <option value="">All Companies</option>
                    {getUniqueCompanies().map((company, idx) => (
                      <option key={idx} value={company}>{company}</option>
                    ))}
                  </select>
                </div>

                {/* Year Filter */}
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-400 pointer-events-none" />
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none cursor-pointer transition-all"
                  >
                    <option value="">All Years (2015-2025)</option>
                    {getYearRange().map((year, idx) => (
                      <option key={idx} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Active Filters Display */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-2 border-t border-gray-700/50">
                  <span className="text-gray-400 text-xs sm:text-sm">Active filters:</span>
                  {searchTerm && (
                    <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-purple-500/20 text-purple-300 text-[10px] sm:text-sm rounded-full flex items-center gap-1">
                      Search: {searchTerm}
                      <X className="w-2.5 h-2.5 sm:w-3 sm:h-3 cursor-pointer" onClick={() => setSearchTerm('')} />
                    </span>
                  )}
                  {selectedCollege && (
                    <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-purple-500/20 text-purple-300 text-[10px] sm:text-sm rounded-full flex items-center gap-1">
                      {selectedCollege}
                      <X className="w-2.5 h-2.5 sm:w-3 sm:h-3 cursor-pointer" onClick={() => setSelectedCollege('')} />
                    </span>
                  )}
                  {selectedCompany && (
                    <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-500/20 text-blue-300 text-[10px] sm:text-sm rounded-full flex items-center gap-1">
                      {selectedCompany}
                      <X className="w-2.5 h-2.5 sm:w-3 sm:h-3 cursor-pointer" onClick={() => setSelectedCompany('')} />
                    </span>
                  )}
                  {selectedYear && (
                    <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-green-500/20 text-green-300 text-[10px] sm:text-sm rounded-full flex items-center gap-1">
                      Class of {selectedYear}
                      <X className="w-2.5 h-2.5 sm:w-3 sm:h-3 cursor-pointer" onClick={() => setSelectedYear('')} />
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Alumni Grid */}
          {alumni.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">😔</div>
              <h3 className="text-2xl font-bold text-white mb-2">No alumni found</h3>
              <p className="text-gray-400 mb-4">
                Try adjusting your search or filters
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {alumni.map((person) => (
                <div
                  key={person._id}
                  onClick={() => setSelectedAlumni(person)}
                  className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-gray-700/50 hover:border-purple-500/70 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer group shadow-lg hover:shadow-purple-500/20"
                >
                  {/* Profile Section */}
                  <div className="flex items-start mb-3 sm:mb-4">
                    <div className="relative">
                      <img
                        src={person.photoUrl || `https://ui-avatars.com/api/?name=${person.name}&background=random`}
                        alt={person.name}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-purple-500 group-hover:border-purple-400 transition-all"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 border-2 border-gray-800 rounded-full"></div>
                    </div>
                    <div className="ml-3 sm:ml-4 flex-1">
                      <h3 className="text-base sm:text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                        {person.name}
                      </h3>
                      <p className="text-purple-400 text-xs sm:text-sm font-semibold">
                        {person.currentRole}
                      </p>
                      <p className="text-gray-400 text-[10px] sm:text-xs flex items-center gap-1 mt-1">
                        <Building2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        {person.currentCompany}
                      </p>
                    </div>
                  </div>

                  {/* Education Info */}
                  <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-lg">
                    {person.collegeName && (
                      <div className="flex items-center text-xs sm:text-sm mb-1.5 sm:mb-2">
                        <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400 mr-1.5 sm:mr-2" />
                        <span className="text-gray-300 font-medium">
                          {person.collegeName}
                        </span>
                      </div>
                    )}
                    {person.degree && (
                      <div className="text-[10px] sm:text-xs text-blue-300 font-medium mb-1.5 sm:mb-2 ml-5 sm:ml-6">
                        {person.degree}
                      </div>
                    )}
                    <div className="flex items-center text-xs sm:text-sm">
                      <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 mr-1.5 sm:mr-2" />
                      <span className="text-gray-300">
                        Class of {person.graduationYear}
                      </span>
                    </div>
                  </div>

                  {/* Bio */}
                  {person.bio && (
                    <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3">
                      {person.bio}
                    </p>
                  )}

                  {/* Expertise Tags */}
                  {person.expertise && person.expertise.length > 0 && (
                    <div className="mb-3 sm:mb-4">
                      <div className="text-[10px] sm:text-xs text-purple-400 font-semibold mb-1.5 sm:mb-2">
                        💡 Expertise:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {person.expertise.slice(0, 4).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-purple-500/20 text-purple-300 text-[10px] sm:text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {person.expertise.length > 4 && (
                          <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 text-gray-400 text-[10px] sm:text-xs">
                            +{person.expertise.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Location */}
                  {person.location && (
                    <div className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 flex items-center">
                      <span className="mr-2">📍</span>
                      {person.location}
                    </div>
                  )}

                  {/* View Profile Button */}
                  <div className="pt-2.5 sm:pt-4 border-t border-gray-700">
                    <button className="w-full py-1.5 sm:py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-[10px] sm:text-sm rounded-lg transition-all transform group-hover:scale-105 flex items-center justify-center gap-1.5 sm:gap-2">
                      <span>View Full Profile</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Alumni Profile Modal */}
      {selectedAlumni && (
        <AlumniProfileModal
          alumni={selectedAlumni}
          onClose={() => setSelectedAlumni(null)}
        />
      )}
    </>
  );
};

export default AlumniExplorer;
