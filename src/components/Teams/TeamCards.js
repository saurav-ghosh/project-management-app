import Error from "../Ui/Error";
import TeamCard from "./TeamCard";

const TeamCards = ({ teams, isLoading, isError, refetch }) => {
    //decide what to render
    let content = null;
    if (isLoading) content = <div>Loading...</div>;

    if (!isLoading && isError)
        content = <Error message="There was an error ocurred!" />;

    if (!isLoading && !isError && teams.length === 0)
        content = (
            <div className="absolute ml-[40%] mt-10">No teams found !</div>
        );

    if (!isLoading && !isError && teams.length > 0)
        content = teams.map((team) => (
            <TeamCard key={team.id} team={team} refetch={refetch} />
        ));

    return content;
};

export default TeamCards;
