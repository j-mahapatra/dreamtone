"use client";

import { usePlayerStore } from "@/stores/use-player-store";
import {
  AudioLines,
  Download,
  MoreHorizontal,
  Pause,
  Play,
  Volume2,
} from "lucide-react";
import { Card } from "./ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatTime } from "@/lib/helpers";

export function Soundbar() {
  const { song } = usePlayerStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([100]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const updateDuration = () => {
      if (!isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    const handleTrackEnd = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleTrackEnd);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleTrackEnd);
    };
  }, [song]);

  useEffect(() => {
    if (audioRef.current && song?.url) {
      setCurrentTime(0);
      setDuration(0);

      audioRef.current.src = song.url;
      audioRef.current.load();

      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.log(error);
            setIsPlaying(false);
          });
      }
    }
  }, [song]);

  useEffect(() => {
    if (audioRef?.current) {
      audioRef.current.volume = (volume[0] ?? 100) / 100;
    }
  }, [volume]);

  const togglePlay = async () => {
    if (!audioRef?.current || !song?.url) {
      return;
    }
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      await audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef?.current && value[0] !== undefined) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  if (!song) {
    return null;
  }

  return (
    <div className="px-4 pb-2">
      <Card className="bg-background/60 relative w-full flex-shrink-0 border-t px-4 py-0 backdrop-blur">
        <div className="space-y-2 p-3">
          <div className="flex items-center justify-between">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md">
                {song?.artwork ? (
                  <Image
                    src={song.artwork}
                    className="h-full w-full rounded-md object-cover"
                    height={50}
                    width={50}
                    alt="music-logo"
                  />
                ) : (
                  <AudioLines className="size-4" />
                )}
              </div>
              <div className="max-w-24 min-w-0 flex-1 md:max-w-full">
                <h2 className="truncate text-sm leading-6 font-medium">
                  {song?.title}
                </h2>
                <p className="text-muted-foreground text-xs">
                  {song?.createdByUsername}
                </p>
              </div>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2">
              <Button
                onClick={togglePlay}
                variant="ghost"
                size="icon"
                className="cursor-pointer"
              >
                {isPlaying ? (
                  <Pause className="size-4" />
                ) : (
                  <Play className="size-4" />
                )}
              </Button>
            </div>
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-2">
                <Volume2 className="size-4" />
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  step={1}
                  max={100}
                  min={0}
                  className="w-16"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                      if (song?.url) {
                        window.open(song.url, "_blank");
                      }
                    }}
                  >
                    <Download className="mr-2 size-4" />
                    Download
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground w-8 text-right text-xs">
              {formatTime(currentTime)}
            </span>
            <Slider
              className="flex-1"
              value={[currentTime]}
              max={duration || 100}
              step={1}
              onValueChange={handleSeek}
            />
            <span className="text-muted-foreground w-8 text-right text-xs">
              {formatTime(duration)}
            </span>
          </div>
        </div>
        {song?.url && (
          <audio src={song.url} ref={audioRef} preload="metadata" />
        )}
      </Card>
    </div>
  );
}
