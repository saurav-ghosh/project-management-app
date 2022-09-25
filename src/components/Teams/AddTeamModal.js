import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useAddTeamMutation } from "../../features/team/teamApi";
import { successMsg } from "../../utils/notifications";
import Error from "../Ui/Error";
import Spinner from "../Ui/Spinner";

const AddTeamModal = ({ addTeamModal, controlAddTeamModal, refetch }) => {
    const { user } = useSelector((state) => state.auth) || {};

    const [addTeam, { isLoading: isAddTeamLoading, isError: isAddTeamError }] =
        useAddTeamMutation();

    const [teamTitle, setTeamTitle] = useState("Select a team title");
    const [description, setDescription] = useState("");

    //clear AddTeamModal inputs
    const clearAddTeamModal = () => {
        setTeamTitle("");
        setDescription("");
    };

    const handleCreate = (e) => {
        e.preventDefault();

        addTeam({
            teamTitle,
            description,
            members: [user],
            createdAt: new Date().getTime(),
        })
            .unwrap()
            .then((res) => {
                if (res?.id) {
                    clearAddTeamModal();
                    controlAddTeamModal();
                    setTeamTitle("Select a team title");
                    refetch();
                    successMsg("New team created successfully. 🙂");
                }
            });
    };

    return (
        addTeamModal && (
            <>
                <div
                    onClick={controlAddTeamModal}
                    className="fixed w-full h-full inset-0 z-10 bg-black/50 cursor-pointer"
                ></div>
                <div className="rounded w-[400px] lg:w-[600px] space-y-8 bg-white p-10 absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create A Team
                    </h2>
                    <form className="mt-8 space-y-6" onSubmit={handleCreate}>
                        <div className="rounded-md shadow-sm space-y-2">
                            <div className="flex items-center justify-between appearance-none relative w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm">
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
                                    isAddTeamLoading ||
                                    teamTitle === "Select a team title" ||
                                    description?.length === 0
                                }
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {isAddTeamLoading ? <Spinner /> : "Create"}
                            </button>
                        </div>

                        {isAddTeamError && (
                            <Error message="There was an error adding new team!" />
                        )}
                    </form>
                </div>
            </>
        )
    );
};

export default AddTeamModal;
