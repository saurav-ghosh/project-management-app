import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
    useEditProjectMutation,
    useGetProjectsQuery,
} from "../../features/project/projectApi";
import { useEditTeamMutation } from "../../features/team/teamApi";
import { useGetUserQuery } from "../../features/user/userApi";
import isValidEmail from "../../utils/isValidEmail";
import { successMsg } from "../../utils/notifications";
import Error from "../Ui/Error";
import Spinner from "../Ui/Spinner";

const EditTeamModal = ({
    editTeamModal,
    controlEditTeamModal,
    team,
    refetch,
}) => {
    const { user } = useSelector((state) => state.auth) || {};
    const {
        teamTitle: defaultTeamTitle,
        description: defaultDescription,
        members,
        id,
    } = team || {};
    const [teamTitle, setTeamTitle] = useState(defaultTeamTitle);
    const [description, setDescription] = useState(defaultDescription);
    const [member, setMember] = useState("");
    const [userChecked, setUserChecked] = useState(false);
    const [isValidEmailFormat, setIsValidEmailFormat] = useState(true);
    const {
        data: getUserData,
        isLoading: isGetUserLoading,
        isError: isGetUserError,
        refetch: getUserDataRefetch,
    } = useGetUserQuery(member, {
        skip: !userChecked,
        refetchOnMountOrArgChange: true,
    });
    const [
        editTeam,
        { isLoading: isEditTeamLoading, isError: isEditTeamError },
    ] = useEditTeamMutation();
    const { data: projects } = useGetProjectsQuery(user?.email);
    const [updateProject] = useEditProjectMutation();
    const [newAddedMembers, setNewAddedMembers] = useState([]);
    const [isNewMemberAlreadyExist, setIsNewMemberAlreadyExist] =
        useState(false);
    const [isUserAlreadyExist, setIsUserAlreadyExist] = useState(false);
    const addMemberInputRef = useRef();

    useEffect(() => {
        if (getUserData?.length > 0) {
            const checkUserExistence = members?.find(
                (member) => member?.email === getUserData[0]?.email
            );

            checkUserExistence?.id
                ? setIsUserAlreadyExist(true)
                : setIsUserAlreadyExist(false);
        }
    }, [members, getUserData]);

    const debouncedSearch = (fn, delay) => {
        let timeOutId;

        return (...args) => {
            clearTimeout(timeOutId);
            timeOutId = setTimeout(() => {
                fn(...args);
            }, delay);
        };
    };

    const doSearch = (value) => {
        if (isValidEmail(value)) {
            setIsValidEmailFormat(true);
            getUserDataRefetch();
            setMember(value);
            setUserChecked(true);
        } else {
            setIsValidEmailFormat(false);
        }
    };

    const handleGetUser = debouncedSearch(doSearch, 500);

    const handleAddMember = (e) => {
        e.preventDefault();

        if (getUserData?.length > 0) {
            const newAddedMemberExistence = newAddedMembers?.find(
                (m) => m.email === getUserData[0].email
            );
            if (newAddedMemberExistence?.id) {
                setIsNewMemberAlreadyExist(true);
            } else {
                setIsNewMemberAlreadyExist(false);
                setNewAddedMembers([...newAddedMembers, ...getUserData]);
                addMemberInputRef.current.value = "";
            }
        }
    };

    //delete new added member in modal
    const handleDeleteNewAddedMember = (id) => {
        const filteredNewAddedMember = newAddedMembers.filter(
            (newMember) => newMember?.id !== id
        );

        setNewAddedMembers(filteredNewAddedMember);
    };

    const handleEdit = (e) => {
        e.preventDefault();

        if (
            description !== defaultDescription ||
            teamTitle !== defaultTeamTitle ||
            newAddedMembers?.length > 0
        ) {
            editTeam({
                id,
                data: {
                    teamTitle,
                    description,
                    members: [...members, ...newAddedMembers],
                },
            })
                .unwrap()
                .then((res) => {
                    if (res?.id) {
                        refetch();
                        successMsg("Team updated successfully. 🙂");
                        controlEditTeamModal();

                        //also update project if applicable
                        const teamInProject = projects?.find(
                            (project) => project?.assignedTeam?.id === id
                        );
                        if (teamInProject?.id) {
                            updateProject({
                                id: teamInProject?.id,
                                data: {
                                    assignedTeam: res,
                                },
                            });
                        }
                    }
                });
        }
        setNewAddedMembers([]);
        setIsNewMemberAlreadyExist(false);
    };

    return (
        editTeamModal && (
            <>
                <div
                    onClick={controlEditTeamModal}
                    className="fixed w-full h-full inset-0 z-10 bg-black/50 cursor-pointer"
                ></div>
                <div className="rounded w-[400px] lg:w-[600px] bg-white p-10 absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
                    <h2 className="mt-6 mb-8 text-center text-3xl font-extrabold text-gray-900">
                        Edit Team
                    </h2>
                    <p className="text-gray-400 text-sm mb-2">
                        Remember when you click on add member it's just add
                        those members in local State. You have to click on save
                        button to save those members in database.
                    </p>
                    <form
                        onSubmit={handleAddMember}
                        className="relative w-full flex gap-1 mb-2"
                    >
                        <input
                            ref={addMemberInputRef}
                            onChange={(e) => handleGetUser(e.target.value)}
                            type="email"
                            className="flex-1 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                            placeholder="Add a member"
                        />
                        <button
                            type="submit"
                            disabled={
                                isUserAlreadyExist ||
                                !member?.length > 0 ||
                                isGetUserLoading ||
                                getUserData?.length === 0 ||
                                (getUserData?.length > 0 &&
                                    getUserData[0]?.email === user?.email)
                            }
                            className=" px-3 py-2 bg-pink-500 text-white rounded-md"
                        >
                            + Add member
                        </button>
                    </form>
                    <div className="flex flex-row flex-wrap gap-2">
                        {newAddedMembers?.map((newMember) => (
                            <span
                                className="bg-gray-200 flex items-center  px-2 py-[2px] rounded-full"
                                key={newMember.id}
                            >
                                {newMember?.email}{" "}
                                <span
                                    onClick={() =>
                                        handleDeleteNewAddedMember(newMember.id)
                                    }
                                    className="ml-2 cursor-pointer material-symbols-outlined"
                                >
                                    close
                                </span>
                            </span>
                        ))}
                    </div>
                    <form className="mt-3 space-y-6" onSubmit={handleEdit}>
                        <div className="rounded-md shadow-sm space-y-2">
                            <div className="flex items-center appearance-none relative w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm">
                                <select
                                    required
                                    className="flex-1 outline-none"
                                    value={teamTitle}
                                    onChange={(e) =>
                                        setTeamTitle(e.target.value)
                                    }
                                >
                                    <option
                                        value="Select a team title"
                                        disabled
                                    >
                                        Select a team title
                                    </option>
                                    <option value="FE">FE</option>
                                    <option value="BE">BE</option>
                                    <option value="Design">Design</option>
                                    <option value="Testing">Testing</option>
                                    <option value="Devops">Devops</option>
                                    <option value="Qa">Qa</option>
                                </select>
                            </div>
                            <input
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                type="text"
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                                placeholder="Enter Description"
                            />
                        </div>

                        <div>
                            <button
                                disabled={
                                    isEditTeamLoading ||
                                    getUserData?.length === 0 ||
                                    (getUserData?.length > 0 &&
                                        getUserData[0]?.email === user?.email)
                                }
                                type="submit"
                                className="group mb-5 relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {isEditTeamLoading ? <Spinner /> : "Save"}
                            </button>
                        </div>
                    </form>

                    {isGetUserError && (
                        <Error message="There was an error getting user!" />
                    )}
                    {getUserData?.length > 0 &&
                        addMemberInputRef?.current !== null &&
                        isUserAlreadyExist &&
                        isValidEmailFormat && (
                            <Error message="This user is already in the team !" />
                        )}
                    {isEditTeamError && (
                        <Error message="There was an error editing team!" />
                    )}
                    {member?.length > 0 &&
                        getUserData?.length === 0 &&
                        isValidEmailFormat && (
                            <Error message="This user doesn't exist !" />
                        )}
                    {!isValidEmailFormat && (
                        <Error message="Invalid email format !" />
                    )}
                    {!isUserAlreadyExist &&
                        isNewMemberAlreadyExist &&
                        isValidEmailFormat && (
                            <Error message="This member already added in local state, please add another member !" />
                        )}
                </div>
            </>
        )
    );
};

export default EditTeamModal;
