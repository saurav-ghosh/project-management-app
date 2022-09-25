import React, { useEffect, useState } from "react";
import { useEditProjectMutation } from "../../features/project/projectApi";
import { errorMsg, successMsg } from "../../utils/notifications";
import Error from "../Ui/Error";
import Col from "./Col";
import Dropwrapper from "./Dropwrapper";
import Project from "./Project";

const AllProjects = ({
    projects,
    isLoading,
    isError,
    refetch,
    status,
    statuses,
    filteredProjects,
}) => {
    const [localProjects, setLocalProjects] = useState([]);
    const [
        updateStatus,
        { isError: isErrorToUpdateStatus, isSuccess: isSuccessToUpdateStatus },
    ] = useEditProjectMutation();

    useEffect(() => {
        setLocalProjects(projects);
    }, [projects]);

    useEffect(() => {
        if (isErrorToUpdateStatus) {
            errorMsg("Unable to update project stage! 🙁");
        }
        if (!isErrorToUpdateStatus && isSuccessToUpdateStatus) {
            successMsg("project stage successfully updated. 🙂");
        }
    }, [isErrorToUpdateStatus, isSuccessToUpdateStatus]);

    const onDrop = ({ item }, monitor, status) => {
        if (item?.status !== status) {
            updateStatus({
                id: item?.id,
                data: {
                    status,
                },
            })
                .unwrap()
                .then((res) => {
                    if (res?.id) {
                        refetch();
                    }
                });
        }
    };

    const moveItem = (dragIndex, hoverIndex) => {
        if (localProjects?.length > 0) {
            const item = localProjects[dragIndex];
            setLocalProjects((prevState) => {
                const newItems = prevState.filter(
                    (i, idx) => idx !== dragIndex
                );
                newItems.splice(hoverIndex, 0, item);
                return [...newItems];
            });
        }
    };

    //decide what to render
    let content = null;
    if (isLoading) content = <div>Loading...</div>;
    if (!isLoading && isError)
        content = <Error message="There was an error ocurred!" />;
    if (!isLoading && !isError && filteredProjects?.length > 0)
        content = filteredProjects?.map((project, idx) => (
            <Project
                item={project}
                index={idx}
                moveItem={moveItem}
                key={project?.id}
                project={project}
                refetch={refetch}
                status={status}
            />
        ));

    return (
        <Dropwrapper onDrop={onDrop} status={status} statuses={statuses}>
            <Col>{content}</Col>
        </Dropwrapper>
    );
};

export default AllProjects;
