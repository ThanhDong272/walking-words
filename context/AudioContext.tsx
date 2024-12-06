import type { ReactNode } from "react";
import React, { createContext, useContext, useState } from "react";
import type { AVPlaybackSource } from "expo-av";
import { Audio } from "expo-av";
import type { Sound } from "expo-av/build/Audio";

interface AudioContextType {
  isReading: boolean;
  pauseReading: boolean;
  sound?: Sound;
  playbackStatus: {
    positionMillis: number;
    durationMillis: number;
  };
  setIsReading: (value: boolean) => void;
  setPauseReading: (value: boolean) => void;
  setPlaybackStatus: (value: {
    positionMillis: number;
    durationMillis: number;
  }) => void;
  onReadingChapter: ({ audioUrl }: { audioUrl: string }) => Promise<void>;
  onPauseReading: () => Promise<void>;
  onRewind: () => Promise<void>;
  onForward: () => Promise<void>;
  getPlaybackPercentage: () => number;
}

interface AudioProviderProps {
  children: ReactNode;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const CONTROL_PLAYBACK_SECOND = 15000;

  const [isReading, setIsReading] = useState(false);
  const [pauseReading, setPauseReading] = useState(false);
  const [sound, setSound] = useState<Sound>();
  const [playbackStatus, setPlaybackStatus] = useState({
    positionMillis: 0,
    durationMillis: 1,
  });

  const onReadingChapter = async ({ audioUrl }: { audioUrl: string }) => {
    console.log("AUDIO URL: ", audioUrl);

    if (!isReading && audioUrl) {
      const { sound } = await Audio.Sound.createAsync(
        {
          uri: audioUrl,
        },
        {
          shouldPlay: true,
        },
      );
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          if (status.didJustFinish) {
            setIsReading(false);
            setPlaybackStatus({
              positionMillis: 0,
              durationMillis: 1,
            });
          }
          setPlaybackStatus({
            positionMillis: status.positionMillis,
            durationMillis: status.durationMillis || 1,
          });
        }
      });
      setSound(sound);
    } else {
      sound?.unloadAsync();

      setPlaybackStatus({
        positionMillis: 0,
        durationMillis: 1,
      });
    }

    setPauseReading(false);
    setIsReading(!isReading);
  };

  const onPauseReading = async () => {
    if (!pauseReading) {
      await sound?.pauseAsync();
    } else {
      await sound?.playAsync();
    }

    setPauseReading(!pauseReading);
  };

  const onRewind = async () => {
    if (sound) {
      const status: any = await sound.getStatusAsync();
      const newPosition = Math.max(
        status?.positionMillis - CONTROL_PLAYBACK_SECOND,
        0,
      );
      await sound.setPositionAsync(newPosition);
    }
  };

  const onForward = async () => {
    if (sound) {
      const status: any = await sound.getStatusAsync();
      const newPosition = Math.min(
        status.positionMillis + CONTROL_PLAYBACK_SECOND,
        status.durationMillis,
      );
      await sound.setPositionAsync(newPosition);
    }
  };

  const getPlaybackPercentage = () => {
    const { positionMillis, durationMillis } = playbackStatus;
    return Math.round((positionMillis / durationMillis) * 100);
  };

  return (
    <AudioContext.Provider
      value={{
        isReading,
        sound,
        pauseReading,
        setIsReading,
        setPauseReading,
        setPlaybackStatus,
        onReadingChapter,
        onPauseReading,
        onRewind,
        onForward,
        getPlaybackPercentage,
        playbackStatus,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useReadAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useReadAudio must be used within an AudioProvider");
  }
  return context;
};
