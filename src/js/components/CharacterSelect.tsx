import "../../style/components/CharacterSelect.scss";

import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonModal, IonSearchbar, IonTitle, IonToolbar, isPlatform } from "@ionic/react";
import { backspaceOutline, checkmarkSharp, closeOutline, closeSharp, diamondSharp, eyeSharp, searchSharp } from "ionicons/icons";
import { Fragment, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";

import { setModalVisibility, setPlayer, setActiveFrameDataPlayer, setPlayerAttr, setDataTableColumns, setCharacterSelectLayout } from "../actions";
import CharacterPortrait from "./CharacterPortrait";
import SegmentSwitcher from "./SegmentSwitcher";
import { activeGameSelector, activePlayerSelector, appDisplaySettingsSelector, dataTableSettingsSelector, frameDataSelector, gameDetailsSelector, modalVisibilitySelector, modeNameSelector, premiumSelector, selectedCharactersSelector } from "../selectors";
import CharacterEntryDetailed from "./CharacterEntryDetailed";
import { CharacterSelectLayout } from "../types";
import CharacterEntrySimple from "./CharacterEntrySimple";
import { handleNewCharacterLandscapeCols } from "../utils/landscapecols";
import { createSegmentSwitcherObject } from "../utils/segmentSwitcherObject";

const CHARACTER_SELECT_LAYOUTS: {
  name: string,
  key: CharacterSelectLayout,
  premiumLayout?: boolean,
}[] = [
  {
    name: "Large Portraits",
    key: "largePortraits",
  },
  {
    name: "Small Portraits",
    key: "smallPortraits",
  },
  {
    name: "Simple List",
    key: "simpleList",
  },
  {
    name: "Detailed List",
    key: "detailedList",
    premiumLayout: true,
  },
];

const PORTRAITS_GRID_COL_VALUES = {
  smallPortraits: {
    sm: 11,
    md: 12,
    lg: 13,
    xl: 9,
  },
  largePortraits: {
    sm: 7,
    md: 8,
    lg: 9,
    xl: 10,
  },
};

const CharacterSelectModal = () => {
  const history = useHistory();

  const [searchShown, setSearchShown] = useState(false);
  const [searchText, setSearchText] = useState("");
  const searchRef = useRef(null);
  useEffect(() => {
    if (searchShown) {
      searchRef?.current.setFocus();
    }
  }, [searchShown]);

  const [characterHasStates, setCharacterHasStates] = useState(false);

  const [layoutModalVisible, setLayoutModalVisible] = useState(false);
  const [portraitsGridColsSize, setPortraitsGridColsSize] = useState("sm");
  const characterSelectLayout = useSelector(appDisplaySettingsSelector).characterSelectLayout ?? "largePortraits";
  const premiumIsPurchased = useSelector(premiumSelector).lifetimePremiumPurchased;

  const modeName = useSelector(modeNameSelector);
  const frameDataFile = useSelector(frameDataSelector);
  const gameDetails = useSelector(gameDetailsSelector);
  const modalVisibility = useSelector(modalVisibilitySelector);
  const selectedCharacters = useSelector(selectedCharactersSelector);
  const activePlayer = useSelector(activePlayerSelector);
  const activeGame = useSelector(activeGameSelector);
  const dataTableColumns = useSelector(dataTableSettingsSelector).tableColumns;
  const autoSetCharacterSpecificColumnsOn = useSelector(dataTableSettingsSelector).autoSetCharacterSpecificColumnsOn;

  const dispatch = useDispatch();

  const handleModalDismiss = () => {
    modalVisibility.visible && dispatch(setModalVisibility({ currentModal: "characterSelect", visible: false }));
    setSearchShown(false);
  };

  const onCharacterSelect = (playerId, charName) => {
    handleModalDismiss();

    dispatch(setDataTableColumns(handleNewCharacterLandscapeCols(gameDetails, selectedCharacters[playerId].name, charName, autoSetCharacterSpecificColumnsOn, dataTableColumns)));

    dispatch(setPlayer(playerId, charName));

    setSearchText("");

    if (playerId === "playerOne" && (modeName === "framedata" || modeName === "moveslist" || modeName === "combos")) {
      history.replace(`/${modeName}/${activeGame}/${charName}`);
    }
  };

  const ContainerDiv: React.ElementType = characterSelectLayout.includes("Portraits") ? Fragment : IonContent;

  // Show or hide the state changer when the character or game changes
  useEffect(() => {
    setCharacterHasStates(!!gameDetails.specificCharacterStates[selectedCharacters[activePlayer].name]);
  }, [selectedCharacters, gameDetails, activePlayer]);

  // Set the grid col value for portrait layout
  useEffect(() => {
    if (characterSelectLayout.includes("Portraits")) {
      if (Object.keys(frameDataFile).length < 22) {
        setPortraitsGridColsSize("sm");
      } else if (Object.keys(frameDataFile).length < 25) {
        setPortraitsGridColsSize("md");
      } else if (Object.keys(frameDataFile).length < 46) {
        setPortraitsGridColsSize("lg");
      } else {
        setPortraitsGridColsSize("xl");
      }
    }
  }, [characterSelectLayout, frameDataFile]);

  return (
    <IonModal
      id="characterSelect"
      isOpen={modalVisibility.visible && modalVisibility.currentModal === "characterSelect"}
      onDidDismiss={handleModalDismiss}
      className={`${characterSelectLayout.includes("Portraits") ? "portraits" : "list"} ${characterSelectLayout}`}
    >
      
      <IonHeader>
        <IonToolbar>
          <IonSearchbar
            className="hideOnSmallScreen"
            value={searchText}
            onIonInput={e => setSearchText(e.detail.value!)}
            placeholder="Filter Characters"
          />

          {searchShown
            ? <>
              <IonSearchbar
                className="hideOnWideScreen slideOnChange"
                showCancelButton="always"
                cancelButtonIcon={closeOutline}
                clearIcon={backspaceOutline}
                value={searchText}
                onIonInput={e => setSearchText(e.detail.value!)}
                onIonCancel={() => {setSearchText(""); setSearchShown(false);}}
                placeholder="Filter Characters"
                ref={searchRef}
              />
            </>

            : <>
              <IonTitle className="hideOnWideScreen ios-left-align">Character Select</IonTitle>
            </>
          }
          <IonButtons slot="end">
            {!searchShown ? (
              <IonButton onClick={() => setSearchShown(!searchShown)} className="hideOnWideScreen">
                <IonIcon icon={searchSharp} slot="icon-only" />
              </IonButton>
            ) : (<></>)}

            <IonButton onClick={()=> setLayoutModalVisible(true)}>
              <IonIcon slot="icon-only" icon={eyeSharp}></IonIcon>
            </IonButton>
            
            <IonButton onClick={handleModalDismiss}>
              <IonIcon slot="icon-only" icon={closeSharp}></IonIcon>
            </IonButton>
            
          </IonButtons>

        </IonToolbar>
      </IonHeader>
      
      <ContainerDiv>

        <div className={`segments ${!isPlatform("ios") && "md"}`}>
          {modeName !== "calc-frametrapchecker" && modeName !== "calc-frametraplister" && modeName !== "calc-framekillgenerator" &&
          <SegmentSwitcher
            key={"CS ActivePlayer"}
            segmentType={"active-player"}
            valueToTrack={activePlayer}
            labels={ {playerOne: `P1: ${selectedCharacters.playerOne.name}`, playerTwo: `P2: ${selectedCharacters.playerTwo.name}`}}
            clickFunc={ (eventValue) => { dispatch(setDataTableColumns(handleNewCharacterLandscapeCols(gameDetails, selectedCharacters[activePlayer].name, selectedCharacters[eventValue].name, autoSetCharacterSpecificColumnsOn, dataTableColumns))); dispatch(setActiveFrameDataPlayer(eventValue)); } }
          />
          }
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
        {characterSelectLayout.includes("Portraits") ? (
          <div
            id="characterSelectGrid"
            style={{gridTemplateColumns: `repeat(${PORTRAITS_GRID_COL_VALUES[characterSelectLayout.includes("Portraits") ? characterSelectLayout : "largePortraits"][portraitsGridColsSize]}, 1fr [col-start])`}}
          >
            {(gameDetails.characterList as unknown as string[]).filter(charName => charName.toLowerCase().includes(searchText.toLowerCase())).map((charName) => {
              const charData = frameDataFile[charName];
              if (!charData || charData.stats.hideCharacter) {return null;}
          
              return (
                <CharacterPortrait
                  key={`select-portrait-${activeGame}-${charName}`}
                  className={characterSelectLayout}
                  game={activeGame}
                  charName={charName}
                  charThreeLetterCode={charData.stats.threeLetterCode.toUpperCase()}
                  charColor={charData.stats.color}
                  remoteImage={charData.stats.remoteImage}
                  showName={true}
                  onClick={() => onCharacterSelect(activePlayer, charName)}
                />
              );
            }
            )}
            {[...Array(5)].map((_, index) => (
              <div key={`hidden-flex-${index}`} className={`hidden-flex-item ${characterSelectLayout}`}></div>
            ))}
          </div>
        ) : characterSelectLayout === "detailedList" ? (
          <div id="BookmarksModal">
            <IonList>
              {(gameDetails.characterList as unknown as string[]).filter(charName => charName.toLowerCase().includes(searchText.toLowerCase())).map((charName, index) => {
                const charData = frameDataFile[charName];
                if (!charData || charData.stats.hideCharacter) {return null;}
                return (
                  <CharacterEntryDetailed
                    key={`select-detail-${activeGame}-${charName}`}
                    bookmark={{
                      modeName: "framedata",
                      gameName: activeGame,
                      characterName: charName,
                    }}
                    bookmarkIndex={index}
                    disableOnClick={false}
                    onClickHandler={() => {
                      onCharacterSelect(activePlayer, charName);
                    }}
                    removalActive={false}
                  />
                );
              })}
            </IonList>
          </div>
        ) : (
          <IonList style={{paddingTop: 0, paddingBottom: 0}}>
            {(gameDetails.characterList as unknown as string[]).filter(charName => charName.toLowerCase().includes(searchText.toLowerCase())).map(charName => {
              const charData = frameDataFile[charName];
              if (!charData || charData.stats.hideCharacter) {return null;}
              return (
                <CharacterEntrySimple
                  key={`select-simple-${activeGame}-${charName}`}
                  charName={charName}
                  gameName={activeGame}
                  charColor={charData.stats.color}
                  onClickHandler={() => onCharacterSelect(activePlayer, charName)}
                />
              );
            })}
          </IonList>
        )}

        <IonModal className="character-select-settings-modal" initialBreakpoint={1} breakpoints={[0, 1]} isOpen={layoutModalVisible} onDidDismiss={() => setLayoutModalVisible(false)}>
          <h2>Character Select Layout</h2>
          <IonList>
            {CHARACTER_SELECT_LAYOUTS.map((optionEntry, index) =>
              <IonItem lines={CHARACTER_SELECT_LAYOUTS.length -1 === index ? "none" : "full"} button key={optionEntry.key} onClick={() => {
                setLayoutModalVisible(false);
                if (!premiumIsPurchased && optionEntry.premiumLayout) {
                  modalVisibility.visible && dispatch(setModalVisibility({ currentModal: "characterSelect", visible: false }));
                  history.push("/settings/premium");
                } else {
                  dispatch(setCharacterSelectLayout(optionEntry.key));
                }
              }}>
                <IonLabel>{optionEntry.name}</IonLabel>
                {characterSelectLayout === optionEntry.key && <IonIcon icon={checkmarkSharp} slot="end"></IonIcon>}
                {!premiumIsPurchased && optionEntry.premiumLayout && <IonIcon icon={diamondSharp} slot="end"></IonIcon>}
              </IonItem>
            )}
          </IonList>
        
        </IonModal>

      </ContainerDiv>
    </IonModal>
  );
};

export default CharacterSelectModal;
