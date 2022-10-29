import SegmentSwitcher from "./SegmentSwitcher";
import '../../style/components/FrameDataSubHeader.scss'
import { IonCol, IonGrid, IonRow } from "@ionic/react";
import CharacterPortrait from "./CharacterPortrait";
import { useEffect, useState } from "react";
import { GameName, PlayerData } from "../types";
import { useDispatch, useSelector } from "react-redux";
import { setModalVisibility } from "../actions";
import { dataDisplaySettingsSelector, frameDataSelector, gameDetailsSelector } from "../selectors";

type FrameDataSubHeaderProps = {
  charName: PlayerData["name"],
  charStats: PlayerData["stats"],
  activeGame: GameName
}

const FrameDataSubHeader = ({ charName, charStats, activeGame }: FrameDataSubHeaderProps) => {
	
	const [statCategory, setStatCategory] = useState("The Basics");

	const dispatch = useDispatch();
	

	const frameData = useSelector(frameDataSelector);
	const gameDetails = useSelector(gameDetailsSelector);
	const dataDisplaySettings = useSelector(dataDisplaySettingsSelector);
	const moveNotation = 
		dataDisplaySettings.moveNameType === "common"
			? "cmnName"
		: dataDisplaySettings.inputNotationType

	const labelObj = {}
	Object.keys(gameDetails.statsPoints).map(keyName => labelObj[keyName] = keyName)

	useEffect(() => {
		setStatCategory("The Basics");
	},[activeGame])

	return (
		<IonGrid id="frameDataSubHeader">
			<IonRow>
				<IonCol className ="character-portrait-container" size="1.6">
					<CharacterPortrait charName={charName} game={activeGame} charColor={charStats.color as string} showName={false}
						onClick={() => dispatch(setModalVisibility({ currentModal: "characterSelect", visible: true })) }
					/>
				</IonCol>
				<IonCol className="character-bio">
					<h1>{charStats.longName ? charStats.longName : charName}</h1>
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
				{gameDetails.statsPoints[statCategory] && 
					gameDetails.statsPoints[statCategory].map(dataRowObj =>
						Object.keys(dataRowObj).map(statKey =>
							charStats[statKey] && charStats[statKey] !== "~" &&
							<IonCol key={`stat-entry-${statKey}`} className="stat-entry">
								<h2>
									{
										statKey === "bestReversal" && frameData[charName] && frameData[charName].moves.normal[charStats[statKey]]
											? frameData[charName].moves.normal[charStats[statKey]][moveNotation]								
											: charStats[statKey]
									}
								</h2>
								<p>{dataRowObj[statKey]}</p>
							</IonCol>
						)
					)
				}
			</IonRow>
		</IonGrid>
	)
}

export default FrameDataSubHeader;