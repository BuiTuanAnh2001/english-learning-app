import { ImageResponse } from 'next/og'
 
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'
 
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 50%, #8B5CF6 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          borderRadius: '50%',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          V
        </div>
        {/* Small stars */}
        <div
          style={{
            position: 'absolute',
            top: '4px',
            left: '4px',
            width: '3px',
            height: '3px',
            background: 'white',
            borderRadius: '50%',
            opacity: 0.8,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '6px',
            right: '5px',
            width: '3px',
            height: '3px',
            background: 'white',
            borderRadius: '50%',
            opacity: 0.8,
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
