import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "./db";
import { Polar } from "@polar-sh/sdk";
import {
  polar,
  checkout,
  portal,
  usage,
  webhooks,
} from "@polar-sh/better-auth";
import { env } from "@/env";
import { polarProductIds } from "./constants";
import { revalidatePath } from "next/cache";

const polarClient = new Polar({
  accessToken: env.POLAR_ACCESS_TOKEN,
  server: "sandbox",
});

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  telemetry: { enabled: false },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: polarProductIds.SMALL,
              slug: "small-credit-pack",
            },
            {
              productId: polarProductIds.MEDIUM,
              slug: "medium-credit-pack",
            },
            {
              productId: polarProductIds.LARGE,
              slug: "large-credit-pack",
            },
          ],
          successUrl: "/home",
          authenticatedUsersOnly: true,
        }),
        portal(),
        webhooks({
          secret: env.POLAR_WEBHOOK_SECRET,
          onOrderPaid: async (order) => {
            const externalCustomerId = order.data.customer.externalId;

            if (!externalCustomerId) {
              console.error("No external customer id found");
              throw new Error("No external customer id found");
            }

            const productId = order.data.productId;

            let creditsToAdd = 0;

            if (productId === polarProductIds.SMALL) {
              creditsToAdd = 8;
            } else if (productId === polarProductIds.MEDIUM) {
              creditsToAdd = 20;
            } else if (productId === polarProductIds.LARGE) {
              creditsToAdd = 50;
            }

            await db.user.update({
              where: {
                id: externalCustomerId,
              },
              data: {
                credits: {
                  increment: creditsToAdd,
                },
              },
            });

            revalidatePath("/home");
          },
        }),
      ],
    }),
  ],
});
