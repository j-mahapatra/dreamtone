import { SongListFetcher } from "@/components/create-song/song-list-fetcher";
import { SongPanel } from "@/components/create-song/song-panel";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export default async function CreatePage() {
  return (
    <div className="flex h-full w-full flex-col lg:flex-row">
      <SongPanel />
      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center">
            <Loader2 className="size-8 animate-spin" />
          </div>
        }
      >
        <SongListFetcher />
      </Suspense>
    </div>
  );
}
