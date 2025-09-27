"use client";

import { getPlayUrl } from "@/actions/generation";
import { usePlayerStore } from "@/stores/use-player-store";
import type { Category, Song, User } from "@prisma/client";
import { Heart, LoaderCircle, Music, Play } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { updateSongLike } from "@/actions/song";

type SongWithRelation = Song & {
  User: {
    name: string | null;
  };
  _count: {
    likes: number;
  };
  categories: Category[];
  thumbnailUrl: string | null;
};
export default function SongCard({ song }: { song: SongWithRelation }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const setSong = usePlayerStore((state) => state.setSong);
  const [isLiked, setIsLiked] = useState(song._count.likes > 0 ? true : false);
  const [likesCount, setLikesCount] = useState(song._count.likes);

  const likeSong = async (e: React.MouseEvent) => {
    e.stopPropagation();

    setIsLiked((prev) => !prev);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

    await updateSongLike(song.id);
  };

  const onSongClick = async () => {
    setIsLoading(true);
    const playUrl = await getPlayUrl(song.id);

    setSong({
      id: song.id,
      title: song.title,
      url: playUrl,
      artwork: song.thumbnailUrl,
      prompt: song.prompt,
      createdByUsername: song.User.name,
    });

    setIsLoading(false);
  };

  return (
    <div>
      <div onClick={onSongClick} className="cursor-pointer">
        <div className="group bg-muted group:hover:opacity-75 relative aspect-square w-full overflow-hidden rounded-md">
          {song.thumbnailUrl ? (
            <img
              src={song.thumbnailUrl}
              alt={song.title ?? "Song"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="bg-muted flex h-full w-full items-center justify-center">
              <Music className="text-muted-foreground size-12" />
            </div>
          )}

          <div className="bg-muted/50 absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
            <div className="bg-muted/60 flex h-12 w-12 items-center justify-center rounded-full transition-transform group-hover:scale-105">
              {isLoading ? (
                <LoaderCircle className="size-6 animate-spin" />
              ) : (
                <Play className="fill-accent-foreground stroke-muted size-6" />
              )}
            </div>
          </div>
        </div>

        <h3 className="mt-2 truncate text-sm font-medium">{song.title}</h3>
        <p className="text-muted-foreground text-xs">{song.User.name}</p>
        <div className="mt-2 flex items-center justify-between text-xs">
          <div className="flex w-20 items-center justify-start">
            <Button
              variant="ghost"
              size="icon"
              className="mr-1 flex h-fit w-fit cursor-pointer justify-start rounded-full text-left"
              onClick={likeSong}
            >
              <Heart
                className={cn(
                  "size-4",
                  isLiked && "fill-rose-500 text-rose-500",
                )}
              />
            </Button>
            {likesCount} Likes
          </div>
          <span>
            <strong>{song.listenCount}</strong> Listens
          </span>
        </div>
      </div>
    </div>
  );
}
