const GAME_DETAILS = {
  SFV: {
    fullName: "Street Fighter V",
    abbrName: "SFV",
    characterStates: ["normal", "vtOne", "vtTwo"] as const,
    specificCharacterStates: [],
    characterList: [
      "Abigail",
      "Akira",
      "Akuma",
      "Alex",
      "Balrog",
      "Birdie",
      "Blanka",
      "Cammy",
      "Chun-Li",
      "Cody",
      "Dan",
      "Dhalsim",
      "E.Honda",
      "Ed",
      "Falke",
      "F.A.N.G",
      "G",
      "Gill",
      "Guile",
      "Ibuki",
      "Juri",
      "Kage",
      "Karin",
      "Ken",
      "Kolin",
      "Laura",
      "Lucia",
      "Luke",
      "M.Bison",
      "Menat",
      "Nash",
      "Necalli",
      "Oro",
      "Poison",
      "R.Mika",
      "Rashid",
      "Rose",
      "Ryu",
      "Sagat",
      "Sakura",
      "Seth",
      "Urien",
      "Vega",
      "Zangief",
      "Zeku (Old)",
      "Zeku (Young)"
    ] as const,
    universalDataPoints: {
      "Basic Frame Data": [
        {
          "startup": {
            "dataTableHeader": "S",
            "detailedHeader": "Startup",
            "dataFileKey": "startup",
          },
          "active": {
            "dataTableHeader": "A",
            "detailedHeader": "Active",
            "dataFileKey": "active",
          },
          "recovery": {
            "dataTableHeader": "R",
            "detailedHeader": "Recovery",
            "dataFileKey": "recovery",
          }
        },
        {
          "total": {
            "dataTableHeader": "T",
            "detailedHeader": "Total",
            "dataFileKey": "total",
          },
        },
        {
          "onHit": {
            "dataTableHeader": "oH",
            "detailedHeader": "On Hit",
            "dataFileKey": "onHit",
          },
          "onBlock": {
            "dataTableHeader": "oB",
            "detailedHeader": "On Block",
            "dataFileKey": "onBlock",
          },
        }
      ],
      "Move Properties": [
        {
          "moveType": {
            "dataTableHeader": "mT",
            "detailedHeader": "Move Type",
            "dataFileKey": "moveType",
          },
          "cancelsTo": {
            "dataTableHeader": "xx",
            "detailedHeader": "Cancels To",
            "dataFileKey": "cancelsTo",
          },
          "attackLevel": {
            "dataTableHeader": "attLvl",
            "detailedHeader": "Attack Level",
            "dataFileKey": "attackLevel",
          }
        },
        {
          "damage": {
            "dataTableHeader": "dmg",
            "detailedHeader": "Damage",
            "dataFileKey": "damage",
          },
          "stun": {
            "dataTableHeader": "stun",
            "detailedHeader": "Stun",
            "dataFileKey": "stun",
          },
        },
      ],
      "Knockdown": [
        {
          "kd": {
            "dataTableHeader": "kd",
            "detailedHeader": "KD Adv",
            "dataFileKey": "kd",
          },
          "kdr": {
            "dataTableHeader": "kdr",
            "detailedHeader": "Quick Rise Adv",
            "dataFileKey": "kdr",
          },
          "kdrb": {
            "dataTableHeader": "kdrb",
            "detailedHeader": "Back Rise Adv",
            "dataFileKey": "kdrb",
          },

        }
      ],
      "Crush Counter": [
        {
          "ccState": {
            "dataTableHeader": "cc-st",
            "detailedHeader": "CC State",
            "dataFileKey": "ccState",
          },
          "ccAdv": {
            "dataTableHeader": "cc-adv",
            "detailedHeader": "Advantage",
            "dataFileKey": "ccAdv",
          },
          "ccVG": {
            "dataTableHeader": "cc-vG",
            "detailedHeader": "V Meter Gain",
            "dataFileKey": "ccVG",
          }
        }
      ],
      "Hit Confirm Window": [
        {
          "hcWinSpCa": {
            "dataTableHeader": "hc-Sp/Ca",
            "detailedHeader": "Specials & CAs",
            "dataFileKey": "hcWinSpCa",
          },
          "hcWinTc": {
            "dataTableHeader": "hc-TC",
            "detailedHeader": "Target Combos",
            "dataFileKey": "hcWinTc",
          },
          "hcWinVt": {
            "dataTableHeader": "hc-VT",
            "detailedHeader": "V-Trigger",
            "dataFileKey": "hcWinVt",
          },
        },
        {
          "hcWinNotes": {
            "dataTableHeader": "hc-n",
            "detailedHeader": "Notes",
            "dataFileKey": "hcWinNotes",
          }
        }
      ],
      "Extra Information": [
        {
          "extraInfo": {
            "dataTableHeader": "Notes",
            "detailedHeader": "Extra Info",
            "dataFileKey": "extraInfo",
          }
        }
      ]
    },
    specificCancels:[{"vtc1OnHit":{"dataTableHeader":"VT1 oH","detailedHeader":"xx V-Trigger 1 oH","dataFileKey":"vtc1OnHit","usedBy":["Akira","Balrog","Birdie","Cammy","Chun-Li","Cody","Falke","Ibuki","Kage","Nash","Oro","R.Mika","Seth","Zeku (Old)","Zeku (Young)"]},"vtc1OnBlock":{"dataTableHeader":"VT1 oB","detailedHeader":"xx V-Trigger 1 oB","dataFileKey":"vtc1OnBlock","usedBy":["Akira","Balrog","Birdie","Cammy","Chun-Li","Cody","Falke","Ibuki","Kage","Nash","Oro","R.Mika","Seth","Zeku (Old)","Zeku (Young)"]}},{"vtc2OnHit":{"dataTableHeader":"VT2 oH","detailedHeader":"xx V-Trigger 2 oH","dataFileKey":"vtc2OnHit","usedBy":["Balrog","Birdie","Cody","Dan","Ed","F.A.N.G","Kage","Kolin","Oro","Rashid","R.Mika","Urien","Vega","Zangief"]},"vtc2OnBlock":{"dataTableHeader":"VT2 oB","detailedHeader":"xx V-Trigger 2 oB","dataFileKey":"vtc2OnBlock","usedBy":["Balrog","Birdie","Cody","Dan","Ed","F.A.N.G","Kage","Kolin","Oro","Rashid","R.Mika","Urien","Vega","Zangief"]}},{"vtcOnHit":{"dataTableHeader":"VT oH","detailedHeader":"xx V-Trigger 1/2 oH","dataFileKey":"vtcOnHit","usedBy":["Abigail","Akuma","Alex","Blanka","E.Honda","F.A.N.G","G","Gill","Guile","Juri","Karin","Ken","Laura","Lucia","Luke","M.Bison","Menat","Necalli","Poison","Rose","Ryu","Sagat","Sakura"]},"vtcOnBlock":{"dataTableHeader":"VT oB","detailedHeader":"xx V-Trigger 1/2 oB","dataFileKey":"vtcOnBlock","usedBy":["Abigail","Akuma","Alex","Blanka","E.Honda","F.A.N.G","G","Gill","Guile","Juri","Karin","Ken","Laura","Lucia","Luke","M.Bison","Menat","Necalli","Poison","Rose","Ryu","Sagat","Sakura"]}},{"vscOnHit":{"dataTableHeader":"VS oH","detailedHeader":"xx V-Skill oH","dataFileKey":"vscOnHit","usedBy":["Alex"]}},{"vsc1OnHit":{"dataTableHeader":"VS1 oH","detailedHeader":"xx V-Skill 1 oH","dataFileKey":"vsc1OnHit","usedBy":["Balrog","Gill","Juri","Ken","Laura"]},"vsc1OnBlock":{"dataTableHeader":"VS1 oB","detailedHeader":"xx V-Skill 1 oB","dataFileKey":"vsc1OnBlock","usedBy":["Balrog","Gill","Juri","Ken","Laura"]}},{"vsc2OnHit":{"dataTableHeader":"VS2 oH","detailedHeader":"xx V-Skill 2 oH","dataFileKey":"vsc2OnHit","usedBy":["Balrog","Dan","G","Juri","Laura","Oro","Poison","Sakura"]},"vsc2OnBlock":{"dataTableHeader":"VS2 oB","detailedHeader":"xx V-Skill 2 oB","dataFileKey":"vsc2OnBlock","usedBy":["Balrog","Dan","G","Juri","Laura","Oro","Poison","Sakura"]}},{"VSPGapHit":{"dataTableHeader":"VSPoH Gap","detailedHeader":"xx V-Skill > P oH Gap","dataFileKey":"VSPGapHit","usedBy":["Balrog","Oro"]},"VSPGapBlock":{"dataTableHeader":"VSPoB Gap","detailedHeader":"xx V-Skill > P oB Gap","dataFileKey":"VSPGapBlock","usedBy":["Balrog","Oro"]}},{"VSKGapHit":{"dataTableHeader":"VSKoH Gap","detailedHeader":"xx V-Skill > K oH Gap","dataFileKey":"VSKGapHit","usedBy":["Balrog","Oro"]},"VSKGapBlock":{"dataTableHeader":"VSKoB Gap","detailedHeader":"xx V-Skill > K oB Gap","dataFileKey":"VSKGapBlock","usedBy":["Balrog","Oro"]}},{"vtc2DashOnHit":{"dataTableHeader":"VT2oH Dash","detailedHeader":"xx V-Trigger 2 Dash oH","dataFileKey":"vtc2DashOnHit","usedBy":["Cammy","Nash"]},"vtc2DashOnBlock":{"dataTableHeader":"VT2oB Dash","detailedHeader":"xx V-Trigger 2 Dash oB","dataFileKey":"vtc2DashOnBlock","usedBy":["Cammy","Nash"]}},{"vtc1GapOnHit":{"dataTableHeader":"VT1oH Gap","detailedHeader":"xx V-Trigger 1 oH Gap","dataFileKey":"vtc1GapOnHit","usedBy":["Dhalsim","Ed","Kolin","Rashid"]},"vtc1GapOnBlock":{"dataTableHeader":"VT1oB Gap","detailedHeader":"xx V-Trigger 1 oB Gap","dataFileKey":"vtc1GapOnBlock","usedBy":["Dhalsim","Ed","Kolin","Rashid"]}},{"vtc2GapOnBlock":{"dataTableHeader":"VT2oB Gap","detailedHeader":"xx V-Trigger 2 oB Gap","dataFileKey":"vtc2GapOnBlock","usedBy":["Chun-Li"]}},{"vtc2scOnHit":{"dataTableHeader":"VT2oH SC","detailedHeader":"xx V-Trigger 2 Stance Cancel oH","dataFileKey":"vtc2scOnHit","usedBy":["Akira"]},"vtc2scOnBlock":{"dataTableHeader":"VT2oB SC","detailedHeader":"xx V-Trigger 2 Stance Cancel oB","dataFileKey":"vtc2scOnBlock","usedBy":["Akira"]}},{"LKorMKDashOH":{"dataTableHeader":"LKMKoHDash","detailedHeader":"xx LK/MK Cmd Dash oH","dataFileKey":"LKorMKDashOH","usedBy":["F.A.N.G"]},"LKorMKDashOB":{"dataTableHeader":"LKMKoBDash","detailedHeader":"xx LK/MK Cmd Dash oB","dataFileKey":"LKorMKDashOB","usedBy":["F.A.N.G"]}},{"lkDashOH":{"dataTableHeader":"lkDashOH","detailedHeader":"xx LK Cmd Dash oH","dataFileKey":"lkDashOH","usedBy":["Ibuki","Karin"]},"lkDashOB":{"dataTableHeader":"lkDashOB","detailedHeader":"xx LK Cmd Dash oB","dataFileKey":"lkDashOB","usedBy":["Ibuki","Karin"]}},{"mkDashOH":{"dataTableHeader":"mkDashOH","detailedHeader":"xx MK Cmd Dash oH","dataFileKey":"mkDashOH","usedBy":["Ibuki"]},"mkDashOB":{"dataTableHeader":"mkDashOB","detailedHeader":"xx MK Cmd Dash oB","dataFileKey":"mkDashOB","usedBy":["Ibuki"]}},{"exDashOH":{"dataTableHeader":"exDashOH","detailedHeader":"xx EX Cmd Dash oH","dataFileKey":"exDashOH","usedBy":["Karin"]},"exDashOB":{"dataTableHeader":"exDashOB","detailedHeader":"xx EX Cmd Dash oB","dataFileKey":"exDashOB","usedBy":["Karin"]}},{"ocOnHit":{"dataTableHeader":"orb oH","detailedHeader":"xx Orb Recall (far away) oH","dataFileKey":"ocOnHit","usedBy":["Menat"]},"ocOnBlock":{"dataTableHeader":"orb oB","detailedHeader":"xx Orb Recall (far away) oB","dataFileKey":"ocOnBlock","usedBy":["Menat"]}},{"rollcOnHit":{"dataTableHeader":"roll oH","detailedHeader":"xx Roll (V-Skill) oH","dataFileKey":"rollcOnHit","usedBy":["Rashid"]},"rollcOnBlock":{"dataTableHeader":"roll oB","detailedHeader":"xx Roll (V-Skill) oB","dataFileKey":"rollcOnBlock","usedBy":["Rashid"]}},{"vtc1OnHitF":{"dataTableHeader":"VT1F oH","detailedHeader":"xx V-Trigger 1 (forward) oH","dataFileKey":"vtc1OnHitF","usedBy":["Urien"]},"vtc1OnBlockF":{"dataTableHeader":"VT1F oB","detailedHeader":"xx V-Trigger 1 (forward) oB","dataFileKey":"vtc1OnBlockF","usedBy":["Urien"]}},{"vtc1OnHitB":{"dataTableHeader":"VT1B oH","detailedHeader":"xx V-Trigger 1 (back) oH","dataFileKey":"vtc1OnHitB","usedBy":["Urien"]},"vtc1OnBlockB":{"dataTableHeader":"VT1B oB","detailedHeader":"xx V-Trigger 1 (back) oB","dataFileKey":"vtc1OnBlockB","usedBy":["Urien"]}},{"vtc1OnHitD":{"dataTableHeader":"VT1D oH","detailedHeader":"xx V-Trigger 1 (air) oH","dataFileKey":"vtc1OnHitD","usedBy":["Urien"]},"vtc1OnBlockD":{"dataTableHeader":"VT1D oB","detailedHeader":"xx V-Trigger 1 (air) oB","dataFileKey":"vtc1OnBlockD","usedBy":["Urien"]}},{"ssOnHit":{"dataTableHeader":"ssOH","detailedHeader":"xx Claw Switch oH","dataFileKey":"ssOnHit","usedBy":["Vega"]},"ssOnBlock":{"dataTableHeader":"ssOB","detailedHeader":"xx Claw Switch oB","dataFileKey":"ssOnBlock","usedBy":["Vega"]}},{"vt1dashOH":{"dataTableHeader":"VT1DashOH","detailedHeader":"xx V-Trigger 1 dash oH","dataFileKey":"vt1dashOH","usedBy":["Zeku (Old)","Zeku (Young)","Kage"]},"vt1dashOB":{"dataTableHeader":"VT1DashOB","detailedHeader":"xx V-Trigger 1 dash oB","dataFileKey":"vt1dashOB","usedBy":["Zeku (Old)","Zeku (Young)","Kage"]}},{"transfOH":{"dataTableHeader":"tfOH","detailedHeader":"xx Transform (Zeku) oH","dataFileKey":"transfOH","usedBy":["Zeku (Old)","Zeku (Young)"]},"transfOB":{"dataTableHeader":"tfOB","detailedHeader":"xx Transform (Zeku) oB","dataFileKey":"transfOB","usedBy":["Zeku (Old)","Zeku (Young)"]}},{"runstopOH":{"dataTableHeader":"RunStopOH","detailedHeader":"xx Run > Stop oH","dataFileKey":"runstopOH","usedBy":["Zeku (Young)"]},"runstopOB":{"dataTableHeader":"RunStopOB","detailedHeader":"xx Run > Stop oB","dataFileKey":"runstopOB","usedBy":["Zeku (Young)"]}},{"hopsOnHit":{"dataTableHeader":"HopOH","detailedHeader":"xx Blanka Hops oH","dataFileKey":"hopsOnHit","usedBy":["Blanka"]},"hopsOnBlock":{"dataTableHeader":"HopOB","detailedHeader":"xx Blanka Hops oB","dataFileKey":"hopsOnBlock","usedBy":["Blanka"]}},{"KnifeReloadOH":{"dataTableHeader":"KnifeOH","detailedHeader":"xx Knife Reload oH","dataFileKey":"KnifeReloadOH","usedBy":["Cody"]},"KnifeReloadOB":{"dataTableHeader":"KnifeOB","detailedHeader":"xx Knife Reload oB","dataFileKey":"KnifeReloadOB","usedBy":["Cody"]}},{"BeanBallOH":{"dataTableHeader":"BBallOH","detailedHeader":"xx Bean Ball oH","dataFileKey":"BeanBallOH","usedBy":["Cody"]},"BeanBallOB":{"dataTableHeader":"BBallOB","detailedHeader":"xx Bean Ball oB","dataFileKey":"BeanBallOB","usedBy":["Cody"]}},{"PPonHit":{"dataTableHeader":"ppOH","detailedHeader":"xx G Charge oH","dataFileKey":"PPonHit","usedBy":["G"]},"PPonBlock":{"dataTableHeader":"ppOB","detailedHeader":"xx G Charge oB","dataFileKey":"PPonBlock","usedBy":["G"]}},{"KKonHit":{"dataTableHeader":"kkOH","detailedHeader":"xx Speech oH","dataFileKey":"KKonHit","usedBy":["G"]},"KKonBlock":{"dataTableHeader":"kkOB","detailedHeader":"xx Speech oB","dataFileKey":"KKonBlock","usedBy":["G"]}},{"retribution":{"dataTableHeader":"Retri","detailedHeader":"Retribution","dataFileKey":"retribution","usedBy":["Gill"]},"retributionVTC":{"dataTableHeader":"RetriVTC","detailedHeader":"Retribution VTC","dataFileKey":"retributionVTC","usedBy":["Gill"]}},{"whipCancelOH":{"dataTableHeader":"whipOH","detailedHeader":"xx Whip Cancel oH","dataFileKey":"whipCancelOH","usedBy":["Poison"]},"whipCancelOB":{"dataTableHeader":"whipOB","detailedHeader":"xx Whip Cancel oB","dataFileKey":"whipCancelOB","usedBy":["Poison"]}}],
    statsPoints: {
      "The Basics": [
        {
          "health": "Health",
          "stun": "Stun",
        },
        {
          "fastestNormal": "Fastest Normal",
          "bestReversal": "Best Reversal"
        }
      ],
      "V-System": [
        {
          "vgauge1": "V-Trigger 1",
          "vgauge2": "V-Trigger 2",
        },
        {
          "vshiftDist": "V-Shift Dist." 
        }
      ],
      "Walking": [
        {
          "bWalk": "Back Walk Speed",
          "fWalk": "Forward Walk Speed"
        }
      ],
      "Dashing": [
        {
          "bDash": "Back Dash Frames",
          "fDash": "Forward Dash Frames"
        },
        {
          "bDashCHFrames": "Back Dash CH Frames"
        },
        {
          "bDashDist": "Back Dash Dist.",
          "fDashDist": "Forward Dash Dist."
        }
      ],
      "Jumping": [
        {
          "bJump": "Back Jump",
          "nJump": "Neutral Jump",
          "fJump": "Forward Jump"
        },
        {
          "bJumpDist": "Back Jump Distance",
          "fJumpDist": "Forward Jump Distance"
        }
      ],
      "Throwing": [
        {
          "throwHurt": "Throw Hurtbox",
          "throwRange": "Throw Range"
        }

      ]
    },
    defaultLandscapeCols: {startup: "S", active: "A", recovery: "R", onBlock: "oB", onHit: "oH", damage:"dmg", stun:"stun", kd:"kd", kdr:"kdr", kdrb:"kdrb"}
  },
  USF4: {
    fullName: "Ultra Street Fighter 4",
    abbrName: "USF4",
    characterStates: ["normal"] as const,
    specificCharacterStates: [],
    characterList: [
      "Abel",
      "Adon",
      "Akuma",
      "Balrog",
      "Blanka",
      "C.Viper",
      "Cammy",
      "Chun-Li",
      "Cody",
      "Dan",
      "Decapre",
      "Dee Jay",
      "Dhalsim",
      "Dudley",
      "E.Honda",
      "Elena",
      "El Fuerte",
      "Evil Ryu",
      "Fei Long",
      "Gen",
      "Gouken",
      "Guile",
      "Guy",
      "Hakan",
      "Hugo",
      "Ibuki",
      "Juri",
      "Ken",
      "M.Bison",
      "Makoto",
      "Oni",
      "Poison",
      "Rolento",
      "Rose",
      "Rufus",
      "Ryu",
      "Sagat",
      "Sakura",
      "Seth",
      "T.Hawk",
      "Vega",
      "Yang",
      "Yun",
      "Zangief"
    ] as const,
    universalDataPoints: {
      "Basic Frame Data": [
        {
          "startup": {
            "dataTableHeader": "S",
            "detailedHeader": "Startup",
            "dataFileKey": "startup",
          },
          "active": {
            "dataTableHeader": "A",
            "detailedHeader": "Active",
            "dataFileKey": "active",
          },
          "recovery": {
            "dataTableHeader": "R",
            "detailedHeader": "Recovery",
            "dataFileKey": "recovery",
          }
        },
        {
          "onBlock": {
            "dataTableHeader": "oB",
            "detailedHeader": "On Block",
            "dataFileKey": "onBlock",
          },
          "onHit": {
            "dataTableHeader": "oH",
            "detailedHeader": "On Hit",
            "dataFileKey": "onHit",
          }
        }
      ],
      "Move Properties": [
        {
          "moveType": {
            "dataTableHeader": "mT",
            "detailedHeader": "Move Type",
            "dataFileKey": "moveType",
          },
          "cancelsTo": {
            "dataTableHeader": "xx",
            "detailedHeader": "Cancels To",
            "dataFileKey": "cancelsTo",
          },
        },
        {
          "damage": {
            "dataTableHeader": "dmg",
            "detailedHeader": "Damage",
            "dataFileKey": "damage",
          },
          "stun": {
            "dataTableHeader": "stun",
            "detailedHeader": "Stun",
            "dataFileKey": "stun",
          },
        },
      ]
    },
    specificCancels: [],
    statsPoints: {
      "The Basics": [
        {
          "health": "Health",
          "stun": "Stun",
        },
        {
          "wUltra": "Double Ultra Scaling"
        }
      ],
      "Ground Movement": [
        {
          "bDash": "Back Dash Frames",
          "fDash": "Forward Dash Frames"
        },
        {
          "lvlOneB": "Level 1 Focus Back",
          "lvlOneF": "Level 1 Focus Forward"
        },
        {
          "lvlTwoB": "Level 2 Focus Back",
          "lvlTwoF": "Level 2 Focus Forward"
        }
      ]
    },
    defaultLandscapeCols: {startup: "S", active: "A", recovery: "R", onBlock: "oB", onHit: "oH", damage:"dmg", stun:"stun", cancelsTo: "xx"}
  },
  '3S': {
    fullName: "Street Fighter 3: Third Strike",
    abbrName: "3S",
    characterStates: ["normal"] as const,
    specificCharacterStates: [],
    characterList: [
      "Alex",
      "Akuma",
      "Chun-Li",
      "Dudley",
      "Elena",
      "Hugo",
      "Ibuki",
      "Ken",
      "Makoto",
      "Necro",
      "Oro",
      "Q",
      "Remy",
      "Ryu",
      "Sean",
      "Twelve",
      "Urien",
      "Yang",
      "Yun"
    ] as const,
    universalDataPoints: {
      "Basic Frame Data": [
        {
          "startup": {
            "dataTableHeader": "S",
            "detailedHeader": "Startup",
            "dataFileKey": "startup",
          },
          "active": {
            "dataTableHeader": "A",
            "detailedHeader": "Active",
            "dataFileKey": "active",
          },
          "recovery": {
            "dataTableHeader": "R",
            "detailedHeader": "Recovery",
            "dataFileKey": "recovery",
          }
        },
        {
          "onBlock": {
            "dataTableHeader": "oB",
            "detailedHeader": "On Block",
            "dataFileKey": "onBlock",
          },
          "onHit": {
            "dataTableHeader": "oH",
            "detailedHeader": "On Hit",
            "dataFileKey": "onHit",
          }
        },
        {
          "onHitCrouch": {
            "dataTableHeader": "oH-Cr",
            "detailedHeader": "On Hit Crouch",
            "dataFileKey": "onHitCrouch",
          },
          "maxAdv": {
            "dataTableHeader": "MaxAdv",
            "detailedHeader": "Max Advantage",
            "dataFileKey": "maxAdv",
          }
        }
      ],
      "Move Properties": [
        {
          "moveType": {
            "dataTableHeader": "mT",
            "detailedHeader": "Move Type",
            "dataFileKey": "moveType",
          },
          "cancelsTo": {
            "dataTableHeader": "xx",
            "detailedHeader": "Cancels To",
            "dataFileKey": "cancelsTo",
          },
        },
        {
          "damage": {
            "dataTableHeader": "dmg",
            "detailedHeader": "Damage",
            "dataFileKey": "damage",
          },
          "stun": {
            "dataTableHeader": "stun",
            "detailedHeader": "Stun",
            "dataFileKey": "stun",
          },
        },
        {
          "attackLevel": {
            "dataTableHeader": "attLvl",
            "detailedHeader": "Attack Level",
            "dataFileKey": "attackLevel",
          },
          "parry": {
            "dataTableHeader": "parry",
            "detailedHeader": "Parry Level",
            "dataFileKey": "parry",
          }
        },
        {
          "karaRange": {
            "dataTableHeader": "kara",
            "detailedHeader": "Kara Range",
            "dataFileKey": "karaRange",
          },
          "throwRange": {
            "dataTableHeader": "thRng",
            "detailedHeader": "Throw Range",
            "dataFileKey": "throwRange",
          }
        },
      ],
      "Meter Build": [
        {
          "meterAtkWhiff": {
            "dataTableHeader": "mAtk-Wf",
            "detailedHeader": "Attack Whiff",
            "dataFileKey": "meterAtkWhiff",
          }
        },
        {
          "meterAtkHit": {
            "dataTableHeader": "mAtk-H",
            "detailedHeader": "Attack Hit",
            "dataFileKey": "meterAtkHit",
          },
          "meterAtkBlk": {
            "dataTableHeader": "mAtk-B",
            "detailedHeader": "Attack Block",
            "dataFileKey": "meterAtkBlk",
          }
        },
        {
          "meterOppHit": {
            "dataTableHeader": "mOpp-H",
            "detailedHeader": "Opponent Hit",
            "dataFileKey": "meterOppHit",
          },
          "meterOppBlk": {
            "dataTableHeader": "mOpp-B",
            "detailedHeader": "Opponent Block",
            "dataFileKey": "meterOppBlk",
          }
        },

      ]
    },
    specificCancels: [],
    statsPoints: {
      "The Basics": [
        {
          "health": "Health",
          "stun": "Stun",
        },
        {
          "wUltra": "Double Ultra Scaling"
        }
      ],
      "Ground Movement": [
        {
          "bDash": "Back Dash Frames",
          "fDash": "Forward Dash Frames"
        },
        {
          "lvlOneB": "Level 1 Focus Back",
          "lvlOneF": "Level 1 Focus Forward"
        },
        {
          "lvlTwoB": "Level 2 Focus Back",
          "lvlTwoF": "Level 2 Focus Forward"
        }
      ]
    },
    defaultLandscapeCols: {startup: "S", active: "A", recovery: "R", onBlock: "oB", onHit: "oH", damage:"dmg", stun:"stun", cancelsTo: "xx", parry: "parry"}
  },
  GGST: {
    fullName: "Guilty Gear Strive",
    abbrName: "GGST",
    characterStates: ["normal"] as const,
    specificCharacterStates: {
      "Goldlewis": ["L2", "L3"],
      "Ky": ["Dragon Install"],
      "Nagoriyuki": ["L2", "L3", "BR"]
    },
    characterList: [
      "Anji",
      "Axl",
      "Baiken",
      "Bridget",
      "Chipp",
      "Faust",
      "Giovanna",
      "Goldlewis",
      "H. Chaos",
      "I-No",
      "Jack-O",
      "Ky",
      "Leo",
      "May",
      "Millia",
      "Nagoriyuki",
      "Potemkin",
      "Ramlethal",
      "Sol",
      "Testament",
      "Zato-1"
    ] as const,

    universalDataPoints: {
      "Basic Frame Data": [
        {
          "startup": {
            "dataTableHeader": "S",
            "detailedHeader": "Startup",
            "dataFileKey": "startup",
          },
          "active": {
            "dataTableHeader": "A",
            "detailedHeader": "Active",
            "dataFileKey": "active",
          },
          "recovery": {
            "dataTableHeader": "R",
            "detailedHeader": "Recovery",
            "dataFileKey": "recovery",
          }
        },
        {
          "total": {
            "dataTableHeader": "T",
            "detailedHeader": "Total",
            "dataFileKey": "total",
          },
        },
        {
          "onBlock": {
            "dataTableHeader": "oB",
            "detailedHeader": "On Block",
            "dataFileKey": "onBlock",
          },
          "onHit": {
            "dataTableHeader": "oH",
            "detailedHeader": "On Hit",
            "dataFileKey": "onHit",
          }
        }
      ],
      "Move Properties": [
        {
          "moveType": {
            "dataTableHeader": "mT",
            "detailedHeader": "Move Type",
            "dataFileKey": "moveType",
          },
          "cancelsTo": {
            "dataTableHeader": "xx",
            "detailedHeader": "Cancels To",
            "dataFileKey": "cancelsTo",
          },
        },
        {
          "gatling": {
            "dataTableHeader": "gatl",
            "detailedHeader": "Gatling To",
            "dataFileKey": "gatling",
          },
        }
      ],
      "Offensive Properties": [
        {
          "damage": {
            "dataTableHeader": "dmg",
            "detailedHeader": "Damage",
            "dataFileKey": "damage",
          },
          "attackLevel": {
            "dataTableHeader": "atkLvl",
            "detailedHeader": "Attack Level",
            "dataFileKey": "attackLevel",
          },
        },
        {
          "riscGain": {
            "dataTableHeader": "risc",
            "detailedHeader": "Risc Gain",
            "dataFileKey": "riscGain",
          },
          "prorate": {
            "dataTableHeader": "prorate",
            "detailedHeader": "Prorate",
            "dataFileKey": "prorate",
          },
          
        },
        {
          "guardLevel": {
            "dataTableHeader": "guard",
            "detailedHeader": "Guard Level",
            "dataFileKey": "guardLevel",
          }
        },
      ],
      "Knockdown & Counterhit": [
        {
          "kda": {
            "dataTableHeader": "kda",
            "detailedHeader": "Knockdown Adv.",
            "dataFileKey": "kda",
          },
          "chAdv": {
            "dataTableHeader": "chAdv",
            "detailedHeader": "Counterhit Adv.",
            "dataFileKey": "chAdv",
          },
        },
      ],
      "Extra Information": [
        {
          "extraInfo": {
            "dataTableHeader": "Notes",
            "detailedHeader": "Extra Info",
            "dataFileKey": "extraInfo",
          }
        }
      ]
    },
    specificCancels: [],
    statsPoints: {
      "The Basics": [
        {
          "defense": "Defense",
          "guts": "Guts",
        },
        {
          "weight": "Weight",
          "bestReversal": "Best Reversal",
          "fastestNormal": "Fastest Normal"
        }
      ],
      "Dashing": [
        {
          "fwdDash": "Fwd Dash Speed",
        },
        {
          "backdashSpeed": "Back Dash Speed",
          "backdashInvul": "Back Dash Invul",
        },
        {
          "airFwdDash": "Air Fwd Dash Speed" ,
          "airBckDash": "Air Back Dash Speed",
        },
        {
          "btFwdDash": "BT Fwd Dash",
          "btBckDash": "BT Back Dash"
        }
      ],
      "Jumping": [
        {
          "prejump": "Prejump Frames",
          "jumpTotal": "Total Jump Frames",
          "highJumpTotal": "Total High Jump Frames",

        }
      ],
      "Defense": [
        {
          "effectiveHealth": "Effective Health",
          "defense": "Defense",
          "riscMod": "RISC Modifier",
          "guts": "guts",
        },
      ],
    },
    defaultLandscapeCols: {startup: "S", active: "A", recovery: "R", onBlock: "oB", onHit: "oH", damage:"dmg", attackLevel: "lvl", riscGain: "risc", prorate: "prorate", guardLevel: "guard"}
  },
};

export default GAME_DETAILS;