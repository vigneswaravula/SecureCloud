import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Download,
  FileText,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  Trash2,
  Archive,
  Lock,
  Globe,
  User,
  Activity,
  BarChart3
} from 'lucide-react';
import { GDPRExport, AccessLog, RetentionPolicy, ComplianceFlag } from '../../types';
import { formatDate, formatFileSize } from '../../utils/formatters';
import toast from 'react-hot-toast';

interface ComplianceCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const ComplianceCenter: React.FC<ComplianceCenterProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'gdpr' | 'retention' | 'access_logs' | 'flags'>('gdpr');
  const [gdprExports, setGdprExports] = useState<GDPRExport[]>([]);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [retentionPolicies, setRetentionPolicies] = useState<RetentionPolicy[]>([]);
  const [complianceFlags, setComplianceFlags] = useState<ComplianceFlag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadComplianceData();
    }
  }, [isOpen]);

  const loadComplianceData = async () => {
    setIsLoading(true);
    try {
      // Mock compliance data
      const mockGdprExports: GDPRExport[] = [
        {
          id: 'export-1',
          userId: '1',
          requestedAt: '2024-01-15T10:30:00Z',
          status: 'completed',
          downloadUrl: '/exports/user-data-2024-01-15.zip',
          expiresAt: '2024-01-22T10:30:00Z',
          fileCount: 45,
          totalSize: 125 * 1024 * 1024
        },
        {
          id: 'export-2',
          userId: '1',
          requestedAt: '2024-01-10T14:20:00Z',
          status: 'processing',
          fileCount: 52,
          totalSize: 0
        }
      ];

      const mockAccessLogs: AccessLog[] = [
        {
          id: 'log-1',
          userId: '1',
          userName: 'John Doe',
          fileId: 'file-1',
          fileName: 'Project Proposal.pdf',
          action: 'view',
          timestamp: '2024-01-15T10:30:00Z',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          location: 'New York, US',
          success: true
        },
        {
          id: 'log-2',
          userId: '2',
          userName: 'Sarah Johnson',
          fileId: 'file-2',
          fileName: 'Budget Spreadsheet.xlsx',
          action: 'download',
          timestamp: '2024-01-15T09:15:00Z',
          ipAddress: '10.0.0.50',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          location: 'San Francisco, US',
          success: true
        },
        {
          id: 'log-3',
          userId: '3',
          userName: 'Mike Chen',
          fileId: 'file-3',
          fileName: 'Confidential Report.docx',
          action: 'edit',
          timestamp: '2024-01-15T08:45:00Z',
          ipAddress: '172.16.0.25',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          location: 'London, UK',
          success: false,
          errorMessage: 'Access denied - insufficient permissions'
        }
      ];

      const mockRetentionPolicies: RetentionPolicy[] = [
        {
          enabled: true,
          deleteAfterDays: 365,
          archiveAfterDays: 180,
          notifyBeforeDays: 30,
          exemptStarred: true,
          exemptShared: true
        }
      ];

      const mockComplianceFlags: ComplianceFlag[] = [
        {
          type: 'gdpr',
          reason: 'Personal data detected in uploaded document',
          createdAt: '2024-01-15T10:30:00Z',
          createdBy: 'system',
          resolved: false
        },
        {
          type: 'hipaa',
          reason: 'Medical information found in file metadata',
          createdAt: '2024-01-14T16:20:00Z',
          createdBy: 'compliance-scanner',
          resolved: true,
          resolvedAt: '2024-01-15T09:00:00Z',
          resolvedBy: 'admin'
        }
      ];

      setGdprExports(mockGdprExports);
      setAccessLogs(mockAccessLogs);
      setRetentionPolicies(mockRetentionPolicies);
      setComplianceFlags(mockComplianceFlags);
    } catch (error) {
      toast.error('Failed to load compliance data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestGDPRExport = async () => {
    try {
      const newExport: GDPRExport = {
        id: `export-${Date.now()}`,
        userId: '1',
        requestedAt: new Date().toISOString(),
        status: 'pending',
        fileCount: 0,
        totalSize: 0
      };

      setGdprExports(prev => [newExport, ...prev]);
      toast.success('GDPR export requested. You will be notified when ready.');
    } catch (error) {
      toast.error('Failed to request GDPR export');
    }
  };

  const handleDownloadExport = async (exportItem: GDPRExport) => {
    if (exportItem.status !== 'completed' || !exportItem.downloadUrl) return;

    try {
      // In a real app, this would download the actual export file
      const link = document.createElement('a');
      link.href = exportItem.downloadUrl;
      link.download = `gdpr-export-${exportItem.id}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('GDPR export downloaded');
    } catch (error) {
      toast.error('Failed to download export');
    }
  };

  const handleResolveFlag = async (flagType: string) => {
    try {
      setComplianceFlags(prev => prev.map(flag =>
        flag.type === flagType && !flag.resolved
          ? {
              ...flag,
              resolved: true,
              resolvedAt: new Date().toISOString(),
              resolvedBy: 'admin'
            }
          : flag
      ));

      toast.success('Compliance flag resolved');
    } catch (error) {
      toast.error('Failed to resolve flag');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'view':
        return <Eye className="w-4 h-4 text-blue-600" />;
      case 'download':
        return <Download className="w-4 h-4 text-green-600" />;
      case 'edit':
        return <FileText className="w-4 h-4 text-orange-600" />;
      case 'delete':
        return <Trash2 className="w-4 h-4 text-red-600" />;
      case 'share':
        return <Globe className="w-4 h-4 text-purple-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getFlagIcon = (type: string) => {
    switch (type) {
      case 'gdpr':
        return <Shield className="w-4 h-4 text-blue-600" />;
      case 'hipaa':
        return <Lock className="w-4 h-4 text-green-600" />;
      case 'sox':
        return <BarChart3 className="w-4 h-4 text-purple-600" />;
      case 'pci':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
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
        className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Compliance Center</h2>
                <p className="text-sm text-gray-600">Manage data privacy and compliance requirements</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              ×
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mt-6 bg-gray-100 p-1 rounded-lg">
            {[
              { id: 'gdpr', label: 'GDPR Export', icon: Download },
              { id: 'retention', label: 'Retention Policy', icon: Archive },
              { id: 'access_logs', label: 'Access Logs', icon: Activity },
              { id: 'flags', label: 'Compliance Flags', icon: AlertTriangle }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.id === 'flags' && complianceFlags.filter(f => !f.resolved).length > 0 && (
                  <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                    {complianceFlags.filter(f => !f.resolved).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading compliance data...</p>
              </div>
            </div>
          ) : (
            <div className="p-6">
              {/* GDPR Export Tab */}
              {activeTab === 'gdpr' && (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-blue-900">GDPR Data Export</h3>
                        <p className="text-sm text-blue-700 mt-1">
                          Request a complete export of your personal data in compliance with GDPR Article 20.
                          The export will include all your files, metadata, and account information.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Export Requests</h3>
                    <button
                      onClick={handleRequestGDPRExport}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      <Download className="w-4 h-4" />
                      <span>Request Export</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {gdprExports.map((exportItem) => (
                      <div key={exportItem.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(exportItem.status)}
                            <div>
                              <p className="font-medium text-gray-900">
                                Export requested on {formatDate(exportItem.requestedAt)}
                              </p>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span>Status: {exportItem.status}</span>
                                {exportItem.fileCount > 0 && (
                                  <span>{exportItem.fileCount} files</span>
                                )}
                                {exportItem.totalSize > 0 && (
                                  <span>{formatFileSize(exportItem.totalSize)}</span>
                                )}
                              </div>
                              {exportItem.expiresAt && (
                                <p className="text-xs text-orange-600 mt-1">
                                  Download expires: {formatDate(exportItem.expiresAt)}
                                </p>
                              )}
                            </div>
                          </div>

                          {exportItem.status === 'completed' && exportItem.downloadUrl && (
                            <button
                              onClick={() => handleDownloadExport(exportItem)}
                              className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                            >
                              <Download className="w-4 h-4" />
                              <span>Download</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {gdprExports.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Download className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No export requests yet</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Retention Policy Tab */}
              {activeTab === 'retention' && (
                <div className="space-y-6">
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Archive className="w-5 h-5 text-orange-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-orange-900">Data Retention Policy</h3>
                        <p className="text-sm text-orange-700 mt-1">
                          Configure automatic deletion and archival of files based on age and usage patterns.
                          This helps maintain compliance with data retention regulations.
                        </p>
                      </div>
                    </div>
                  </div>

                  {retentionPolicies.map((policy, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Retention Policy</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700">Policy Status</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              policy.enabled 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {policy.enabled ? 'Enabled' : 'Disabled'}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700">Delete after</span>
                            <span className="font-medium">{policy.deleteAfterDays} days</span>
                          </div>
                          
                          {policy.archiveAfterDays && (
                            <div className="flex items-center justify-between">
                              <span className="text-gray-700">Archive after</span>
                              <span className="font-medium">{policy.archiveAfterDays} days</span>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700">Notify before deletion</span>
                            <span className="font-medium">{policy.notifyBeforeDays} days</span>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700">Exempt starred files</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              policy.exemptStarred 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {policy.exemptStarred ? 'Yes' : 'No'}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700">Exempt shared files</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              policy.exemptShared 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {policy.exemptShared ? 'Yes' : 'No'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                          Edit Policy
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Access Logs Tab */}
              {activeTab === 'access_logs' && (
                <div className="space-y-6">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Activity className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-purple-900">Access Logs</h3>
                        <p className="text-sm text-purple-700 mt-1">
                          Detailed logs of all file access activities for compliance auditing and security monitoring.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">File</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {accessLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div>
                                <p className="font-medium text-gray-900">{log.userName}</p>
                                <p className="text-sm text-gray-500">{log.ipAddress}</p>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center space-x-2">
                                {getActionIcon(log.action)}
                                <span className="capitalize">{log.action}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <p className="font-medium text-gray-900">{log.fileName}</p>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {formatDate(log.timestamp)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {log.location}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                log.success
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {log.success ? 'Success' : 'Failed'}
                              </span>
                              {log.errorMessage && (
                                <p className="text-xs text-red-600 mt-1">{log.errorMessage}</p>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Compliance Flags Tab */}
              {activeTab === 'flags' && (
                <div className="space-y-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-red-900">Compliance Flags</h3>
                        <p className="text-sm text-red-700 mt-1">
                          Automated detection of potential compliance issues that require attention.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {complianceFlags.map((flag, index) => (
                      <div
                        key={index}
                        className={`border rounded-lg p-4 ${
                          flag.resolved ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            {getFlagIcon(flag.type)}
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900 uppercase">{flag.type}</span>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  flag.resolved
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                  {flag.resolved ? 'Resolved' : 'Active'}
                                </span>
                              </div>
                              <p className="text-gray-700 mt-1">{flag.reason}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                                <span>Created: {formatDate(flag.createdAt)}</span>
                                <span>By: {flag.createdBy}</span>
                                {flag.resolved && flag.resolvedAt && (
                                  <>
                                    <span>Resolved: {formatDate(flag.resolvedAt)}</span>
                                    <span>By: {flag.resolvedBy}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {!flag.resolved && (
                            <button
                              onClick={() => handleResolveFlag(flag.type)}
                              className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                            >
                              Resolve
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {complianceFlags.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-400" />
                        <p>No compliance flags</p>
                        <p className="text-sm">All systems are compliant</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ComplianceCenter;