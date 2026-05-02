{
    "pickpocketing": [
        {
            "_id": 1,
            "desc": "Man lv 5",
            "xp": 10,
            "requirements": [
                {
                    "desc": "crime level >= 1",
                    "type": "skill",
                    "skill": "crime",
                    "level": 1,
                    "operator": ">=",
                    "checkCurrentLevel" : true
                }
            ],
            "baseProbabilityOfSuccess": 0.55,
            "maxLvlProbabilityOfSuccess": 1.25,
            "stunTicks": 5,
            "stunDamage": 2,
            "stunMessage": "Help! Thief!",
            "rareLootProbability" : 0,
            "rootLoot" : null,
            "baseLoot": [
                {
                    "itemId": 6,
                    "name": "coins",
                    "isIOU": false,
                    "amount": 3
                }
            ],
            "loot": [{
                "itemId": 556,
                "name": "fuchsia key",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0005
            },
            {
                "itemId": 555,
                "name": "celadon key",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0001
            }]
        },
        {
            "_id": 2,
            "desc": "Fisherman lv 8",
            "xp": 12,
            "requirements": [
                {
                    "desc": "crime level >= 3",
                    "type": "skill",
                    "skill": "crime",
                    "level": 3,
                    "operator": ">=",
                    "checkCurrentLevel" : true
                }
            ],
            "baseProbabilityOfSuccess": 0.525,
            "maxLvlProbabilityOfSuccess": 1.2,
            "stunTicks": 5,
            "stunDamage": 3,
            "stunMessage": "Get your hands off me you thief!",
            "rareLootProbability" : 0,
            "rootLoot" : null,
            "baseLoot": [
                {
                    "itemId": 6,
                    "name": "coins",
                    "isIOU": false,
                    "amount": 4
                }
            ],
            "loot": [
                {
                    "itemId": 224,
                    "name": "starfish",
                    "isIOU": false,
                    "amount": 1,
                    "odds": 0.25
                },
                {
                    "itemId": 556,
                    "name": "fuchsia key",
                    "isIOU": false,
                    "amount": 1,
                    "odds": 0.0005
                },
                {
                    "itemId": 555,
                    "name": "celadon key",
                    "isIOU": false,
                    "amount": 1,
                    "odds": 0.0001
                }
            ]
        },
        {
            "_id": 3,
            "desc": "Lumberjack lv 10",
            "xp": 14,
            "requirements": [
                {
                    "desc": "crime level >= 6",
                    "type": "skill",
                    "skill": "crime",
                    "level": 6,
                    "operator": ">=",
                    "checkCurrentLevel" : true
                }
            ],
            "baseProbabilityOfSuccess": 0.525,
            "maxLvlProbabilityOfSuccess": 1.175,
            "stunTicks": 5,
            "stunDamage": 3,
            "stunMessage": "Want me to chop off your hands with my axe?",
            "rareLootProbability" : 0,
            "rootLoot" : null,
            "baseLoot": [
                {
                    "itemId": 6,
                    "name": "coins",
                    "isIOU": false,
                    "amount": 5
                }
            ],
            "loot": [
                {
                    "itemId": 112,
                    "name": "leaf",
                    "isIOU": false,
                    "amount": 1,
                    "odds": 0.25
                },
                {
                    "itemId": 556,
                    "name": "fuchsia key",
                    "isIOU": false,
                    "amount": 1,
                    "odds": 0.0005
                },
                {
                    "itemId": 555,
                    "name": "celadon key",
                    "isIOU": false,
                    "amount": 1,
                    "odds": 0.0001
                }
            ]
        },
        {
            "_id": 4,
            "desc": "Farmer lv 5",
            "xp": 16,
            "requirements": [
                {
                    "desc": "crime level >= 10",
                    "type": "skill",
                    "skill": "crime",
                    "level": 10,
                    "operator": ">=",
                    "checkCurrentLevel" : true
                }
            ],
            "baseProbabilityOfSuccess": 0.52,
            "maxLvlProbabilityOfSuccess": 1.15,
            "stunTicks": 5,
            "stunDamage": 3,
            "stunMessage": "You dirty thief!",
            "rareLootProbability" : 0,
            "rootLoot" : null,
            "baseLoot": [
                {
                    "itemId": 6,
                    "name": "coins",
                    "isIOU": false,
                    "amount": 8
                }
            ],
            "loot": [
                {
                    "itemId": 556,
                    "name": "fuchsia key",
                    "isIOU": false,
                    "amount": 1,
                    "odds": 0.0005
                },
                {
                    "itemId": 555,
                    "name": "celadon key",
                    "isIOU": false,
                    "amount": 1,
                    "odds": 0.0001
                }
            ]
        },
        {
            "_id": 5,
            "desc": "Guard lv 10",
            "xp": 20,
            "requirements": [
                {
                    "desc": "crime level >= 14",
                    "type": "skill",
                    "skill": "crime",
                    "level": 14,
                    "operator": ">=",
                    "checkCurrentLevel" : true
                }
            ],
            "baseProbabilityOfSuccess": 0.51,
            "maxLvlProbabilityOfSuccess": 1.125,
            "stunTicks": 5,
            "stunDamage": 3,
            "stunMessage": "I'll arrest you for that!",
            "rareLootProbability" : 0,
            "rootLoot" : null,
            "baseLoot": [
                {
                    "itemId": 6,
                    "name": "coins",
                    "isIOU": false,
                    "amount": 12
                }
            ],
            "loot": [
                {
                    "itemId": 556,
                    "name": "fuchsia key",
                    "isIOU": false,
                    "amount": 1,
                    "odds": 0.00075
                },
                {
                    "itemId": 555,
                    "name": "celadon key",
                    "isIOU": false,
                    "amount": 1,
                    "odds": 0.0001
                }
            ]
        },
        {
            "_id": 6,
            "desc": "Guard lv 18",
            "xp": 30,
            "requirements": [
                {
                    "desc": "crime level >= 20",
                    "type": "skill",
                    "skill": "crime",
                    "level": 20,
                    "operator": ">=",
                    "checkCurrentLevel" : true
                }
            ],
            "baseProbabilityOfSuccess": 0.5,
            "maxLvlProbabilityOfSuccess": 1.075,
            "stunTicks": 5,
            "stunDamage": 3,
            "stunMessage": "I'll arrest you for that!",
            "rareLootProbability" : 0,
            "rootLoot" : null,
            "baseLoot": [
                {
                    "itemId": 6,
                    "name": "coins",
                    "isIOU": false,
                    "amount": 15
                }
            ],
            "loot": [
                {
                    "itemId": 556,
                    "name": "fuchsia key",
                    "isIOU": false,
                    "amount": 1,
                    "odds": 0.001
                },
                {
                    "itemId": 555,
                    "name": "celadon key",
                    "isIOU": false,
                    "amount": 1,
                    "odds": 0.0002
                }
            ]
        },
        {
            "_id": 7,
            "desc": "Dwarf lv 14",
            "xp": 40,
            "requirements": [
                {
                    "desc": "crime level >= 30",
                    "type": "skill",
                    "skill": "crime",
                    "level": 30,
                    "operator": ">=",
                    "checkCurrentLevel" : true
                }
            ],
            "baseProbabilityOfSuccess": 0.5,
            "maxLvlProbabilityOfSuccess": 1.0,
            "stunTicks": 5,
            "stunDamage": 3,
            "stunMessage": "Trying to steal my belongings are ye?",
            "rareLootProbability" : 0,
            "rootLoot" : null,
            "baseLoot": [
                {
                    "itemId": 6,
                    "name": "coins",
                    "isIOU": false,
                    "amount": 15
                }
            ],
            "loot": [
                {
                    "itemId": 79,
                    "name": "iron ore",
                    "amount": 1,
                    "isIOU": true,
                    "odds": 0.08
                },
                {
                    "itemId": 142,
                    "name": "coal",
                    "amount": 1,
                    "isIOU": true,
                    "odds": 0.04
                },
                {
                    "itemId": 272,
                    "name": "potion of mining (1)",
                    "amount": 1,
                    "isIOU": false,
                    "odds": 0.01
                },
                {
                    "itemId": 48,
                    "name": "palladium ore",
                    "amount": 1,
                    "isIOU": true,
                    "odds": 0.0025
                },
                {
                    "itemId": 556,
                    "name": "fuchsia key",
                    "isIOU": false,
                    "amount": 1,
                    "odds": 0.002
                },
                {
                    "itemId": 555,
                    "name": "celadon key",
                    "isIOU": false,
                    "amount": 1,
                    "odds": 0.0003
                }
            ]
        },
        {
            "_id": 8,
            "desc": "Squire lv 20",
            "xp": 45,
            "requirements": [
                {
                    "desc": "crime level >= 35",
                    "type": "skill",
                    "skill": "crime",
                    "level": 35,
                    "operator": ">=",
                    "checkCurrentLevel" : true
                }
            ],
            "baseProbabilityOfSuccess": 0.5,
            "maxLvlProbabilityOfSuccess": 0.975,
            "stunTicks": 5,
            "stunDamage": 3,
            "stunMessage": "Get your hands off me!",
            "rareLootProbability" : 0,
            "rootLoot" : null,
            "baseLoot": [
                {
                    "itemId": 6,
                    "name": "coins",
                    "isIOU": false,
                    "amount": 25
                }
            ],
            "loot": [
                {
                    "itemId": 556,
                    "name": "fuchsia key",
                    "isIOU": false,
                    "amount": 1,
                    "odds": 0.002
                },
                {
                    "itemId": 555,
                    "name": "celadon key",
                    "isIOU": false,
                    "amount": 1,
                    "odds": 0.0003
                }
            ]
        },
        {
            "_id": 9,
            "desc": "Knight lv 45",
            "xp": 65,
            "requirements": [
                {
                    "desc": "crime level >= 45",
                    "type": "skill",
                    "skill": "crime",
                    "level": 45,
                    "operator": ">=",
                    "checkCurrentLevel" : true
                }
            ],
            "baseProbabilityOfSuccess": 0.475,
            "maxLvlProbabilityOfSuccess": 0.95,
            "stunTicks": 6,
            "stunDamage": 4,
            "stunMessage": "Thief!",
            "rareLootProbability" : 0,
            "rootLoot" : null,
            "baseLoot": [
                {
                    "itemId": 6,
                    "name": "coins",
                    "isIOU": false,
                    "amount": 40
                }
            ],
            "loot": [
                {
                    "itemId": 556,
                    "name": "fuchsia key",
                    "isIOU": false,
                    "amount": 1,
                    "odds": 0.002
                },
                {
                    "itemId": 555,
                    "name": "celadon key",
                    "isIOU": false,
                    "amount": 1,
                    "odds": 0.0003
                }
            ]
        },
        {
            "_id": 10,
            "desc": "Wizard lv 16",
            "xp": 80,
            "requirements": [
                {
                    "desc": "crime level >= 52",
                    "type": "skill",
                    "skill": "crime",
                    "level": 52,
                    "operator": ">=",
                    "checkCurrentLevel" : true
                }
            ],
            "baseProbabilityOfSuccess": 0.45,
            "maxLvlProbabilityOfSuccess": 0.92,
            "stunTicks": 5,
            "stunDamage": 3,
            "stunMessage": "What on earth are you doing?",
            "rareLootProbability" : 0,
            "rootLoot" : null,
            "baseLoot": [
                {
                    "itemId": 6,
                    "name": "coins",
                    "isIOU": false,
                    "amount": 25
                }
            ],
            "loot": [
                {
                    "itemId": 175,
                    "name": "flame scroll",
                    "isIOU": false,
                    "amount": 3,
                    "odds": 0.25
                },
                {
                    "itemId": 176,
                    "name": "water scroll",
                    "isIOU": false,
                    "amount": 3,
                    "odds": 0.25
                },
                {
                    "itemId": 177,
                    "name": "nature scroll",
                    "isIOU": false,
                    "amount": 3,
                    "odds": 0.25
                },
                {
                    "itemId": 178,
                    "name": "fury scroll",
                    "isIOU": false,
                    "amount": 2,
                    "odds": 0.15
                },
                {
                    "itemId": 179,
                    "name": "rage scroll",
                    "isIOU": false,
                    "amount": 2,
                    "odds": 0.075
                },
                {
                    "itemId": 181,
                    "name": "warp scroll",
                    "isIOU": false,
                    "amount": 2,
                    "odds": 0.02
                },
                {
                    "itemId": 556,
                    "name": "fuchsia key",
                    "isIOU": false,
                    "amount": 1,
                    "odds": 0.002
                },
                {
                    "itemId": 555,
                    "name": "celadon key",
                    "isIOU": false,
                    "amount": 1,
                    "odds": 0.0003
                }
            ]
        },
        {
            "_id": 11,
            "desc": "Knight lv 60",
            "xp": 125,
            "requirements": [
                {
                    "desc": "crime level >= 60",
                    "type": "skill",
                    "skill": "crime",
                    "level": 60,
                    "operator": ">=",
                    "checkCurrentLevel" : true
                }
            ],
            "baseProbabilityOfSuccess": 0.44,
            "maxLvlProbabilityOfSuccess": 0.9,
            "stunTicks": 6,
            "stunDamage": 4,
            "stunMessage": "Trying to steal from me, are you?",
            "rareLootProbability" : 0,
            "rootLoot" : null,
            "baseLoot": [
                {
                    "itemId": 6,
                    "name": "coins",
                    "isIOU": false,
                    "amount": 30
                }
            ],
            "loot": [
                {
                    "itemId": 6,
                    "name": "coins",
                    "isIOU": false,
                    "amount": 30,
                    "odds": 0.5
                },
                {
                    "itemId": 179,
                    "name": "rage scroll",
                    "isIOU": false,
                    "amount": 1,
                    "odds": 0.4
                },
                {
                    "itemId": 556,
                    "name": "fuchsia key",
                    "isIOU": false,
                    "amount": 1,
                    "odds": 0.002
                },
                {
                    "itemId": 555,
                    "name": "celadon key",
                    "isIOU": false,
                    "amount": 1,
                    "odds": 0.0003
                }
            ]
        },
        {
            "_id": 12,
            "desc": "gnomes",
            "xp": 150,
            "requirements": [
                {
                    "desc": "crime level >= 68",
                    "type": "skill",
                    "skill": "crime",
                    "level": 68,
                    "operator": ">=",
                    "checkCurrentLevel" : true
                }
            ],
            "baseProbabilityOfSuccess": 0.44,
            "maxLvlProbabilityOfSuccess": 0.85,
            "stunTicks": 5,
            "stunDamage": 1,
            "stunMessage": "Get your grubby hands off me!",
            "rareLootProbability" : 0,
            "rootLoot" : null,
            "baseLoot": [
                {
                    "itemId": 6,
                    "name": "coins",
                    "isIOU": false,
                    "amount": 25
                }
            ],
            "loot": [
                {
                    "itemId": 6,
                    "name": "coins",
                    "isIOU": false,
                    "amount": 50,
                    "odds": 0.55
                },
                {
                    "itemId": 6,
                    "name": "coins",
                    "isIOU": false,
                    "amount": 100,
                    "odds": 0.2
                },
                {
                    "itemId": 289,
                    "name": "baked potato",
                    "isIOU": false,
                    "amount": 1,
                    "odds": 0.1
                },
                {
                    "itemId": 37,
                    "name": "raw frog",
                    "isIOU": false,
                    "amount": 1,
                    "odds": 0.075
                },
                {
                    "itemId": 330,
                    "name": "steel arrowheads",
                    "isIOU": false,
                    "amount": 15,
                    "odds": 0.015
                },
                {
                    "itemId": 300,
                    "name": "rough emerald",
                    "isIOU": false,
                    "amount": 1,
                    "odds": 0.01
                },
                {
                    "itemId": 556,
                    "name": "fuchsia key",
                    "isIOU": false,
                    "amount": 1,
                    "odds": 0.002
                },
                {
                    "itemId": 555,
                    "name": "celadon key",
                    "isIOU": false,
                    "amount": 1,
                    "odds": 0.0003
                }
            ]
        },
        {
            "_id": 13,
            "desc": "Wizard lv 40",
            "xp": 200,
            "requirements": [
                {
                    "desc": "crime level >= 74",
                    "type": "skill",
                    "skill": "crime",
                    "level": 74,
                    "operator": ">=",
                    "checkCurrentLevel" : true
                }
            ],
            "baseProbabilityOfSuccess": 0.425,
            "maxLvlProbabilityOfSuccess": 0.8,
            "stunTicks": 6,
            "stunDamage": 3,
            "stunMessage": "What on earth are you doing?",
            "rareLootProbability" : 0,
            "rootLoot" : null,
            "baseLoot": [
                {
                    "itemId": 6,
                    "name": "coins",
                    "isIOU": false,
                    "amount": 25
                }
            ],
            "loot": [
                {
                    "itemId": 175,
                    "name": "flame scroll",
                    "isIOU": false,
                    "amount": 5,
                    "odds": 0.25
                },
                {
                    "itemId": 176,
                    "name": "water scroll",
                    "isIOU": false,
                    "amount": 5,
                    "odds": 0.25
                },
                {
                    "itemId": 177,
                    "name": "nature scroll",
                    "isIOU": false,
                    "amount": 5,
                    "odds": 0.25
                },
                {
                    "itemId": 179,
                    "name": "rage scroll",
                    "isIOU": false,
                    "amount": 4,
                    "odds": 0.15
                },
                {
                    "itemId": 181,
                    "name": "warp scroll",
                    "isIOU": false,
                    "amount": 2,
                    "odds": 0.05
                },
                {
                    "itemId": 184,
                    "name": "alchemy scroll",
                    "isIOU": false,
                    "amount": 3,
                    "odds": 0.04
                },
                {
                    "itemId": 556,
                    "name": "fuchsia key",
                    "isIOU": false,
                    "amount": 1,
                    "odds": 0.002
                },
                {
                    "itemId": 555,
                    "name": "celadon key",
                    "isIOU": false,
                    "amount": 1,
                    "odds": 0.0003
                }
            ]
        },
        {
            "_id": 14,
            "desc": "Elf lv 35",
            "xp": 225,
            "requirements": [
                {
                    "desc": "crime level >= 78",
                    "type": "skill",
                    "skill": "crime",
                    "level": 78,
                    "operator": ">=",
                    "checkCurrentLevel" : true
                }
            ],
            "baseProbabilityOfSuccess": 0.375,
            "maxLvlProbabilityOfSuccess": 0.75,
            "stunTicks": 6,
            "stunDamage": 4,
            "stunMessage": "What are you doing?",
            "rareLootProbability" : 0,
            "rootLoot" : null,
            "baseLoot": [
                {
                    "itemId": 6,
                    "name": "coins",
                    "isIOU": false,
                    "amount": 75
                }
            ],
            "loot": [
                {
                    "itemId": 334,
                    "name": "bronze arrows",
                    "isIOU": false,
                    "amount": 5,
                    "odds": 0.2
                },
                {
                    "itemId": 335,
                    "name": "iron arrows",
                    "isIOU": false,
                    "amount": 5,
                    "odds": 0.1
                },
                {
                    "itemId": 336,
                    "name": "steel arrows",
                    "isIOU": false,
                    "amount": 5,
                    "odds": 0.05
                },
                {
                    "itemId": 337,
                    "name": "palladium arrows",
                    "isIOU": false,
                    "amount": 5,
                    "odds": 0.025
                },
                {
                    "itemId": 338,
                    "name": "coronium arrows",
                    "isIOU": false,
                    "amount": 5,
                    "odds": 0.01
                },
                {
                    "itemId": 339,
                    "name": "celadon arrows",
                    "isIOU": false,
                    "amount": 5,
                    "odds": 0.005
                },
                {
                    "itemId": 556,
                    "name": "fuchsia key",
                    "isIOU": false,
                    "amount": 1,
                    "odds": 0.002
                },
                {
                    "itemId": 555,
                    "name": "celadon key",
                    "isIOU": false,
                    "amount": 1,
                    "odds": 0.0003
                }
            ]
        },
        {
            "_id": 15,
            "desc": "Elder Knight lv 102",
            "xp": 270,
            "requirements": [
                {
                    "desc": "crime level >= 82",
                    "type": "skill",
                    "skill": "crime",
                    "level": 82,
                    "operator": ">=",
                    "checkCurrentLevel" : true
                }
            ],
            "baseProbabilityOfSuccess": 0.35,
            "maxLvlProbabilityOfSuccess": 0.7,
            "stunTicks": 6,
            "stunDamage": 4,
            "stunMessage": "Get your hands off my belongings!",
            "rareLootProbability" : 0,
            "rootLoot" : null,
            "baseLoot": [
                {
                    "itemId": 6,
                    "name": "coins",
                    "isIOU": false,
                    "amount": 25
                }
            ],
            "loot": [
                {
                    "itemId": 6,
                    "name": "coins",
                    "isIOU": false,
                    "amount": 100,
                    "odds": 0.35
                },
                {
                    "itemId": 6,
                    "name": "coins",
                    "isIOU": false,
                    "amount": 250,
                    "odds": 0.25
                },
                {
                    "itemId": 6,
                    "name": "coins",
                    "isIOU": false,
                    "amount": 375,
                    "odds": 0.1
                },
                {
                    "itemId": 89,
                    "name": "silver nugget",
                    "isIOU": false,
                    "amount": 1,
                    "odds": 0.1
                },
                {
                    "itemId": 358,
                    "name": "blood scroll",
                    "isIOU": false,
                    "amount": 1,
                    "odds": 0.075
                },
                {
                    "itemId": 184,
                    "name": "alchemy scroll",
                    "isIOU": false,
                    "amount": 5,
                    "odds": 0.035
                },
                {
                    "itemId": 90,
                    "name": "gold nugget",
                    "isIOU": false,
                    "amount": 1,
                    "odds": 0.025
                },
                {
                    "itemId": 85,
                    "name": "ruby",
                    "isIOU": false,
                    "amount": 1,
                    "odds": 0.01
                },
                {
                    "itemId": 86,
                    "name": "diamond",
                    "isIOU": false,
                    "amount": 1,
                    "odds": 0.005
                },
                {
                    "itemId": 556,
                    "name": "fuchsia key",
                    "isIOU": false,
                    "amount": 1,
                    "odds": 0.002
                },
                {
                    "itemId": 555,
                    "name": "celadon key",
                    "isIOU": false,
                    "amount": 1,
                    "odds": 0.0003
                }
            ]
        }
    ]
}