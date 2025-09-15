import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { PeerSupportPost } from '@/models/PeerSupport';
import { ObjectId } from 'mongodb';

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
    const { increment } = body;
    
    if (typeof increment !== 'boolean') {
      return NextResponse.json({ error: 'Increment must be a boolean' }, { status: 400 });
    }
    
    // Check if post exists
    const postExists = await collection.findOne({ _id: new ObjectId(id), isActive: true });
    if (!postExists) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    const updateQuery = increment 
      ? { $inc: { likes: 1 } }
      : { $inc: { likes: -1 } };
    
    const updatedPost = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        ...updateQuery,
        $set: { updatedAt: new Date() }
      },
      { returnDocument: 'after' }
    );
    
    if (!updatedPost || !updatedPost.value) {
      return NextResponse.json({ error: 'Failed to update likes' }, { status: 500 });
    }
    
    // Ensure likes don't go below 0
    if (updatedPost.value.likes < 0) {
      const fixedPost = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { likes: 0, updatedAt: new Date() } },
        { returnDocument: 'after' }
      );
      return NextResponse.json({ post: fixedPost?.value });
    }
    
    return NextResponse.json({ post: updatedPost.value });
  } catch (error) {
    console.error('Error updating likes:', error);
    if (error instanceof Error && error.message.includes('ObjectId')) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update likes' }, { status: 500 });
  }
}