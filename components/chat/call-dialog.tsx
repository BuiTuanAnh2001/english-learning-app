"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  createAgoraClient,
  createLocalTracks,
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from "@/lib/agora";
import { createBrowserClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import {
  Mic,
  MicOff,
  PhoneOff,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

interface CallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  callType: "voice" | "video";
  isOutgoing: boolean;
  callerName: string;
  callerAvatar?: string;
  channelName: string;
  userId?: string;
  otherUserId?: string;
  onCallEnd?: () => void;
}

export function CallDialog({
  open,
  onOpenChange,
  callType,
  isOutgoing,
  callerName,
  callerAvatar,
  channelName,
  userId,
  otherUserId,
  onCallEnd,
}: CallDialogProps) {
  const [client, setClient] = useState<IAgoraRTCClient | null>(null);
  const [localAudioTrack, setLocalAudioTrack] =
    useState<IMicrophoneAudioTrack | null>(null);
  const [localVideoTrack, setLocalVideoTrack] =
    useState<ICameraVideoTrack | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isSpeakerOff, setIsSpeakerOff] = useState(false);
  const [callStatus, setCallStatus] = useState<
    "calling" | "connecting" | "connected" | "ended"
  >(isOutgoing ? "calling" : "connecting");
  const [callDuration, setCallDuration] = useState(0);

  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Use refs to avoid recreating handleEndCall
  const localTracksRef = useRef({
    audio: localAudioTrack,
    video: localVideoTrack,
  });
  const clientRef = useRef(client);

  // Update refs when values change
  useEffect(() => {
    localTracksRef.current = { audio: localAudioTrack, video: localVideoTrack };
  }, [localAudioTrack, localVideoTrack]);

  useEffect(() => {
    clientRef.current = client;
  }, [client]);

  // Handle ending call - defined early for use in effects
  const handleEndCall = useCallback(async () => {
    setCallStatus("ended");

    // Broadcast call ended to other user
    if (otherUserId) {
      const supabase = createBrowserClient();
      if (supabase) {
        try {
          const channel = supabase.channel(`user:${otherUserId}:call-events`);

          // Subscribe first, then send
          channel.subscribe(async (status) => {
            if (status === "SUBSCRIBED") {
              await channel.send({
                type: "broadcast",
                event: "call_ended",
                payload: { userId },
              });

              // Small delay to ensure message is sent
              setTimeout(() => {
                supabase.removeChannel(channel);
              }, 100);
            }
          });
        } catch (error) {
          console.error("Error broadcasting call ended:", error);
        }
      }
    }

    // Stop and close local tracks using refs
    if (localTracksRef.current.audio) {
      localTracksRef.current.audio.stop();
      localTracksRef.current.audio.close();
    }
    if (localTracksRef.current.video) {
      localTracksRef.current.video.stop();
      localTracksRef.current.video.close();
    }

    // Leave channel using ref
    if (clientRef.current) {
      await clientRef.current.leave();
    }

    // Clear timer
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
    }

    onCallEnd?.();
    onOpenChange(false);
  }, [otherUserId, userId, onCallEnd, onOpenChange]);

  // Initialize Agora client
  useEffect(() => {
    if (!open) return;

    const agoraClient = createAgoraClient();
    setClient(agoraClient);

    return () => {
      agoraClient.leave();
      setClient(null);
    };
  }, [open]);

  // Subscribe to call ended events
  useEffect(() => {
    if (!open || !userId) return;

    const supabase = createBrowserClient();
    if (!supabase) return;

    const channel = supabase
      .channel(`user:${userId}:call-events`)
      .on("broadcast", { event: "call_ended" }, (payload) => {
        console.log("📞 Call ended by other user");
        toast("Người kia đã kết thúc cuộc gọi", { icon: "📞" });

        // Cleanup without broadcasting back
        setCallStatus("ended");

        if (localTracksRef.current.audio) {
          localTracksRef.current.audio.stop();
          localTracksRef.current.audio.close();
        }
        if (localTracksRef.current.video) {
          localTracksRef.current.video.stop();
          localTracksRef.current.video.close();
        }
        if (clientRef.current) {
          clientRef.current.leave();
        }
        if (callTimerRef.current) {
          clearInterval(callTimerRef.current);
        }

        onCallEnd?.();
        onOpenChange(false);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [open, userId, onCallEnd, onOpenChange]);

  // Join channel and setup tracks
  useEffect(() => {
    if (!client || !open) return;

    const joinChannel = async () => {
      try {
        const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID;
        if (!appId) {
          toast.error("Agora App ID not configured");
          return;
        }

        // Create local tracks
        const tracks = await createLocalTracks(true, callType === "video");
        setLocalAudioTrack(tracks.audioTrack || null);
        setLocalVideoTrack(tracks.videoTrack || null);

        // Join channel (using null for token in development)
        await client.join(appId, channelName, null, null);

        // Publish tracks
        if (tracks.audioTrack) {
          await client.publish(tracks.audioTrack);
        }
        if (tracks.videoTrack) {
          await client.publish(tracks.videoTrack);
          // Play local video
          if (localVideoRef.current) {
            tracks.videoTrack.play(localVideoRef.current);
          }
        }

        setCallStatus("connected");

        // Start call timer
        callTimerRef.current = setInterval(() => {
          setCallDuration((prev) => prev + 1);
        }, 1000);
      } catch (error) {
        console.error("Error joining channel:", error);
        toast.error("Không thể kết nối cuộc gọi");
        handleEndCall();
      }
    };

    // Handle remote users
    client.on("user-published", async (user, mediaType) => {
      await client.subscribe(user, mediaType);

      if (mediaType === "video") {
        setRemoteUsers((prev) => [
          ...prev.filter((u) => u.uid !== user.uid),
          user,
        ]);
        // Play remote video
        setTimeout(() => {
          if (remoteVideoRef.current && user.videoTrack) {
            user.videoTrack.play(remoteVideoRef.current);
          }
        }, 100);
      }

      if (mediaType === "audio" && user.audioTrack) {
        user.audioTrack.play();
      }
    });

    client.on("user-unpublished", (user) => {
      setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
    });

    client.on("user-left", (user) => {
      setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
      toast("Người kia đã rời khỏi cuộc gọi", { icon: "📞" });
    });

    joinChannel();

    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, [client, open, channelName, callType, handleEndCall]);

  const toggleAudio = () => {
    if (localAudioTrack) {
      localAudioTrack.setEnabled(isAudioMuted);
      setIsAudioMuted(!isAudioMuted);
    }
  };

  const toggleVideo = () => {
    if (localVideoTrack) {
      localVideoTrack.setEnabled(isVideoMuted);
      setIsVideoMuted(!isVideoMuted);
    }
  };

  const toggleSpeaker = () => {
    setIsSpeakerOff(!isSpeakerOff);
    remoteUsers.forEach((user) => {
      if (user.audioTrack) {
        user.audioTrack.setVolume(isSpeakerOff ? 100 : 0);
      }
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-slate-900 border-slate-800 p-0 overflow-hidden">
        <div className="relative h-[600px] flex flex-col">
          {/* Video area */}
          <div className="flex-1 relative bg-slate-950">
            {callType === "video" ? (
              <>
                {/* Remote video (full screen) */}
                <div
                  ref={remoteVideoRef}
                  className={cn(
                    "absolute inset-0",
                    remoteUsers.length === 0 && "hidden"
                  )}
                />

                {/* No remote video placeholder */}
                {remoteUsers.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Avatar className="w-32 h-32 mx-auto mb-4">
                        <AvatarImage src={callerAvatar} />
                        <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-4xl">
                          {callerName[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="text-2xl font-semibold text-white mb-2">
                        {callerName}
                      </h3>
                      <p className="text-slate-400">
                        {callStatus === "calling"
                          ? "Đang gọi..."
                          : callStatus === "connecting"
                          ? "Đang kết nối..."
                          : "Đã kết nối"}
                      </p>
                    </div>
                  </div>
                )}

                {/* Local video (picture-in-picture) */}
                <div
                  ref={localVideoRef}
                  className={cn(
                    "absolute top-4 right-4 w-40 h-28 rounded-lg overflow-hidden border-2 border-slate-700 shadow-lg",
                    isVideoMuted && "hidden"
                  )}
                />
              </>
            ) : (
              // Voice call UI
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Avatar className="w-32 h-32 mx-auto mb-4 ring-4 ring-cyan-500/50 animate-pulse">
                    <AvatarImage src={callerAvatar} />
                    <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-4xl">
                      {callerName[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-2xl font-semibold text-white mb-2">
                    {callerName}
                  </h3>
                  <p className="text-slate-400 mb-4">
                    {callStatus === "calling"
                      ? "Đang gọi..."
                      : callStatus === "connecting"
                      ? "Đang kết nối..."
                      : formatDuration(callDuration)}
                  </p>
                  {callStatus === "connected" && (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm text-green-400">Đang gọi</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Call duration overlay */}
            {callStatus === "connected" && callType === "video" && (
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-white font-medium">
                  {formatDuration(callDuration)}
                </span>
              </div>
            )}
          </div>

          {/* Call controls */}
          <div className="bg-slate-900/95 backdrop-blur-sm p-6 border-t border-slate-800">
            <div className="flex items-center justify-center gap-4">
              {/* Mute audio */}
              <button
                onClick={toggleAudio}
                className={cn(
                  "w-14 h-14 rounded-full transition-all flex items-center justify-center",
                  isAudioMuted
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-slate-800 hover:bg-slate-700 text-white"
                )}
                title={isAudioMuted ? "Bật mic" : "Tắt mic"}
              >
                {isAudioMuted ? (
                  <MicOff className="w-6 h-6" />
                ) : (
                  <Mic className="w-6 h-6" />
                )}
              </button>

              {/* Toggle video (only for video calls) */}
              {callType === "video" && (
                <button
                  onClick={toggleVideo}
                  className={cn(
                    "w-14 h-14 rounded-full transition-all flex items-center justify-center",
                    isVideoMuted
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-slate-800 hover:bg-slate-700 text-white"
                  )}
                  title={isVideoMuted ? "Bật camera" : "Tắt camera"}
                >
                  {isVideoMuted ? (
                    <VideoOff className="w-6 h-6" />
                  ) : (
                    <Video className="w-6 h-6" />
                  )}
                </button>
              )}

              {/* Speaker toggle */}
              <button
                onClick={toggleSpeaker}
                className={cn(
                  "w-14 h-14 rounded-full transition-all flex items-center justify-center",
                  isSpeakerOff
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-slate-800 hover:bg-slate-700 text-white"
                )}
                title={isSpeakerOff ? "Bật loa" : "Tắt loa"}
              >
                {isSpeakerOff ? (
                  <VolumeX className="w-6 h-6" />
                ) : (
                  <Volume2 className="w-6 h-6" />
                )}
              </button>

              {/* End call */}
              <button
                onClick={handleEndCall}
                className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all flex items-center justify-center"
                title="Kết thúc cuộc gọi"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
