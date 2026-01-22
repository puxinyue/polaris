'use client'
import { Id } from "../../../../../convex/_generated/dataModel";
import Navbar from "./navbar";
import { Allotment } from 'allotment'
import "allotment/dist/style.css";

const MIN_SIDEBAR_WIDTH = 200
const MAX_SIDEBAR_WIDTH = 800
const DEFAULT_CONVERSATION_SIDEBAR_WIDTH = 400
const DEFAULT_MAIN_SIZE = 1000

const ProjectIdLayout = ({
    children,
    projectId
}:{
 children:React.ReactNode,
 projectId: Id<'projects'>
}) => {
    return (
        <div className="flex flex-col h-screen w-full">
            <Navbar projectId={projectId} />
            <div className="flex-1 overflow-hidden">
                <Allotment 
                className="flex-1" 
                  defaultSizes={[
                    DEFAULT_CONVERSATION_SIDEBAR_WIDTH, 
                    DEFAULT_MAIN_SIZE
                  ]}>
                    <Allotment.Pane 
                      snap
                      minSize={MIN_SIDEBAR_WIDTH}
                      maxSize={MAX_SIDEBAR_WIDTH}
                      preferredSize={DEFAULT_CONVERSATION_SIDEBAR_WIDTH}
                    >
                        {/* <ConversationSidebar /> */}
                        dasdasdccccc
                    </Allotment.Pane>
                    <Allotment.Pane preferredSize={DEFAULT_MAIN_SIZE}>
                        {children}
                    </Allotment.Pane>
                </Allotment>
            </div>
            
        </div>
    )
}

export default ProjectIdLayout;