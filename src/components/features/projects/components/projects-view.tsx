"use client"
import { Poppins } from 'next/font/google'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { SparkleIcon } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'
import { Kbd } from '@/components/ui/kbd'
import { colors,animals,uniqueNamesGenerator,adjectives } from 'unique-names-generator'
import ProjectsList from './projects-list'
import { useCreateProject } from '../hooks/use-projects'
import { useEffect, useState } from 'react'
import { ProjectCommandDialog } from './project-command-dialog'

const font = Poppins({
    subsets: ['latin'],
    weight:['400','500','600','700']
})

const ProjectsView = () =>{
const createProject =  useCreateProject()
const [commandDialogOpen, setCommandDialogOpen] = useState(false)

   useEffect(()=>{
      const handleKeyDown = (event: KeyboardEvent) => {
         if(event.metaKey || event.ctrlKey){
            if(event.key === 'k'){
               event.preventDefault()
               setCommandDialogOpen(true)
            }
         }
     }
   document.addEventListener('keydown', handleKeyDown)
   return () => {
    document.removeEventListener('keydown', handleKeyDown)
   }
},[])

   return (
      <div className="min-h-screen bg-sidebar flex flex-col justify-center 
      items-center p-6 md:p-6"
      >
         <div className="w-full max-w-sm mx-auto flex flex-col gap-4 items-center">
             <div className="flex flex-col items-center justify-center w-full gap-4">
                 <div className="flex items-center gap-2 w-full group/logo">
                     <img src="/logo.svg" alt="Polaris" className="size-[32px] md:size-[46px]" />
                     <h1 className={cn(
                        'text-4xl md:text-5xl font-semibold',
                        font.className
                     )}>
                        Polaris
                     </h1>
                     
                 </div>
             </div>
             <div className='flex flex-col w-full gap-4'>
                <div className='grid grid-cols-2 gap-2'>
                   <Button 
                     variant={'outline'}
                     className='h-full items-start justify-start p-4 bg-background border flex flex-col gap-6 rounded-none'
                     onClick={()=>{
                        const ProjectName = uniqueNamesGenerator({
                          dictionaries:[colors,animals,adjectives],
                          separator:'-',
                          length:3
                        })
                        createProject({
                           name: ProjectName
                        })
                     }}
                    >
                      <div className='flex items-center justify-between w-full'>
                       <SparkleIcon className='size-4'/>
                       <Kbd className='bg-accent border'>
                          ⌘J
                       </Kbd>
                      </div>
                      <div>
                        <span className='text-sm'>
                           New
                        </span>
                      </div>
                   </Button>
                   <Button 
                     variant={'outline'}
                     className='h-full items-start justify-start p-4 bg-background border flex flex-col gap-6 rounded-none'
                     onClick={()=>{}}
                    >
                      <div className='flex items-center justify-between w-full'>
                       <FaGithub className='size-4'/>
                       <Kbd className='bg-accent border'>
                          ⌘I
                       </Kbd>
                      </div>
                      <div>
                        <span className='text-sm'>
                           Import
                        </span>
                      </div>
                   </Button>
                </div>
             </div>
             <ProjectsList onViewAll={()=>setCommandDialogOpen(true)}/>
         </div>
          <ProjectCommandDialog 
            open={commandDialogOpen} 
            onOpenChange={setCommandDialogOpen}
            />
      </div>
   )
}

export default ProjectsView