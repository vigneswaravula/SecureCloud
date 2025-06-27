export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
  
  return date.toLocaleDateString();
};

export const getFileIcon = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.includes('pdf')) return 'file-text';
  if (mimeType.includes('word') || mimeType.includes('document')) return 'file-text';
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'file-spreadsheet';
  if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'presentation';
  if (mimeType.includes('zip') || mimeType.includes('archive')) return 'archive';
  return 'file';
};

export const getFileTypeColor = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) return 'text-green-600';
  if (mimeType.startsWith('video/')) return 'text-red-600';
  if (mimeType.startsWith('audio/')) return 'text-purple-600';
  if (mimeType.includes('pdf')) return 'text-red-600';
  if (mimeType.includes('word') || mimeType.includes('document')) return 'text-blue-600';
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'text-green-600';
  if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'text-orange-600';
  return 'text-gray-600';
};