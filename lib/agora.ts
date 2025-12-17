import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";

// Agora client configuration
export const createAgoraClient = () => {
  // Only create client on browser side
  if (typeof window === 'undefined') {
    throw new Error('Agora client can only be created in browser environment');
  }

  return AgoraRTC.createClient({
    mode: "rtc",
    codec: "vp8",
  });
};

export const createLocalTracks = async (
  audioEnabled: boolean = true,
  videoEnabled: boolean = false
) => {
  // Only create tracks on browser side
  if (typeof window === 'undefined') {
    return {};
  }

  const tracks: {
    audioTrack?: IMicrophoneAudioTrack;
    videoTrack?: ICameraVideoTrack;
  } = {};

  if (audioEnabled) {
    tracks.audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
  }

  if (videoEnabled) {
    tracks.videoTrack = await AgoraRTC.createCameraVideoTrack();
  }

  return tracks;
};

export { AgoraRTC };
export type {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack
};

