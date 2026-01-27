import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

import { getItemPadding } from "./constants";
import { Doc } from "../../../../../../convex/_generated/dataModel";

// 备用方案：使用 DropdownMenu 模拟右键菜单
export const TreeItemWrapper = ({
  item,
  children,
  level,
  isActive,
  onClick,
  onDoubleClick,
  onRename,
  onDelete,
  onCreateFile,
  onCreateFolder,
}: {
  item: Doc<"files">;
  children: React.ReactNode;
  level: number;
  isActive?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
  onRename?: () => void;
  onDelete?: () => void;
  onCreateFile?: () => void;
  onCreateFolder?: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <div 
          style={{ 
            position: "fixed",
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: 0,
            height: 0,
            pointerEvents: "none"
          }} 
        />
      </DropdownMenuTrigger>
      <button
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onContextMenu={(e) => {
          e.preventDefault();
          console.log("Right click detected on:", item.name);
          setPosition({ x: e.clientX, y: e.clientY });
          setOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onRename?.();
          }
        }}
        className={cn(
          "group flex items-center gap-1 w-full h-5.5 hover:bg-accent/30 outline-none focus:ring-1 focus:ring-inset focus:ring-ring",
          isActive && "bg-accent/30",
        )}
        style={{ paddingLeft: getItemPadding(level, item.type === "file") }}
      >
        {children}
      </button>
      <DropdownMenuContent
        className="w-64"
        align="start"
        side="right"
      >
        {item.type === "folder" && (
          <>
            <DropdownMenuItem 
              onSelect={() => {
                onCreateFile?.();
              }}
            >
              New File...
            </DropdownMenuItem>
            <DropdownMenuItem 
              onSelect={() => {
                onCreateFolder?.();
              }}
            >
              New Folder...
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
         <DropdownMenuItem 
          onSelect={() => {
            onRename?.();
          }}
        >
          Rename...
          <DropdownMenuShortcut>
            Enter
          </DropdownMenuShortcut>
        </DropdownMenuItem>
         <DropdownMenuItem 
          onSelect={() => {
            onDelete?.();
          }}
        >
          Delete Permanently
          <DropdownMenuShortcut>
            ⌘Backspace
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
