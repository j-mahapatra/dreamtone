"use client";

import {
  Download,
  Guitar,
  Link2,
  Link2Off,
  ListMusic,
  LoaderCircle,
  Music,
  Music2,
  Pencil,
  Play,
  RefreshCw,
  Search,
  Settings,
  XCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { songStatuses } from "@/lib/constants";
import Image from "next/image";
import { getPlayUrl } from "@/actions/generation";
import { Badge } from "@/components/ui/badge";
import { publishSong, renameSong } from "@/actions/song";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import RenameDialog from "./rename-dialog";
import { useRouter } from "next/navigation";
import { usePlayerStore } from "@/stores/use-player-store";

export interface Song {
  id: string;
  title: string | null;
  createdAt: Date;
  prompt: string | null;
  lyrics: string | null;
  fullSongDescription: string | null;
  lyricsDescription: string | null;
  isInstrumental: boolean;
  thumbnailUrl: string | null;
  playUrl: string | null;
  status: string | null;
  createdBy: string | null;
  published: boolean;
}

export function SongList({ songs }: { songs: Song[] }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingSongId, setLoadingSongId] = useState<string | null>(null);
  const [songToRename, setSongToRename] = useState<Song | null>(null);
  const setSong = usePlayerStore((state) => state.setSong);

  const filteredSongs = searchQuery
    ? songs.filter(
        (song) =>
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          song.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          song.prompt?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : songs;

  const onSongClick = async (song: Song) => {
    if (loadingSongId) return;

    setLoadingSongId(song.id);
    const playUrl = await getPlayUrl(song.id);
    setLoadingSongId(null);

    setSong({
      id: song.id,
      title: song.title,
      url: playUrl,
      artwork: song.thumbnailUrl,
      prompt: song.prompt,
      createdByUsername: song.createdBy,
    });
  };

  const onSongRename = async (songId: string, newTitle: string) => {
    await renameSong(songId, newTitle);
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    router.refresh();
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="flex flex-1 flex-col overflow-y-scroll">
      <div className="flex-1 p-6">
        <div className="mb-4 flex items-center justify-between space-x-3">
          <div className="relative max-w-md flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              placeholder="Search"
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            disabled={isLoading}
            variant={"outline"}
            className={cn(!isLoading && "cursor-pointer")}
            onClick={() => handleRefresh()}
          >
            <RefreshCw className={cn(isLoading && "animate-spin")} />
            Refresh
          </Button>
        </div>
        <div className="space-y-2">
          {filteredSongs.length > 0 ? (
            filteredSongs.map((song) => {
              if (song.status === songStatuses.FAILED) {
                return (
                  <div
                    key={song.id}
                    className="flex items-center gap-4 rounded-lg p-3"
                  >
                    <div className="bg-destructive/10 flex size-12 flex-shrink-0 items-center justify-center rounded-md">
                      <XCircle className="text-destructive size-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-destructive truncate text-sm font-medium">
                        Generation failed
                      </h3>
                      <p className="text-muted-foreground truncate text-sm">
                        Please try generating the song again.
                      </p>
                    </div>
                  </div>
                );
              }

              if (song.status === songStatuses.NO_CREDITS) {
                return (
                  <div
                    key={song.id}
                    className="flex items-center gap-4 rounded-lg p-3"
                  >
                    <div className="bg-destructive/10 flex size-12 flex-shrink-0 items-center justify-center rounded-md">
                      <XCircle className="text-destructive size-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-destructive truncate text-sm font-medium">
                        No Credits
                      </h3>
                      <p className="text-muted-foreground truncate text-sm">
                        Please purchase more credits.
                      </p>
                    </div>
                  </div>
                );
              }

              if (
                song.status === songStatuses.QUEUED ||
                song.status === songStatuses.PROCESSING
              ) {
                return (
                  <div
                    key={song.id}
                    className="flex items-center gap-4 rounded-lg p-3"
                  >
                    <div className="flex size-12 flex-shrink-0 items-center justify-center rounded-md bg-yellow-500/10">
                      <ListMusic className="size-6 animate-pulse text-yellow-700" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-medium">
                        {song.status === songStatuses.QUEUED
                          ? "Queued"
                          : "Processing"}
                      </h3>
                      <p className="text-muted-foreground truncate text-sm">
                        Please wait while the song is being generated. Refresh
                        to see updated status.
                      </p>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={song.id}
                  className="hover:bg-muted/50 flex cursor-pointer items-center gap-4 rounded-lg p-3 transition-colors"
                  onClick={() => onSongClick(song)}
                >
                  <div className="group relative size-14 flex-shrink-0 overflow-hidden rounded-md">
                    {song.thumbnailUrl ? (
                      <Image
                        src={song.thumbnailUrl}
                        alt={`${song.title} thumbnail`}
                        width={56}
                        height={56}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="bg-muted flex h-full w-full items-center justify-center">
                        <Music className="text-muted-foreground size-6" />
                      </div>
                    )}
                    <div className="bg-muted/50 absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                      {loadingSongId ? (
                        <LoaderCircle className="size-4 animate-spin" />
                      ) : (
                        <Play className="fill-accent-foreground stroke-muted size-4" />
                      )}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-md truncate text-sm">{song.title}</h3>
                      {song.isInstrumental && (
                        <Badge variant={"outline"}>
                          <Music2 className="size-3" />
                          Instrumental
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground truncate text-sm">
                      {song.prompt ?? song.fullSongDescription}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="cursor-pointer" asChild>
                        <Button size="sm" variant="outline">
                          <Settings />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={async (e) => {
                            e.stopPropagation();
                            const url = await getPlayUrl(song.id);
                            window.open(url, "_blank");
                          }}
                        >
                          <Download className="size-4" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={async (e) => {
                            e.stopPropagation();
                            setSongToRename(song);
                          }}
                        >
                          <Pencil className="size-4" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={async (e) => {
                            e.stopPropagation();
                            await publishSong(song.id, !song.published);
                          }}
                          className={cn(
                            "group cursor-pointer transition-all",
                            song.published &&
                              "focus:bg-destructive/70 focus:text-muted",
                          )}
                        >
                          {song.published ? (
                            <Link2Off className="group-focus:text-muted size-4" />
                          ) : (
                            <Link2 className="size-4" />
                          )}
                          {song.published ? "Unpublish" : "Publish"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-muted-foreground bg-muted/50 flex h-full w-full flex-col items-center justify-center rounded-md p-4">
              <Guitar className="mb-4 size-16" />
              <h3 className="font-semibold">No Songs</h3>
              <p className="flex h-full">
                {searchQuery
                  ? "No songs match your search"
                  : "You don't have any songs yet"}
              </p>
            </div>
          )}
        </div>
      </div>
      {songToRename && (
        <RenameDialog
          song={songToRename}
          onClose={() => {
            setSongToRename(null);
          }}
          onRename={onSongRename}
        />
      )}
    </div>
  );
}
