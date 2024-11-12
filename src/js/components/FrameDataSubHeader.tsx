import SegmentSwitcher from "./SegmentSwitcher";
import '../../style/components/FrameDataSubHeader.scss'
import { IonCol, IonGrid, IonIcon, IonRow } from "@ionic/react";
import CharacterPortrait from "./CharacterPortrait";
import { useEffect, useState } from "react";
import { GameName, PlayerData } from "../types";
import { useDispatch, useSelector } from "react-redux";
import { setActiveFrameDataPlayer, setDataTableColumns, setModalVisibility, setPlayerAttr } from "../actions";
import { activePlayerSelector, dataDisplaySettingsSelector, dataTableSettingsSelector, frameDataSelector, gameDetailsSelector, selectedCharactersSelector } from "../selectors";
import { useHistory } from "react-router";
import { swapHorizontal } from "ionicons/icons";
import { handleNewCharacterLandscapeCols } from "../utils/landscapecols";
import { createSegmentSwitcherObject } from "../utils/segmentSwitcherObject";

type FrameDataSubHeaderProps = {
  charName: PlayerData["name"],
	characterHasStates: boolean,
  opponentName: PlayerData["name"],
  charStats: PlayerData["stats"],
  activeGame: GameName
}

const FrameDataSubHeader = ({ charName, characterHasStates, opponentName, charStats, activeGame }: FrameDataSubHeaderProps) => {
	
	const [statCategory, setStatCategory] = useState("The Basics");

	const dispatch = useDispatch();
	let history = useHistory();
	

	const frameData = useSelector(frameDataSelector);
	const gameDetails = useSelector(gameDetailsSelector);
	const dataDisplaySettings = useSelector(dataDisplaySettingsSelector);
	const selectedCharacters = useSelector(selectedCharactersSelector);
	const activePlayer = useSelector(activePlayerSelector);
	const dataTableColumns = useSelector(dataTableSettingsSelector).tableColumns;
  const autoSetCharacterSpecificColumnsOn = useSelector(dataTableSettingsSelector).autoSetCharacterSpecificColumnsOn;
	const moveNotation = 
		dataDisplaySettings.moveNameType === "official"
			? "moveName"
		: dataDisplaySettings.moveNameType === "common"
			? "cmnName"
		: dataDisplaySettings.inputNotationType

	const labelObj = {}
	Object.keys(gameDetails.statsPoints).map(keyName => labelObj[keyName] = keyName)

	useEffect(() => {
		setStatCategory("The Basics");
	},[activeGame])

	const handleMoveSelection = (officialMoveName) => {
		const moveToDispatch =
			frameData[charName].moves.normal[officialMoveName][moveNotation]
				? frameData[charName].moves.normal[officialMoveName][moveNotation]
				: frameData[charName].moves.normal[officialMoveName].moveName
		dispatch(setPlayerAttr(activePlayer, selectedCharacters[activePlayer].name, {selectedMove: moveToDispatch}));
		history.push(`/framedata/movedetail/${activeGame}/${selectedCharacters[activePlayer].name}/${selectedCharacters[activePlayer].vtState}/${officialMoveName}`)

	}

	return (
		<IonGrid id="frameDataSubHeader">
			<IonRow>
				<IonCol className="character-portrait-container" size="1.6">
					<CharacterPortrait charName={charName} game={activeGame} charColor={charStats.color as string} remoteImage={charStats.remoteImage as unknown as Boolean} showName={false}
						onClick={() => dispatch(setModalVisibility({ currentModal: "characterSelect", visible: true })) }
					/>
				</IonCol>
				<IonCol className="character-bio">
					<div>{charStats.longName ? charStats.longName : charName} <span>{charStats.phrase}</span></div>
					<div className="bio-options">
						<div className="bio-switcher" onClick={() => {
							dispatch(setDataTableColumns(handleNewCharacterLandscapeCols(gameDetails, selectedCharacters[activePlayer].name, opponentName, autoSetCharacterSpecificColumnsOn, dataTableColumns)));
							dispatch(setActiveFrameDataPlayer(activePlayer === "playerOne" ? "playerTwo" : "playerOne"));
						}}>
							<IonIcon icon={swapHorizontal}></IonIcon>
							<div className="character-portrait-container">
								<CharacterPortrait charName={opponentName} game={activeGame} charColor={charStats.color as string} remoteImage={charStats.remoteImage as unknown as Boolean} showName={false} />
							</div>
						</div>
						<div className="state-changer">
						{activeGame === "SFV" ?
            <SegmentSwitcher
              segmentType={"vtrigger"}
              valueToTrack={selectedCharacters[activePlayer].vtState}
              labels={ {normal: "Normal", vtOne: "V-Trigger I" , vtTwo: "V-Trigger II"} }
              clickFunc={ (eventValue) => dispatch(setPlayerAttr(activePlayer, selectedCharacters[activePlayer].name, {vtState: eventValue})) }
            />
          : (activeGame === "GGST" || activeGame === "SF6") &&
            <SegmentSwitcher
              passedClassNames={!characterHasStates ? "collapsed" : "expanded"}
              segmentType={"vtrigger"}
              valueToTrack={selectedCharacters[activePlayer].vtState}
              labels={createSegmentSwitcherObject(gameDetails.specificCharacterStates[selectedCharacters[activePlayer].name])}
              clickFunc={ (eventValue) => dispatch(setPlayerAttr(activePlayer, selectedCharacters[activePlayer].name, {vtState: eventValue})) }
            />
          }
						</div>
					</div>
					
					
				</IonCol>
			</IonRow>
			<SegmentSwitcher
				key={"Stat Chooser"}
				segmentType={"stat-chooser"}
				valueToTrack={statCategory}
				labels={ labelObj }
				hashtag={
					selectedCharacters[activePlayer].stats.hashtag ?
						selectedCharacters[activePlayer].stats.hashtag as string
					: "false"
				}
				clickFunc={ (eventValue) => setStatCategory(eventValue) }
			/>
			<IonRow className="stat-row">
				{gameDetails.statsPoints[statCategory] ? 
					gameDetails.statsPoints[statCategory].map(dataRowObj =>
						Object.keys(dataRowObj).map(statKey =>
							charStats[statKey] && charStats[statKey] !== "~" &&
								<IonCol key={`stat-entry-${statKey}`} className="stat-entry" style={statKey === "bestReversal" || statKey === "fastestNormal" ? { cursor: "pointer" } : {}}
									onClick={() => {
										if (statKey === "bestReversal") {
											handleMoveSelection(charStats[statKey])

										} else if (statKey === "fastestNormal") {
											const fastestNormalName = Object.keys(frameData[charName].moves.normal).find(moveEntry =>
												frameData[charName].moves.normal[moveEntry].moveType === "normal" &&
												!frameData[charName].moves.normal[moveEntry].airmove &&
												frameData[charName].moves.normal[moveEntry].startup === Number(charStats[statKey][0])
											)
											handleMoveSelection(fastestNormalName)
										}
									}}
								>
								<h2>
									{
										statKey === "bestReversal" && frameData[charName] && frameData[charName].moves.normal[charStats[statKey]]
											? frameData[charName].moves.normal[charStats[statKey]][moveNotation] || frameData[charName].moves.normal[charStats[statKey]].moveName
											: charStats[statKey]
									}
								</h2>
								<p>{dataRowObj[statKey]}</p>
							</IonCol>
						)
					)
				: <IonCol key={`stat-entry-hashtag`} className="stat-entry">
						<h2>Did you get that sick Twitter tech??</h2>
						<p style={{margin: "2px 0 -2px"}}>The sickest twitter tech is <a target="_blank" rel="noreferrer" href="https://twitter.com/D4RK_ONION" style={{color: "inherit"}}>following me</a>... #shameless</p>
					</IonCol>
				}
			</IonRow>
		</IonGrid>
	)
}

export default FrameDataSubHeader;