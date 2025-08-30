import React from "react";
import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";

export function UpgradeUser() {
  return (
    <Button
      variant={"outline"}
      size={"sm"}
      className="text-accent-foreground ml-2 cursor-pointer"
    >
      <Rocket /> Upgrade
    </Button>
  );
}
