export const APP_CURRENT_VERSION_NAME = "3.12.1";
export const APP_CURRENT_VERSION_CODE = 31201;
export const APP_DATE_UPDATED = "Sep 27 2024"; // new Date().toDateString().substring(4)

export const UPDATABLE_GAMES = ["SFV", "GGST", "SF6"]
export const TYPES_OF_UPDATES = ["FrameData", "GameDetails"]
export const UPDATABLE_GAMES_APP_CODES = {
  "SFV": {
    "FrameData": 93,
    "GameDetails": 2
  },
  "GGST": {
    "FrameData": 114,
    "GameDetails": 6
  },
  "SF6": {
    "FrameData": 41,
    "GameDetails": 8
  }
}

export const VERSION_LOGS = {
  "3.12.1": {
    "New Features": [
      "SF6: Added Terry",
      "SF6: Added more juggle data for all characters",
      "SF6: Added DR > Block distance for all characters"
    ],
    "Bug Fixes": [
      "3.12.1 Hotfix: Frame Data file updating fixed!",
      "Fixed a bug where selecting moves from the character subheader wasn't always working",
      "Fixed a bug where the Stat Comparer was getting confused by certain characters",
      "Fixed a bug where some moves weren't showing up in the Oki Calculator", 
      "Fixed a bug where counter and punish counter weren't working in the link calculator for SF6", 
      "Fixed a bug where the frame trap calculator was crashing when changing modes",
      "Fixed a bug with the advice toasts not dismissing sometimes",
      "Fixed bugs on What's New and Version Logs",
      "Made it so 'ex' works for searching OD moves in SF6", 
    ]
  },
  "3.12.0": {
    "New Features": [
      "SF6: Added Terry",
      "SF6: Added more juggle data for all characters",
      "SF6: Added DR > Block distance for all characters"
    ],
    "Bug Fixes": [
      "Fixed a bug where selecting moves from the character subheader wasn't always working",
      "Fixed a bug where the Stat Comparer was getting confused by certain characters",
      "Fixed a bug where some moves weren't showing up in the Oki Calculator", 
      "Fixed a bug where counter and punish counter weren't working in the link calculator for SF6", 
      "Fixed a bug where the frame trap calculator was crashing when changing modes",
      "Fixed a bug with the advice toasts not dismissing sometimes",
      "Fixed bugs on What's New and Version Logs",
      "Made it so 'ex' works for searching OD moves in SF6", 
    ]
  },
  "3.11.0": {
    "New Features": [
      "SF6: Added M.Bison"
    ],
    "Bug Fixes": [
      "None!"
    ]
  },
  "3.10.0": {
    "New Features": [
      "GGST: Added ABA",
      "GGST: Prepped for Slayer",
      "SF6: Prepped for Akuma",
    ],
    "Bug Fixes": [
      "None!"
    ]
  },
  "3.9.0": {
    "New Features": [
      "Android 13+: Added a Themed Icon",
      "SF6: Added Ed",
      "SF6: Added Modern Controls, including the option to view the data with these names",
      "SF6: Added Surprise Hop as a specific cancel for Blanka",
      "SF6: Added hitsun, blockstun, hitstop & hit confirm window information", 
      "SF6: Prepping app for Juggle Data, arriving with a frame data update shortly",
      "GGST: NumPad will be set as the default input type when switching to this game"
    ],
    "Bug Fixes": [
      "None!"
    ]
  },
  "3.8.0": {
    "New Features": [
      "GGST: Added Elphelt"
    ],
    "Bug Fixes": [
      "All good!"
    ]
  },
  "3.7.0": {
    "New Features": [
      "SF6: Added A.K.I.",
      "Added Sobat & Slasher Cancels to Dee Jay"
    ],
    "Bug Fixes": [
      "Fixed a typo in Dee Jay's name (from DeeJay)",
      "Fixed a bug where long active frames got a bit out of hand in detail view",
      "Fixed a bug where the GGST spreadsheet link wasn't working properly"
    ]
  },
  "3.6.0": {
    "New Features": [
      "GGST: Added Johnny",
      "Tweaks to several UI elements such as Character Portraits, Mobile Stats & State Switchers"
    ],
    "Bug Fixes": [
      "Due to some major 'under the hood' upgrades, there may be new bugs! Please let me know if you find any",
      "Fixed a few unrelated calculator bugs",
    ]
  },
  "3.5.6": {
    "New Features": [
      "SF6: Added Rashid",
      "Added Compact View, so large cells are cut short. This can be switched off using the menu in the top right",
      "Oki Calculator now works with SF6",
      "Added more resources for different games to the 'More Resources' page."
    ],
    "Bug Fixes": [
      "Fixed a bug where chosen landscape columns would often reset"
    ]
  },
  "3.5.5": {
    "New Features": [
      "SF6 is now the default game on first run",
      "GGST/SF6: Added Twitter hashtags to stats so you can get that tech",
      "SF6: Added a toggle for Raw DR that changes oH and oB, rather than being their own columns",
      "SF6: -3 moves are now yellow rather than red in the table",
      "Added Chip values (still working on the whole cast)",
      "Changed Drive Rush Distance stat to min and max versions"
    ],
    "Bug Fixes": [
      "Some stat points weren't displaying correctly on mobile"
    ]
  },
  "3.5.4": {
    "New Features": [
      "GGST: Added Asuka",
      "SF6: Added the rest of the base roster characters",
      "SF6: Added Move Lists for all characters (check the menu!)",
      "SF6: Added data points related to drive and super meter gain",
      "Added a tab in Frame Data for characters with moves that have large variations (like Asuka's Spells & Faust's items)",
      "Desktop/Tablet: Clicking 'Best Reversal' or 'Fastest Normal' now takes you to the frame data page for those moves",
    ],
    "Bug Fixes": [
      "None!"
    ]
  },
  "3.5.3": {
    "New Features": [
      "GGST: Added Bedman? (Yes, added Bedman)",
      "All: Updated local Frame Data files",
      "SF6: Made it so searching EX works for OD moves",
      "Overhauled the character images and the character select menu."
    ],
    "Bug Fixes": [
      "Fixed a bug where you could only search for official move names if you had official move names set."
    ]
  },
  "3.5.2": {
    "New Features": [
      "Added Privacy Policy to the settings menu. Long story short, we collect 0 data from this app",
    ],
    "Bug Fixes": [
      "Fixed a bug where sometimes all landscape columns would disappear",
      "Fixed a bug where all themes were available to use without purchase. Let's call it a promotion..."
    ]
  },
  "3.5.1": {
    "New Features": [
      "This is the same as 3.5.0, but fixes the teeny tiny bug that the app literally wouldn't open an android. Whoops...",
      "New Game! Added SF6. The data is from the closed beta and is subject to change",
      "Improved remote updating! Expect faster DLC characters without the need for an app store update",
      "Improved efficiency on startup and downloading updates",
      "The above two features required extensive rewrites of core code. Please report any new bugs to apps@fullmeter.com",
      "Added a VS Burnout checkbox to the framedata page for SF6",
      "Removed the frame data version numbers from the menu. You can still find these in the settings menu",
      "Added a link to the SuperCombo.gg entry for SFV moves so you can see move images"
    ],
    "Bug Fixes": [
      "Fixed a bug where landscape columns weren't setting proprely",
    ]
  },
  "3.5.0": {
    "New Features": [
      "New Game! Added SF6. The data is from the closed beta and is subject to change",
      "Improved remote updating! Expect faster DLC characters without the need for an app store update",
      "Improved efficiency on startup and downloading updates",
      "The above two features required extensive rewrites of core code. Please report any new bugs to apps@fullmeter.com",
      "Added a VS Burnout checkbox to the framedata page for SF6",
      "Removed the frame data version numbers from the menu. You can still find these in the settings menu",
      "Added a link to the SuperCombo.gg entry for SFV moves so you can see move images"
    ],
    "Bug Fixes": [
      "Fixed a bug where landscape columns weren't setting proprely",
    ]
  },
  "3.4.5": {
    "New Features": [
      "GGST: Added Bridget",
      "Added a color blind mode for FAT Classic (see settings)",
      "Changed dark colours for oB values",
      "Added frame data last updated information to the settings > version logs screen"
    ],
    "Bug Fixes": [
      "No bugs!"
    ]
  },
  "3.4.4": {
    "New Features": [
      "Updated SFV character specific columns"
    ],
    "Bug Fixes": [
      "Fixed a bug where remote framedata updating was failing due to file sizes"
    ]
  },
  "3.4.3": {
    "New Features": [
      "Added Testament",
      "Lots of SFV updates but we're still adding more (with remote updating)"
    ],
    "Bug Fixes": [
      "No bugs!"
    ]
  },
  "3.4.2": {
    "New Features": [
      "Added Luke",
      "Added Happy Chaos and prepped for Baiken",
      "Added more stats to GGST characters, removed blank stats from characters",
      "Best Reversal now adapts to the user's chosen move notation"
    ],
    "Bug Fixes": [
      "Fixed an issue where followup moves were being considered for Fastest Move",
      "Web: Fixed a crash when changing games while a game unique stat was selected",
    ]
  },
  "3.4.1": {
    "New Features": [
      "Added Akira and Oro",
      "Prepped the app for Luke and Jack-O",
      "Added Goldlewis states",
      "Added more stats to GGST characters"
    ],
    "Bug Fixes": [
      "No bugs!"
    ]
  },
  "3.4.0": {
    "New Features": [
      "New Game: GGST data is now in FAT!",
      "You can check out the hitbox data (where available) on dustloop using the direct link in the move detail page",
      "Added some GGST resources to the More Resources Page"
    ],
    "Bug Fixes": [
      "Fixed a bug where the app would sometimes crash when changing games on the combos page"
    ]
  },
  "3.3.1": {
    "New Features": [
      "Added Rose's specific cancels to the app",
      "New theme: Poisonous Pink. A dangerously pink theme, look but don't touch!",
      "Added [info=] search term for the frame data page, to search a character's extra info. Try doing info=fully inv",
      "Made it so 'gief' and 'sim' are valid search choices for Yaksha Search",
      "Prepped the app for Akira and Oro",
    ],
    "Bug Fixes": [
      "Fixed a bug where stat compare's headings were not sorted properly",
      "Fixed an issue where some character's jump normals were being counted as their 'fastest normal'",
      "Moved R.Mika to the top of the characters beginning with R",
      "App: Fixed an issue where the stats quote was left aligned",
      "Web: Fixed a bug where entering from a URL would sometimes set the wrong landscape cols",
      "Fixed a bug where Guile & Balrog's throws were not being set up properly in Frame Kill Generator"
    ]
  },
  "3.3.0": {
    "New Features": [
      "ROSE DATA WILL COME IN A FRAME DATA FILE UPDATE",
      "This update is preparing the app for Rose so that when the framedata team are done with her they can update it immediately. When Rose is available she will show up in the character select menu",
      "New theme: Delta Green. This dark green theme is no clone!",
      "Filter the frame data page using the search bar! You can search using a move name or an expression like oB>4",
      "Filter the character select by name using the search bar",
      "Tablet/Desktop: improved the look of character select screen",
      "Rearranged the stats sections",
      "Added V-Shift Distance to Stat Compare mode",
      "All Combos for SFV are now completely up to date, thank you Sestze",
      "FAT now checks your system theme setting on fresh install and sets dark or light mode",
      "Added a past Version Logs page under settings"
    ],
    "Bug Fixes": [
      "Fixed a bug where VS1 data was hidden on Seth's table",
      "Fixed a bug where some stats wouldn't appear in stat compare",
      "iOS: Fixed a bug where activated and hovered buttons would be the wrong colour"
    ]
  },
  "3.2.0": {
    "New Features": [
      "Added a theme previewer",
      "New theme: Second in Command. Theme number 2 is purple and truly intoxicating!",
      "Reworked the Red Dragon theme to be less ugly in light mode, check it out in the theme previewer",
      "Added a toggle all to each landscape column section in the framedata menu",
      "Added autosetting of character specific data, can turn off in landscape options",
      "Added Dan's specific cancels to the app",
      "Desktop/tablets: Massive rework of the side menu, much prettier now",
      "Desktop/tablets: New character bio section above frame data",
      "Desktop: URL deep linking into move details/specific characters etc. should now work throughout the app",
      "Desktop: Open landscape options by clicking the header",
      "Made it so Seth's frame data table only shows the move that he steals from the other selected character",
      "Improved how dark mode's oB numbers looks",
    ],
    "Bug Fixes": [
      "Fixed a bug where the data table would sometimes double render, causing lag",
      "Fixed a bug where checkboxes were invisible on dark mode when unchecked",
      "Fixed a bug where you could change characters while looking at a move's detail, causing a crash",
      "Fixed a bug where you could change games while looking at a move's detail, causing a crash",
      "Fixed the link to Sestze's spreadsheet, sorry Sestze!",
      "Fixed a bug where sometimes some of the subheader data wasn't showing",
      "Fixed the link to the FAT repo",
      "Desktop: Fixed a bug where various elements didn't cause a mouse pointer effect",
    ]
  },
  "3.1.0": {
    "New Features": [
      "Added this shiny What's New page when FAT updates",
      "Changed how the app names its versions with regard to frame data updates",
    ],
    "Bug Fixes": [
      "iOS: Fixed a bug where the app would sometimes get stuck in landscape mode",
      "iOS: Fixed a bug where swiping from the left went back a screen instead of opening the menu"
    ]
  },
  "3.0.5": {
    "New Features": [
      "A complete rewrite of the app from the ground up!",
      "Improved look for almost every aspect of the app",
      "Open Sourced all of FAT",
      "Added a Dark Mode",
      "Added 3S, data still being verified by Arly",
      "Added Yaksha Search to the app so you can check multiple moves quickly",
      "Added a Resources Page to the app where you can find discords, docs and app",
      "Changed the remote fetching feature so that we can more easily and quickly update the framedata",
      "Added a new theme store",
      "Overhauled the menu, less cluttered",
      "Added game switcher from the main menu",
      "Massively Improved Move List page",
      "Tapping on a move in Moves List will bring you to the Frame Data page",
      "Completely updated Combos section",
      "New and improved Stat Compare page, displays like a tier list",
      "New data including Hit Confirm Windows",
      "Added counterhit switch on Frame Data",
      "Added V-Trigger Switcher from within Move Detail",
      "Change characters by tapping on the currently active character in the switcher",
      "Moved the calculators to their own submenu",
      "Added Advice Popups to help you get to grips with the new app (can be turned off in settings)",
      "Rewrote the help pages"
    ],
    "Bug Fixes": [
      "Fixed a bug where Dan broke the app when looking for his combos (they're not there yet!)",
      "Fixed a bug where changing character from theme store from the app",
      "Fixed a bug where trying to change V-Trigger states while in a subpage broke the app",
      "Fixed a bug where trying to change V-Trigger states on the datapage was locking people into a detail page",
      "Fixed a bug where the cancelTo column had no spaces",
      "Toned down the red on the Red Dragon theme",
      "Added the FAT team to the More Resources page",
      "Fixed a bug where the positions of onBlock and onHit were swapped",
      "Fixed a bug where MonkUnit wasn't in the Shoutouts page",
      "Fixed a typo on the landscape options popup",
    ]
  },
  "2.6.3": {"Bug Fixes": ["Some extremely tiny frame data fixes."]},
  "2.6.2": {"Bug Fixes": ["Fixed a bug where landscape was mixing up the headers of columns.", "Extended the size of when landscape activates by about 100 pixels to accomodate for wider phones. It's a messy hack but it'll do for now."]},
  "2.6.1": {"New Features": ["Added a section to the welcome page asking for reviews on the store. We'd really appreciate your feedback :)", "Made it so the remote update fetch notificaton displays on Android as well as iOS."], "Bug Fixes": ["Fixed a very serious bug where adam's name wasn't in the credits.", "Fixed a bug where the detailed Move List wouldn't display until the character was changed.", "Fixed a bug where it was still possible to get to the donations page."]},
  "2.6.0": {"New Features": ["@HatsonFGC, @StandardToastie and @Arlieth did an IMMENSE amount of work to update the frame data.", "Completely updated all characters to SFV:CE", "Added Poison, Gill, Lucia, E.Honda and Seth. I'm sorry this took so long, but please appreciate that we are very busy and that we do this for free", "Removed the donation options"], "Bug Fixes": ["Fixed a bug where startup wasn't showing in the String Interruptor calculator"]},
  "2.5.7": {"Bug Fixes": ["@HatsonFGC has fixed lots of datas", "Fixed a bug where the landscape options reset every time the app was started. They will still need to reset every time the app is updated."]},
  "2.5.6": {"Bug Fixes": ["(@HatsonFGC and @Arlieth added Kage and all the S4 changes. Then I put them in the app. Praise them"]},
  "2.5.5": {"Bug Fixes": ["Actually fixed the OH/OB bug this time, swear I know what I'm doing"]},
  "2.5.4": {"New Features": ["Updated the Frame data file"], "Bug Fixes": ["Fixed a bug where some character's extra detail section was filled with whatever move you looked at last", "Fixed a bug where On Hit and On Block in lanscape view were flipped"]},
  "2.5.3": {"New Features": ["Added G!", "Added Sagat!", "Added Footsies! Thanks @HiFight", "Added more column options to Landscape mode (three dots top left of frame data screen"], "Bug Fixes": ["Fixed a bug where Crush Counter data wasn't showing", "Other tiny fixes"]},
  "2.5.2": {"New Features": ["Added Falke!", "Added Cody!", "Quick note: I don't play SFV or even Fighting Games anymore (apart from the odd session with my friends.) I may well be slow to update this from time to time. Sorry about that!"]},
  "2.5.1": {"New Features": ["Added Blanka!", "Gave the move detail screen a bit of a shuffle, and put the move name, common name and move command at the top of the screen."], "Bug Fixes": ["Fixed a bug where some data points were showing up twice in more detailed frame data view", "Fixed a bug where some images were broken in move list."]},
  "2.5.0": {"New Features": ["Added Arcade Edition changes", "Added VT2 data for all characters and a new button to view them with", "Added early Blanka data, rest will be a Day 1 update", "Added Zeku's Transformation, VT cancel, VT dash cancel and Run Stop data, Juri's VSkill cancel data, Rashid's roll cancel data, Sim/Ed/Kolin VT1 Gap, Menat's Orb recall oH and oB and probably a bunch more than I've forgotten"], "Bug Fixes": ["Fixed a bug where Player Two could only be switched to Vtrigger if Player One also was", "Fixed a bug where moves with more than two active periods were appearing as ~ in the Active column", "Fixed a bug where Numpad commands would fail to load in Vtrigger mode"]},
  "2.4.3": {"New Features": ["(Hatson) Added Zeku! I (Paul) am on holidays atm, so Zeku as two characters is a temporary measure! Look out for another update next week"]},
  "2.4.2": {"New Features": ["(Hatson) Added Menat"], "Bug Fixes": ["Fixed a bug where Player 1's name was showing up in Player 2's more detailed frame data view", "Fixed a bug where frame data entries that were a 0 were showing up as ~ on Frame data screen"]},
  "2.4.1": {"Bug Fixes": ["Fixed a bug where frame data view was totally blank and crashing the app on old versions of Android","Because I can't have a nice clean version code for longer than 4 hours ;_;"]},
  "2.4.0": {"New Features": ["Big under the hood changes, so please report any bugs you might find!", "Added Abigail", "Added the following under more detailed framedata view: LM-A OH (Laura Only), LM-A OB (Laura Only), VSkill Cancel OH (Ken/Balrog Only), VSkill Cancel OB (Ken/Balrog Only), VTrigger Cancel OH, VTrigger Cancel OB, VTrigger Cancel OH F (Urien only), VTrigger Cancel OB F (Urien only), VTrigger Cancel OH B (Urien only), VTrigger Cancel OB B (Urien only), VTrigger Cancel OH D (Urien only), VTrigger Cancel OB D (Urien only), Stance Switch On Block (Vega only), Stance Switch On Hit (Vega only), lk Dash cancel OH (Karin/Ibuki Only), lk Dash cancel OB (Karin/Ibuki Only), mk Dash cancel OH (Ibuki Only), mk Dash cancel OB (Ibuki Only), ex Dash cancel OH (Karin Only), ex Dash cancel OB (Karin Only), VSkill > P Gap On Hit (Balrog only), VSkill > P Gap On Block (Balrog only), VSkill > K Gap On Hit (Balrog only), VSkill > K Gap On Block (Balrog only)",  "Added landscape mode and the ability to set any number of data points as columns in framedata mode. Tap the three dots in the top right of that screen to try it out", "Changed the welcome screen to more easily swap between games", "Updated the combos stuff with the help of community members. If there's S1  content or no content at all, you can help by contacting me for database access!", "Changed the splash screen and icon logo", "Probably other stuff, I'm good at this..."]},
  "2.3.7": {"New Features": ["Added Season 2.1 changes"], "Bug Fixes": ["Fixed a bug where some of the calculators weren't working properly"]},
  "2.3.6": {"New Features": ["Added Ed", "Lots of data improvements courtesy of the spreadsheet team"]},
  "2.3.5": {"New Features": ["Some minor frame data improvements"]},
  "2.3.4": {"New Features": ["Added Kolin frame data", "Added the ability to switch between Motion and NumPad notation for move inputs", "Added the option for move names to be their respective inputs", "So many fixes and addtions to the frame data that I can't even keep up. My spreadsheet team are Gods", "Way nicer looking Vtrigger look in Frame Data mode, much easier to see what's changed", "Added a menu drop down that let's you quickly zip to a character's frame data page"], "Bug Fixes": ["Fixed a bug where VTrigger switching would sometimes fail"]},
  "2.3.3": {"New Features": ["Further improved frame data accuracy, big shoutouts to users 'Tanden Renki' and 'Banana Cyclone' for their large number of reports. And thanks to Hatson as always for his work on the data!", "Added Laura's VSkill cancel data out of normals. Tap a normal to see the data", "Updated all affected Gief's Gym entries to their S2 versions", "Added links to my Patreon page under 'Other' subheading"]},
  "2.3.2": {"New Features": ["A bunch of corrections for S2 frame data plus more Akuma numbers"]},
  "2.3.1": {"New Features": ["Added some S2 changes that were missed, sorry!"]},
  "2.3.0": {"New Features": ["Added Akuma Frame Data, plus the ability to use him in all notes and calculators", "Updated all characters to S2 Frame Data", "Added Bafael's Akuma Combos and Tech stuff"], "Bug Fixes": ["Fixed a bug where Forward Dash couldn't show up twice in a Two Move OkiCalc setup"]},
  "2.2.10": {"New Features": ["Added Urien Frame data, plus the ability to use him in all notes and calculators", "Made it so that OkiCalc takes the 2 frame throw invul window into account", "OkiCalc can now let you know if a knockdown has a natural meaty", "OkiCalc can now check for setups that catch Quick and Back Recovery", "OkiCalc can now fuzzy search for late meaties"], "Bug Fixes": ["Fixed a bug where certain characters' normals did not have common names", "Fixed a bug where Juri's QCF+2K wasn't showing up in OkiCalc", "Added Karin's late Tekno", "Fixed a bug where Ryu's VSkill was allowed into certain calculators", "General Frame data clean up", "Added proper Yoga Gale frame data"]},
  "2.2.9": {"New Features": ["NEW MODE: Oki Calculator! Supply FAT with a knockdown and a target meaty, FAT will tell you how to land that meaty perfectly everytime!"], "Bug Fixes": ["Hopefully fixed a bug where scrolling would become disabled sometimes", "Fixed a bug where you couldn't view Juri's Target Combo in a more detailed fashion"]},
  "2.2.8": {"Bug Fixes": ["Fixed that some stats were showing up even when they didn't exist", "Fixed that stat headers were red", "Fixed that Ken had a Vtrigger dash", "Fixed Juri's jump stat", "Slight visual tweaks"]},
  "2.2.7": {"New Features": ["NEW MODE: Stat Compare! Under the References heading. Choose a stat and it will show you an ordered list of every character in the game. It also highlights who's Player 1/2", "New Setting: Favourite mode! Go to settings and set up your favourite mode. A handy quick link will appear for it both in the side menu and on the welcome screen. Dat QoL", "Added dash distance; throw range to character stats", "Overhauled the design of the help screens and notes! Pretty!", "Added help screens for pages that were missing them and cleaned up the ones that already existed", "Added more Juri Frame Data and added her extra info", "Added knockdown advantage frames for all SFV characters, under the more detailed frame data view"], "Bug Fixes": ["Fixed a bug where What's New would always show after updating via the Fullmeter server (note: you'll have to update via your app store to get this fix)", "Fixed a bug where the app would sometimes not see that there's a new server update"]},
  "2.2.6": {"New Features": ["Added Juri Frame Data (early days, may be wrong)", "Added Balrog and Ibuki combos and tech",  "Made it so your moves on block are highlighted red relative to the chosen opponent", "Overhauled the look of the app to give it a bit more personality. More to come"], "Bug Fixes": ["Fixed some other errors in character frame data (thanks emailers!)"]},
  "2.2.5": {"New Features": ["Added Balrog and Ibuki frame data"], "Bug Fixes": ["Fixed some other errors in character frame data (thanks /u/ItsTimeToAttack)"]},
  "2.2.4": {"New Features": ["Placed another \"Update Available\" message here on the welcome screen.", "Added another batch or /u/Joe_Munday's awesome tutorials.", "Added Guile's combos to the app. Thanks as always to Bafael!"], "Bug Fixes": ["Fixed Vega MK Roll frame data and changed some of Guile's"]},
  "2.2.3": {"Bug Fixes": ["Fixed a bug where frame trap lister was totally broken"]},
  "2.2.2": {"New Features": ["Early Guile frame data added, he can now be used in all modes"]},
  "2.2.1": {"New Features": ["Cleaned up frame data and combo/tech database, we did it Reddit!"]},
  "2.2.0": {"New Features": ["NEW MODE: Combos & Tech! Featuring content from Bafael, 4D Streaming and more to come!", "Side Menu UI improvement: The categories are now expandable, it's a lot easier to find your way around now!", "Optional Back Button functionality: Some people have expressed a dislike for swiping right/reaching up to the menu button in the top left. If that's you, head oto settings and try out the new Alternative back button functionality", "I've tweaked the tutorial menu to make it cleaner looking and easier to find stuff in", "/u/Joe_Munday-sensei has written even more tutorial goodness for you!", "Added extra info for Alex, all should be up to date now"], "Bug Fixes": ["Fixed a bug where the screen would scroll to the top upon returning from a specific tutorial", "Fixed a bug where some iOS users were being bombarded with purchase error messages"]},
  "2.1.10": {"New Features": ["Added even more data for Alex! WARNING: This data may well be inaccurate, the character has been out for about 48 hours!"]},
  "2.1.9": {"New Features": ["Added in some preliminary data for Alex, this will make most of the modes work for him now. WARNING: This data may well be inaccurate, the character has been out for about 24 hours!"]},
  "2.1.8": {"New Features": ["New Character: Hier Kommt Alex! Move list and ability to take notes for Alex added!", "Added the ability to grab app updates remotely (from my server). This wont be forced on you, but you will be alerted in the settings menu when there's a new update.", "Added a TON of new tutorials from the excellent /u/Joe_Munday-sensei, this man does not stop!", "Tweaked the algorithm on String Interrupter to even more correctly account for Move Priority. Also now states the moves start-up for more clarity"]},
  "2.1.6": {"New Features": ["NEW MODE: String Interrupter is a brand new mode for FAT, specifically tailored for SFV (but also works for USF4). Set up a string for your opponent, and FAT will tell you what buttons you can use to interrupt it.", "Added two new tutorials from the excellent /u/Joe_Munday -sensei", "Tidied up the tutorial page layout a bit"], "Bug Fixes": ["Fixed some errors in the database"]},
  "2.1.5": {"New Features": ["Added a VTrigger switcher to the top of frame data view"], "Bug Fixes": ["Fixed some errors in the database"]},
  "2.1.4": {"New Features": ["Switched out the toggles for button bars in Frame-Trapper and character select"], "Bug Fixes": ["Fixed an error with Mika's move list"]},
  "2.1.3": {"New Features": ["Added tons of new info like invincibility frames and airbourne frames on all relevant moves - find them under the more detailed frame data views", "Added a search bar to the frame data viewer, you can search by name and a bunch of other things", "Added all VTrigger data for all characters", "Added all crush counter data for all characters. This data is also now accounted for in \"Move Linking\" mode", "Added more of /u/Joe_Munday's excellent tutorials!", "Redesigned the tutorial menu screen", "Improved the launch speed of the app"], "Bug Fixes": ["Fixed a bug where images were only being added to the end of the note instead of to the cursor position", "Fixed some errors in the frame-data database"]},
  "2.1.2": {"Bug Fixes": ["Fixed a bug with the game changer in settings menu", "Fixed errors in various character's frame data"]},
  "2.1.1": {"New Features": ["Added status bar colour"], "Bug Fixes": ["Fixed a bug where Laura and Ken's Damage wasn't showing up", "Fixed errors in Birdie's movelist", "Fixed a bug where outputs were getting cut off if they were too long in some calculators", "Changed move-linking mode so that lights are granted +2 on CH"]},
  "2.1.0": {"New Features": ["Huge frame data overhaul, thank you to community members Gilley3D and Dantarion for their hard work!", "New Mode! New to fighting games? Check out the all new \"Tutorials & Lessons\" mode under References.", "New Setting! New to fighting games? Or not fluent in Japanese?! Turn on \"Common Move Names\" in Settings!", "Added Back & Forward Walk Speeds and Back & Forward Jump Distances to character stats page", "Added the \"Attack Level\" value under more detailed Frame Data", "Changed the look of toggles throughout the app to show both options up front", "Improved the layout of general frame data view", "Improved how the text input area in notes modes is rendered"], "Bug Fixes": ["Fixed a bug where external links weren't opening", "Fixed a bug where anti-air moves were showing as grounded punishes", "Fixed a bug where users weren't alerted after donating"]},
  "2.0.3": {"New Features": ["Added the Frame Data, Move List and ability to take notes for F.A.N.G.", "Note: until certain data becomes available, some of the calculators will not work for F.A.N.G! Sorry!", "Tapping a move in moves list now brings you to the more detail screen for that move.", "Added the welcome screen for fresh app entry!", "You can now donate again! Of course, you don't have to :)", "Frame-Data legend will now stick to the top of the screen when scrolling", "Returning from the more detailed frame data screen no longer scrolls you back to the top of the list.", "Scrolling in general should feel a lot less janky"], "Bug Fixes": ["Fixed a bug where the splashscreen would not show for long enough", "Fixed a bug where Move Linking card header was not wrapping it's text"]},
  "2.0.2": {"Bug Fixes": ["Fixed a bug where the app was requesting WiFi info"]},
  "2.0.0": {"New Features": ["Street Fighter V characters included, along with full frame data, calculation and notes support!", "Complete visual and framework overhaul of the app!", "New and improved notes, with complete markdown support!", "Tons of other new stuff!"]}
}
