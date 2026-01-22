'use client'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Id } from "../../../../../convex/_generated/dataModel"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import { UserButton } from "@clerk/nextjs";
import { useGetProjectById, useRenameProject } from "../hooks/use-projects";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CloudCheck, LoaderIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const font = Poppins({
    subsets: ['latin'],
    weight:['400','500','600','700']
})


const Navbar = ({projectId}:{projectId:Id<'projects'>}) => {
    const project = useGetProjectById(projectId)
    const renameProject = useRenameProject(projectId)
    const [isRenaming,setRenaming] = useState(false)
    const [newName,setNewName] = useState(project?.name??'')

    const handleRenameProject = () => {
        if(!project){
            return
        }
        setNewName(project.name??'')
        setRenaming(true)
    }

    const handleSubmitNewName = () => {
        if(!project){
            return
        }
        setRenaming(false)
        const trimmedName = newName.trim()
        if(trimmedName == project.name || !trimmedName)return
        renameProject({
            id:projectId,
            name:trimmedName
        })
    }

    const handleKeyDown = (e:React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key==='Enter'){
            handleSubmitNewName()
        } else if(e.key==='Escape'){
            setNewName(project?.name??'')
            setRenaming(false)
        }
    }

    return (
        <div className="flex items-center justify-between p-2 bg-sidebar border-b gap-x-2">
            <div className="flex items-center gap-x-2">
                <Breadcrumb>
                    <BreadcrumbList className="gap-0!">
                    <BreadcrumbItem>
                        <BreadcrumbLink 
                         className="flex item-center gap-1.5"
                         asChild
                        >
                            <Button
                              variant="ghost"
                              asChild
                              className="w-fit! p-1.5! h-7!"
                            >
                                <Link href="/">
                                  <Image 
                                   src="/logo.svg" 
                                   alt="Logo" 
                                   width={20} 
                                   height={20} 
                                   />
                                   <span className={cn(
                                        'text-sm font-medium',
                                        font.className
                                    )}>
                                      Polaris
                                   </span>
                                </Link>
                            </Button>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="mr-1 ml-0!" />
                    <BreadcrumbItem>
                      {isRenaming?
                      <input
                      value={newName}
                      type="text"
                      onChange={(e)=>setNewName(e.target.value)}
                      onBlur={handleSubmitNewName}
                      autoFocus
                      onFocus={(e)=>e.currentTarget.select()}
                      onKeyDown={handleKeyDown}
                      className="text-sm bg-transparent text-foreground
                       outline-none focus:ring-1 focus:ring-inset 
                       focus:ring-ring font-medium max-w-40 truncate
                      "
                      />
                      :
                      <BreadcrumbPage>
                        <span className="
                          text-sm cursor-pointer 
                          hover:text-primary font-medium 
                          max-w-40 truncate"
                          onClick={handleRenameProject}
                          >
                          {project?.name??"Loading..."}
                        </span>
                      </BreadcrumbPage>
                      }
                    </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                {
                    project?.importStatus == 'importing'?(
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <LoaderIcon
                                 className="size-4 animate-spin text-muted-foreground"
                                />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Importing...</p>
                            </TooltipContent>
                        </Tooltip>
                    ):(
                      project?.updatedAt&& <Tooltip>
                            <TooltipTrigger asChild>
                                <CloudCheck
                                 className="size-4 text-muted-foreground"
                                />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Saved {formatDistanceToNow(project.updatedAt, {addSuffix:true})}</p>
                            </TooltipContent>
                            </Tooltip>
                    )
                   
                }
            </div>
            <div className="flex items-center gap-x-2">
                <UserButton/>
            </div>
        </div>
    )
}

export default Navbar;