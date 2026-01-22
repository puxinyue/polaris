import ProjectIdLayout from "@/components/features/projects/components/project-id-layout";

const Layout = async({
     children,
     params
    }:{
    children:React.ReactNode,
    params:Promise<{projectId:string}>
   }):Promise<React.ReactNode> => {
    const {projectId} = await params;
    return (
        <div>
            <ProjectIdLayout projectId={projectId}>
                {children}
            </ProjectIdLayout>
        </div>
    )
}

export default Layout