import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { PeerSupportPost, validatePostData } from '@/models/PeerSupport';
import { ObjectId } from 'mongodb';
import crypto from 'crypto';

// Generate anonymous ID
function generateAnonymousId(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const letterPart = letters.charAt(Math.floor(Math.random() * letters.length));
  const numberPart = Array.from({length: 3}, () => numbers.charAt(Math.floor(Math.random() * numbers.length))).join('');
  return `Student_${letterPart}${numberPart}`;
}

// Hash IP for spam prevention
function hashIP(ip: string): string {
  return crypto.createHash('sha256').update(ip + (process.env.NEXTAUTH_SECRET || 'fallback')).digest('hex');
}

// GET - Fetch all posts
export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection<PeerSupportPost>('peer_support_posts');
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 20;
    
    let query: any = { isActive: true };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { content: { $regex: search, $options: 'i' } },
        { 'replies.content': { $regex: search, $options: 'i' } }
      ];
    }
    
    const posts = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();
    
    const total = await collection.countDocuments(query);
    
    return NextResponse.json({ 
      posts, 
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        hasMore: page * limit < total
      }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// POST - Create new post
export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection<PeerSupportPost>('peer_support_posts');
    
    const body = await request.json();
    const { content, category } = body;
    
    // Validation
    const validation = validatePostData({ content, category });
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }
    
    // Get IP for spam prevention
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    const ipHash = hashIP(ip);
    
    // Rate limiting check (5 posts per hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentPosts = await collection.countDocuments({
      ipHash,
      createdAt: { $gte: oneHourAgo }
    });
    
    if (recentPosts >= 5) {
      return NextResponse.json({ error: 'Rate limit exceeded. Please wait before posting again.' }, { status: 429 });
    }
    
    const now = new Date();
    const post: PeerSupportPost = {
      content: content.trim(),
      category,
      likes: 0,
      replies: [],
      anonymousId: generateAnonymousId(),
      ipHash,
      isActive: true,
      createdAt: now,
      updatedAt: now
    };
    
    const result = await collection.insertOne(post);
    const savedPost = await collection.findOne({ _id: result.insertedId });
    
    return NextResponse.json({ post: savedPost }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}