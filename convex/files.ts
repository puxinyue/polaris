import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { verilyAuth } from "./auth";
import { Id } from "./_generated/dataModel";

export const createFile = mutation({
  args: {
    projectId: v.id("projects"),
    parentId: v.optional(v.id("files")),
    name: v.string(),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
   const identity =  await verilyAuth(ctx)
   const project = await ctx.db.get('projects',args.projectId)
   if(!project) {
    throw new Error("Project not found")
   }
   if(project.ownerId !== identity.subject) {
    throw new Error("You are not the owner of this project")
   }
    //判断创建的文件名不能相同
    const files = await ctx.db.query("files")
      .withIndex("by_project_parent", (q) => q.eq("projectId", args.projectId).eq("parentId", args.parentId))
      .collect();
    const existingFile =files.find((file) => file.name === args.name&&file.type === 'file')
    if(existingFile) {
      throw new Error("File name already exists")
    }
    const now = Date.now()

     await ctx.db.insert("files", {
        projectId: args.projectId,
        parentId: args.parentId,
        name: args.name,
        type: 'file',
        content: args.content,
        updatedAt: now
    });
    await ctx.db.patch('projects',args.projectId,{
      updatedAt: now
    })
  }
});


export const createFolder = mutation({
  args: {
    projectId: v.id("projects"),
    parentId: v.optional(v.id("files")),
    name: v.string(),
  },
  handler: async (ctx, args) => {
   const identity =  await verilyAuth(ctx)
   const project = await ctx.db.get('projects',args.projectId)
   if(!project) {
    throw new Error("Project not found")
   }
   if(project.ownerId !== identity.subject) {
    throw new Error("You are not the owner of this project")
   }
    //判断创建的文件名不能相同
    const files = await ctx.db.query("files")
      .withIndex("by_project_parent", (q) => q.eq("projectId", args.projectId).eq("parentId", args.parentId))
      .collect();
    const existingFile =files.find((file) => file.name === args.name&&file.type === 'folder')
    if(existingFile) {
      throw new Error("Folder name already exists")
    }
    const now = Date.now()

   await ctx.db.insert("files", {
        projectId: args.projectId,
        parentId: args.parentId,
        name: args.name,
        type: 'folder',
        updatedAt: now
    });
    await ctx.db.patch('projects',args.projectId,{
      updatedAt: now
    })
  }
});

export const getFiles = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const identity = await verilyAuth(ctx)

    const project = await ctx.db.get('projects',args.projectId)
     if(!project) {
      throw new Error("Project not found")
     }
     if(project.ownerId !== identity.subject) {
      throw new Error("You are not the owner of this project")
     }

    return await ctx.db.query("files")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .order("desc")
      .collect();
  }
});

export const getFile = query({
  args: {
    fileId: v.id("files"),
  },
  handler: async (ctx, args) => {
    const identity = await verilyAuth(ctx)
    const file = await ctx.db.get('files',args.fileId)
    if(!file) {
      throw new Error("File not found")
    }
    const project = await ctx.db.get('projects',file.projectId)
    if(!project) {
      throw new Error("Project not found")
    }
    if(project.ownerId !== identity.subject) {
      throw new Error("You are not the owner of this project")
    }
    return file
  }
});

export const getFolderContent = query({
  args: {
    parentId: v.optional(v.id("files")),
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const identity = await verilyAuth(ctx)
    const project = await ctx.db.get('projects',args.projectId)
    if(!project) {
      throw new Error("Project not found")
    }
    if(project.ownerId !== identity.subject) {
      throw new Error("You are not the owner of this project")
    }
    const files = await ctx.db.query("files")
      .withIndex("by_project_parent", (q) => q.eq("projectId", args.projectId)
      .eq("parentId", args.parentId))
      .collect();
    return files.sort((a, b) => {
      if(a.type === "folder" && b.type !== "folder") {
        return -1;
      }
      if(a.type !== "folder" && b.type === "folder") {
        return 1;
      }
      return a.name.localeCompare(b.name)
    });
  }
}); 


export const  renameFile = mutation({
  args: {
    id: v.id("files"),
    newName: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await verilyAuth(ctx)
    const file = await ctx.db.get('files',args.id)
    if(!file) {
      throw new Error("File not found")
    }
    const project = await ctx.db.get('projects',file.projectId)
    if(!project) {
      throw new Error("Project not found")
    }
    if(project.ownerId !== identity.subject) {
      throw new Error("You are not the owner of this project")
    }
    const siblings = await ctx.db.query("files")
      .withIndex("by_project_parent", (q) => q.eq("projectId", file.projectId).eq("parentId", file.parentId))
      .collect();
    const existingFile =siblings.find((sibling) => 
      sibling.name === args.newName
      &&sibling.type === file.type
      &&sibling._id !== args.id)
    if(existingFile) {
      throw new Error("New file name already exists")
    }
    return await ctx.db.patch(args.id, {
      name: args.newName ,
      updatedAt: Date.now()
    }); 
  }
});


export const deleteFile = mutation({
  args: {
    id: v.id("files"),
  },
  handler: async (ctx, args) => {
    const identity = await verilyAuth(ctx)
    const file = await ctx.db.get('files',args.id)
    if(!file) {
      throw new Error("File not found")
    }
    const project = await ctx.db.get('projects',file.projectId)
    if(!project) {
      throw new Error("Project not found")
    }
    if(project.ownerId !== identity.subject) {
      throw new Error("You are not the owner of this project")
    }
    const deleteRecursive = async (fileId: Id<'files'>) => {
      const file = await ctx.db.get('files',fileId)
      if(!file) {
        return
      }
      if(file.type === 'folder') {
        const children = await ctx.db.query('files')
        .withIndex('by_project_parent', (q) => q.eq('projectId', file.projectId)
        .eq('parentId', fileId))
        .collect()
        for(const child of children) {
          await deleteRecursive(child._id)
        }
      }
      if (file.storageId) {
        await ctx.storage.delete(file.storageId);
      }
      await ctx.db.delete('files',fileId)
    }
    await deleteRecursive(args.id)
    await ctx.db.patch('projects',file.projectId,{
      updatedAt: Date.now()
    })
  }
});


export const updateFile = mutation({
  args: {
    id: v.id("files"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await verilyAuth(ctx);

    const file = await ctx.db.get("files", args.id);

    if (!file) throw new Error("File not found");

    const project = await ctx.db.get("projects", file.projectId);

    if (!project) {
      throw new Error("Project not found");
    }

    if (project.ownerId !== identity.subject) {
      throw new Error("Unauthorized to access this project");
    }

    const now = Date.now();

    await ctx.db.patch("files", args.id, {
      content: args.content,
      updatedAt: now,
    });

    await ctx.db.patch("projects", file.projectId, {
      updatedAt: now,
    });
  },
});