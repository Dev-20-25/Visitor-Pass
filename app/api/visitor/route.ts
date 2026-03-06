import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Visitor from '@/models/Visitor';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // Validate required fields
    const { name, phoneNumber, reason, signature } = body;
    if (!name || !phoneNumber || !reason || !signature) {
      return NextResponse.json(
        { error: 'Name, Phone Number, Reason, and Signature are mandatory.' },
        { status: 400 }
      );
    }

    const visitor = await Visitor.create({
      ...body,
      inTime: new Date(),
    });

    return NextResponse.json({ success: true, data: visitor }, { status: 201 });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
