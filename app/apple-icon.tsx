import { ImageResponse } from 'next/og'
 
export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'
 
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 100,
          background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 50%, #8B5CF6 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          borderRadius: '40px',
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
            top: '25px',
            left: '25px',
            width: '15px',
            height: '15px',
            background: 'white',
            borderRadius: '50%',
            opacity: 0.8,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '30px',
            right: '30px',
            width: '10px',
            height: '10px',
            background: 'white',
            borderRadius: '50%',
            opacity: 0.6,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            right: '35px',
            width: '12px',
            height: '12px',
            background: 'white',
            borderRadius: '50%',
            opacity: 0.7,
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
