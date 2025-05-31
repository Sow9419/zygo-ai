// src/app/api/image-analysis/route.ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { imageBase64 } = await req.json()

  if (!imageBase64) {
    return NextResponse.json({ error: 'Image base64 is required' }, { status: 400 })
  }

  // Supprimer le préfixe "data:image/jpeg;base64,"
  const base64Content = imageBase64.replace(/^data:image\/\w+;base64,/, '')

  const visionEndpoint = `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_VISION_API_KEY}`

  const body = {
    requests: [
      {
        image: {
          content: base64Content,
        },
        features: [
          { type: 'LABEL_DETECTION', maxResults: 5 },
          { type: 'TEXT_DETECTION' }
        ]
      }
    ]
  }

  const res = await fetch(visionEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

  const data = await res.json()
  return NextResponse.json(data)
}
