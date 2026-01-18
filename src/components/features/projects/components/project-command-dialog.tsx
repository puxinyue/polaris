
import { 
    CommandInput, 
    CommandList, 
    CommandEmpty, 
    CommandItem, 
    CommandGroup, 
    CommandDialog,
     } from "@/components/ui/command"
import { useGetProjects } from "../hooks/use-projects"
import { FaGithub } from "react-icons/fa"
import { AlertCircleIcon, GlobeIcon, Loader2Icon } from "lucide-react"
import { Doc } from "../../../../../convex/_generated/dataModel"
import { useRouter } from "next/navigation"

interface ProjectCommandDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const getProjectIcon = (project:Doc<'projects'>) => {
    if(project.importStatus=='completed'){
        return <FaGithub className="size-3.5 text-foreground/60 group-hover:text-foreground transition-colors"/>
    }
    if(project.importStatus=='failed'){
        return <AlertCircleIcon className="size-3.5 text-foreground/60 group-hover:text-foreground transition-colors"/>
    }
    if(project.importStatus=='importing'){
        return <Loader2Icon className="size-3.5 text-muted-foreground animate-spin"/>
    }
    return <GlobeIcon className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors"/>
}

export const ProjectCommandDialog = ({ open, onOpenChange }: ProjectCommandDialogProps) => {
    const projects = useGetProjects()
    const router = useRouter()
    const handleSelect = (projectId: string) => {
        router.push(`/projects/${projectId}`)
        onOpenChange(false)
    }
    return (
        <CommandDialog open={open} onOpenChange={onOpenChange}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Projects">
                    {projects&&projects.map((project) => (
                        <CommandItem 
                          key={project._id} 
                           value={`${project.name}-${project._id}`} 
                           onSelect={() => handleSelect(project._id)}
                         >
                            <div className="flex items-center gap-2">
                                {getProjectIcon(project)}
                                <span className="truncate">{project.name}</span>
                            </div>
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    )
}