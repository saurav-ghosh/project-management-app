import moment from "moment/moment";
import React, { useEffect, useState } from "react";
import { useDeleteTeamMutation } from "../../features/team/teamApi";
import { errorMsg, successMsg } from "../../utils/notifications";
import EditTeamModal from "./EditTeamModal";

const TeamCard = ({ team, refetch }) => {
    const { teamTitle, description, createdAt, members, id } = team || {};
    const [color, setColor] = useState("");
    const [showDelAndEditBtn, setShowDelAndEditBtn] = useState(false);
    const [editTeamModal, setEditTeamModal] = useState(false);
    const [
        deleteTeam,
        {
            isSuccess: isDeleteSuccess,
            isError: isDeleteError,
            isLoading: isDeleteLoading,
        },
    ] = useDeleteTeamMutation();

    useEffect(() => {
        if (isDeleteError) {
            errorMsg("There was an error deleting this team. 🙁");
        }

        if (!isDeleteError && isDeleteSuccess) {
            refetch();
            successMsg("Team deleted successfully. 🙂");
        }
    }, [isDeleteError, isDeleteSuccess, refetch]);

    useEffect(() => {
        if (teamTitle) {
            switch (teamTitle) {
                case "FE":
                    return setColor("text-pink-500 bg-pink-100");
                case "BE":
                    return setColor("text-violet-500 bg-violet-100");
                case "Design":
                    return setColor("text-yellow-500 bg-yellow-100");
                case "Testing":
                    return setColor("text-green-500 bg-green-100");
                case "Devops":
                    return setColor("text-blue-500 bg-blue-100");
                case "Qa":
                    return setColor("text-orange-500 bg-orange-100");

                default:
                    setColor("text-pink-500 bg-pink-100");
            }
        }
    }, [teamTitle]);

    //edit team modal control
    const controlEditTeamModal = () => {
        setEditTeamModal((prevState) => !prevState);
    };

    // edit team
    const handleEditTeam = () => {
        controlEditTeamModal();
    };

    // delete team
    const handleDeleteTeam = () => {
        if (window.confirm("Are you sure to delete this team ?")) {
            deleteTeam(id);
        }
    };

    return (
        <>
            <div className="relative flex flex-col items-start p-4 mt-3 bg-white rounded-lg bg-opacity-90 group hover:bg-opacity-100">
                <button
                    onClick={() =>
                        setShowDelAndEditBtn((prevState) => !prevState)
                    }
                    className={`absolute top-0 right-0 ${
                        showDelAndEditBtn ? "flex" : "hidden"
                    }  items-center justify-center w-5 h-5 mt-3 mr-2 text-gray-500 rounded hover:bg-gray-200 hover:text-gray-700 group-hover:flex`}
                >
                    <svg
                        className="w-4 h-4 fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                </button>
                <div
                    className={`${
                        showDelAndEditBtn ? "flex" : "hidden"
                    } flex-col absolute right-0 mt-5 mr-6 bg-pink-100 px-2 rounded-md py-2`}
                >
                    <button
                        onClick={handleEditTeam}
                        className="text-sm bg-pink-400 text-white w-[80px] py-[2px] rounded mb-1"
                    >
                        Edit
                    </button>
                    <button
                        disabled={isDeleteLoading}
                        onClick={handleDeleteTeam}
                        className="text-sm bg-pink-400 text-white w-[80px] py-[2px] rounded"
                    >
                        Delete
                    </button>
                </div>
                <span
                    className={`flex items-center h-6 px-3 text-xs font-semibold ${color} rounded-full`}
                >
                    {teamTitle}
                </span>
                <h4 className="mt-3 text-sm font-medium">{description}</h4>
                <div className="flex items-center justify-between w-full mt-3 text-xs font-medium text-gray-400">
                    <div className="flex items-center">
                        <svg
                            className="w-4 h-4 text-gray-300 fill-current"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                clipRule="evenodd"
                                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            />
                        </svg>
                        <span className="ml-1 leading-none">
                            {moment(createdAt).format("MMM DD")}
                        </span>
                    </div>
                    <div className="flex items-center">
                        <span className="material-symbols-outlined">
                            groups
                        </span>
                        <span className="ml-1 leading-none">
                            {members?.length}
                        </span>
                    </div>
                </div>
            </div>
            {id && (
                <EditTeamModal
                    team={team}
                    editTeamModal={editTeamModal}
                    controlEditTeamModal={controlEditTeamModal}
                    refetch={refetch}
                />
            )}
        </>
    );
};

export default TeamCard;
