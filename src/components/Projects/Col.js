import React from "react";

const Col = ({ isOver, children }) => {
    const bgClassName = isOver ? "bg-pink-200" : "";

    return (
        <div
            className={`flex h-[100vh] px-2 flex-col pb-2 overflow-auto ${bgClassName} rounded-md`}
        >
            {children}
        </div>
    );
};

export default Col;
