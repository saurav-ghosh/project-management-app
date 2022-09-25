import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import AddProjectModal from "../components/Projects/AddProjectModal";
import AllProjects from "../components/Projects/AllProjects";
import { useGetProjectsQuery } from "../features/project/projectApi";
import { useGetTeamsQuery } from "../features/team/teamApi";

const Projects = () => {
    const { user } = useSelector((state) => state.auth) || {};
    const [addProjectModal, setAddProjectModal] = useState(false);
    const { data: teams } = useGetTeamsQuery(user?.email);
    const {
        data: projects,
        isLoading,
        isError,
        refetch,
    } = useGetProjectsQuery(user?.email);

    // all static statuses
    const statuses = ["backlog", "ready", "doing", "review", "blocked", "done"];

    const controlAddProjectModal = () => {
        setAddProjectModal((prevState) => !prevState);
    };

    return (
        <div className="flex flex-col w-screen h-screen overflow-auto text-gray-700 bg-gradient-to-tr from-blue-200 via-indigo-200 to-pink-200">
            <Navbar searchBox />
            <div className="px-10 mt-6">
                <h1 className="text-2xl font-bold">Project Board</h1>
            </div>

            {/* draggable contents */}
            <DndProvider backend={HTML5Backend}>
                <div className="flex flex-grow px-10 mt-4 space-x-6 overflow-auto">
                    {statuses?.map((status, idx) => {
                        const filteredProjects =
                            projects?.length > 0 &&
                            projects.filter(
                                (project) => project.status === status
                            );

                        return (
                            <div
                                key={idx}
                                className="flex flex-col flex-shrink-0 w-72"
                            >
                                <div className="flex items-center flex-shrink-0 h-10 px-2">
                                    <span className="block text-sm font-semibold">
                                        {status}
                                    </span>
                                    <span className="flex items-center justify-center w-5 h-5 ml-2 text-sm font-semibold text-indigo-500 bg-white rounded bg-opacity-30">
                                        {filteredProjects?.length || 0}
                                    </span>
                                    {status === "backlog" && (
                                        <button
                                            onClick={controlAddProjectModal}
                                            className="flex items-center justify-center w-6 h-6 ml-auto text-indigo-500 rounded hover:bg-indigo-500 hover:text-indigo-100"
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                                ></path>
                                            </svg>
                                        </button>
                                    )}
                                </div>
                                {projects?.length > 0 && (
                                    <AllProjects
                                        projects={projects}
                                        filteredProjects={filteredProjects}
                                        isLoading={isLoading}
                                        isError={isError}
                                        refetch={refetch}
                                        status={status}
                                        statuses={statuses}
                                    />
                                )}
                            </div>
                        );
                    })}
                    <div className="flex-shrink-0 w-6"></div>
                </div>
            </DndProvider>

            {teams?.length > 0 && (
                <AddProjectModal
                    addProjectModal={addProjectModal}
                    controlAddProjectModal={controlAddProjectModal}
                    teams={teams}
                    refetch={refetch}
                />
            )}
        </div>
    );
};

export default Projects;
