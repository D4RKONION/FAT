import { IonContent, IonGrid, IonPage } from '@ionic/react';
import React from 'react';
import { connect } from 'react-redux';
import ReactHtmlParser from 'react-html-parser';
import '../../style/pages/Shoutouts.scss';
import PageHeader from '../components/PageHeader';
import { DEVS, DONATORS, DATA_TEAM, FRIENDS } from '../constants/Shoutouts';

const Shoutouts = () => {



  return (
    <IonPage>
      <PageHeader
        componentsToShow={{back: `/settings`}}
        title="Shoutouts"
      />

      <IonContent id="Shoutouts">
        <IonGrid fixed>
          <h1>App Development</h1>
          {Object.keys(DEVS).map(devName =>
            <div key={devName + "info"}>
              <h2>{devName}</h2>
              <p>{ReactHtmlParser(DEVS[devName])}</p>
            </div>
          )}
          <hr/>

          <h1>Frame Data Team</h1>
          {Object.keys(DATA_TEAM).map(teamName =>
            <div key={teamName + "info"}>
              <h2>{teamName}</h2>
              <p>{ReactHtmlParser(DATA_TEAM[teamName])}</p>
            </div>
          )}
          <hr/>

          <h1>Friends of FAT</h1>
          {Object.keys(FRIENDS).map(friendName =>
            <div key={friendName + "info"}>
              <h2>{friendName}</h2>
              <p>{ReactHtmlParser(FRIENDS[friendName])}</p>
            </div>
          )}
          <hr/>

          <h1>Donators</h1>
          <p><em>In the past people could donate in exchange for a shoutout in FAT. I've removed that option, but here are the people who donated to me!</em></p>
          <hr/>
          {Object.keys(DONATORS).map(donationType =>
            <div key={donationType + "section"}>
              <h2>{donationType}</h2>
              {donationType !== "Super"
              ? Object.keys(DONATORS[donationType]).map(donator =>
                <div key={donator + "info"}>
                <h3>{donator}</h3>
                <p>{ReactHtmlParser(DONATORS[donationType][donator])}</p>
                </div>
              )
              : DONATORS[donationType].map(donator =>
                <h3 key={donator + "info"}>{donator}</h3>
              )}
              {donationType !== "Super" &&
                <hr/>
              }
            </div>
          )}
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

const mapStateToProps = state => ({
})

const mapDispatchToProps = dispatch => ({
})


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)
(Shoutouts)
