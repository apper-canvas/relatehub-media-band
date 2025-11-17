import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';

function CompanyCard({ company, onEdit, onDelete }) {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      onDelete(company.Id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 flex-1">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
            <ApperIcon name="Building2" className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {company.name_c || 'Unnamed Company'}
            </h3>
            <p className="text-sm text-gray-500 truncate">
              {company.city_c && company.state_c
                ? `${company.city_c}, ${company.state_c}`
                : 'No location'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(company)}
            className="p-2"
          >
            <ApperIcon name="Edit2" className="h-4 w-4 text-gray-600 hover:text-primary" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="p-2"
          >
            <ApperIcon name="Trash2" className="h-4 w-4 text-gray-600 hover:text-error" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {company.phone_c && (
          <div className="flex items-center space-x-2 text-sm">
            <ApperIcon name="Phone" className="h-4 w-4 text-gray-400" />
            <a href={`tel:${company.phone_c}`} className="text-primary hover:underline">
              {company.phone_c}
            </a>
          </div>
        )}

        {company.website_c && (
          <div className="flex items-center space-x-2 text-sm">
            <ApperIcon name="Globe" className="h-4 w-4 text-gray-400" />
            <a
              href={company.website_c}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline truncate"
            >
              {company.website_c}
            </a>
          </div>
        )}

        {company.address_c && (
          <div className="flex items-start space-x-2 text-sm">
            <ApperIcon name="MapPin" className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-gray-600 line-clamp-2">{company.address_c}</p>
          </div>
        )}

        {company.zip_c && (
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <ApperIcon name="Mail" className="h-4 w-4 text-gray-400" />
            <span>{company.zip_c}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default CompanyCard;