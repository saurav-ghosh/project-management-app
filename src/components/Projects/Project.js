import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useSelector } from "react-redux";
import deleteIcon from "../../assets/images/delete.png";
import { useDeleteProjectMutation } from "../../features/project/projectApi";
import { successMsg } from "../../utils/notifications";

const Project = ({ project, refetch, status, item, moveItem, index }) => {
    const { user: loggedInUser } = useSelector((state) => state.auth) || {};
    const { searchText } = useSelector((state) => state.filter) || {};
    const { projectTitle, assignedTeam, createdAt, owner, id } = project || {};
    const { teamTitle } = assignedTeam || {};
    const { avatar, email: projectCreator } = owner || {};
    const [color, setColor] = useState("");
    const [showDeleteIcon, setShowDeleteIcon] = useState(false);
    const [
        deleteProject,
        {
            isLoading: isDeleteLoading,
            isError: isDeleteError,
            isSuccess: isDeleteSuccess,
        },
    ] = useDeleteProjectMutation();

    //search filter result
    const highlightProject =
        searchText?.length > 0 &&
        searchText !== " " &&
        project?.projectTitle?.toLowerCase()?.includes(searchText);

    useEffect(() => {
        if (isDeleteError) {
            successMsg("There was an error deleting this project. 🙁");
        }
        if (!isDeleteError && isDeleteSuccess) {
            refetch();
            successMsg("Project deleted successfully. 🙂");
        }
    }, [isDeleteError, isDeleteSuccess, refetch]);

    useEffect(() => {
        if (loggedInUser?.id && projectCreator) {
            setShowDeleteIcon(
                loggedInUser.email === projectCreator && status === "backlog"
            );
        }
    }, [loggedInUser, projectCreator, status]);

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

    const handleDeleteProject = (id) => {
        if (window.confirm("Are you sure to delete this project?")) {
            deleteProject(id);
        }
    };

    //dnd functionality
    const ref = useRef(null);

    const [, drop] = useDrop({
        accept: "ITEM",
        hover(item, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) {
                return;
            }

            const hoveredRect = ref.current.getBoundingClientRect();
            const hoverMiddleY = (hoveredRect.bottom - hoveredRect.top) / 2;
            const mousePosition = monitor.getClientOffset();
            const hoverClientY = mousePosition.y - hoveredRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }

            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }
            moveItem(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: "ITEM",
        item: { item },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref));

    return (
        <div
            ref={ref}
            style={{ opacity: isDragging ? 0 : 1 }}
            className={`${
                highlightProject && "border-2 border-pink-400 animate-pulse"
            }  relative flex flex-col items-start p-4 mt-3 bg-white rounded-lg bg-opacity-90 group hover:bg-opacity-100 cursor-pointer`}
            draggable
        >
            {showDeleteIcon && (
                <button
                    disabled={isDeleteLoading}
                    onClick={() => handleDeleteProject(id)}
                    className="absolute top-0 right-0 flex items-center justify-center hidden w-5 h-5 mt-3 mr-2 group-hover:flex"
                >
                    <img
                        className="w-4 object-cover"
                        src={deleteIcon}
                        alt="delete icon"
                    />
                </button>
            )}
            <span
                className={`flex items-center h-6 px-3 text-xs font-semibold ${color} rounded-full`}
            >
                {teamTitle}
            </span>
            <h4 className="mt-3 text-sm font-medium">{projectTitle}</h4>
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
                <div className="w-5 h-5 overflow-hidden rounded-full cursor-pointer">
                    <img src={avatar} alt="avatar" />
                </div>
            </div>
        </div>
    );
};

export default Project;
