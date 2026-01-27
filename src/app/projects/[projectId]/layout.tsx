import ProjectIdLayout from "@/components/features/projects/components/project-id-layout";
import { Id } from "../../../../convex/_generated/dataModel";

const Layout = async({
     children,
     params
    }:{
    children:React.ReactNode,
    params:Promise<{projectId:Id<"projects">}>
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