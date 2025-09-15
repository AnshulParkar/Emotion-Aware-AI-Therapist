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
  category: 'academic-stress' | 'social-emotional' | 'time-management' | 'career-anxiety' | 'relationships' | 'health-wellness' | 'other';
  likes: number;
  replies: Reply[];
  anonymousId: string;
  ipHash: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Helper functions for validation
export function validatePostData(data: any): { isValid: boolean; error?: string } {
  if (!data.content || typeof data.content !== 'string' || data.content.trim().length === 0) {
    return { isValid: false, error: 'Content is required' };
  }
  
  if (data.content.length > 2000) {
    return { isValid: false, error: 'Content too long (max 2000 characters)' };
  }
  
  const validCategories = ['academic-stress', 'social-emotional', 'time-management', 'career-anxiety', 'relationships', 'health-wellness'];
  if (!data.category || !validCategories.includes(data.category)) {
    return { isValid: false, error: 'Invalid category' };
  }
  
  return { isValid: true };
}

export function validateReplyData(data: any): { isValid: boolean; error?: string } {
  if (!data.content || typeof data.content !== 'string' || data.content.trim().length === 0) {
    return { isValid: false, error: 'Content is required' };
  }
  
  if (data.content.length > 1000) {
    return { isValid: false, error: 'Content too long (max 1000 characters)' };
  }
  
  return { isValid: true };
}