import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { getServerSession } from 'next-auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const version = formData.get('version') as string;

    if (!file || !version) {
      return NextResponse.json({ error: 'Missing file or version' }, { status: 400 });
    }

    // Validate file type
    if (!file.name.endsWith('.apk')) {
      return NextResponse.json({ error: 'Only APK files allowed' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Remove old APK files
    const downloadsDir = path.join(process.cwd(), 'public/downloads');
    const existingFiles = await import('fs').then(fs => 
      fs.readdirSync(downloadsDir).filter(f => f.endsWith('.apk'))
    );
    
    for (const existingFile of existingFiles) {
      await unlink(path.join(downloadsDir, existingFile));
    }

    // Save new file
    const filename = `weibao-${version}.apk`;
    const filepath = path.join(downloadsDir, filename);
    await writeFile(filepath, buffer);

    // Update version info
    const versionInfo = {
      version,
      downloadUrl: `/downloads/${filename}`,
      releaseDate: new Date().toISOString(),
      fileSize: (buffer.length / (1024 * 1024)).toFixed(2) + ' MB',
      filename
    };

    await writeFile(
      path.join(process.cwd(), 'public/version.json'),
      JSON.stringify(versionInfo, null, 2)
    );

    return NextResponse.json({ success: true, versionInfo });
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}