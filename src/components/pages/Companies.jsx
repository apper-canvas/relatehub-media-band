import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { companyService } from '@/services/api/companyService';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import CompanyModal from '@/components/organisms/CompanyModal';
import CompanyCard from '@/components/molecules/CompanyCard';
import SearchBar from '@/components/molecules/SearchBar';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import Loading from '@/components/ui/Loading';

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    filterCompanies();
  }, [companies, searchTerm]);

  const loadCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await companyService.getAll();
      setCompanies(data || []);
    } catch (err) {
      console.error('Error loading companies:', err);
      setError(err.message || 'Failed to load companies');
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const filterCompanies = () => {
    let filtered = companies;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = companies.filter(
        (company) =>
          company.name_c?.toLowerCase().includes(term) ||
          company.city_c?.toLowerCase().includes(term) ||
          company.state_c?.toLowerCase().includes(term) ||
          company.phone_c?.toLowerCase().includes(term)
      );
    }

    setFilteredCompanies(filtered);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleAddCompany = () => {
    setSelectedCompany(null);
    setIsModalOpen(true);
  };

  const handleEditCompany = (company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const handleDeleteCompany = async (companyId) => {
    try {
      await companyService.delete(companyId);
      setCompanies((prev) => prev.filter((c) => c.Id !== companyId));
      toast.success('Company deleted successfully');
    } catch (err) {
      console.error('Error deleting company:', err);
      toast.error(err.message || 'Failed to delete company');
    }
  };

  const handleSaveCompany = async (companyData) => {
    setIsSubmitting(true);
    try {
      if (selectedCompany) {
        // Update existing company
        await companyService.update(selectedCompany.Id, companyData);
        setCompanies((prev) =>
          prev.map((c) =>
            c.Id === selectedCompany.Id ? { ...c, ...companyData } : c
          )
        );
        toast.success('Company updated successfully');
      } else {
        // Create new company
        const newCompany = await companyService.create(companyData);
        if (newCompany) {
          setCompanies((prev) => [newCompany, ...prev]);
          toast.success('Company created successfully');
        }
      }
    } catch (err) {
      console.error('Error saving company:', err);
      toast.error(err.message || 'Failed to save company');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Error
        message={error}
        onRetry={loadCompanies}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                  <ApperIcon name="Building2" className="h-6 w-6 text-white" />
                </div>
                <span>Companies</span>
              </h1>
              <p className="text-gray-600 mt-2">
                Manage and track all company information
              </p>
            </div>
            <Button
              variant="primary"
              onClick={handleAddCompany}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="Plus" className="h-4 w-4" />
              <span>Add Company</span>
            </Button>
          </div>

          {/* Search Bar */}
          <SearchBar
            placeholder="Search companies by name, city, state, or phone..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {/* Companies Grid */}
        {filteredCompanies.length === 0 ? (
          <Empty
            title={searchTerm ? 'No companies found' : 'No companies yet'}
            description={
              searchTerm
                ? 'Try adjusting your search criteria'
                : 'Create your first company to get started'
            }
            icon="Building2"
            action={
              !searchTerm && (
                <Button variant="primary" onClick={handleAddCompany}>
                  Add Company
                </Button>
              )
            }
          />
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredCompanies.map((company) => (
                <CompanyCard
                  key={company.Id}
                  company={company}
                  onEdit={handleEditCompany}
                  onDelete={handleDeleteCompany}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Stats */}
        {filteredCompanies.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing {filteredCompanies.length} of {companies.length} companies
            </p>
          </div>
        )}
      </div>

      {/* Company Modal */}
      <CompanyModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCompany(null);
        }}
        company={selectedCompany}
        onSave={handleSaveCompany}
        isLoading={isSubmitting}
      />
    </div>
  );
}

export default Companies;