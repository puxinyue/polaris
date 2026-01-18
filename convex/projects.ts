import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { verilyAuth } from "./auth";

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
   const identity =  await verilyAuth(ctx)
    return await ctx.db.insert("projects", {
        name: args.name,
        ownerId: identity.subject,
        updatedAt: Date.now()
    });
  }
});

// 获取部分
export const getPartial = query({
  args: {
    limit:v.number()
  },
  handler: async (ctx,args) => {
    const identity = await verilyAuth(ctx)
    if (!identity) {
      return [];
    }
    // withIndex 只查我自己创建的项目
    return await ctx.db
            .query("projects")
            .withIndex("by_owner", (q) => q.eq("ownerId", identity.subject))
            .order("desc")
            .take(args.limit);
  }
});

export const get = query({
  args: {},
  handler: async (ctx,args) => {
    const identity = await verilyAuth(ctx)
    if (!identity) {
      return [];
    }
    // withIndex 只查我自己创建的项目
    return await ctx.db
            .query("projects")
            .withIndex("by_owner", (q) => q.eq("ownerId", identity.subject))
            .order("desc")
            .collect()
  }
});