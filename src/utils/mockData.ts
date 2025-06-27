import { FileItem, Folder, Activity, StorageStats } from '../types';

export const mockFiles: FileItem[] = [
  {
    id: '1',
    name: 'Project Proposal.pdf',
    size: 2.5 * 1024 * 1024,
    type: 'document',
    mimeType: 'application/pdf',
    url: '/mock-files/proposal.pdf',
    thumbnailUrl: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2',
    ownerId: '1',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    versions: [],
    sharedLinks: [],
    tags: ['work', 'important'],
    isStarred: true,
    isTrashed: false
  },
  {
    id: '2',
    name: 'Team Photo.jpg',
    size: 4.2 * 1024 * 1024,
    type: 'image',
    mimeType: 'image/jpeg',
    url: '/mock-files/team.jpg',
    thumbnailUrl: 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2',
    ownerId: '1',
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-14T14:20:00Z',
    versions: [],
    sharedLinks: [],
    tags: ['team', 'memories'],
    isStarred: false,
    isTrashed: false
  },
  {
    id: '3',
    name: 'Presentation.pptx',
    size: 8.7 * 1024 * 1024,
    type: 'document',
    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    url: '/mock-files/presentation.pptx',
    thumbnailUrl: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2',
    ownerId: '1',
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z',
    versions: [],
    sharedLinks: [],
    tags: ['presentation', 'work'],
    isStarred: false,
    isTrashed: false
  },
  {
    id: '4',
    name: 'Demo Video.mp4',
    size: 45.3 * 1024 * 1024,
    type: 'video',
    mimeType: 'video/mp4',
    url: '/mock-files/demo.mp4',
    thumbnailUrl: 'https://images.pexels.com/photos/1181292/pexels-photo-1181292.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2',
    ownerId: '1',
    createdAt: '2024-01-12T16:45:00Z',
    updatedAt: '2024-01-12T16:45:00Z',
    versions: [],
    sharedLinks: [],
    tags: ['demo', 'video'],
    isStarred: true,
    isTrashed: false
  },
  {
    id: '5',
    name: 'Budget Spreadsheet.xlsx',
    size: 1.8 * 1024 * 1024,
    type: 'document',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    url: '/mock-files/budget.xlsx',
    thumbnailUrl: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2',
    ownerId: '1',
    createdAt: '2024-01-11T11:30:00Z',
    updatedAt: '2024-01-11T11:30:00Z',
    versions: [],
    sharedLinks: [],
    tags: ['budget', 'finance'],
    isStarred: false,
    isTrashed: false
  }
];

export const mockFolders: Folder[] = [
  {
    id: '1',
    name: 'Work Projects',
    ownerId: '1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    isStarred: true,
    isTrashed: false,
    children: []
  },
  {
    id: '2',
    name: 'Personal',
    ownerId: '1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    isStarred: false,
    isTrashed: false,
    children: []
  },
  {
    id: '3',
    name: 'Shared with me',
    ownerId: '1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    isStarred: false,
    isTrashed: false,
    children: []
  }
];

export const mockActivity: Activity[] = [
  {
    id: '1',
    type: 'upload',
    description: 'Uploaded Project Proposal.pdf',
    userId: '1',
    userName: 'John Doe',
    fileId: '1',
    fileName: 'Project Proposal.pdf',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    type: 'share',
    description: 'Shared Team Photo.jpg',
    userId: '1',
    userName: 'John Doe',
    fileId: '2',
    fileName: 'Team Photo.jpg',
    createdAt: '2024-01-14T15:20:00Z'
  },
  {
    id: '3',
    type: 'download',
    description: 'Downloaded Demo Video.mp4',
    userId: '1',
    userName: 'John Doe',
    fileId: '4',
    fileName: 'Demo Video.mp4',
    createdAt: '2024-01-13T12:15:00Z'
  }
];

export const mockStorageStats: StorageStats = {
  totalUsed: 2.5 * 1024 * 1024 * 1024, // 2.5GB
  totalLimit: 15 * 1024 * 1024 * 1024, // 15GB
  fileTypes: {
    images: 0.8 * 1024 * 1024 * 1024,
    documents: 1.2 * 1024 * 1024 * 1024,
    videos: 0.4 * 1024 * 1024 * 1024,
    audio: 0.05 * 1024 * 1024 * 1024,
    others: 0.05 * 1024 * 1024 * 1024
  },
  recentActivity: mockActivity
};