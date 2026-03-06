import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Visitor from '@/models/Visitor';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const visitors = await Visitor.find({}).sort({ inTime: -1 });
    return NextResponse.json(visitors);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
