"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Music2, Pencil, Plus, Settings, Zap } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { lyricStyleTags, sampleSongDescriptions } from "@/lib/constants";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";

type ModeType = "simple" | "custom";
type LyricsMode = "user-generated" | "auto-generated";

export function SongPanel() {
  const [mode, setMode] = useState<ModeType>("simple");
  const [description, setDescription] = useState<string>("");
  const [instrumental, setInstrumental] = useState<boolean>(false);
  const [lyricsMode, setLyricsMode] = useState<LyricsMode>("user-generated");
  const [lyrics, setLyrics] = useState<string>("");
  const [styleTags, setStyleTags] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const generateSong = () => {};

  return (
    <div className="bg-muted/30 flex h-full w-full flex-col border-r lg:w-80">
      <div className="h-full flex-1 overflow-y-auto p-4">
        <Tabs
          value={mode}
          onValueChange={(value) => setMode(value as ModeType)}
        >
          <TabsList className="w-full">
            <TabsTrigger
              value="simple"
              className="cursor-pointer"
              disabled={loading}
            >
              Simple
            </TabsTrigger>
            <TabsTrigger
              value="custom"
              className="cursor-pointer"
              disabled={instrumental || loading}
            >
              Custom
            </TabsTrigger>
          </TabsList>
          <TabsContent value="simple" className="mt-6 space-y-6">
            <div className="flex flex-col gap-3">
              <div className="flex w-full flex-col gap-3">
                <Label htmlFor="song-desription-textarea">
                  Describe your song
                </Label>
                <Textarea
                  placeholder="Type the song desciption here. (e.g. - A energentic hip-hop song for a party)"
                  id="song-desription-textarea"
                  className="h-32 resize-none overflow-y-auto placeholder:text-xs"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col flex-wrap gap-2">
                <p className="text-muted-foreground text-sm">
                  Here are some popular desciptions to start with:
                </p>
                <div className="flex flex-wrap gap-2">
                  {sampleSongDescriptions.map((description) => (
                    <Badge
                      key={description}
                      variant="secondary"
                      className={cn(
                        loading
                          ? "cursor-not-allowed"
                          : "hover:bg-accent-foreground hover:text-accent cursor-pointer transition-all duration-300",
                      )}
                      onClick={() => setDescription(description)}
                    >
                      <Plus />
                      {description}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger>
                      <Label
                        htmlFor="instrumental-toggle"
                        className={cn(loading ? "" : "cursor-pointer")}
                      >
                        Instrumental Mode
                      </Label>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-72">
                      {
                        "Instrumental mode disables lyrics creation. Tap on 'Add Lyrics' to create a song with Lyrics."
                      }
                    </TooltipContent>
                  </Tooltip>
                  <Switch
                    id="instrumental-toggle"
                    className="cursor-pointer"
                    checked={instrumental}
                    onCheckedChange={setInstrumental}
                    disabled={loading}
                  />
                </div>
                <Button
                  size="sm"
                  className="cursor-pointer"
                  onClick={() => setMode("custom")}
                  disabled={instrumental || loading}
                >
                  <Settings /> Configure Lyrics
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="custom" className="mt-6 space-y-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <Label>Lyrics</Label>
                <div className="flex items-center gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={
                          lyricsMode === "auto-generated"
                            ? "ghost"
                            : "secondary"
                        }
                        size="sm"
                        className="h-7 cursor-pointer text-xs"
                        onClick={() => {
                          setLyricsMode("user-generated");
                          setLyrics("");
                        }}
                        disabled={loading}
                      >
                        <Pencil />
                        Write Lyrics
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-72">
                      {"Write your own lyrics for the song"}
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={
                          lyricsMode === "user-generated"
                            ? "ghost"
                            : "secondary"
                        }
                        size="sm"
                        className="h-7 cursor-pointer text-xs"
                        onClick={() => {
                          setLyricsMode("auto-generated");
                          setLyrics("");
                        }}
                        disabled={loading}
                      >
                        <Zap />
                        Auto-generate
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-72">
                      {"Describe the lyrics that you want to be generated"}
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <Textarea
                placeholder={
                  lyricsMode === "auto-generated"
                    ? "Describe the lyrics and let AI do the magic. (e.g. - An energetic hip-hop song for a party)"
                    : "Write your own lyrics here."
                }
                className="h-32 resize-none overflow-y-auto placeholder:text-xs"
                value={lyrics}
                onChange={(event) => setLyrics(event.target.value)}
                disabled={loading}
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label>Styles</Label>
              <Textarea
                placeholder={"Enter style tags here."}
                className="h-20 resize-none overflow-y-auto placeholder:text-xs"
                value={styleTags}
                onChange={(event) => setStyleTags(event.target.value)}
                disabled={loading}
              />
            </div>
            <div className="flex flex-col flex-wrap gap-2">
              <p className="text-muted-foreground text-sm">
                Here are some popular style tags to start with:
              </p>
              <div className="flex flex-wrap gap-2">
                {lyricStyleTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className={cn(
                      loading
                        ? "cursor-not-allowed"
                        : "hover:bg-accent-foreground hover:text-accent cursor-pointer transition-all duration-300",
                    )}
                    onClick={() => {
                      if (!loading) {
                        setStyleTags(tag);
                      }
                    }}
                  >
                    <Plus />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <Separator className="my-3" />
        <Button
          className={cn("w-full", loading ? "" : "cursor-pointer")}
          disabled={loading}
          onClick={generateSong}
        >
          {loading ? <Loader2 className="animate-spin" /> : <Music2 />}
          {loading ? "Generating..." : "Generate"}
        </Button>
      </div>
    </div>
  );
}
