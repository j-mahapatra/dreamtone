import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import { headers } from "next/headers";

export async function CreditLimit() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  const user = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      credits: true,
    },
  });

  return (
    <>
      <p className={cn("font-semibold", user?.credits === 0 && "text-red-500")}>
        {user?.credits}
      </p>
      <p className="text-muted-foreground">Credits Left</p>
    </>
  );
}
