import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const versionPath = path.join(process.cwd(), 'public/version.json');
    const versionData = await readFile(versionPath, 'utf-8');
    return NextResponse.json(JSON.parse(versionData));
  } catch (error) {
    return NextResponse.json({ 
      version: 'No version available',
      downloadUrl: '',
      releaseDate: '',
      fileSize: '',
      filename: ''
    });
  }
}