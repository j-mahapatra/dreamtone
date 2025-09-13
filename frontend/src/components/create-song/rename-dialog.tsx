"use client";

import { useState } from "react";
import type { Song } from "./song-list";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function RenameDialog({
  song,
  onClose,
  onRename,
}: {
  song: Song;
  onClose: () => void;
  onRename: (songId: string, newTitle: string) => Promise<void>;
}) {
  const [title, setTitle] = useState(song.title ?? "");

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("clicked");
    e.preventDefault();

    if (title.trim().length > 0) {
      await onRename(song.id, title);
      onClose();
    }
  };
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rename Song</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="name"
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter the new title here..."
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="cursor-pointer">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            className="cursor-pointer"
            onClick={handleSubmit}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
