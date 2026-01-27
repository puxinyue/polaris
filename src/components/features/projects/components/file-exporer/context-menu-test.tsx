"use client";

import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export const ContextMenuTest = () => {
  return (
    <div className="p-4">
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="border p-4 rounded">
            Right click me!
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onSelect={() => alert("Item 1 clicked")}>
            Item 1
          </ContextMenuItem>
          <ContextMenuItem onSelect={() => alert("Item 2 clicked")}>
            Item 2
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
};
