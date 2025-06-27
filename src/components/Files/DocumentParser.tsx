import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  X,
  Sparkles,
  Download,
  Copy,
  Check,
  CreditCard,
  Calendar,
  User,
  Mail,
  Phone,
  DollarSign,
  Hash,
  AlertTriangle,
  Clipboard
} from 'lucide-react';
import { FileItem, ExtractedDocumentData, ExtractedField } from '../../types';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

interface DocumentParserProps {
  file: FileItem;
  isOpen: boolean;
  onClose: () => void;
}

const DocumentParser: React.FC<DocumentParserProps> = ({ file, isOpen, onClose }) => {
  const [extractedData, setExtractedData] = useState<ExtractedDocumentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      parseDocument();
    }
  }, [isOpen, file.id]);

  const parseDocument = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to AI document parsing service
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock extracted data based on file type
      let mockData: ExtractedDocumentData;
      
      if (file.name.toLowerCase().includes('invoice')) {
        mockData = {
          type: 'invoice',
          fields: [
            { name: 'invoice_number', value: 'INV-2024-0123', confidence: 0.98, type: 'text' },
            { name: 'date', value: '2024-01-15', confidence: 0.95, type: 'date' },
            { name: 'due_date', value: '2024-02-15', confidence: 0.94, type: 'date' },
            { name: 'total_amount', value: '1,250.00', confidence: 0.97, type: 'currency' },
            { name: 'tax_amount', value: '125.00', confidence: 0.96, type: 'currency' },
            { name: 'vendor_name', value: 'Acme Corporation', confidence: 0.99, type: 'text' },
            { name: 'vendor_email', value: 'billing@acmecorp.com', confidence: 0.93, type: 'email' },
            { name: 'payment_terms', value: 'Net 30', confidence: 0.91, type: 'text' }
          ],
          confidence: 0.96,
          language: 'en',
          currency: 'USD'
        };
      } else if (file.name.toLowerCase().includes('receipt')) {
        mockData = {
          type: 'receipt',
          fields: [
            { name: 'merchant', value: 'Coffee Shop', confidence: 0.97, type: 'text' },
            { name: 'date', value: '2024-01-14', confidence: 0.96, type: 'date' },
            { name: 'time', value: '10:30 AM', confidence: 0.92, type: 'text' },
            { name: 'total', value: '8.75', confidence: 0.98, type: 'currency' },
            { name: 'payment_method', value: 'VISA ****1234', confidence: 0.94, type: 'text' },
            { name: 'items', value: 'Latte, Croissant', confidence: 0.89, type: 'text' }
          ],
          confidence: 0.94,
          language: 'en',
          currency: 'USD'
        };
      } else if (file.name.toLowerCase().includes('contract')) {
        mockData = {
          type: 'contract',
          fields: [
            { name: 'contract_id', value: 'CTR-2024-0057', confidence: 0.97, type: 'text' },
            { name: 'start_date', value: '2024-01-01', confidence: 0.96, type: 'date' },
            { name: 'end_date', value: '2024-12-31', confidence: 0.96, type: 'date' },
            { name: 'party_1', value: 'Acme Corporation', confidence: 0.98, type: 'text' },
            { name: 'party_2', value: 'XYZ Ltd', confidence: 0.98, type: 'text' },
            { name: 'contract_value', value: '50,000.00', confidence: 0.95, type: 'currency' },
            { name: 'payment_schedule', value: 'Quarterly', confidence: 0.92, type: 'text' },
            { name: 'termination_clause', value: '30 days written notice', confidence: 0.90, type: 'text' }
          ],
          confidence: 0.95,
          language: 'en'
        };
      } else {
        mockData = {
          type: 'other',
          fields: [
            { name: 'title', value: file.name.replace(/\.[^/.]+$/, ''), confidence: 0.90, type: 'text' },
            { name: 'date', value: formatDate(file.createdAt), confidence: 0.85, type: 'date' },
            { name: 'author', value: 'John Doe', confidence: 0.80, type: 'text' }
          ],
          confidence: 0.85,
          language: 'en'
        };
      }

      setExtractedData(mockData);
    } catch (error) {
      toast.error('Failed to parse document');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyField = (field: ExtractedField) => {
    navigator.clipboard.writeText(field.value);
    setCopiedField(field.name);
    toast.success(`Copied: ${field.value}`);
    
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const handleCopyAll = () => {
    if (!extractedData) return;
    
    const text = extractedData.fields
      .map(field => `${field.name.replace(/_/g, ' ')}: ${field.value}`)
      .join('\n');
    
    navigator.clipboard.writeText(text);
    toast.success('All fields copied to clipboard');
  };

  const getFieldIcon = (type: string) => {
    switch (type) {
      case 'currency':
        return <DollarSign className="w-4 h-4 text-green-600" />;
      case 'date':
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case 'email':
        return <Mail className="w-4 h-4 text-purple-600" />;
      case 'phone':
        return <Phone className="w-4 h-4 text-indigo-600" />;
      case 'number':
        return <Hash className="w-4 h-4 text-orange-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case 'invoice':
        return <CreditCard className="w-5 h-5 text-blue-600" />;
      case 'receipt':
        return <DollarSign className="w-5 h-5 text-green-600" />;
      case 'contract':
        return <FileText className="w-5 h-5 text-purple-600" />;
      case 'id_document':
        return <User className="w-5 h-5 text-orange-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600';
    if (confidence >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Document Analysis</h2>
                <p className="text-sm text-gray-600">{file.name}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Analyzing document with AI...</p>
              </div>
            </div>
          ) : extractedData ? (
            <div className="p-6 space-y-6">
              {/* Document Type */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getDocumentTypeIcon(extractedData.type)}
                  <div>
                    <h3 className="font-semibold text-gray-900 capitalize">{extractedData.type}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>Confidence: {Math.round(extractedData.confidence * 100)}%</span>
                      {extractedData.language && <span>Language: {extractedData.language.toUpperCase()}</span>}
                      {extractedData.currency && <span>Currency: {extractedData.currency}</span>}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCopyAll}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  <Clipboard className="w-4 h-4" />
                  <span>Copy All</span>
                </button>
              </div>

              {/* Extracted Fields */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Extracted Fields</h3>
                
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Field</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Confidence</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {extractedData.fields.map((field) => (
                        <tr key={field.name} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-2">
                              {getFieldIcon(field.type)}
                              <span className="font-medium text-gray-900 capitalize">
                                {field.name.replace(/_/g, ' ')}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-700">{field.value}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-1">
                              <div className={`w-2 h-2 rounded-full ${
                                field.confidence >= 0.9 ? 'bg-green-500' :
                                field.confidence >= 0.7 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}></div>
                              <span className={`text-sm ${getConfidenceColor(field.confidence)}`}>
                                {Math.round(field.confidence * 100)}%
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleCopyField(field)}
                              className="p-1 text-gray-400 hover:text-gray-600 rounded"
                              title="Copy value"
                            >
                              {copiedField === field.name ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Low Confidence Warning */}
              {extractedData.fields.some(field => field.confidence < 0.7) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-900">Low Confidence Fields Detected</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Some fields were extracted with low confidence. Please verify the highlighted information.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No data extracted</h3>
              <p className="text-gray-600">
                Unable to extract structured data from this document.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Powered by AI document analysis</span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DocumentParser;