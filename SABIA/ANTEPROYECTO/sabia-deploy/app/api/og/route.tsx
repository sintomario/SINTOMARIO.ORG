// app/api/og/route.tsx — OG image dinámica 1200x630
import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const zona    = searchParams.get('zona') ?? 'Cuerpo'
  const ctx     = searchParams.get('ctx') ?? 'Bienestar'
  const emocion = searchParams.get('emocion') ?? 'Tu cuerpo te dice.'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%',
          background: '#F8F7F3',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '60px',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div style={{ color: '#0C4A34', fontSize: 28, letterSpacing: 6, marginBottom: 20 }}>
          SABIA
        </div>
        <div style={{
          color: '#1A1816', fontSize: 44, fontWeight: 400,
          fontStyle: 'italic', textAlign: 'center',
          maxWidth: 900, lineHeight: 1.3, marginBottom: 30,
        }}>
          {emocion}
        </div>
        <div style={{
          display: 'flex', gap: 12, marginBottom: 40,
        }}>
          <span style={{ background: '#EAF5EE', color: '#0C4A34', padding: '6px 18px', borderRadius: 20, fontSize: 18 }}>
            {zona.replace('-', ' ')}
          </span>
          <span style={{ background: '#FBF7E8', color: '#8A6A12', padding: '6px 18px', borderRadius: 20, fontSize: 18 }}>
            {ctx}
          </span>
        </div>
        <div style={{ color: '#7A786E', fontSize: 16, letterSpacing: 3, textTransform: 'uppercase' }}>
          sabia.info
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
