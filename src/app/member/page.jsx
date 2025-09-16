'use client'

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { 
  Search, 
  Plus, 
  Users, 
  Filter,
  Edit,
  User,
  X
} from 'lucide-react';

const MembersPage = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [departments, setDepartments] = useState([]);
  
  // Department modal state
  const [departmentName, setDepartmentName] = useState('');
  const [departmentDescription, setDepartmentDescription] = useState('');
  const [isSubmittingDepartment, setIsSubmittingDepartment] = useState(false);
  
  // Member modal state
  const [memberData, setMemberData] = useState({
    name: '',
    email: '',
    role: '',
    project: '',
    phone: ''
  });
  const [isSubmittingMember, setIsSubmittingMember] = useState(false);

  // Fetch members from API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/members');
        if (response.ok) {
          const data = await response.json();
          setMembers(data);
        } else {
          console.error('Failed to fetch members');
          setMembers([]);
        }
      } catch (error) {
        console.error('Error fetching members:', error);
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // Filter members based on search term
  const filteredMembers = members.filter(member =>
    member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'project admin':
        return 'bg-blue-100 text-blue-800';
      case 'consultant':
        return 'bg-green-100 text-green-800';
      case 'approver':
        return 'bg-purple-100 text-purple-800';
      case 'contractor':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatLastLogin = (dateString) => {
    if (!dateString || dateString === 'Not logged in yet') return 'Not logged in yet';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Department modal handlers
  const handleDepartmentSubmit = async () => {
    if (!departmentName.trim()) return;

    try {
      setIsSubmittingDepartment(true);
      const response = await fetch('/api/departments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: departmentName,
          description: departmentDescription
        }),
      });

      if (response.ok) {
        const newDepartment = await response.json();
        setDepartments(prev => [...prev, newDepartment]);
        setShowDepartmentModal(false);
        setDepartmentName('');
        setDepartmentDescription('');
        alert('Department created successfully!');
      } else {
        throw new Error('Failed to create department');
      }
    } catch (error) {
      console.error('Error creating department:', error);
      alert('Error creating department. Please try again.');
    } finally {
      setIsSubmittingDepartment(false);
    }
  };

  // Member modal handlers
  const handleMemberInputChange = (field, value) => {
    setMemberData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMemberSubmit = async () => {
    if (!memberData.name.trim() || !memberData.email.trim() || !memberData.role) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmittingMember(true);
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberData),
      });

      if (response.ok) {
        const newMember = await response.json();
        setMembers(prev => [...prev, newMember]);
        setShowMemberModal(false);
        setMemberData({
          name: '',
          email: '',
          role: '',
          project: '',
          phone: ''
        });
        alert('Member added successfully!');
      } else {
        throw new Error('Failed to create member');
      }
    } catch (error) {
      console.error('Error creating member:', error);
      alert('Error creating member. Please try again.');
    } finally {
      setIsSubmittingMember(false);
    }
  };

  const MemberCard = ({ member }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
            {member.avatar ? (
              <img 
                src={member.avatar} 
                alt={member.name} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <User className="w-6 h-6 text-gray-600" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{member.name}</h3>
            <p className="text-gray-600 text-sm">{member.email}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Active
          </span>
          <button 
            className="text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => {
              console.log('Edit member:', member.id);
            }}
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Role:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
            {member.role}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Last Login:</span>
          <span className="text-gray-900 text-right text-xs">
            {formatLastLogin(member.lastLogin)}
          </span>
        </div>
        {member.project && (
          <div className="flex justify-between items-start">
            <span className="text-gray-600">Project:</span>
            <span 
              className="text-gray-900 text-right max-w-48 text-xs leading-tight" 
              title={member.project}
            >
              {member.project}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  const LoadingSkeleton = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-300"></div>
        <div>
          <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-40"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-300 rounded"></div>
        <div className="h-3 bg-gray-300 rounded"></div>
        <div className="h-3 bg-gray-300 rounded"></div>
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>Members - Project Management</title>
        <meta name="description" content="Manage team members and departments" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900">Members</h1>
                {!loading && (
                  <span className="text-sm text-gray-500">
                    {filteredMembers.length} member{filteredMembers.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                  />
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setShowDepartmentModal(true)}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Department</span>
                  </button>
                  
                  <button 
                    onClick={() => setShowMemberModal(true)}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Users className="w-4 h-4" />
                    <span className="hidden sm:inline">Member</span>
                  </button>
                  
                  <button className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Members Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <LoadingSkeleton key={i} />
              ))}
            </div>
          ) : filteredMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map((member) => (
                <MemberCard key={member.id || member.email} member={member} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No members found' : 'No members yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? `No members match "${searchTerm}". Try a different search term.`
                  : 'Get started by adding your first team member.'
                }
              </p>
              {!searchTerm && (
                <button 
                  onClick={() => setShowMemberModal(true)}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Member</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Department Modal */}
        <div className={`fixed inset-0 z-50 overflow-hidden transition-all duration-500 ease-in-out ${showDepartmentModal ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowDepartmentModal(false)}></div>
          <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transition-transform duration-500 ease-in-out ${showDepartmentModal ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Create Department</h2>
              <button 
                onClick={() => setShowDepartmentModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto h-full">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department Name *
                </label>
                <input
                  type="text"
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter department name"
                  disabled={isSubmittingDepartment}
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={departmentDescription}
                  onChange={(e) => setDepartmentDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter description"
                  rows="3"
                  disabled={isSubmittingDepartment}
                />
              </div>
              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={() => setShowDepartmentModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isSubmittingDepartment}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDepartmentSubmit}
                  disabled={!departmentName.trim() || isSubmittingDepartment}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmittingDepartment ? 'Creating...' : 'Create Department'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Member Modal */}
        <div className={`fixed inset-0 z-50 overflow-hidden transition-all duration-500 ease-in-out ${showMemberModal ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowMemberModal(false)}></div>
          <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transition-transform duration-500 ease-in-out ${showMemberModal ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Add New Member</h2>
              <button 
                onClick={() => setShowMemberModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto h-full">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={memberData.name}
                  onChange={(e) => handleMemberInputChange('name', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter full name"
                  disabled={isSubmittingMember}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={memberData.email}
                  onChange={(e) => handleMemberInputChange('email', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter email address"
                  disabled={isSubmittingMember}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <select
                  value={memberData.role}
                  onChange={(e) => handleMemberInputChange('role', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isSubmittingMember}
                >
                  <option value="">Select a role</option>
                  <option value="Project Admin">Project Admin</option>
                  <option value="Consultant">Consultant</option>
                  <option value="Approver">Approver</option>
                  <option value="Contractor">Contractor</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project
                </label>
                <input
                  type="text"
                  value={memberData.project}
                  onChange={(e) => handleMemberInputChange('project', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter project name"
                  disabled={isSubmittingMember}
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={memberData.phone}
                  onChange={(e) => handleMemberInputChange('phone', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter phone number"
                  disabled={isSubmittingMember}
                />
              </div>
              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={() => setShowMemberModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isSubmittingMember}
                >
                  Cancel
                </button>
                <button
                  onClick={handleMemberSubmit}
                  disabled={!memberData.name.trim() || !memberData.email.trim() || !memberData.role || isSubmittingMember}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmittingMember ? 'Adding...' : 'Add Member'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MembersPage;