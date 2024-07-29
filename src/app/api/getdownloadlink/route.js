import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';

export async function GET(request) {
  const url = new URL(request.url);
  const videoId = url.searchParams.get('videoId');

  if (!videoId) {
    return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
  }

  try {
    const binaryPath = 'public/yt-dlp';
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    const process = spawn(binaryPath, [
      videoUrl,
      '--dump-single-json',
      '--no-warnings',
      '--quiet',
      '--output',
      '-',
    ]);

    let stdout = '';
    let stderr = '';

    process.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    process.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    return new Promise((resolve, reject) => {
      process.on('close', (code) => {
        if (code !== 0) {
          console.error('stderr:', stderr);
          return reject(new Error(`Command failed with code ${code}: ${stderr}`));
        }

        // Try parsing stdout first
        try {
          const videoInfo = JSON.parse(stdout);

            if (!videoInfo) {
              return resolve(NextResponse.json({ error: 'Failed to retrieve video' }, { status: 404 }));
            }

            resolve(NextResponse.json(videoInfo,{status:200}));
        } catch (stdoutParseError) {
          // If parsing stdout fails, try stderr
          try {
            const videoInfo = JSON.parse(stderr);

            if (!videoInfo) {
              return resolve(NextResponse.json({ error: 'Failed to retrieve video' }, { status: 404 }));
            }

            resolve(NextResponse.json(videoInfo,{status:200}));
          } catch (stderrParseError) {
            console.error('Parse Error:', stderrParseError);
            console.error('stdout data:', stdout);
            console.error('stderr data:', stderr);
            resolve(NextResponse.json({ error: 'Failed to parse video' }, { status: 500 }));
          }
        }
      });
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to fetch video' }, { status: 500 });
  }
}
