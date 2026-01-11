"use client";
import { Button } from "@/components/ui/button"
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
const Home = () => {
  const projects = useQuery(api.projects.get) ?? [];
  const createProject = useMutation(api.projects.create);
  const handleCreateProject = () => {
    createProject({ name: "Project 1", ownerId: "123" }).then((res) => {
      console.log(res);
    });
  };
  return (
    <div>
      <h1>Home</h1>
      <Button variant='default' onClick={handleCreateProject}>create project</Button>
      <div>
        {projects?.map((project) => (
          <div key={project?._id}>
            <h2>{project?.name}</h2>
            <p>ownerId: {project?.ownerId}</p>
          </div>
        ))}
      </div>
    </div>
  );
};


export default Home;