import { IonContent, IonPage, IonItem, IonLabel, IonIcon, IonFab, IonFabButton, IonList, IonSelect, IonSelectOption, IonListHeader, IonItemDivider, IonItemGroup, IonGrid } from '@ionic/react';
import React, { useState, useMemo, useEffect } from 'react';
import PageHeader from '../../components/PageHeader';
import '../../../style/pages/Calculators.scss';
import '../../../style/pages/FrameKillGenerator.scss';
import '../../../style/components/FAB.scss'
import { setActiveFrameDataPlayer, setPlayerAttr, setModalVisibility } from '../../actions';
import { connect } from 'react-redux';
import { person } from 'ionicons/icons';
import SegmentSwitcher from '../../components/SegmentSwitcher';


const FrameKillGenerator = ({ activePlayer, selectedCharacters, modalVisibility, activeGame, setModalVisibility, setPlayerAttr, setActiveFrameDataPlayer	}) => {
  const [recoveryType, setRecoveryType] = useState("kdr");
  const [knockdownMove, setKnockdownMove] = useState(null);
  const [lateByFrames, setLateByFrames] = useState(0);
  const [specificSetupMove, setSpecificSetupMove] = useState("anything");
  const [targetMeaty, setTargetMeaty] = useState(null);

  const [okiResults, setOkiResults] = useState({});

  const playerOneMoves = selectedCharacters["playerOne"].frameData;

  useEffect(() => {
    if (playerOneMoves[knockdownMove] && !(playerOneMoves[knockdownMove].kd || playerOneMoves[knockdownMove].kdr || playerOneMoves[knockdownMove].kdrb)) {
      setKnockdownMove(null);
    }
    if (!playerOneMoves[specificSetupMove] || specificSetupMove !== "Forward Dash") {
      setSpecificSetupMove("anything");
    }
    if (!playerOneMoves[targetMeaty]) {
      setTargetMeaty(null);
    }
  },[selectedCharacters]);

  useMemo(() => {
    if (typeof knockdownMove === "string" && typeof targetMeaty === "string" && typeof playerOneMoves[knockdownMove] !== "undefined" && typeof playerOneMoves[targetMeaty] !== "undefined") {

      // https://stackoverflow.com/questions/12487422/take-a-value-1-31-and-convert-it-to-ordinal-date-w-javascript
      // This allows us to quickly create ordinal strings using active frame numbers
      function getOrdinal(n) {
        var s=["th","st","nd","rd"],
        v=n%100;
        return n+(s[(v-20)%10]||s[v]||s[0]);
      }

      // set up the processed data container
      let processedResults = {"Natural Setups": {}, "One Move Setups": {}, "Two Move Setups": {}, "Three Move Setups": {}};

      // Set up the number of frames the opponent is knocked down for. We add plus 1 because that is the frame the opponent is vunerable again
      let knockdownFrames;
      let coverBothKDs;
      if (recoveryType === "both") {
        knockdownFrames = playerOneMoves[knockdownMove]["kdr"] + 1;
        coverBothKDs = true;
      } else {
        knockdownFrames = playerOneMoves[knockdownMove][recoveryType] + 1;
      }

      if (playerOneMoves[targetMeaty]["attackLevel"] === "T" ) {
        knockdownFrames +=2;
      }

      // Put the character's forward dash into the data model as a possible setup move. We will remove this at the end
      playerOneMoves["Forward Dash"] = {
        "startup": 1,
        "active": 0,
        "recovery": parseInt(selectedCharacters.playerOne.stats.fDash)
      }

      // If a specific move is required in the setup, make that the only option in firstokimove
      let firstOkiMoveModel;
      if (specificSetupMove === "anything" || typeof specificSetupMove === "undefined") {
        firstOkiMoveModel = {...playerOneMoves};
      } else {
        // WARNING
        // firstOkiMoveModel[specificSetupMove] = moveObj;
        firstOkiMoveModel = {[specificSetupMove]: playerOneMoves[specificSetupMove]}
      }

      let ordinalName;
      const moveSetLoop = (currentLateByFramesSearch) => {
        if (currentLateByFramesSearch === 1) {
          ordinalName = "1st (" + currentLateByFramesSearch + " frame late)"
        } else if (currentLateByFramesSearch > 1) {
          ordinalName = "1st (" + currentLateByFramesSearch + " frames late)"
        } else {
          ordinalName = getOrdinal(currentActiveFrame);
        }

        // Before we begin the loop, we check for natural meaties
        if (0 === (knockdownFrames - targetMeatyFrames + currentLateByFramesSearch)) {

          // If this is the first setup for this particular active frame, create an array for it
          if (typeof processedResults["Natural Setups"][ordinalName] === "undefined") {
            processedResults["Natural Setups"][ordinalName] = [];
          }
          processedResults["Natural Setups"][ordinalName].push('>');
        }

        // loop through the entire move set
        for (var firstOkiMove in firstOkiMoveModel) {
          // First we check if a move is a viable setup move (has fixed startup/active/recovery; takes place on the ground etc.)
          if (((typeof firstOkiMoveModel[firstOkiMove]["startup"] === "number" && typeof firstOkiMoveModel[firstOkiMove]["active"] === "number") || firstOkiMoveModel[firstOkiMove]["multiActive"]) && typeof firstOkiMoveModel[firstOkiMove]["recovery"] === "number" && firstOkiMoveModel[firstOkiMove]["followUp"] !== true && firstOkiMoveModel[firstOkiMove]["moveType"] !== "alpha" && firstOkiMoveModel[firstOkiMove]["moveType"] !== "super" && !firstOkiMoveModel[firstOkiMove]["airmove"]) {

            let firstOkiMoveTotalFrames
            // If a move has multiActive, we take the last element (last active frame) and add it to recovery to calculate total frames.
            // Otherwise, we just add startup active and recovery
            if (firstOkiMoveModel[firstOkiMove]["multiActive"]) {
              firstOkiMoveTotalFrames = firstOkiMoveModel[firstOkiMove]["multiActive"][(firstOkiMoveModel[firstOkiMove]["multiActive"].length -1)]  + firstOkiMoveModel[firstOkiMove]["recovery"];

            } else {
              firstOkiMoveTotalFrames = (firstOkiMoveModel[firstOkiMove]["startup"] -1) + firstOkiMoveModel[firstOkiMove]["active"] + firstOkiMoveModel[firstOkiMove]["recovery"];
            }


            // Then we check if the setup move would allow our target meaty to perfectly overlap with the knockdown.
            // Remember we're looping for each active frame the meaty has
            if (firstOkiMoveTotalFrames === (knockdownFrames - targetMeatyFrames + currentLateByFramesSearch)) {

              // If this is the first setup for this particular active frame, create an array for it
              if (typeof processedResults["One Move Setups"][ordinalName] === "undefined") {
                processedResults["One Move Setups"][ordinalName] = [];
              }
              processedResults["One Move Setups"][ordinalName].push(firstOkiMove);
            }

            // Pretty much the same as oki loop one
            for (var secondOkiMove in playerOneMoves) {

              if (((typeof playerOneMoves[secondOkiMove]["startup"] === "number" && typeof playerOneMoves[secondOkiMove]["active"] === "number") || playerOneMoves[secondOkiMove]["multiActive"]) && typeof playerOneMoves[secondOkiMove]["recovery"] === "number" && playerOneMoves[secondOkiMove]["followUp"] !== true && playerOneMoves[secondOkiMove]["moveType"] !== "alpha" && playerOneMoves[secondOkiMove]["moveType"] !== "super" && !playerOneMoves[secondOkiMove]["airmove"]) {

                let secondOkiMoveTotalFrames;
                if (playerOneMoves[secondOkiMove]["multiActive"]) {
                  secondOkiMoveTotalFrames = playerOneMoves[secondOkiMove]["multiActive"][(playerOneMoves[secondOkiMove]["multiActive"].length -1)]  + playerOneMoves[secondOkiMove]["recovery"];
                } else {
                  secondOkiMoveTotalFrames = (playerOneMoves[secondOkiMove]["startup"] -1) + playerOneMoves[secondOkiMove]["active"] + playerOneMoves[secondOkiMove]["recovery"];
                }

                if ((firstOkiMoveTotalFrames + secondOkiMoveTotalFrames) === (knockdownFrames - targetMeatyFrames + currentLateByFramesSearch)) {

                  var skipDupe2 = false;
                  // here we check if we have a duplicate match. For instance, [st. lp, st.mp] would provide the same setup as [st.mp, st.lp] so we use this to ignore it
                  for (var previousSetup in processedResults["Two Move Setups"][ordinalName]) {
                    if ((processedResults["Two Move Setups"][ordinalName][previousSetup].indexOf(firstOkiMove) > -1 && processedResults["Two Move Setups"][ordinalName][previousSetup].indexOf(secondOkiMove) > -1)) {
                      if (firstOkiMove !== "Forward Dash" || secondOkiMove !== "Forward Dash") {
                        skipDupe2 = true;
                      }
                    }
                  }
                  if (!skipDupe2) {
                    if (typeof processedResults["Two Move Setups"][ordinalName] === "undefined") {
                      processedResults["Two Move Setups"][ordinalName] = [];
                    }
                    processedResults["Two Move Setups"][ordinalName].push(firstOkiMove + ", " + secondOkiMove);
                  }

                }

                // Exactly the same as loop 2
                for (var thirdOkiMove in playerOneMoves) {
                  if (((typeof playerOneMoves[thirdOkiMove]["startup"] === "number" && typeof playerOneMoves[thirdOkiMove]["active"] === "number") ||  playerOneMoves[thirdOkiMove]["multiActive"]) && typeof playerOneMoves[thirdOkiMove]["recovery"] === "number" && playerOneMoves[thirdOkiMove]["followUp"] !== true && playerOneMoves[thirdOkiMove]["moveType"] !== "alpha" && playerOneMoves[thirdOkiMove]["moveType"] !== "super" && !playerOneMoves[thirdOkiMove]["airmove"]) {

                    let thirdOkiMoveTotalFrames
                    if (playerOneMoves[thirdOkiMove]["multiActive"]) {
                      thirdOkiMoveTotalFrames = playerOneMoves[thirdOkiMove]["multiActive"][(playerOneMoves[thirdOkiMove]["multiActive"].length -1)]  + playerOneMoves[thirdOkiMove]["recovery"];
                    } else {
                      thirdOkiMoveTotalFrames = (playerOneMoves[thirdOkiMove]["startup"] -1) + playerOneMoves[thirdOkiMove]["active"] + playerOneMoves[thirdOkiMove]["recovery"];
                    }

                    if ((firstOkiMoveTotalFrames + secondOkiMoveTotalFrames +  thirdOkiMoveTotalFrames) === (knockdownFrames - targetMeatyFrames + currentLateByFramesSearch)) {
                      var skipDupe3 = false;
                      for (previousSetup in processedResults["Three Move Setups"][ordinalName]) {
                        if (processedResults["Three Move Setups"][ordinalName][previousSetup].indexOf(firstOkiMove) > -1 && processedResults["Three Move Setups"][ordinalName][previousSetup].indexOf(secondOkiMove) > -1 && processedResults["Three Move Setups"][ordinalName][previousSetup].indexOf(thirdOkiMove) > -1) {
                          if (firstOkiMove !== "Forward Dash" || secondOkiMove !== "Forward Dash"|| secondOkiMove !== "Forward Dash") {
                            skipDupe3 = true;
                          }
                        }
                      }
                      if (!skipDupe3) {
                        if (typeof processedResults["Three Move Setups"][ordinalName] === "undefined") {
                          processedResults["Three Move Setups"][ordinalName] = [];
                        }
                        processedResults["Three Move Setups"][ordinalName].push(firstOkiMove + ", " + secondOkiMove + ", " + thirdOkiMove);
                      }

                    }
                  }
                }
              }

            }

          }

        }
      }

      function pathComparer(kdrResults, kdrbResults) {
        for (var obj1 in kdrResults) {
          for (var ordinal1 in kdrResults[obj1]) {
            for (var setup1 in kdrResults[obj1][ordinal1]) {
              for (var obj2 in kdrbResults) {
                for (var ordinal2 in kdrbResults[obj2]) {
                  for (var setup2 in kdrbResults[obj2][ordinal2]) {
                    if (kdrResults[obj1][ordinal1][setup1] === kdrbResults[obj2][ordinal2][setup2]) {
                      if (typeof processedResults[obj1][ordinal1 + " & " + ordinal2] === "undefined") {
                        processedResults[obj1][ordinal1 + " & " + ordinal2] = [];
                      }
                      processedResults[obj1][ordinal1 + " & " + ordinal2].push(kdrResults[obj1][ordinal1][setup1]);
                    }
                  }
                }
              }
            }
          }
        }
      }

      if (playerOneMoves[targetMeaty]["multiActive"]) {
        var currentActiveFrame = 1;
        let targetMeatyFrames;
        // This first for loop is used to allow for late meaties.
        for (var currentLateByFramesSearch = 0; currentLateByFramesSearch <= lateByFrames; currentLateByFramesSearch++) {
          //First, perfect meaties are checked for
          if (currentLateByFramesSearch === 0) {
            // Begin the for loop. We loop through once for each active frame the targe meaty has)
            for (var frame in playerOneMoves[targetMeaty]["multiActive"]) {

              // multiActive is a direct array of when each active frame occurs. No need for any extra calculation
              targetMeatyFrames = playerOneMoves[targetMeaty]["multiActive"][frame];

              moveSetLoop(currentLateByFramesSearch);

              currentActiveFrame++
            }
          } else {
            // Then we do a late meaty search. Late meaties are only ever going to happen on the first active frame, so
            //we don't need to loop this time
            console.log("loop: " + currentLateByFramesSearch)
            currentActiveFrame = 1;
            targetMeatyFrames = parseInt(playerOneMoves[targetMeaty]["startup"]);
            moveSetLoop(currentLateByFramesSearch)
          }


        }

        if (coverBothKDs) {
          var currentActiveFrame = 1;

          let kdrResults = {...processedResults}
          processedResults = {"Natural Setups": {}, "One Move Setups": {}, "Two Move Setups": {}, "Three Move Setups": {}};

          knockdownFrames = playerOneMoves[knockdownMove]["kdrb"] + 1;
          if (playerOneMoves[targetMeaty]["attackLevel"] === "T" ) {
            knockdownFrames +=2;
          }

          // This first for loop is used to allow for late meaties.
          for (var currentLateByFramesSearch = 0; currentLateByFramesSearch <= lateByFrames; currentLateByFramesSearch++) {
            //First, perfect meaties are checked for
            if (currentLateByFramesSearch === 0) {
              // Begin the for loop. We loop through once for each active frame the targe meaty has)
              for (var frame in playerOneMoves[targetMeaty]["multiActive"]) {

                // multiActive is a direct array of when each active frame occurs. No need for any extra calculation
                targetMeatyFrames = playerOneMoves[targetMeaty]["multiActive"][frame];

                moveSetLoop(currentLateByFramesSearch);

                currentActiveFrame++
              }
            } else {
              // Then we do a late meaty search. Late meaties are only ever going to happen on the first active frame, so
              //we don't need to loop this time
              console.log("loop: " + currentLateByFramesSearch)
              var currentActiveFrame = 1;
              targetMeatyFrames = parseInt(playerOneMoves[targetMeaty]["startup"]);
              moveSetLoop(currentLateByFramesSearch)
            }


          }
          var kdrbResults = {...processedResults};
          processedResults = {"Natural Setups": {}, "One Move Setups": {}, "Two Move Setups": {}, "Three Move Setups": {}};

          pathComparer(kdrResults, kdrbResults);
        }
      } else {
        // This first for loop is used to allow for late meaties.
        for (var currentLateByFramesSearch = 0; currentLateByFramesSearch <= lateByFrames; currentLateByFramesSearch++) {
          //First, perfect meaties are checked for
          if (currentLateByFramesSearch === 0) {
            // Begin the for loop. We loop through once for each active frame the targe meaty has)
            for (var currentActiveFrame = 1; currentActiveFrame <= playerOneMoves[targetMeaty]["active"]; currentActiveFrame++) {

              // We minus one because last frame of startup and first active frame are the same frame
              var targetMeatyFrames = (parseInt(playerOneMoves[targetMeaty]["startup"]) -1) + currentActiveFrame;

              moveSetLoop(currentLateByFramesSearch);

            }
          } else {
            // Then we do a late meaty search. Late meaties are only ever going to happen on the first active frame, so
            //we don't need to loop this time
            var currentActiveFrame = 1;
            var targetMeatyFrames = parseInt(playerOneMoves[targetMeaty]["startup"]);
            moveSetLoop(currentLateByFramesSearch)
          }


        }

        if (coverBothKDs) {
          let kdrResults = {...processedResults}
          processedResults = {"Natural Setups": {}, "One Move Setups": {}, "Two Move Setups": {}, "Three Move Setups": {}};
          knockdownFrames = playerOneMoves[knockdownMove]["kdrb"] + 1;
          if (playerOneMoves[targetMeaty]["attackLevel"] === "T" ) {
            knockdownFrames +=2;
          }

          // This first for loop is used to allow for late meaties.
          for (var currentLateByFramesSearch = 0; currentLateByFramesSearch <= lateByFrames; currentLateByFramesSearch++) {
            //First, perfect meaties are checked for
            if (currentLateByFramesSearch === 0) {
              // Begin the for loop. We loop through once for each active frame the targe meaty has)
              for (var currentActiveFrame = 1; currentActiveFrame <= playerOneMoves[targetMeaty]["active"]; currentActiveFrame++) {

                // We minus one because last frame of startup and first active frame are the same frame
                var targetMeatyFrames = (parseInt(playerOneMoves[targetMeaty]["startup"]) -1) + currentActiveFrame;

                moveSetLoop(currentLateByFramesSearch);

              }
            } else {
              // Then we do a late meaty search. Late meaties are only ever going to happen on the first active frame, so
              //we don't need to loop this time
              console.log("loop: " + currentLateByFramesSearch)
              var currentActiveFrame = 1;
              var targetMeatyFrames = parseInt(playerOneMoves[targetMeaty]["startup"]);
              moveSetLoop(currentLateByFramesSearch)
            }
          }
          kdrbResults = {...processedResults};
          processedResults = {"Natural Setups": {}, "One Move Setups": {}, "Two Move Setups": {}, "Three Move Setups": {}};
          pathComparer(kdrResults, kdrbResults);
        }
      }



      // Remove any empty objects
      for (var obj in processedResults) {
        if (Object.keys(processedResults[obj]).length === 0 && processedResults[obj].constructor === Object) {
          delete processedResults[obj];
        }
      }

      // Remove the character's forward dash from the move model, so it doesn't show up elsewhere
      delete playerOneMoves["Forward Dash"];
      if (Object.keys(processedResults).length !== 0) {
        setOkiResults(processedResults);
      } else {
        setOkiResults(false);
      }

    }
  },[recoveryType, knockdownMove, lateByFrames, specificSetupMove, targetMeaty, playerOneMoves, selectedCharacters.playerOne.stats.fDash]);

  return (
    <IonPage>
      <PageHeader
        componentsToShow={{back: true, popover: true}}
        title={`Oki - ${selectedCharacters.playerOne.name}`}
      />


      <IonContent id="FrameKillGenerator" className="calculators">
        <IonGrid fixed>
          <SegmentSwitcher
            key={"Oki KD type"}
            valueToTrack={recoveryType}
            segmentType={"recovery-type"}
            labels={ {kdr: "Quick", kdrb: "Back", both: "Q&B", kd: "None"}}
            clickFunc={ (eventValue) => recoveryType !== eventValue &&
              setRecoveryType(eventValue)}
          />

          <IonItem lines="full">
            <IonLabel>
              <h2>Knock down with</h2>
            </IonLabel>
            <IonSelect
              interfaceOptions={{ header: "Knock down with" }}
              value={knockdownMove}
              okText="Select"
              cancelText="Cancel"
              onIonChange={e => setKnockdownMove(e.detail.value)}
            >
              <IonSelectOption key="knockdownMove-select" value={null}>Select a move</IonSelectOption>
              {Object.keys(playerOneMoves).filter(move =>
                playerOneMoves[move].kd|| playerOneMoves[move].kdr || playerOneMoves[move].kdrb
              ).map(move =>
                <IonSelectOption key={`knockdownMove-${move}`} value={move}>{move}</IonSelectOption>
              )
              }
            </IonSelect>
          </IonItem>

          <IonItem lines="full">
            <IonLabel>
              <h2>Include late meaties</h2>
            </IonLabel>
            <IonSelect
              interfaceOptions={{ header: "Include late meaties" }}
              value={lateByFrames}
              okText="Select"
              cancelText="Cancel"
              onIonChange={e => setLateByFrames(e.detail.value)}
            >
              <IonSelectOption key="late-meaties-0" value={0}>No</IonSelectOption>
              {[1, 2, 3, 4, 5].map(lateByFrames =>
                <IonSelectOption key={`late-meaties-${lateByFrames}`} value={lateByFrames}>{lateByFrames} Frame{lateByFrames > 1 &&
                  "s"} Late</IonSelectOption>
              )
              }
            </IonSelect>
          </IonItem>

          <IonItem lines="full">
            <IonLabel>
              <h2>Setup contains</h2>
            </IonLabel>
            <IonSelect
              interfaceOptions={{ header: "Setup Contains" }}
              value={specificSetupMove}
              okText="Select"
              cancelText="Cancel"
              onIonChange={e => setSpecificSetupMove(e.detail.value)}
            >
              <IonSelectOption key="specificSetupMove-anything" value={"anything"}>Anything</IonSelectOption>
              <IonSelectOption key="specificSetupMove-forward-dash" value={"Forward Dash"}>Forward Dash</IonSelectOption>
              {Object.keys(playerOneMoves).filter(move =>
                (
                  (typeof playerOneMoves[move].startup === "number" &&
                  typeof playerOneMoves[move].active === "number") ||
                  typeof playerOneMoves[move].multiActive
                ) &&
                typeof playerOneMoves[move].recovery === "number" &&
                !playerOneMoves[move].followUp &&
                playerOneMoves[move].moveType !== "alpha" &&
                playerOneMoves[move].moveType !== "super" &&
                !playerOneMoves[move].airmove
              ).map(move =>
                <IonSelectOption key={`specificSetup-${move}`} value={move}>{move}</IonSelectOption>
              )}
            </IonSelect>
          </IonItem>

          <IonItem lines="full">
            <IonLabel>
              <h2>Target meaty</h2>
            </IonLabel>
            <IonSelect
              interfaceOptions={{ header: "Target Meaty" }}
              value={targetMeaty}
              okText="Select"
              cancelText="Cancel"
              onIonChange={e => setTargetMeaty(e.detail.value)}
            >
              <IonSelectOption key="targetMeaty-select" value={null}>Select a move</IonSelectOption>
              {Object.keys(playerOneMoves).filter(move =>
                !playerOneMoves[move].airmove &&
                !playerOneMoves[move].followUp &&
                !playerOneMoves[move].nonHittingMove &&
                playerOneMoves[move].moveType !== "alpha"
              ).map(move =>
                <IonSelectOption key={`targetMeaty-${move}`} value={move}>{move}</IonSelectOption>
              )}
            </IonSelect>
          </IonItem>

          {playerOneMoves[knockdownMove] && playerOneMoves[targetMeaty] &&
            <IonItem lines="full" class="selected-move-info">
              <IonLabel>
                <h3>Knockdown with</h3>
                <h2>{knockdownMove}</h2>
                <>
                {recoveryType === "both"
                  ? <>
                      <p>KD Advantage (Q): <strong>{playerOneMoves[knockdownMove]["kdr"]}</strong></p>
                      <p>KD Advantage (B): <strong>{playerOneMoves[knockdownMove]["kdrb"]}</strong></p>
                    </>
                  : <p>KD Advantage: <strong>{playerOneMoves[knockdownMove][recoveryType]}</strong></p>
                }
                </>

              </IonLabel>
              <IonLabel>
                <h3>Target Meaty</h3>
                <h2>{targetMeaty}</h2>
                <p>Startup: <b>{playerOneMoves[targetMeaty].startup}</b></p>
                <p>Active: <b>{playerOneMoves[targetMeaty].active}</b></p>
              </IonLabel>
            </IonItem>
          }

          <IonList>
            {okiResults
              ? Object.keys(okiResults).map(numOfMovesSetup =>
                <IonItemGroup key={numOfMovesSetup}>
                  <IonItemDivider><p>{numOfMovesSetup}</p></IonItemDivider>
                  {Object.keys(okiResults[numOfMovesSetup]).map(activeAsOrdinal =>
                    <div key={activeAsOrdinal}>
                      <IonListHeader className="ordinal-header">
                        <IonLabel>
                          <p>Meaty on the <strong>{activeAsOrdinal}</strong> active frame{recoveryType === "both" && "s"}</p>
                        </IonLabel>
                      </IonListHeader>
                      {Object.keys(okiResults[numOfMovesSetup][activeAsOrdinal]).map((setup, index) =>
                        <IonItem key={activeAsOrdinal + index}>
                          <IonLabel>
                            <p>{knockdownMove}, <strong style={{marginLeft: "3px"}}>[{okiResults[numOfMovesSetup][activeAsOrdinal][setup]}]</strong>, {targetMeaty}</p>
                          </IonLabel>
                        </IonItem>
                      )}
                    </div>
                  )}
                </IonItemGroup>
              )
            : <h4>No oki found for this setup...<br/>Sorry!</h4>
            }
          </IonList>

        </IonGrid>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => {setActiveFrameDataPlayer("playerOne"); setModalVisibility({ currentModal: "characterSelect", visible: true})} }>
            <IonIcon icon={person} />
          </IonFabButton>
        </IonFab>

      </IonContent>
    </IonPage>
  );
};

const mapStateToProps = state => ({
  modalVisibility: state.modalVisibilityState,
  selectedCharacters: state.selectedCharactersState,
  activePlayer: state.activePlayerState,
  activeGame: state.activeGameState,
})

const mapDispatchToProps = dispatch => ({
  setActiveFrameDataPlayer: (oneOrTwo) => dispatch(setActiveFrameDataPlayer(oneOrTwo)),
  setPlayerAttr: (playerId, charName, playerData) => dispatch(setPlayerAttr(playerId, charName, playerData)),
  setModalVisibility: (data)  => dispatch(setModalVisibility(data)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)
(FrameKillGenerator)
