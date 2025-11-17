import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";

function CompanyModal({ isOpen, onClose, company, onSave, isLoading }) {
  const [formData, setFormData] = useState({
    name_c: '',
    address_c: '',
    city_c: '',
    state_c: '',
    zip_c: '',
    phone_c: '',
    website_c: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

useEffect(() => {
    if (company) {
      setFormData({
        name_c: company.name_c || '',
        address_c: company.address_c || '',
        city_c: company.city_c || '',
        state_c: company.state_c || '',
        zip_c: company.zip_c || '',
        phone_c: company.phone_c || '',
        website_c: company.website_c || '',
      });
    } else {
      setFormData({
        name_c: '',
        address_c: '',
        city_c: '',
        state_c: '',
        zip_c: '',
        phone_c: '',
        website_c: '',
      });
    }
    setErrors({});
  }, [company, isOpen]);

  const validateForm = () => {
    // Clear any previous errors before validation
    const newErrors = {};

    // Check current formData state - ensure trim() is called on string
    const nameValue = String(formData.name_c || '').trim();
    if (!nameValue) {
      newErrors.name_c = 'Company name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
      setFormData({
        name_c: '',
        address_c: '',
        city_c: '',
        state_c: '',
        zip_c: '',
        phone_c: '',
        website_c: '',
      });
    } catch (error) {
      console.error('Error saving company:', error);
      toast.error(error.message || 'Failed to save company');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black bg-opacity-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {company ? 'Edit Company' : 'New Company'}
              </h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" className="h-5 w-5 text-gray-600" />
              </button>
            </div>

{/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <FormField
                label="Company Name"
                required
                error={errors.name_c}
              >
                <Input
                  type="text"
                  value={formData.name_c}
                  onChange={(e) => handleChange('name_c', e.target.value)}
                  placeholder="Enter company name"
                  disabled={isSubmitting}
                />
              </FormField>

              <FormField label="Address">
                <Textarea
                  value={formData.address_c}
                  onChange={(e) => handleChange('address_c', e.target.value)}
                  placeholder="Enter street address"
                  rows={2}
                  disabled={isSubmitting}
                />
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="City">
                  <Input
                    type="text"
                    value={formData.city_c}
                    onChange={(e) => handleChange('city_c', e.target.value)}
                    placeholder="Enter city"
                    disabled={isSubmitting}
                  />
                </FormField>

                <FormField label="State">
                  <Input
                    type="text"
                    value={formData.state_c}
                    onChange={(e) => handleChange('state_c', e.target.value)}
                    placeholder="Enter state"
                    disabled={isSubmitting}
                  />
                </FormField>
              </div>

              <FormField label="Zip Code">
                <Input
                  type="text"
                  value={formData.zip_c}
                  onChange={(e) => handleChange('zip_c', e.target.value)}
                  placeholder="Enter zip code"
                  disabled={isSubmitting}
                />
              </FormField>

              <FormField label="Phone">
                <Input
                  type="tel"
                  value={formData.phone_c}
                  onChange={(e) => handleChange('phone_c', e.target.value)}
                  placeholder="Enter phone number"
                  disabled={isSubmitting}
                />
              </FormField>

              <FormField label="Website">
                <Input
                  type="url"
                  value={formData.website_c}
                  onChange={(e) => handleChange('website_c', e.target.value)}
                  placeholder="Enter website URL"
                  disabled={isSubmitting}
                />
              </FormField>
              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <span className="flex items-center space-x-2">
                      <ApperIcon name="Loader" className="h-4 w-4 animate-spin" />
                      <span>Saving...</span>
                    </span>
                  ) : (
                    'Save Company'
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default CompanyModal;