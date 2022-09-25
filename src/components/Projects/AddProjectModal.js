import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useAddProjectMutation } from "../../features/project/projectApi";
import { successMsg } from "../../utils/notifications";
import Error from "../Ui/Error";
import Spinner from "../Ui/Spinner";

const AddProjectModal = ({
    addProjectModal,
    controlAddProjectModal,
    teams,
    refetch,
}) => {
    const { user } = useSelector((state) => state.auth);
    const [assignedTeam, setAssignedTeam] = useState(
        "Select a team to assign this project"
    );
    const [projectTitle, setProjectTitle] = useState("");
    const [addProject, { isLoading, isError }] = useAddProjectMutation();

    const handleCreate = (e) => {
        e.preventDefault();

        if (assignedTeam?.length > 0) {
            const selectedTeam = teams?.find(
                (team) => team?.id == assignedTeam.split(" ")[1]
            );

            if (user?.id && selectedTeam?.id) {
                addProject({
                    assignedTeam: selectedTeam,
                    projectTitle,
                    owner: user,
                    createdAt: new Date().getTime(),
                    status: "backlog",
                })
                    .unwrap()
                    .then((res) => {
                        if (res?.id) {
                            controlAddProjectModal();
                            setProjectTitle("");
                            setAssignedTeam(
                                "Select a team to assign this project"
                            );
                            refetch();
                            successMsg("New project created successfully. 🙂");
                        }
                    });
            }
        }
    };

    return (
        addProjectModal && (
            <>
                <div
                    onClick={controlAddProjectModal}
                    className="fixed w-full h-full inset-0 z-10 bg-black/50 cursor-pointer"
                ></div>
                <div className="rounded w-[400px] lg:w-[600px] bg-white p-10 absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create A Project
                    </h2>
                    <form className="mt-8 space-y-6" onSubmit={handleCreate}>
                        <div className="rounded-md shadow-sm space-y-2">
                            <input
                                disabled
                                type="text"
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                                value={`You will be the project owner (${user?.name})`}
                            />
                            <input
                                value={projectTitle}
                                onChange={(e) =>
                                    setProjectTitle(e.target.value)
                                }
                                type="text"
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                                placeholder="Enter project title"
                            />
                            <div className="flex items-center appearance-none relative w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm">
                                <select
                                    required
                                    className="flex-1 outline-none"
                                    value={assignedTeam}
                                    onChange={(e) =>
                                        setAssignedTeam(e.target.value)
                                    }
                                >
                                    <option
                                        value="Select a team to assign this project"
                                        disabled
                                    >
                                        Select a team to assign this project
                                    </option>
                                    {teams?.map((team) => (
                                        <option
                                            key={team?.id}
                                            value={
                                                team?.teamTitle + " " + team?.id
                                            }
                                        >
                                            {team?.teamTitle} - (
                                            {team?.members?.length} Members)
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <button
                                disabled={isLoading}
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {isLoading ? <Spinner /> : "Create"}
                            </button>
                        </div>

                        {isError && (
                            <Error message="There was an error adding new project!" />
                        )}
                    </form>
                </div>
            </>
        )
    );
};

export default AddProjectModal;
