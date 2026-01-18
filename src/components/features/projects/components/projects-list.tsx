import { Spinner } from "@/components/ui/spinner"
import { useGetProjectsPartial } from "../hooks/use-projects"
import { formatDistanceToNow } from 'date-fns'
import { Kbd } from "@/components/ui/kbd"
import { Doc } from "../../../../../convex/_generated/dataModel"
import Link from "next/link"
import { AlertCircleIcon, ArrowRightIcon, GlobeIcon, Loader2Icon } from "lucide-react"
import { FaGithub } from "react-icons/fa"
import { Button } from "@/components/ui/button"


interface ProjectsListProps {
    onViewAll:() => void
}
const formatDate = (date: number) => {
    return formatDistanceToNow(new Date(date),{addSuffix:true})
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

const ContinueCard = ({ data }: {data:Doc<'projects'>}) => {
    return (
        <div className="flex flex-col gap-2">
           <span className="text-xs text-muted-foreground">Last Updated</span>
           <Button 
             variant="outline"
             asChild
             className="h-auto items-start justify-start
              p-4 bg-background border rounded-none flex 
              flex-col gap-2"
             >
             <Link href={`/projects/${data._id}`} 
              className="group"
             >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                 {getProjectIcon(data)}
                 <span className="truncate">{data.name}</span>
                </div>
                <ArrowRightIcon className="size-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform"/>
              </div>
              <span className="text-xs text-muted-foreground group-hover:text-foreground/60 transition-colors">
                {formatDate(data.updatedAt)}
              </span>
             </Link>
           </Button>
        </div>
    )
}

const ProjectItem = ({ data }: {data:Doc<'projects'>}) => {
    return (
        <Link href={`/projects/${data._id}`} 
        className="flex py-1 items-center justify-between gap-2 text-sm text-foreground/60 font-medium
        hover:text-foreground transition-colors group w-full"
        >
         <div className="flex items-center gap-2">
            {getProjectIcon(data)}
            <span className="truncate">{data.name}</span>
         </div>
         <span className="text-xs text-muted-foreground group-hover:text-foreground/60 transition-colors">{formatDate(data.updatedAt)}</span>
        </Link>
    )
}

const ProjectsList = ({ onViewAll }: ProjectsListProps) =>{
    const projects  =  useGetProjectsPartial(6)
    if(projects==undefined){
        return <Spinner className="size-4 text-ring"/>
    }
     const [mostrecent,...rest] = projects
   return (
    <div className="flex flex-col w-full gap-4">
        {mostrecent&&<ContinueCard data={mostrecent} />}
        {rest.length>0&&( 
          <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center gap-2">
                    <span className="text-xs text-muted-foreground" >
                        recent project
                    </span>
                    <button 
                      onClick={onViewAll}
                      className="flex items-center gap-2 text-xs text-muted-foreground
                    hover:text-foreground transition-colors">
                        <span>View All</span>
                        <Kbd className="bg-accent border">⌘K</Kbd>
                    </button>
                </div>
                <ul className="flex flex-col">
                    {
                      rest.map((project)=>(
                        <ProjectItem key={project._id} data={project} />
                      ))
                    }
                </ul>
          </div>
        )}
    </div>
   )
}


export default ProjectsList