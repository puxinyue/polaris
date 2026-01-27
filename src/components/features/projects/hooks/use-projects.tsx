import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../../../convex/_generated/api'
import { Id } from '../../../../../convex/_generated/dataModel'
import { useAuth } from '@clerk/nextjs'


export const useGetProjects = () =>{
   return useQuery(api.projects.get)
}


export const useGetProjectsPartial = (limit: number) =>{
    return useQuery(api.projects.getPartial,{limit})
 }


 export const useGetProjectById = (projectId: Id<'projects'>) =>{
    return useQuery(api.projects.getById,{id:projectId})
 }

 export const useCreateProject = () =>{
   const { userId } = useAuth()
    return useMutation(api.projects.create).withOptimisticUpdate((localStore,args)=>{
        const existingProjects = localStore.getQuery(api.projects.get)
        if(existingProjects!==undefined){
         const now = Date.now()
            const newProject = {
                _id: crypto.randomUUID() as Id<"projects">,
                name:args.name,
                _creationTime:now,
                ownerId: userId as string,
                createdAt:now,
                updatedAt:now
            }
            localStore.setQuery(api.projects.get,{},[
               newProject,...existingProjects
            ])
        }
        
    })
 }


 export const useRenameProject = () =>{
   const { userId } = useAuth()
    return useMutation(api.projects.rename).withOptimisticUpdate((localStore,args)=>{
        const existingProject = localStore.getQuery(
         api.projects.getById,
         {id:args.id}
      )
        if(existingProject!==undefined && existingProject!==null){
           localStore.setQuery(api.projects.getById,{id:args.id},{
            ...existingProject,
            name:args.name,
            updatedAt:Date.now()
         })
        }
        const existingProjects = localStore.getQuery(api.projects.get)
        if(existingProjects!==undefined){
          localStore.setQuery(
            api.projects.get,
            {},
            existingProjects?.map(project=>{
               return project._id===args.id
               ? {...project,name:args.name,updatedAt:Date.now()}
               : project
            })
            
          )
        }
    })
 }