import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../config/api';
import { authUtils } from '../../utils/auth';
import { removeAdmin } from '../utils/adminSlice';
import NavBar from './NavBar';

const AdminDashboard = () => {
  const admin = useSelector((store) => store.admin);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alumniList, setAlumniList] = useState([]);
  const [editingAlumni, setEditingAlumni] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    collegeName: '',
    graduationYear: '',
    degree: '',
    currentCompany: '',
    currentRole: '',
    location: '',
    bio: '',
    expertise: '',
    photoUrl: '',
    socialLinks: {
      linkedin: '',
      github: '',
      twitter: '',
      instagram: '',
      portfolio: ''
    },
    interviewProcess: {
      rounds: '',
      description: '',
      tips: '',
      difficulty: ''
    }
  });

  // Redirect if not admin
  useEffect(() => {
    if (!admin || !admin.isAdmin) {
      navigate('/admin/login');
    } else {
      fetchAlumni();
    }
  }, [admin, navigate]);

  if (!admin || !admin.isAdmin) {
    return null;
  }

  // Fetch alumni list
  const fetchAlumni = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/alumni?limit=100`, {
        withCredentials: true,
        headers: authUtils.getAuthHeaders()
      });
      if (response.data.success) {
        setAlumniList(response.data.alumni);
      }
    } catch (error) {
      console.error('Error fetching alumni:', error);
      toast.error('Failed to fetch alumni list');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social_')) {
      const socialKey = name.replace('social_', '');
      setFormData({
        ...formData,
        socialLinks: {
          ...formData.socialLinks,
          [socialKey]: value
        }
      });
    } else if (name.startsWith('interview_')) {
      const interviewKey = name.replace('interview_', '');
      setFormData({
        ...formData,
        interviewProcess: {
          ...formData.interviewProcess,
          [interviewKey]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert expertise string to array
      const expertiseArray = formData.expertise
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill);

      // Convert interview tips string to array
      const tipsArray = formData.interviewProcess.tips
        .split(',')
        .map(tip => tip.trim())
        .filter(tip => tip);

      const alumniData = {
        ...formData,
        expertise: expertiseArray,
        graduationYear: parseInt(formData.graduationYear),
        interviewProcess: {
          rounds: formData.interviewProcess.rounds ? parseInt(formData.interviewProcess.rounds) : undefined,
          description: formData.interviewProcess.description || undefined,
          tips: tipsArray.length > 0 ? tipsArray : undefined,
          difficulty: formData.interviewProcess.difficulty || undefined
        }
      };

      const response = await axios.post(
        `${API_BASE_URL}/alumni`,
        alumniData,
        {
          withCredentials: true,
          headers: authUtils.getAuthHeaders()
        }
      );

      if (response.data.success) {
        toast.success('Alumni added successfully! 🎉');
        setShowAddForm(false);
        fetchAlumni(); // Refresh the list
        // Reset form
        setFormData({
          name: '',
          email: '',
          collegeName: '',
          graduationYear: '',
          degree: '',
          currentCompany: '',
          currentRole: '',
          location: '',
          bio: '',
          expertise: '',
          photoUrl: '',
          socialLinks: {
            linkedin: '',
            github: '',
            twitter: '',
            instagram: '',
            portfolio: ''
          },
          interviewProcess: {
            rounds: '',
            description: '',
            tips: '',
            difficulty: ''
          }
        });
      }
    } catch (error) {
      console.error('Error adding alumni:', error);
      toast.error(error.response?.data?.message || 'Failed to add alumni! 🚫');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (alumni) => {
    setEditingAlumni({
      ...alumni,
      expertise: alumni.expertise?.join(', ') || '',
      interviewProcess: {
        rounds: alumni.interviewProcess?.rounds || '',
        description: alumni.interviewProcess?.description || '',
        tips: alumni.interviewProcess?.tips?.join(', ') || '',
        difficulty: alumni.interviewProcess?.difficulty || ''
      }
    });
    setShowEditForm(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social_')) {
      const socialKey = name.replace('social_', '');
      setEditingAlumni({
        ...editingAlumni,
        socialLinks: {
          ...editingAlumni.socialLinks,
          [socialKey]: value
        }
      });
    } else if (name.startsWith('interview_')) {
      const interviewKey = name.replace('interview_', '');
      setEditingAlumni({
        ...editingAlumni,
        interviewProcess: {
          ...editingAlumni.interviewProcess,
          [interviewKey]: value
        }
      });
    } else {
      setEditingAlumni({ ...editingAlumni, [name]: value });
    }
  };

  const handleUpdateAlumni = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const expertiseArray = editingAlumni.expertise
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill);

      const tipsArray = editingAlumni.interviewProcess.tips
        .split(',')
        .map(tip => tip.trim())
        .filter(tip => tip);

      const alumniData = {
        ...editingAlumni,
        expertise: expertiseArray,
        graduationYear: parseInt(editingAlumni.graduationYear),
        interviewProcess: {
          rounds: editingAlumni.interviewProcess.rounds ? parseInt(editingAlumni.interviewProcess.rounds) : undefined,
          description: editingAlumni.interviewProcess.description || undefined,
          tips: tipsArray.length > 0 ? tipsArray : undefined,
          difficulty: editingAlumni.interviewProcess.difficulty || undefined
        }
      };

      const response = await axios.put(
        `${API_BASE_URL}/alumni/${editingAlumni._id}`,
        alumniData,
        {
          withCredentials: true,
          headers: authUtils.getAuthHeaders()
        }
      );

      if (response.data.success) {
        toast.success('Alumni updated successfully! ✅');
        setShowEditForm(false);
        setEditingAlumni(null);
        fetchAlumni(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating alumni:', error);
      toast.error(error.response?.data?.message || 'Failed to update alumni! 🚫');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAlumni = async (alumniId) => {
    if (!window.confirm('Are you sure you want to delete this alumni?')) {
      return;
    }

    try {
      const response = await axios.delete(
        `${API_BASE_URL}/alumni/${alumniId}`,
        {
          withCredentials: true,
          headers: authUtils.getAuthHeaders()
        }
      );

      if (response.data.success) {
        toast.success('Alumni removed successfully! 🗑️');
        fetchAlumni(); // Refresh the list
      }
    } catch (error) {
      console.error('Error deleting alumni:', error);
      toast.error(error.response?.data?.message || 'Failed to delete alumni! 🚫');
    }
  };

  const handleLogout = () => {
    dispatch(removeAdmin());
    authUtils.clearToken();
    toast.success('Admin logged out! 👋');
    navigate('/');
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  🛡️ Admin Dashboard
                </h1>
                <p className="text-gray-400">
                  Welcome, <span className="text-purple-400 font-semibold">{admin?.firstname || 'Admin'}</span>
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  {showAddForm ? '❌ Cancel' : '➕ Add Alumni'}
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold py-2 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          </div>

          {/* Add Alumni Form */}
          {showAddForm && (
            <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span>👥</span> Add New Alumni
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  {/* College Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      College Name *
                    </label>
                    <input
                      type="text"
                      name="collegeName"
                      value={formData.collegeName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="MIT, Stanford, IIT Delhi, etc."
                      required
                    />
                  </div>

                  {/* Graduation Year */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Graduation Year *
                    </label>
                    <input
                      type="number"
                      name="graduationYear"
                      value={formData.graduationYear}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="2020"
                      min="1950"
                      max="2030"
                      required
                    />
                  </div>

                  {/* Degree */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Branch / Degree *
                    </label>
                    <input
                      type="text"
                      name="degree"
                      value={formData.degree}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="B.Tech Computer Science, MBA, etc."
                      required
                    />
                  </div>

                  {/* Current Company */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Current Company *
                    </label>
                    <input
                      type="text"
                      name="currentCompany"
                      value={formData.currentCompany}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Google"
                      required
                    />
                  </div>

                  {/* Current Role */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Current Role *
                    </label>
                    <input
                      type="text"
                      name="currentRole"
                      value={formData.currentRole}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Senior Software Engineer"
                      required
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="San Francisco, USA"
                    />
                  </div>

                  {/* Photo URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Photo URL
                    </label>
                    <input
                      type="url"
                      name="photoUrl"
                      value={formData.photoUrl}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="https://example.com/photo.jpg"
                    />
                  </div>
                </div>

                


                {/* Social Links */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    🔗 Social Links
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="url"
                      name="social_linkedin"
                      value={formData.socialLinks.linkedin}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="LinkedIn URL"
                    />
                    <input
                      type="url"
                      name="social_github"
                      value={formData.socialLinks.github}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="GitHub URL"
                    />
                    <input
                      type="url"
                      name="social_twitter"
                      value={formData.socialLinks.twitter}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Twitter URL"
                    />
                    <input
                      type="url"
                      name="social_instagram"
                      value={formData.socialLinks.instagram}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Instagram URL"
                    />
                    <input
                      type="url"
                      name="social_portfolio"
                      value={formData.socialLinks.portfolio}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Portfolio URL"
                    />
                  </div>
                </div>

                {/* Interview Journey */}
                <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-500/30 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
                    💼 Interview Journey & Experience
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Number of Rounds */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Number of Interview Rounds
                        </label>
                        <input
                          type="number"
                          name="interview_rounds"
                          value={formData.interviewProcess.rounds}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="3"
                          min="1"
                          max="10"
                        />
                      </div>

                      {/* Difficulty Level */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Interview Difficulty
                        </label>
                        <select
                          name="interview_difficulty"
                          value={formData.interviewProcess.difficulty}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none cursor-pointer"
                        >
                          <option value="">Select Difficulty</option>
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                        </select>
                      </div>
                    </div>

                    {/* Interview Process Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Interview Process Description
                      </label>
                      <textarea
                        name="interview_description"
                        value={formData.interviewProcess.description}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Describe the interview process, rounds, and overall experience..."
                      />
                    </div>

                    {/* Interview Tips */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Interview Tips & Insights (comma-separated)
                      </label>
                      <textarea
                        name="interview_tips"
                        value={formData.interviewProcess.tips}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Practice DSA thoroughly, Be confident in system design, Prepare behavioral questions, etc."
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? 'Adding...' : 'Add Alumni'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Edit Alumni Form */}
          {showEditForm && editingAlumni && (
            <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span>✏️</span> Edit Alumni
              </h2>
              
              <form onSubmit={handleUpdateAlumni} className="space-y-6">
                {/* Basic Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editingAlumni.name}
                      onChange={handleEditInputChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={editingAlumni.email}
                      onChange={handleEditInputChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  {/* College Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      College Name *
                    </label>
                    <input
                      type="text"
                      name="collegeName"
                      value={editingAlumni.collegeName}
                      onChange={handleEditInputChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  {/* Graduation Year */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Graduation Year *
                    </label>
                    <input
                      type="number"
                      name="graduationYear"
                      value={editingAlumni.graduationYear}
                      onChange={handleEditInputChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      min="1950"
                      max="2030"
                      required
                    />
                  </div>

                  {/* Degree */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Branch / Degree *
                    </label>
                    <input
                      type="text"
                      name="degree"
                      value={editingAlumni.degree}
                      onChange={handleEditInputChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  {/* Current Company */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Current Company *
                    </label>
                    <input
                      type="text"
                      name="currentCompany"
                      value={editingAlumni.currentCompany}
                      onChange={handleEditInputChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  {/* Current Role */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Current Role *
                    </label>
                    <input
                      type="text"
                      name="currentRole"
                      value={editingAlumni.currentRole}
                      onChange={handleEditInputChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={editingAlumni.location}
                      onChange={handleEditInputChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  {/* Photo URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Photo URL
                    </label>
                    <input
                      type="url"
                      name="photoUrl"
                      value={editingAlumni.photoUrl}
                      onChange={handleEditInputChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={editingAlumni.bio}
                    onChange={handleEditInputChange}
                    rows="4"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Expertise */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Expertise (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="expertise"
                    value={editingAlumni.expertise}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Social Links */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    🔗 Social Links
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="url"
                      name="social_linkedin"
                      value={editingAlumni.socialLinks?.linkedin || ''}
                      onChange={handleEditInputChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="LinkedIn URL"
                    />
                    <input
                      type="url"
                      name="social_github"
                      value={editingAlumni.socialLinks?.github || ''}
                      onChange={handleEditInputChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="GitHub URL"
                    />
                    <input
                      type="url"
                      name="social_twitter"
                      value={editingAlumni.socialLinks?.twitter || ''}
                      onChange={handleEditInputChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Twitter URL"
                    />
                    <input
                      type="url"
                      name="social_instagram"
                      value={editingAlumni.socialLinks?.instagram || ''}
                      onChange={handleEditInputChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Instagram URL"
                    />
                    <input
                      type="url"
                      name="social_portfolio"
                      value={editingAlumni.socialLinks?.portfolio || ''}
                      onChange={handleEditInputChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Portfolio URL"
                    />
                  </div>
                </div>

                {/* Interview Journey */}
                <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-500/30 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
                    💼 Interview Journey & Experience
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Number of Interview Rounds
                        </label>
                        <input
                          type="number"
                          name="interview_rounds"
                          value={editingAlumni.interviewProcess?.rounds || ''}
                          onChange={handleEditInputChange}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                          min="1"
                          max="10"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Interview Difficulty
                        </label>
                        <select
                          name="interview_difficulty"
                          value={editingAlumni.interviewProcess?.difficulty || ''}
                          onChange={handleEditInputChange}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none cursor-pointer"
                        >
                          <option value="">Select Difficulty</option>
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Interview Process Description
                      </label>
                      <textarea
                        name="interview_description"
                        value={editingAlumni.interviewProcess?.description || ''}
                        onChange={handleEditInputChange}
                        rows="4"
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Interview Tips & Insights (comma-separated)
                      </label>
                      <textarea
                        name="interview_tips"
                        value={editingAlumni.interviewProcess?.tips || ''}
                        onChange={handleEditInputChange}
                        rows="3"
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditForm(false);
                      setEditingAlumni(null);
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? 'Updating...' : 'Update Alumni'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Info Panel */}
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">📊 Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-4">
                <p className="text-gray-300 text-sm mb-1">Total Alumni</p>
                <p className="text-3xl font-bold text-white">{alumniList.length}</p>
              </div>
              <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl p-4">
                <p className="text-gray-300 text-sm mb-1">Companies</p>
                <p className="text-3xl font-bold text-white">{new Set(alumniList.map(a => a.currentCompany)).size}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-xl p-4">
                <p className="text-gray-300 text-sm mb-1">Active Alumni</p>
                <p className="text-3xl font-bold text-white">{alumniList.filter(a => a.isActive).length}</p>
              </div>
            </div>
            <div className="mt-6 bg-blue-900/20 border border-blue-700/50 rounded-xl p-4">
              <p className="text-blue-300 text-sm">
                💡 <strong>Quick Tip:</strong> Click "Add Alumni" to add new alumni profiles or click the edit/delete buttons on any alumni card below to manage them.
              </p>
            </div>
          </div>

          {/* Alumni List */}
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-6">
            <h2 className="text-xl font-bold text-white mb-4">👥 Alumni Management</h2>
            {alumniList.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No alumni found. Add your first alumni!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {alumniList.map((alumni) => (
                  <div
                    key={alumni._id}
                    className="bg-gray-700/50 border border-gray-600 rounded-xl p-4 hover:border-purple-500/50 transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {alumni.photoUrl && (
                            <img
                              src={alumni.photoUrl}
                              alt={alumni.name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-purple-500"
                            />
                          )}
                          <div>
                            <h3 className="text-lg font-semibold text-white">{alumni.name}</h3>
                            <p className="text-sm text-gray-400">{alumni.email}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                          <p className="text-gray-300">
                            <span className="text-purple-400">🏢 Company:</span> {alumni.currentCompany}
                          </p>
                          <p className="text-gray-300">
                            <span className="text-purple-400">💼 Role:</span> {alumni.currentRole}
                          </p>
                          <p className="text-gray-300">
                            <span className="text-purple-400">🎓 Year:</span> {alumni.graduationYear}
                          </p>
                          <p className="text-gray-300">
                            <span className="text-purple-400">🏫 College:</span> {alumni.collegeName}
                          </p>
                          <p className="text-gray-300">
                            <span className="text-purple-400">📚 Degree:</span> {alumni.degree}
                          </p>
                          {alumni.location && (
                            <p className="text-gray-300">
                              <span className="text-purple-400">📍 Location:</span> {alumni.location}
                            </p>
                          )}
                        </div>
                        {alumni.expertise && alumni.expertise.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-400 mb-1">Skills:</p>
                            <div className="flex flex-wrap gap-2">
                              {alumni.expertise.slice(0, 5).map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="bg-purple-600/30 text-purple-300 px-2 py-1 rounded-lg text-xs"
                                >
                                  {skill}
                                </span>
                              ))}
                              {alumni.expertise.length > 5 && (
                                <span className="text-gray-400 text-xs">+{alumni.expertise.length - 5} more</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(alumni)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2"
                        >
                          <span>✏️</span> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAlumni(alumni._id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2"
                        >
                          <span>🗑️</span> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
