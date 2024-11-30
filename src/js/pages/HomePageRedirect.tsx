import { useSelector } from "react-redux";
import { Redirect } from "react-router";

import { activeGameSelector, selectedCharactersSelector } from "../selectors";

const HomePageRedirect = () => {
  const activeGame = useSelector(activeGameSelector);
  const selectedCharacters = useSelector(selectedCharactersSelector);
  
  return <Redirect to={`/framedata/${activeGame}/${selectedCharacters["playerOne"].name}`} />;
};

export default HomePageRedirect;
