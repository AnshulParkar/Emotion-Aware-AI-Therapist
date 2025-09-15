import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { PeerSupportPost, Reply, validateReplyData } from '@/models/PeerSupport';
import { ObjectId } from 'mongodb';

function generateAnonymousId(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const letterPart = letters.charAt(Math.floor(Math.random() * letters.length));
  const numberPart = Array.from({length: 3}, () => numbers.charAt(Math.floor(Math.random() * numbers.length))).join('');
  return `Student_${letterPart}${numberPart}`;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection<PeerSupportPost>('peer_support_posts');
    
    const { id } = params;
    const body = await request.json();
    const { content, isVolunteer = false } = body;
    
    // Validation
    const validation = validateReplyData({ content });
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }
    
    // Check if post exists
    const postExists = await collection.findOne({ _id: new ObjectId(id), isActive: true });
    if (!postExists) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    const reply: Reply = {
      _id: new ObjectId(),
      content: content.trim(),
      isVolunteer,
      anonymousId: generateAnonymousId(),
      timestamp: new Date()
    };
    
    const updatedPost = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { 
        $push: { replies: reply },
        $set: { updatedAt: new Date() }
      },
      { returnDocument: 'after' }
    );
    
    if (!updatedPost) {
      return NextResponse.json({ error: 'Failed to add reply' }, { status: 500 });
    }
    
    return NextResponse.json({ post: updatedPost });
  } catch (error) {
    console.error('Error adding reply:', error);
    if (error instanceof Error && error.message.includes('ObjectId')) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to add reply' }, { status: 500 });
  }
}