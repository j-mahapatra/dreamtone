import { create } from "zustand";

interface PlayerSong {
  id: string;
  title: string | null;
  url: string | null;
  artwork: string | null;
  prompt: string | null;
  createdByUsername: string | null;
}

interface PlayerState {
  song: PlayerSong | null;
  setSong: (song: PlayerSong) => void;
}

export const usePlayerStore = create<PlayerState>((set) => {
  return {
    song: null,
    setSong: (song: PlayerSong) => set({ song }),
  };
});
