"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { polarProductIds } from "@/lib/constants";
import { PlusCircle } from "lucide-react";

export function UpgradeUser() {
  const upgradeUser = async () => {
    await authClient.checkout({
      products: Object.values(polarProductIds),
    });
  };

  return (
    <Button
      variant={"outline"}
      size={"sm"}
      className="text-accent-foreground ml-2 cursor-pointer"
      onClick={upgradeUser}
    >
      <PlusCircle /> Add Credits
    </Button>
  );
}
