import SegmentSwitcher from "./SegmentSwitcher";
import '../../style/components/FrameDataSubHeader.scss'
import { IonCol, IonGrid, IonRow } from "@ionic/react";
import CharacterPortrait from "./CharacterPortrait";
import { useState } from "react";
import GAME_DETAILS from "../constants/GameDetails";
import { GameName, PlayerData } from "../types";
import { useDispatch } from "react-redux";
import { setModalVisibility } from "../actions";

type FrameDataSubHeaderProps = {
  charName: PlayerData["name"],
  charStats: PlayerData["stats"],
  activeGame: GameName
}

const FrameDataSubHeader = ({ charName, charStats, activeGame }: FrameDataSubHeaderProps) => {
	
	const [statCategory, setStatCategory] = useState("The Basics")
	const dispatch = useDispatch()

	const labelObj = {}
	Object.keys(GAME_DETAILS[activeGame].statsPoints).map(keyName => labelObj[keyName] = keyName)

	return (
		<IonGrid id="frameDataSubHeader">
			<IonRow>
				<IonCol className ="character-portrait-container" size="1.6">
					<CharacterPortrait charName={charName} game={activeGame} charColor={charStats.color as string} showName={false}
						onClick={() => dispatch(setModalVisibility({ currentModal: "characterSelect", visible: true })) }
					/>
				</IonCol>
				<IonCol className="character-bio">
					<h1>{charName}</h1>
					<h2>{charStats.phrase}</h2>
				</IonCol>
			</IonRow>
			<SegmentSwitcher
				key={"Stat Chooser"}
				segmentType={"stat-chooser"}
				valueToTrack={statCategory}
				labels={ labelObj }
				clickFunc={ (eventValue) => setStatCategory(eventValue) }
			/>
			<IonRow className="stat-row">
				{GAME_DETAILS[activeGame].statsPoints[statCategory].map(dataRowObj =>
					Object.keys(dataRowObj).map(statKey => 
						<IonCol key={`stat-entry-${statKey}`} className="stat-entry">
							<h2>{charStats[statKey]}</h2>
							<p>{dataRowObj[statKey]}</p>
						</IonCol>
					)
				)}
			</IonRow>
		</IonGrid>
	)
}

export default FrameDataSubHeader;