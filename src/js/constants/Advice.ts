const ADVICE = {
  framedata: [
    {
      message: "You can change from Official Move Names to Common Move Names in the settings",
      handler: (history) => {history.push('/settings#moveNameType')},
      icon: "settingsOutline"
    },
    {
      message: "You can quickly change characters by tapping the current active character's name in the switcher",
    },
    {
      message: "You can change the columns that appear when in landscape using the menu in the top right",
    },
    {
      message: "You can change advantage states like 'Counter Hit' and 'Burned Out Opponent in the menu in the top right",
    },
    {
      message: "You can turn off the On Block (oB) colour values using the menu in the top right",
    },
    {
      message: "We'd be super happy if you could leave us a nice review :)",
      handler: () => {window.open("https://play.google.com/store/apps/details?id=com.fullmeter.fat", '_blank');},
      icon: "star"
    },
  ],

  moveslist: [
    {
      message: "You can tap on a move to see its full frame data"
    }
  ],

  combos: [
    {
      message: "You can tap on a combo entry to see it's extra information"
    },
    {
      message: "Those 3 rectangular bars tell you how much meter this combo spends"
    }
  ],

}

export default ADVICE;