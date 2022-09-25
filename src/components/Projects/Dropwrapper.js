import React from "react";
import { useDrop } from "react-dnd";

const Dropwrapper = ({ onDrop, children, status, statuses }) => {
    const [{ isOver }, drop] = useDrop({
        accept: "ITEM",
        canDrop: (item, monitor) => {
            const itemIndex = statuses.findIndex(
                (si) => si.status === item.status
            );
            const statusIndex = statuses.findIndex(
                (si) => si.status === status
            );
            return [itemIndex + 1, itemIndex - 1, itemIndex].includes(
                statusIndex
            );
        },
        drop: (item, monitor) => {
            onDrop(item, monitor, status);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });

    return <div ref={drop}>{React.cloneElement(children, { isOver })}</div>;
};

export default Dropwrapper;
