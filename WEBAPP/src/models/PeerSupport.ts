import { ObjectId } from 'mongodb';

export interface Reply {
  _id?: ObjectId;
  content: string;
  timestamp: Date;
  isVolunteer: boolean;
  anonymousId: string;
}

export interface PeerSupportPost {
  _id?: ObjectId;
  content: string;
  category: 'general' | 'academic-stress' | 'social-emotional' | 'time-management' | 'career-anxiety' | 'relationships' | 'health-wellness' | 'other';
  likes: number;
  replies: Reply[];
  anonymousId: string;
  ipHash: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Helper functions for validation
export function validatePostData(data: Record<string, unknown>): { isValid: boolean; error?: string } {
  const validCategories = [
    'general',
    'academic-stress',
    'social-emotional',
    'time-management',
    'career-anxiety',
    'relationships',
    'health-wellness',
    'other',
  ];
  const content = data.content;
  const category = data.category;
  if (typeof content !== 'string' || content.trim().length === 0) {
    return { isValid: false, error: 'Content is required' };
  }
  if (content.length > 2000) {
    return { isValid: false, error: 'Content too long (max 2000 characters)' };
  }
  if (typeof category !== 'string' || !validCategories.includes(category)) {
    return { isValid: false, error: 'Invalid category' };
  }
  return { isValid: true };
}

export function validateReplyData(data: Record<string, unknown>): { isValid: boolean; error?: string } {
  const content = data.content;
  if (typeof content !== 'string' || content.trim().length === 0) {
    return { isValid: false, error: 'Content is required' };
  }
  if (content.length > 1000) {
    return { isValid: false, error: 'Content too long (max 1000 characters)' };
  }
  return { isValid: true };
}