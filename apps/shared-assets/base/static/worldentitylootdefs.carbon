[
	{
		"_id": 1,
		"desc": "Search Crate",
		"xpRewards": [],
		"requirements": [],
		"baseProbabilityOfSuccess": 1,
		"maxLvlProbabilityOfSuccess": 1,
		"respawnTicks": 0,
        "oddsOfHavingLootOnRespawn": 0.2,
		"searchStartResult": [],
		"searchEndResult": [],
        "rareLootProbability" : 0,
        "rootLoot" : null,
		"baseLoot": [],
		"loot": [
			{
				"itemId": 6,
				"name": "coins",
				"isIOU": false,
				"amount": 2,
				"odds": 0.4
			},
			{
				"itemId": 6,
				"name": "coins",
				"isIOU": false,
				"amount": 3,
				"odds": 0.1
			},
			{
				"itemId": 154,
				"name": "chisel",
				"isIOU": false,
				"amount": 1,
				"odds": 0.1
			},
			{
				"itemId": 155,
				"name": "hammer",
				"isIOU": false,
				"amount": 1,
				"odds": 0.1
			},
			{
				"itemId": 346,
				"name": "knife",
				"isIOU": false,
				"amount": 1,
				"odds": 0.1
			},
			{
				"itemId": 259,
				"name": "vial",
				"isIOU": false,
				"amount": 1,
				"odds": 0.05
			},
			{
				"itemId": 326,
				"name": "arrow shafts",
				"isIOU": false,
				"amount": 3,
				"odds": 0.05
			},
			{
				"itemId": 70,
				"name": "bronze bar",
				"isIOU": false,
				"amount": 1,
				"odds": 0.05
			},
			{
				"itemId": 137,
				"name": "leather gloves",
				"isIOU": false,
				"amount": 1,
				"odds": 0.03
			},
			{
				"itemId": 52,
				"name": "bronze helm",
				"isIOU": false,
				"amount": 1,
				"odds": 0.02
			}
		]
	},
	{
		"_id": 2,
		"desc": "Search Chest",
		"xpRewards": [],
		"requirements": [],
		"baseProbabilityOfSuccess": 1,
		"maxLvlProbabilityOfSuccess": 1,
		"respawnTicks": 0,
        "oddsOfHavingLootOnRespawn": 0.05,
		"searchStartResult": [],
		"searchEndResult": [],
        "rareLootProbability" : 0,
        "rootLoot" : null,
		"baseLoot": [],
		"loot": [
			{
				"itemId": 6,
				"name": "coins",
				"isIOU": false,
				"amount": 10,
				"odds": 0.75
			},
			{
				"itemId": 6,
				"name": "coins",
				"isIOU": false,
				"amount": 20,
				"odds": 0.25
			}
		]
	},
	{
		"_id": 3,
		"desc": "Picklock chest, gives 10 coins",
		"xpRewards": [
			{
				"skill": "crime",
				"amount": 15
			}
		],
		"requirements": [
			{
				"desc" : "player crime skill >= 10",
				"type" : "skill",
				"skill" : "crime",
				"level" : 10,
				"operator" : ">=",
                "checkCurrentLevel" : true
			}
		],
		"baseProbabilityOfSuccess": 0.1,
		"maxLvlProbabilityOfSuccess": 0.75,
		"respawnTicks": 20,
        "oddsOfHavingLootOnRespawn": 1,
		"searchStartResult": [],
		"searchEndResult": [],
        "rareLootProbability" : 0,
        "rootLoot" : null,
		"baseLoot": [
			{
				"itemId": 6,
				"name": "coins",
				"isIOU": false,
				"amount": 10
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
				"odds": 0.0001
            }
        ]
	},
	{
		"_id": 4,
		"desc": "Picklock deluxe coin chest, gives 50 coins",
		"xpRewards": [
			{
				"skill": "crime",
				"amount": 150
			}
		],
		"requirements": [
			{
				"desc" : "player crime skill >= 35",
				"type" : "skill",
				"skill" : "crime",
				"level" : 35,
				"operator" : ">=",
                "checkCurrentLevel" : true
			}
		],
		"baseProbabilityOfSuccess": 0.1,
		"maxLvlProbabilityOfSuccess": 0.5,
		"respawnTicks": 180,
        "oddsOfHavingLootOnRespawn": 1,
		"searchStartResult": [],
		"searchEndResult": [],
        "rareLootProbability" : 0,
        "rootLoot" : null,
		"baseLoot": [
			{
				"itemId": 6,
				"name": "coins",
				"isIOU": false,
				"amount": 50
			}
		],
		"loot": [
            {
                "itemId": 556,
				"name": "fuchsia key",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0015
            },
            {
                "itemId": 555,
				"name": "celadon key",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0002
            },
			{
				"itemId": 257,
				"name": "golden gloves",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0001
			}
        ]
	},
	{
		"_id": 5,
		"desc": "Picklock dwarven chest, gives mining supplies",
		"xpRewards": [
			{
				"skill": "crime",
				"amount": 200
			}
		],
		"requirements": [
			{
				"desc" : "player crime skill >= 52",
				"type" : "skill",
				"skill" : "crime",
				"level" : 52,
				"operator" : ">=",
                "checkCurrentLevel" : true
			}
		],
		"baseProbabilityOfSuccess": 0.075,
		"maxLvlProbabilityOfSuccess": 0.45,
		"respawnTicks": 250,
        "oddsOfHavingLootOnRespawn": 1,
		"searchStartResult": [],
		"searchEndResult": [],
        "rareLootProbability" : 0,
        "rootLoot" : null,
		"baseLoot": [
            {
				"itemId": 6,
				"name": "coins",
				"isIOU": false,
				"amount": 65
			},
			{
				"itemId": 48,
				"name": "palladium ore",
				"isIOU": false,
				"amount": 1
			}
		],
		"loot": [
            {
				"itemId": 79,
				"name": "iron ore",
				"isIOU": true,
				"amount": 2,
				"odds": 0.5
			},
            {
				"itemId": 142,
				"name": "coal",
				"isIOU": true,
				"amount": 5,
				"odds": 0.1
			},
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
				"odds": 0.0005
            },
            {
				"itemId": 51,
				"name": "coronium ore",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0005
			},
            {
				"itemId": 252,
				"name": "celadium ore",
				"isIOU": false,
				"amount": 1,
				"odds": 0.000025
			}
        ]
	},
	{
		"_id": 6,
		"desc": "Picklock Julian's chest",
		"xpRewards": [
			{
				"skill": "crime",
				"amount": 300
			}
		],
		"requirements": [
			{
				"desc" : "player crime skill >= 67",
				"type" : "skill",
				"skill" : "crime",
				"level" : 67,
				"operator" : ">=",
                "checkCurrentLevel" : true
			}
		],
		"baseProbabilityOfSuccess": 0.05,
		"maxLvlProbabilityOfSuccess": 0.3,
		"respawnTicks": 300,
        "oddsOfHavingLootOnRespawn": 1,
		"searchStartResult": [],
		"searchEndResult": [],
        "rareLootProbability" : 0,
        "rootLoot" : null,
		"baseLoot": [
			{
				"itemId": 6,
				"name": "coins",
				"isIOU": false,
				"amount": 150
			}
		],
		"loot": [
			{
				"itemId": 80,
				"name": "amethyst gem",
				"isIOU": false,
				"amount": 1,
				"odds": 0.25
			},
            {
				"itemId": 81,
				"name": "sapphire gem",
				"isIOU": false,
				"amount": 1,
				"odds": 0.1
			},
            {
				"itemId": 82,
				"name": "emerald gem",
				"isIOU": false,
				"amount": 1,
				"odds": 0.05
			},
            {
				"itemId": 83,
				"name": "topaz gem",
				"isIOU": false,
				"amount": 1,
				"odds": 0.025
			},
            {
				"itemId": 84,
				"name": "citrine gem",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0125
			},
            {
				"itemId": 85,
				"name": "ruby gem",
				"isIOU": false,
				"amount": 1,
				"odds": 0.005
			},
            {
				"itemId": 86,
				"name": "diamond gem",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0015
			},
            {
                "itemId": 556,
				"name": "fuchsia key",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0015
            },
            {
                "itemId": 555,
				"name": "celadon key",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0005
            }
        ]
	},
	{
		"_id": 7,
		"desc": "Picklock armour plater's chest",
		"xpRewards": [
			{
				"skill": "crime",
				"amount": 250
			}
		],
		"requirements": [
			{
				"desc" : "player crime skill >= 59",
				"type" : "skill",
				"skill" : "crime",
				"level" : 59,
				"operator" : ">=",
                "checkCurrentLevel" : true
			}
		],
		"baseProbabilityOfSuccess": 0.05,
		"maxLvlProbabilityOfSuccess": 0.35,
		"respawnTicks": 250,
        "oddsOfHavingLootOnRespawn": 1,
		"searchStartResult": [],
		"searchEndResult": [],
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
				"itemId": 71,
				"name": "silver bar",
				"isIOU": false,
				"amount": 1,
				"odds": 0.05
			},
            {
				"itemId": 72,
				"name": "gold bar",
				"isIOU": false,
				"amount": 1,
				"odds": 0.02
			},
            {
                "itemId": 556,
				"name": "fuchsia key",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0015
            },
            {
                "itemId": 555,
				"name": "celadon key",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0005
            },
            {
				"itemId": 174,
				"name": "silver helmr",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0005
			},
            {
				"itemId": 141,
				"name": "golden helmr",
				"isIOU": false,
				"amount": 1,
				"odds": 0.00025
			}
        ]
	},
	{
		"_id": 8,
		"desc": "Picklock goblin arrow chest",
		"xpRewards": [
			{
				"skill": "crime",
				"amount": 40
			}
		],
		"requirements": [
			{
				"desc" : "player crime skill >= 24",
				"type" : "skill",
				"skill" : "crime",
				"level" : 24,
				"operator" : ">=",
                "checkCurrentLevel" : true
			}
		],
		"baseProbabilityOfSuccess": 0.1,
		"maxLvlProbabilityOfSuccess": 0.5,
		"respawnTicks": 50,
        "oddsOfHavingLootOnRespawn": 1,
		"searchStartResult": [],
		"searchEndResult": [],
        "rareLootProbability" : 0,
        "rootLoot" : null,
		"baseLoot": [
			{
				"itemId": 6,
				"name": "coins",
				"isIOU": false,
				"amount": 10
			}
		],
		"loot": [
			{
				"itemId": 328,
				"name": "bronze arrowheads",
				"isIOU": false,
				"amount": 10,
				"odds": 0.5
			},
            {
				"itemId": 329,
				"name": "iron arrowheads",
				"isIOU": false,
				"amount": 10,
				"odds": 0.2
			},
            {
				"itemId": 330,
				"name": "steel arrowheads",
				"isIOU": false,
				"amount": 10,
				"odds": 0.1
			},
            {
				"itemId": 331,
				"name": "palladium arrowheads",
				"isIOU": false,
				"amount": 10,
				"odds": 0.025
			},
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
				"odds": 0.0001
            }
        ]
	},
	{
		"_id": 9,
		"desc": "Picklock wasteland chest",
		"xpRewards": [
			{
				"skill": "crime",
				"amount": 450
			}
		],
		"requirements": [
			{
				"desc" : "player crime skill >= 76",
				"type" : "skill",
				"skill" : "crime",
				"level" : 76,
				"operator" : ">=",
                "checkCurrentLevel" : true
			}
		],
		"baseProbabilityOfSuccess": 0.025,
		"maxLvlProbabilityOfSuccess": 0.2,
		"respawnTicks": 900,
        "oddsOfHavingLootOnRespawn": 1,
		"searchStartResult": [],
		"searchEndResult": [],
        "rareLootProbability" : 0,
        "rootLoot" : null,
		"baseLoot": [
			{
				"itemId": 6,
				"name": "coins",
				"isIOU": false,
				"amount": 1050
			},
            {
				"itemId": 163,
				"name": "dew beer",
				"isIOU": false,
				"amount": 1
			},
            {
				"itemId": 184,
				"name": "alchemy scroll",
				"isIOU": false,
				"amount": 5
			},
            {
				"itemId": 181,
				"name": "warp scroll",
				"isIOU": false,
				"amount": 2
			}
		],
		"loot": [
            {
                "itemId": 556,
				"name": "fuchsia key",
				"isIOU": false,
				"amount": 1,
				"odds": 0.005
            },
            {
                "itemId": 555,
				"name": "celadon key",
				"isIOU": false,
				"amount": 1,
				"odds": 0.001
            },
			{
				"itemId": 245,
				"name": "celadon pickaxe",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0005
			},
            {
				"itemId": 319,
				"name": "celadon hatchet",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0005
			},
            {
				"itemId": 246,
				"name": "celadon gloves",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0005
			},
            {
				"itemId": 258,
				"name": "celadon helm",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0005
			}
        ]
	},
	{
		"_id": 10,
		"desc": "Pirate's Chest",
		"xpRewards": [],
		"requirements": [
            {
                "desc" : "player needs to have a pirate's key in their inventory",
                "type" : "inventoryitem",
                "itemid" : 227,
                "isiou" : false,
                "amount" : 1,
                "operator" : ">="
            }
        ],
		"baseProbabilityOfSuccess": 1,
		"maxLvlProbabilityOfSuccess": 1,
		"respawnTicks": 0,
        "oddsOfHavingLootOnRespawn": 1,
		"searchStartResult": [],
		"searchEndResult": [
            {
                "desc" : "pirate's key removed from inventory",
                "type" : "PlayerGiveItems",
                "playerGiveItems" : [
                    { "id" : 227, "isIOU" : false, "amt" : 1 }
                ]
            }
        ],
        "rareLootProbability" : 0,
        "rootLoot" : null,
		"baseLoot": [
            {
				"itemId": 381,
				"name": "pirate's bandana",
				"isIOU": false,
				"amount": 1
			},
            {
				"itemId": 367,
				"name": "palladium scimitar",
				"isIOU": false,
				"amount": 1
			},
            {
				"itemId": 18,
				"name": "cooked marlin",
				"isIOU": true,
				"amount": 5
			},
            {
				"itemId": 178,
				"name": "fury scroll",
				"isIOU": false,
				"amount": 50
			},
            {
				"itemId": 179,
				"name": "rage scroll",
				"isIOU": false,
				"amount": 20
			}
        ],
		"loot": [
            {
				"itemId": 224,
				"name": "starfish",
				"isIOU": true,
				"amount": 10,
                "odds": 0.2
			},
            {
				"itemId": 223,
				"name": "seaweed",
				"isIOU": false,
				"amount": 1,
                "odds": 0.2
			},
            {
				"itemId": 71,
				"name": "silver bar",
				"isIOU": false,
				"amount": 1,
                "odds": 0.2
			},
            {
				"itemId": 72,
				"name": "gold bar",
				"isIOU": false,
				"amount": 1,
                "odds": 0.2
			},
            {
				"itemId": 27,
				"name": "raw piranha",
				"isIOU": false,
				"amount": 1,
                "odds": 0.2
			}
        ]
	},
	{
		"_id": 11,
		"desc": "Picklock Sage's chest",
		"xpRewards": [
			{
				"skill": "crime",
				"amount": 300
			}
		],
		"requirements": [
			{
				"desc" : "player crime skill >= 71",
				"type" : "skill",
				"skill" : "crime",
				"level" : 71,
				"operator" : ">=",
                "checkCurrentLevel" : true
			}
		],
		"baseProbabilityOfSuccess": 0.025,
		"maxLvlProbabilityOfSuccess": 0.25,
		"respawnTicks": 350,
        "oddsOfHavingLootOnRespawn": 1,
		"searchStartResult": [],
		"searchEndResult": [],
        "rareLootProbability" : 0,
        "rootLoot" : null,
		"baseLoot": [
			{
				"itemId": 283,
				"name": "aruba root",
				"isIOU": false,
				"amount": 1
			},
            {
				"itemId": 284,
				"name": "grenada root",
				"isIOU": false,
				"amount": 1
			},
            {
				"itemId": 282,
				"name": "samoan root",
				"isIOU": false,
				"amount": 1
			}
		],
		"loot": [
			{
				"itemId": 279,
				"name": "nauru root",
				"isIOU": false,
				"amount": 1,
				"odds": 0.4975
			},
            {
				"itemId": 278,
				"name": "tonga root",
				"isIOU": false,
				"amount": 1,
				"odds": 0.25
			},
            {
				"itemId": 281,
				"name": "vanua root",
				"isIOU": false,
				"amount": 1,
				"odds": 0.125
			},
            {
				"itemId": 293,
				"name": "mariana root",
				"isIOU": false,
				"amount": 1,
				"odds": 0.125
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
				"odds": 0.0005
            }
        ]
	},
	{
		"_id": 12,
		"desc": "Search Bookshelf",
		"xpRewards": [],
		"requirements": [],
		"baseProbabilityOfSuccess": 1,
		"maxLvlProbabilityOfSuccess": 1,
		"respawnTicks": 0,
        "oddsOfHavingLootOnRespawn": 0,
		"searchStartResult": [],
		"searchEndResult": [],
        "rareLootProbability" : 0,
        "rootLoot" : null,
		"baseLoot": [],
		"loot": []
	},
	{
		"_id": 13,
		"desc": "Undercroft Chest #1",
		"xpRewards": [],
		"requirements": [
            {
                "desc" : "player needs to have undercroft room 3 key in their inventory",
                "type" : "inventoryitem",
                "itemid" : 388,
                "isiou" : false,
                "amount" : 1,
                "operator" : ">="
            }
        ],
		"baseProbabilityOfSuccess": 1,
		"maxLvlProbabilityOfSuccess": 1,
		"respawnTicks": 0,
        "oddsOfHavingLootOnRespawn": 1,
		"searchStartResult": [],
		"searchEndResult": [
            {
                "desc" : "undercroft room 3 key removed from inventory",
                "type" : "PlayerGiveItems",
                "playerGiveItems" : [
                    { "id" : 388, "isIOU" : false, "amt" : 1 }
                ]
            }
        ],
        "rareLootProbability" : 0,
        "rootLoot" : null,
		"baseLoot": [
            {
				"itemId": 6,
				"name": "coins",
				"isIOU": false,
				"amount": 100
			}
        ],
		"loot": [
            {
				"itemId": 6,
				"name": "coins",
				"isIOU": false,
				"amount": 500,
				"odds": 0.375
			},
            {
				"itemId": 3,
				"name": "bass",
				"isIOU": true,
				"amount": 5,
				"odds": 0.175
			},
            {
				"itemId": 5,
				"name": "bluegill",
				"isIOU": true,
				"amount": 5,
				"odds": 0.15
			},
            {
				"itemId": 175,
				"name": "flame scroll",
				"isIOU": false,
				"amount": 50,
				"odds": 0.05
			},
            {
				"itemId": 176,
				"name": "water scroll",
				"isIOU": false,
				"amount": 50,
				"odds": 0.05
			},
            {
				"itemId": 177,
				"name": "nature scroll",
				"isIOU": false,
				"amount": 50,
				"odds": 0.05
			},
            {
				"itemId": 148,
				"name": "iron bar",
				"isIOU": true,
				"amount": 10,
				"odds": 0.05
			},
            {
				"itemId": 335,
				"name": "iron arrows",
				"isIOU": false,
				"amount": 100,
				"odds": 0.05
			},
            {
				"itemId": 128,
				"name": "iron full helm",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0025
			},
            {
				"itemId": 118,
				"name": "iron platebody",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0025
			},
            {
				"itemId": 119,
				"name": "iron platelegs",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0025
			},
            {
				"itemId": 120,
				"name": "iron helm",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0025
			},
            {
				"itemId": 121,
				"name": "iron gloves",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0025
			},
            {
				"itemId": 191,
				"name": "iron shield",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0025
			},
            {
				"itemId": 371,
				"name": "iron chainmail",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0025
			},
            {
				"itemId": 315,
				"name": "iron hatchet",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0025
			},
            {
				"itemId": 74,
				"name": "iron pickaxe",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0025
			},
            {
				"itemId": 126,
				"name": "iron greatsword",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0025
			},
            {
				"itemId": 59,
				"name": "iron sword",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0025
			},
            {
				"itemId": 57,
				"name": "iron battleaxe",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0025
			},
            {
				"itemId": 365,
				"name": "iron scimitar",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0025
			}
        ],
        "minRandomizedStackableFactor":0.1,
        "showLootReceivedNotification":true,
        "rolls": [ 1.0, 1.0, 0.5, 0.25, 0.1 ]
	},
	{
		"_id": 14,
		"desc": "Undercroft Chest #2",
		"xpRewards": [],
		"requirements": [
            {
                "desc" : "player needs to have undercroft room 8 key in their inventory",
                "type" : "inventoryitem",
                "itemid" : 393,
                "isiou" : false,
                "amount" : 1,
                "operator" : ">="
            }
        ],
		"baseProbabilityOfSuccess": 1,
		"maxLvlProbabilityOfSuccess": 1,
		"respawnTicks": 0,
        "oddsOfHavingLootOnRespawn": 1,
		"searchStartResult": [],
		"searchEndResult": [
            {
                "desc" : "undercroft room 8 key removed from inventory",
                "type" : "PlayerGiveItems",
                "playerGiveItems" : [
                    { "id" : 393, "isIOU" : false, "amt" : 1 }
                ]
            }
        ],
        "rareLootProbability" : 0,
        "rootLoot" : null,
		"baseLoot": [
            {
				"itemId": 6,
				"name": "coins",
				"isIOU": false,
				"amount": 250
			}
        ],
		"loot": [
            {
				"itemId": 6,
				"name": "coins",
				"isIOU": false,
				"amount": 500,
				"odds": 0.35
			},
            {
				"itemId": 34,
				"name": "carp",
				"isIOU": true,
				"amount": 5,
				"odds": 0.15
			},
            {
				"itemId": 36,
				"name": "walleye",
				"isIOU": true,
				"amount": 5,
				"odds": 0.1
			},
            {
				"itemId": 180,
				"name": "energy scroll",
				"isIOU": false,
				"amount": 50,
				"odds": 0.075
			},
            {
				"itemId": 178,
				"name": "fury scroll",
				"isIOU": false,
				"amount": 25,
				"odds": 0.075
			},
            {
				"itemId": 179,
				"name": "rage scroll",
				"isIOU": false,
				"amount": 15,
				"odds": 0.075
			},
            {
				"itemId": 143,
				"name": "steel bar",
				"isIOU": true,
				"amount": 10,
				"odds": 0.075
			},
            {
				"itemId": 336,
				"name": "steel arrows",
				"isIOU": false,
				"amount": 100,
				"odds": 0.05
			},
            {
				"itemId": 123,
				"name": "steel full helm",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0025
			},
            {
				"itemId": 42,
				"name": "steel platebody",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0025
			},
            {
				"itemId": 43,
				"name": "steel platelegs",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0025
			},
            {
				"itemId": 53,
				"name": "steel helm",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0025
			},
            {
				"itemId": 93,
				"name": "steel gloves",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0025
			},
            {
				"itemId": 186,
				"name": "steel shield",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0025
			},
            {
				"itemId": 372,
				"name": "steel chainmail",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0025
			},
            {
				"itemId": 316,
				"name": "steel hatchet",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0025
			},
            {
				"itemId": 75,
				"name": "steel pickaxe",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0025
			},
            {
				"itemId": 127,
				"name": "steel greatsword",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0025
			},
            {
				"itemId": 60,
				"name": "steel sword",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0025
			},
            {
				"itemId": 63,
				"name": "steel battleaxe",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0025
			},
            {
				"itemId": 366,
				"name": "steel scimitar",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0025
			}
        ],
        "minRandomizedStackableFactor":0.2,
        "showLootReceivedNotification":true,
        "rolls": [ 1.0, 0.75, 0.5, 0.25, 0.1 ]
	},
	{
		"_id": 15,
		"desc": "Undercroft Chest #3",
		"xpRewards": [],
		"requirements": [
            {
                "desc" : "player needs to have undercroft room 14 key in their inventory",
                "type" : "inventoryitem",
                "itemid" : 399,
                "isiou" : false,
                "amount" : 1,
                "operator" : ">="
            }
        ],
		"baseProbabilityOfSuccess": 1,
		"maxLvlProbabilityOfSuccess": 1,
		"respawnTicks": 0,
        "oddsOfHavingLootOnRespawn": 1,
		"searchStartResult": [],
		"searchEndResult": [
            {
                "desc" : "undercroft room 14 key removed from inventory",
                "type" : "PlayerGiveItems",
                "playerGiveItems" : [
                    { "id" : 399, "isIOU" : false, "amt" : 1 }
                ]
            }
        ],
        "rareLootProbability" : 0,
        "rootLoot" : null,
		"baseLoot": [
            {
                "itemId": 6,
                "name": "coins",
                "isIOU": false,
                "amount": 750
            }
        ],
		"loot": [
            {
                "itemId": 6,
                "name": "coins",
                "isIOU": false,
                "amount": 500,
                "odds": 0.25
            },
            {
                "itemId": 26,
                "name": "salmon",
                "isIOU": true,
                "amount": 5,
                "odds": 0.1
            },
            {
                "itemId": 22,
                "name": "tuna",
                "isIOU": true,
                "amount": 5,
                "odds": 0.075
            },
            {
                "itemId": 181,
                "name": "warp scroll",
                "isIOU": false,
                "amount": 10,
                "odds": 0.075
            },
            {
                "itemId": 178,
                "name": "fury scroll",
                "isIOU": false,
                "amount": 50,
                "odds": 0.075
            },
            {
                "itemId": 179,
                "name": "rage scroll",
                "isIOU": false,
                "amount": 50,
                "odds": 0.075
            },
            {
                "itemId": 144,
                "name": "palladium bar",
                "isIOU": true,
                "amount": 10,
                "odds": 0.075
            },
            {
                "itemId": 337,
                "name": "palladium arrows",
                "isIOU": false,
                "amount": 100,
                "odds": 0.05
            },
            {
                "itemId": 184,
                "name": "alchemy scroll",
                "isIOU": false,
                "amount": 20,
                "odds": 0.025
            },
            {
                "itemId": 175,
                "name": "flame scroll",
                "isIOU": false,
                "amount": 100,
                "odds": 0.02
            },
            {
                "itemId": 176,
                "name": "water scroll",
                "isIOU": false,
                "amount": 100,
                "odds": 0.02
            },
            {
                "itemId": 177,
                "name": "nature scroll",
                "isIOU": false,
                "amount": 100,
                "odds": 0.02
            },
            {
                "itemId": 228,
                "name": "elf ears",
                "isIOU": true,
                "amount": 5,
                "odds": 0.02
            },
            {
                "itemId": 136,
                "name": "bandit mask",
                "isIOU": false,
                "amount": 1,
                "odds": 0.02
            },
            {
                "itemId": 6,
                "name": "coins",
                "isIOU": false,
                "amount": 6000,
                "odds": 0.01
            },
            {
                "itemId": 194,
                "name": "amethyst necklace",
                "isIOU": false,
                "amount": 1,
                "odds": 0.01
            },
            {
                "itemId": 195,
                "name": "sapphire necklace",
                "isIOU": false,
                "amount": 1,
                "odds": 0.01
            },
            {
                "itemId": 196,
                "name": "emerald necklace",
                "isIOU": false,
                "amount": 1,
                "odds": 0.01
            },
            {
                "itemId": 197,
                "name": "topaz necklace",
                "isIOU": false,
                "amount": 1,
                "odds": 0.01
            },
            {
                "itemId": 124,
                "name": "palladium full helm",
                "isIOU": false,
                "amount": 1,
                "odds": 0.002
            },
            {
                "itemId": 44,
                "name": "palladium platebody",
                "isIOU": false,
                "amount": 1,
                "odds": 0.002
            },
            {
                "itemId": 45,
                "name": "palladium platelegs",
                "isIOU": false,
                "amount": 1,
                "odds": 0.002
            },
            {
                "itemId": 54,
                "name": "palladium helm",
                "isIOU": false,
                "amount": 1,
                "odds": 0.002
            },
            {
                "itemId": 94,
                "name": "palladium gloves",
                "isIOU": false,
                "amount": 1,
                "odds": 0.002
            },
            {
                "itemId": 187,
                "name": "palladium shield",
                "isIOU": false,
                "amount": 1,
                "odds": 0.002
            },
            {
                "itemId": 373,
                "name": "palladium chainmail",
                "isIOU": false,
                "amount": 1,
                "odds": 0.002
            },
            {
                "itemId": 317,
                "name": "palladium hatchet",
                "isIOU": false,
                "amount": 1,
                "odds": 0.002
            },
            {
                "itemId": 76,
                "name": "palladium pickaxe",
                "isIOU": false,
                "amount": 1,
                "odds": 0.002
            },
            {
                "itemId": 146,
                "name": "palladium greatsword",
                "isIOU": false,
                "amount": 1,
                "odds": 0.002
            },
            {
                "itemId": 61,
                "name": "palladium sword",
                "isIOU": false,
                "amount": 1,
                "odds": 0.002
            },
            {
                "itemId": 78,
                "name": "palladium battleaxe",
                "isIOU": false,
                "amount": 1,
                "odds": 0.002
            },
            {
                "itemId": 367,
                "name": "palladium scimitar",
                "isIOU": false,
                "amount": 1,
                "odds": 0.002
            }
        ],
        "minRandomizedStackableFactor":0.3,
        "showLootReceivedNotification":true,
        "rolls": [ 1.0, 0.75, 0.5, 0.25, 0.1 ]
	},
	{
		"_id": 16,
		"desc": "Undercroft Chest #4",
		"xpRewards": [],
		"requirements": [
            {
                "desc" : "player needs to have undercroft room 16 key in their inventory",
                "type" : "inventoryitem",
                "itemid" : 401,
                "isiou" : false,
                "amount" : 1,
                "operator" : ">="
            }
        ],
		"baseProbabilityOfSuccess": 1,
		"maxLvlProbabilityOfSuccess": 1,
		"respawnTicks": 0,
        "oddsOfHavingLootOnRespawn": 1,
		"searchStartResult": [],
		"searchEndResult": [
            {
                "desc" : "undercroft room 16 key removed from inventory",
                "type" : "PlayerGiveItems",
                "playerGiveItems" : [
                    { "id" : 401, "isIOU" : false, "amt" : 1 }
                ]
            }
        ],
        "rareLootProbability" : 0,
        "rootLoot" : null,
		"baseLoot": [
            {
                "itemId": 6,
                "name": "coins",
                "isIOU": false,
                "amount": 1500
            }
        ],
		"loot": [
            {
                "itemId": 6,
                "name": "coins",
                "isIOU": false,
                "amount": 1000,
                "odds": 0.25
            },
            {
                "itemId": 14,
                "name": "crab",
                "isIOU": true,
                "amount": 20,
                "odds": 0.1
            },
            {
                "itemId": 18,
                "name": "marlin",
                "isIOU": true,
                "amount": 15,
                "odds": 0.09
            },
            {
                "itemId": 6,
                "name": "coins",
                "isIOU": false,
                "amount": 5000,
                "odds": 0.082
            },
            {
                "itemId": 181,
                "name": "warp scroll",
                "isIOU": false,
                "amount": 15,
                "odds": 0.075
            },
            {
                "itemId": 184,
                "name": "alchemy scroll",
                "isIOU": false,
                "amount": 20,
                "odds": 0.075
            },
            {
                "itemId": 179,
                "name": "rage scroll",
                "isIOU": false,
                "amount": 100,
                "odds": 0.075
            },
            {
                "itemId": 145,
                "name": "coronium bar",
                "isIOU": true,
                "amount": 5,
                "odds": 0.05
            },
            {
                "itemId": 261,
                "name": "potion of accuracy",
                "isIOU": true,
                "amount": 5,
                "odds": 0.04
            },
            {
                "itemId": 159,
                "name": "beer",
                "isIOU": false,
                "amount": 1,
                "odds": 0.025
            },
            {
                "itemId": 271,
                "name": "potion of mining",
                "isIOU": true,
                "amount": 5,
                "odds": 0.02
            },
            {
                "itemId": 269,
                "name": "potion of smithing",
                "isIOU": true,
                "amount": 5,
                "odds": 0.02
            },
            {
                "itemId": 6,
                "name": "coins",
                "isIOU": false,
                "amount": 10000,
                "odds": 0.02
            },
            {
                "itemId": 352,
                "name": "string",
                "isIOU": true,
                "amount": 150,
                "odds": 0.02
            },
            {
                "itemId": 338,
                "name": "coronium arrows",
                "isIOU": false,
                "amount": 100,
                "odds": 0.01
            },
            {
                "itemId": 198,
                "name": "citrine necklace",
                "isIOU": false,
                "amount": 1,
                "odds": 0.01
            },
            {
                "itemId": 199,
                "name": "ruby necklace",
                "isIOU": false,
                "amount": 1,
                "odds": 0.01
            },
            {
                "itemId": 200,
                "name": "diamond necklace",
                "isIOU": false,
                "amount": 1,
                "odds": 0.005
            },
            {
                "itemId": 227,
                "name": "pirate's key",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0025
            },
            {
                "itemId": 125,
                "name": "coronium full helm",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0015
            },
            {
                "itemId": 46,
                "name": "coronium platebody",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0015
            },
            {
                "itemId": 47,
                "name": "coronium platelegs",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0015
            },
            {
                "itemId": 55,
                "name": "coronium helm",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0015
            },
            {
                "itemId": 95,
                "name": "coronium gloves",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0015
            },
            {
                "itemId": 188,
                "name": "coronium shield",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0015
            },
            {
                "itemId": 374,
                "name": "coronium chainmail",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0015
            },
            {
                "itemId": 318,
                "name": "coronium hatchet",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0015
            },
            {
                "itemId": 77,
                "name": "coronium pickaxe",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0015
            },
            {
                "itemId": 147,
                "name": "coronium greatsword",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0015
            },
            {
                "itemId": 62,
                "name": "coronium sword",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0015
            },
            {
                "itemId": 96,
                "name": "coronium battleaxe",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0015
            },
            {
                "itemId": 368,
                "name": "coronium scimitar",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0015
            },
            {
                "itemId": 255,
                "name": "silver warrior helm",
                "isIOU": false,
                "amount": 1,
                "odds": 0.00025
            }
        ],
        "minRandomizedStackableFactor":0.4,
        "showLootReceivedNotification":true,
        "rolls": [ 1.0, 1.0, 0.75, 0.5, 0.25 ]
	},
	{
		"_id": 17,
		"desc": "Undercroft Chest #5",
		"xpRewards": [],
		"requirements": [
            {
                "desc" : "player needs to have undercroft room 22 key in their inventory",
                "type" : "inventoryitem",
                "itemid" : 407,
                "isiou" : false,
                "amount" : 1,
                "operator" : ">="
            }
        ],
		"baseProbabilityOfSuccess": 1,
		"maxLvlProbabilityOfSuccess": 1,
		"respawnTicks": 0,
        "oddsOfHavingLootOnRespawn": 1,
		"searchStartResult": [],
		"searchEndResult": [
            {
                "desc" : "undercroft room 22 key removed from inventory",
                "type" : "PlayerGiveItems",
                "playerGiveItems" : [
                    { "id" : 407, "isIOU" : false, "amt" : 1 }
                ]
            }
        ],
        "rareLootProbability" : 0,
        "rootLoot" : null,
		"baseLoot": [
            {
                "itemId": 6,
                "name": "coins",
                "isIOU": false,
                "amount": 2500
            }
        ],
		"loot": [
            {
                "itemId": 6,
                "name": "coins",
                "isIOU": false,
                "amount": 2500,
                "odds": 0.1
            },
            {
                "itemId": 6,
                "name": "coins",
                "isIOU": false,
                "amount": 5000,
                "odds": 0.1
            },
            {
                "itemId": 340,
                "name": "feather",
                "isIOU": false,
                "amount": 200,
                "odds": 0.05
            },
            {
                "itemId": 80,
                "name": "amethyst gem",
                "isIOU": true,
                "amount": 3,
                "odds": 0.05
            },
            {
                "itemId": 278,
                "name": "tonga root",
                "isIOU": true,
                "amount": 10,
                "odds": 0.05
            },
            {
                "itemId": 6,
                "name": "coins",
                "isIOU": false,
                "amount": 7500,
                "odds": 0.045
            },
            {
                "itemId": 279,
                "name": "nauru root",
                "isIOU": true,
                "amount": 8,
                "odds": 0.045
            },
            {
                "itemId": 81,
                "name": "sapphire gem",
                "isIOU": true,
                "amount": 3,
                "odds": 0.04
            },
            {
                "itemId": 282,
                "name": "samoan root",
                "isIOU": true,
                "amount": 8,
                "odds": 0.04
            },
            {
                "itemId": 281,
                "name": "vanua root",
                "isIOU": true,
                "amount": 8,
                "odds": 0.035
            },
            {
                "itemId": 6,
                "name": "coins",
                "isIOU": false,
                "amount": 10000,
                "odds": 0.03
            },
            {
                "itemId": 82,
                "name": "emerald gem",
                "isIOU": true,
                "amount": 3,
                "odds": 0.03
            },
            {
                "itemId": 83,
                "name": "topaz gem",
                "isIOU": true,
                "amount": 3,
                "odds": 0.025
            },
            {
                "itemId": 293,
                "name": "mariana root",
                "isIOU": true,
                "amount": 8,
                "odds": 0.025
            },
            {
                "itemId": 181,
                "name": "warp scroll",
                "isIOU": false,
                "amount": 30,
                "odds": 0.025
            },
            {
                "itemId": 184,
                "name": "alchemy scroll",
                "isIOU": false,
                "amount": 50,
                "odds": 0.025
            },
            {
                "itemId": 358,
                "name": "blood scroll",
                "isIOU": false,
                "amount": 40,
                "odds": 0.025
            },
            {
                "itemId": 306,
                "name": "chefs hat",
                "isIOU": false,
                "amount": 1,
                "odds": 0.025
            },
            {
                "itemId": 308,
                "name": "old hood",
                "isIOU": false,
                "amount": 1,
                "odds": 0.025
            },
            {
                "itemId": 309,
                "name": "dark hood",
                "isIOU": false,
                "amount": 1,
                "odds": 0.025
            },
            {
                "itemId": 84,
                "name": "citrine gem",
                "isIOU": true,
                "amount": 3,
                "odds": 0.02
            },
            {
                "itemId": 265,
                "name": "potion of strength",
                "isIOU": true,
                "amount": 10,
                "odds": 0.02
            },
            {
                "itemId": 199,
                "name": "ruby necklace",
                "isIOU": false,
                "amount": 1,
                "odds": 0.02
            },
            {
                "itemId": 85,
                "name": "ruby gem",
                "isIOU": true,
                "amount": 3,
                "odds": 0.015
            },
            {
                "itemId": 24,
                "name": "octopus",
                "isIOU": true,
                "amount": 30,
                "odds": 0.015
            },
            {
                "itemId": 310,
                "name": "druids hood",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0125
            },
            {
                "itemId": 307,
                "name": "blood hood",
                "isIOU": false,
                "amount": 1,
                "odds": 0.01
            },
            {
                "itemId": 86,
                "name": "diamond gem",
                "isIOU": true,
                "amount": 3,
                "odds": 0.01
            },
            {
                "itemId": 200,
                "name": "diamond necklace",
                "isIOU": false,
                "amount": 1,
                "odds": 0.01
            },
            {
                "itemId": 227,
                "name": "pirate's key",
                "isIOU": false,
                "amount": 1,
                "odds": 0.01
            },
            {
                "itemId": 253,
                "name": "celadon bar",
                "isIOU": false,
                "amount": 1,
                "odds": 0.01
            },
            {
                "itemId": 339,
                "name": "celadon arrows",
                "isIOU": false,
                "amount": 100,
                "odds": 0.01
            },
            {
                "itemId": 6,
                "name": "coins",
                "isIOU": false,
                "amount": 25000,
                "odds": 0.005
            },
            {
                "itemId": 135,
                "name": "purple cape",
                "isIOU": false,
                "amount": 1,
                "odds": 0.005
            },
            {
                "itemId": 247,
                "name": "celadon full helm",
                "isIOU": false,
                "amount": 1,
                "odds": 0.001
            },
            {
                "itemId": 244,
                "name": "celadon platelegs",
                "isIOU": false,
                "amount": 1,
                "odds": 0.001
            },
            {
                "itemId": 258,
                "name": "celadon helm",
                "isIOU": false,
                "amount": 1,
                "odds": 0.001
            },
            {
                "itemId": 246,
                "name": "celadon gloves",
                "isIOU": false,
                "amount": 1,
                "odds": 0.001
            },
            {
                "itemId": 248,
                "name": "celadon shield",
                "isIOU": false,
                "amount": 1,
                "odds": 0.001
            },
            {
                "itemId": 377,
                "name": "celadon chainmail",
                "isIOU": false,
                "amount": 1,
                "odds": 0.001
            },
            {
                "itemId": 319,
                "name": "celadon hatchet",
                "isIOU": false,
                "amount": 1,
                "odds": 0.001
            },
            {
                "itemId": 245,
                "name": "celadon pickaxe",
                "isIOU": false,
                "amount": 1,
                "odds": 0.001
            },
            {
                "itemId": 251,
                "name": "celadon greatsword",
                "isIOU": false,
                "amount": 1,
                "odds": 0.001
            },
            {
                "itemId": 249,
                "name": "celadon sword",
                "isIOU": false,
                "amount": 1,
                "odds": 0.001
            },
            {
                "itemId": 250,
                "name": "celadon battleaxe",
                "isIOU": false,
                "amount": 1,
                "odds": 0.001
            },
            {
                "itemId": 369,
                "name": "celadon scimitar",
                "isIOU": false,
                "amount": 1,
                "odds": 0.001
            },
            {
                "itemId": 254,
                "name": "golden warrior helm",
                "isIOU": false,
                "amount": 1,
                "odds": 0.00025
            }
        ],
        "minRandomizedStackableFactor":0.5,
        "showLootReceivedNotification":true,
        "rolls": [ 1.0, 1.0, 0.5, 0.5, 0.25 ]
	},
	{
		"_id": 18,
		"desc": "Treasure Map 1 Loot",
		"xpRewards": [],
		"requirements": [
            {
                "desc" : "player needs to have treasure map 1 in their inventory",
                "type" : "inventoryitem",
                "itemid" : 442,
                "isiou" : false,
                "amount" : 1,
                "operator" : ">="
            }
        ],
		"baseProbabilityOfSuccess": 1,
		"maxLvlProbabilityOfSuccess": 1,
		"respawnTicks": 0,
        "oddsOfHavingLootOnRespawn": 1,
		"searchStartResult": [],
		"searchEndResult": [
            {
                "desc" : "treasure map 1 removed from inventory",
                "type" : "PlayerGiveItems",
                "playerGiveItems" : [
                    { "id" : 442, "isIOU" : false, "amt" : 1 }
                ]
            }
        ],
        "rareLootProbability" : 0,
        "rootLoot" : null,
		"baseLoot": [
            {
                "itemId": 6,
                "name": "coins",
                "isIOU": false,
                "amount": 500
            }
        ],
		"loot": [
            {
                "itemId": 6,
                "name": "coins",
                "isIOU": false,
                "amount": 2000,
                "odds": 0.185
            },
            {
                "itemId": 175,
                "name": "fire scroll",
                "isIOU": false,
                "amount": 50,
                "odds": 0.1
            },
            {
                "itemId": 176,
                "name": "water scroll",
                "isIOU": false,
                "amount": 50,
                "odds": 0.1
            },
            {
                "itemId": 177,
                "name": "nature scroll",
                "isIOU": false,
                "amount": 50,
                "odds": 0.1
            },
            {
                "itemId": 336,
                "name": "steel arrows",
                "isIOU": false,
                "amount": 50,
                "odds": 0.1
            },
            {
                "itemId": 14,
                "name": "crab",
                "isIOU": true,
                "amount": 30,
                "odds": 0.1
            },
            {
                "itemId": 178,
                "name": "fury scroll",
                "isIOU": false,
                "amount": 40,
                "odds": 0.05
            },
            {
                "itemId": 345,
                "name": "cherry bow",
                "isIOU": false,
                "amount": 1,
                "odds": 0.05
            },
            {
                "itemId": 283,
                "name": "aruba root",
                "isIOU": true,
                "amount": 10,
                "odds": 0.03
            },
            {
                "itemId": 261,
                "name": "potion of accuracy",
                "isIOU": true,
                "amount": 5,
                "odds": 0.025
            },
            {
                "itemId": 54,
                "name": "palladium helm",
                "isIOU": false,
                "amount": 1,
                "odds": 0.01
            },
            {
                "itemId": 124,
                "name": "palladium full helm",
                "isIOU": false,
                "amount": 1,
                "odds": 0.01
            },
            {
                "itemId": 44,
                "name": "palladium platebody",
                "isIOU": false,
                "amount": 1,
                "odds": 0.01
            },
            {
                "itemId": 373,
                "name": "palladium chainmail",
                "isIOU": false,
                "amount": 1,
                "odds": 0.01
            },
            {
                "itemId": 45,
                "name": "palladium platelegs",
                "isIOU": false,
                "amount": 1,
                "odds": 0.01
            },
            {
                "itemId": 94,
                "name": "palladium gloves",
                "isIOU": false,
                "amount": 1,
                "odds": 0.01
            },
            {
                "itemId": 187,
                "name": "palladium shield",
                "isIOU": false,
                "amount": 1,
                "odds": 0.01
            },
            {
                "itemId": 61,
                "name": "palladium sword",
                "isIOU": false,
                "amount": 1,
                "odds": 0.01
            },
            {
                "itemId": 76,
                "name": "palladium pickaxe",
                "isIOU": false,
                "amount": 1,
                "odds": 0.01
            },
            {
                "itemId": 78,
                "name": "palladium battleaxe",
                "isIOU": false,
                "amount": 1,
                "odds": 0.01
            },
            {
                "itemId": 146,
                "name": "palladium greatsword",
                "isIOU": false,
                "amount": 1,
                "odds": 0.01
            },
            {
                "itemId": 367,
                "name": "palladium scimitar",
                "isIOU": false,
                "amount": 1,
                "odds": 0.01
            },
            {
                "itemId": 337,
                "name": "palladium arrows",
                "isIOU": false,
                "amount": 100,
                "odds": 0.01
            },
            {
                "itemId": 502,
                "name": "black leather boots",
                "isIOU": false,
                "amount": 1,
                "odds": 0.01
            },
            {
                "itemId": 429,
                "name": "gold emerald necklace",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0075
            },
            {
                "itemId": 477,
                "name": "wizard's gloves",
                "isIOU": false,
                "amount": 1,
                "odds": 0.005
            },
            {
                "itemId": 499,
                "name": "wizard's boots",
                "isIOU": false,
                "amount": 1,
                "odds": 0.005
            },
            {
                "itemId": 435,
                "name": "ember staff",
                "isIOU": false,
                "amount": 1,
                "odds": 0.00075
            },
            {
                "itemId": 436,
                "name": "hydro staff",
                "isIOU": false,
                "amount": 1,
                "odds": 0.00075
            },
            {
                "itemId": 437,
                "name": "forest staff",
                "isIOU": false,
                "amount": 1,
                "odds": 0.00075
            }
        ],
        "minRandomizedStackableFactor":0.25,
        "showLootReceivedNotification":true,
        "rolls": [ 1.0, 0.75, 0.5, 0.25, 0.25 ]
	},
	{
		"_id": 19,
		"desc": "Treasure Map 2 Loot",
		"xpRewards": [],
		"requirements": [
            {
                "desc" : "player needs to have treasure map 2 in their inventory",
                "type" : "inventoryitem",
                "itemid" : 443,
                "isiou" : false,
                "amount" : 1,
                "operator" : ">="
            }
        ],
		"baseProbabilityOfSuccess": 1,
		"maxLvlProbabilityOfSuccess": 1,
		"respawnTicks": 0,
        "oddsOfHavingLootOnRespawn": 1,
		"searchStartResult": [],
		"searchEndResult": [
            {
                "desc" : "treasure map 2 removed from inventory",
                "type" : "PlayerGiveItems",
                "playerGiveItems" : [
                    { "id" : 443, "isIOU" : false, "amt" : 1 }
                ]
            }
        ],
        "rareLootProbability" : 0,
        "rootLoot" : null,
		"baseLoot": [
            {
                "itemId": 6,
                "name": "coins",
                "isIOU": false,
                "amount": 2000
            }
        ],
		"loot": [
            {
                "itemId": 6,
                "name": "coins",
                "isIOU": false,
                "amount": 2500,
                "odds": 0.15249
            },
            {
                "itemId": 178,
                "name": "fury scroll",
                "isIOU": false,
                "amount": 60,
                "odds": 0.1
            },
            {
                "itemId": 181,
                "name": "warp scroll",
                "isIOU": false,
                "amount": 15,
                "odds": 0.1
            },
            {
                "itemId": 184,
                "name": "alchemy scroll",
                "isIOU": false,
                "amount": 20,
                "odds": 0.1
            },
            {
                "itemId": 358,
                "name": "blood scroll",
                "isIOU": false,
                "amount": 15,
                "odds": 0.1
            },
            {
                "itemId": 179,
                "name": "rage scroll",
                "isIOU": false,
                "amount": 40,
                "odds": 0.1
            },
            {
                "itemId": 142,
                "name": "coronium bar",
                "isIOU": true,
                "amount": 10,
                "odds": 0.05
            },
            {
                "itemId": 360,
                "name": "wizard's bow",
                "isIOU": false,
                "amount": 1,
                "odds": 0.05
            },
            {
                "itemId": 18,
                "name": "marlin",
                "isIOU": true,
                "amount": 25,
                "odds": 0.05
            },
            {
                "itemId": 265,
                "name": "potion of strength",
                "isIOU": true,
                "amount": 5,
                "odds": 0.05
            },
            {
                "itemId": 275,
                "name": "potion of forestry",
                "isIOU": true,
                "amount": 5,
                "odds": 0.03
            },
            {
                "itemId": 159,
                "name": "beer",
                "isIOU": true,
                "amount": 10,
                "odds": 0.02
            },
            {
                "itemId": 457,
                "name": "green headband",
                "isIOU": false,
                "amount": 1,
                "odds": 0.01
            },
            {
                "itemId": 458,
                "name": "blue headband",
                "isIOU": false,
                "amount": 1,
                "odds": 0.01
            },
            {
                "itemId": 500,
                "name": "blue wizard's boots",
                "isIOU": false,
                "amount": 1,
                "odds": 0.005
            },
            {
                "itemId": 478,
                "name": "blue wizard's gloves",
                "isIOU": false,
                "amount": 1,
                "odds": 0.005
            },
            {
                "itemId": 497,
                "name": "royal cape",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0035
            },
            {
                "itemId": 55,
                "name": "coronium helm",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0035
            },
            {
                "itemId": 125,
                "name": "coronium full helm",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0035
            },
            {
                "itemId": 46,
                "name": "coronium platebody",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0035
            },
            {
                "itemId": 374,
                "name": "coronium chainmail",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0035
            },
            {
                "itemId": 47,
                "name": "coronium platelegs",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0035
            },
            {
                "itemId": 95,
                "name": "coronium gloves",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0035
            },
            {
                "itemId": 188,
                "name": "coronium shield",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0035
            },
            {
                "itemId": 62,
                "name": "coronium sword",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0035
            },
            {
                "itemId": 77,
                "name": "coronium pickaxe",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0035
            },
            {
                "itemId": 96,
                "name": "coronium battleaxe",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0035
            },
            {
                "itemId": 147,
                "name": "coronium greatsword",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0035
            },
            {
                "itemId": 368,
                "name": "coronium scimitar",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0035
            },
            {
                "itemId": 318,
                "name": "coronium hatchet",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0035
            },
            {
                "itemId": 338,
                "name": "coronium arrows",
                "isIOU": false,
                "amount": 100,
                "odds": 0.0035
            },
            {
                "itemId": 432,
                "name": "gold ruby necklace",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0015
            },
            {
                "itemId": 435,
                "name": "ember staff",
                "isIOU": false,
                "amount": 1,
                "odds": 0.001
            },
            {
                "itemId": 436,
                "name": "hydro staff",
                "isIOU": false,
                "amount": 1,
                "odds": 0.001
            },
            {
                "itemId": 437,
                "name": "forest staff",
                "isIOU": false,
                "amount": 1,
                "odds": 0.001
            },
            {
                "itemId": 454,
                "name": "coronium full helm (purple plume)",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0005
            },
            {
                "itemId": 171,
                "name": "coronium full helm (silver plating)",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0005
            },
            {
                "itemId": 174,
                "name": "coronium helm (silver plating)",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0005
            },
            {
                "itemId": 172,
                "name": "coronium chestplate (silver plating)",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0005
            },
            {
                "itemId": 375,
                "name": "coronium chainmail body (silver plating)",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0005
            },
            {
                "itemId": 173,
                "name": "coronium platelegs (silver plating)",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0005
            },
            {
                "itemId": 193,
                "name": "coronium shield (silver plating)",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0005
            },
            {
                "itemId": 256,
                "name": "coronium gloves (silver plating)",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0005
            },
            {
                "itemId": 138,
                "name": "coronium full helm (gold plating)",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0005
            },
            {
                "itemId": 141,
                "name": "coronium helm (gold plating)",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0005
            },
            {
                "itemId": 139,
                "name": "coronium chestplate (gold plating)",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0005
            },
            {
                "itemId": 376,
                "name": "coronium chainmail body (gold plating)",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0005
            },
            {
                "itemId": 140,
                "name": "coronium platelegs (gold plating)",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0005
            },
            {
                "itemId": 192,
                "name": "coronium shield (gold plating)",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0005
            },
            {
                "itemId": 257,
                "name": "coronium gloves (gold plating)",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0005
            },
            {
                "itemId": 446,
                "name": "coronium shield (gold trim)",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0005
            },
            {
                "itemId": 447,
                "name": "coronium shield (silver plating and gold trim)",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0005
            },
            {
                "itemId": 448,
                "name": "coronium shield (gold plating and gold trim)",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0005
            },
            {
                "itemId": 450,
                "name": "coronium full helm (gold plume)",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0005
            },
            {
                "itemId": 451,
                "name": "coronium full helm (silver plating and gold plume)",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0005
            },
            {
                "itemId": 452,
                "name": "coronium full helm (gold plating and gold plume)",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0005
            }
        ],
        "minRandomizedStackableFactor":0.25,
        "showLootReceivedNotification":true,
        "rolls": [ 1.0, 0.75, 0.5, 0.25, 0.25 ]
	},
	{
		"_id": 20,
		"desc": "Treasure Map 3 Loot",
		"xpRewards": [],
		"requirements": [
            {
                "desc" : "player needs to have treasure map 3 in their inventory",
                "type" : "inventoryitem",
                "itemid" : 456,
                "isiou" : false,
                "amount" : 1,
                "operator" : ">="
            }
        ],
		"baseProbabilityOfSuccess": 1,
		"maxLvlProbabilityOfSuccess": 1,
		"respawnTicks": 0,
        "oddsOfHavingLootOnRespawn": 1,
		"searchStartResult": [],
		"searchEndResult": [
            {
                "desc" : "treasure map 3 removed from inventory",
                "type" : "PlayerGiveItems",
                "playerGiveItems" : [
                    { "id" : 456, "isIOU" : false, "amt" : 1 }
                ]
            }
        ],
        "rareLootProbability" : 0,
        "rootLoot" : null,
		"baseLoot": [
            {
                "itemId": 6,
                "name": "coins",
                "isIOU": false,
                "amount": 5000
            }
        ],
		"loot": [
            {
                "itemId": 6,
                "name": "coins",
                "isIOU": false,
                "amount": 5000,
                "odds": 0.1732
            },
            {
                "itemId": 175,
                "name": "fire scroll",
                "isIOU": false,
                "amount": 75,
                "odds": 0.1
            },
            {
                "itemId": 176,
                "name": "water scroll",
                "isIOU": false,
                "amount": 75,
                "odds": 0.1
            },
            {
                "itemId": 177,
                "name": "nature scroll",
                "isIOU": false,
                "amount": 75,
                "odds": 0.1
            },
            {
                "itemId": 181,
                "name": "warp scroll",
                "isIOU": false,
                "amount": 25,
                "odds": 0.1
            },
            {
                "itemId": 184,
                "name": "alchemy scroll",
                "isIOU": false,
                "amount": 30,
                "odds": 0.1
            },
            {
                "itemId": 24,
                "name": "octopus",
                "isIOU": true,
                "amount": 20,
                "odds": 0.05
            },
            {
                "itemId": 355,
                "name": "magic scroll",
                "isIOU": false,
                "amount": 20,
                "odds": 0.05
            },
            {
                "itemId": 358,
                "name": "blood scroll",
                "isIOU": false,
                "amount": 20,
                "odds": 0.05
            },
            {
                "itemId": 129,
                "name": "red cape",
                "isIOU": false,
                "amount": 1,
                "odds": 0.02
            },
            {
                "itemId": 130,
                "name": "blue cape",
                "isIOU": false,
                "amount": 1,
                "odds": 0.02
            },
            {
                "itemId": 131,
                "name": "green cape",
                "isIOU": false,
                "amount": 1,
                "odds": 0.02
            },
            {
                "itemId": 362,
                "name": "blood bow",
                "isIOU": false,
                "amount": 1,
                "odds": 0.02
            },
            {
                "itemId": 457,
                "name": "green headband",
                "isIOU": false,
                "amount": 1,
                "odds": 0.015
            },
            {
                "itemId": 458,
                "name": "blue headband",
                "isIOU": false,
                "amount": 1,
                "odds": 0.015
            },
            {
                "itemId": 435,
                "name": "ember staff",
                "isIOU": false,
                "amount": 1,
                "odds": 0.005
            },
            {
                "itemId": 436,
                "name": "hydro staff",
                "isIOU": false,
                "amount": 1,
                "odds": 0.005
            },
            {
                "itemId": 437,
                "name": "forest staff",
                "isIOU": false,
                "amount": 1,
                "odds": 0.005
            },
            {
                "itemId": 480,
                "name": "archer's gloves",
                "isIOU": false,
                "amount": 1,
                "odds": 0.005
            },
            {
                "itemId": 501,
                "name": "archer's boots",
                "isIOU": false,
                "amount": 1,
                "odds": 0.005
            },
            {
                "itemId": 479,
                "name": "blood gloves",
                "isIOU": false,
                "amount": 1,
                "odds": 0.003125
            },
            {
                "itemId": 438,
                "name": "knights cape",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0025
            },
            {
                "itemId": 439,
                "name": "magicians cape",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0025
            },
            {
                "itemId": 440,
                "name": "archers cape",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0025
            },
            {
                "itemId": 339,
                "name": "celadon arrows",
                "isIOU": false,
                "amount": 50,
                "odds": 0.0015
            },
            {
                "itemId": 247,
                "name": "celadon full helm",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0015
            },
            {
                "itemId": 258,
                "name": "celadon helm",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0015
            },
            {
                "itemId": 243,
                "name": "celadon chestplate",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0015
            },
            {
                "itemId": 244,
                "name": "celadon platelegs",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0015
            },
            {
                "itemId": 248,
                "name": "celadon shield",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0015
            },
            {
                "itemId": 246,
                "name": "celadon gloves",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0015
            },
            {
                "itemId": 245,
                "name": "celadon pickaxe",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0015
            },
            {
                "itemId": 249,
                "name": "celadon sword",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0015
            },
            {
                "itemId": 250,
                "name": "celadon battleaxe",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0015
            },
            {
                "itemId": 251,
                "name": "celadon greatsword",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0015
            },
            {
                "itemId": 319,
                "name": "celadon hatchet",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0015
            },
            {
                "itemId": 369,
                "name": "celadon scimitar",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0015
            },
            {
                "itemId": 433,
                "name": "gold diamond necklace",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0005
            },
            {
                "itemId": 455,
                "name": "celadon full helm (purple plume)",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0005
            },
            {
                "itemId": 449,
                "name": "celadon shield (gold trim)",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0005
            },
            {
                "itemId": 453,
                "name": "celadon full helm (gold plume)",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0005
            },
            {
                "itemId": 459,
                "name": "celadon full helm (silver plating)",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0005
            },
            {
                "itemId": 460,
                "name": "celadon helm (silver plating)",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0005
            },
            {
                "itemId": 461,
                "name": "celadon chestplate (silver plating)",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0005
            },
            {
                "itemId": 462,
                "name": "celadon chainmail body (silver plating)",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0005
            },
            {
                "itemId": 463,
                "name": "celadon platelegs (silver plating)",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0005
            },
            {
                "itemId": 464,
                "name": "celadon shield (silver plating)",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0005
            },
            {
                "itemId": 465,
                "name": "celadon gloves (silver plating)",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0005
            },
            {
                "itemId": 466,
                "name": "celadon full helm (silver trim and gold plume)",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0005
            },
            {
                "itemId": 467,
                "name": "celadon shield (silver plating and gold trim)",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0005
            },
            {
                "itemId": 468,
                "name": "celadon full helm (gold plating)",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0005
            },
            {
                "itemId": 469,
                "name": "celadon helm (gold plating)",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0005
            },
            {
                "itemId": 470,
                "name": "celadon chestplate (gold plating)",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0005
            },
            {
                "itemId": 471,
                "name": "celadon chainmail body (gold plating)",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0005
            },
            {
                "itemId": 472,
                "name": "celadon platelegs (gold plating)",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0005
            },
            {
                "itemId": 473,
                "name": "celadon shield (gold plating)",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0005
            },
            {
                "itemId": 474,
                "name": "celadon gloves (gold plating)",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0005
            },
            {
                "itemId": 475,
                "name": "celadon full helm (gold plating and gold plume)",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0005
            },
            {
                "itemId": 476,
                "name": "celadon shield (gold plating and gold trim)",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0005
            },
            {
                "itemId": 441,
                "name": "champions cape",
                "isIOU": false,
                "amount": 1,
                "odds": 0.00025
            },
            {
                "itemId": 6,
                "name": "coins",
                "isIOU": false,
                "amount": 25000,
                "odds": 0.0002
            },
            {
                "itemId": 445,
                "name": "halo",
                "isIOU": false,
                "amount": 1,
                "odds": 0.0001
            }
        ],
        "minRandomizedStackableFactor":0.25,
        "showLootReceivedNotification":true,
        "rolls": [ 1.0, 0.5, 0.5, 0.25, 0.25 ]
	},
	{
		"_id": 21,
		"desc": "Picklock portal obelisk chest",
		"xpRewards": [
			{
				"skill": "crime",
				"amount": 400
			}
		],
		"requirements": [
			{
				"desc" : "player crime skill >= 70",
				"type" : "skill",
				"skill" : "crime",
				"level" : 70,
				"operator" : ">=",
                "checkCurrentLevel" : true
			}
		],
		"baseProbabilityOfSuccess": 0.025,
		"maxLvlProbabilityOfSuccess": 0.2,
		"respawnTicks": 400,
        "oddsOfHavingLootOnRespawn": 1,
		"searchStartResult": [],
		"searchEndResult": [],
        "rareLootProbability" : 0,
        "rootLoot" : null,
		"baseLoot": [
			{
				"itemId": 6,
				"name": "coins",
				"isIOU": false,
				"amount": 500
			},
            {
				"itemId": 181,
				"name": "warp scroll",
				"isIOU": false,
				"amount": 2
			}
		],
		"loot": [
            {
                "itemId": 556,
				"name": "fuchsia key",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0025
            },
            {
                "itemId": 555,
				"name": "celadon key",
				"isIOU": false,
				"amount": 1,
				"odds": 0.00075
            },
			{
				"itemId": 257,
				"name": "golden gloves",
				"isIOU": false,
				"amount": 1,
				"odds": 0.001
			}
        ]
	},
	{
		"_id": 22,
		"desc": "Picklock goblin arrow chest",
		"xpRewards": [
			{
				"skill": "crime",
				"amount": 160
			}
		],
		"requirements": [
			{
				"desc" : "player crime skill >= 45",
				"type" : "skill",
				"skill" : "crime",
				"level" : 45,
				"operator" : ">=",
                "checkCurrentLevel" : true
			}
		],
		"baseProbabilityOfSuccess": 0.075,
		"maxLvlProbabilityOfSuccess": 0.45,
		"respawnTicks": 150,
        "oddsOfHavingLootOnRespawn": 1,
		"searchStartResult": [],
		"searchEndResult": [],
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
				"itemId": 334,
				"name": "bronze arrow",
				"isIOU": false,
				"amount": 15,
				"odds": 0.5
			},
            {
				"itemId": 335,
				"name": "iron arrow",
				"isIOU": false,
				"amount": 15,
				"odds": 0.2
			},
            {
				"itemId": 336,
				"name": "steel arrow",
				"isIOU": false,
				"amount": 15,
				"odds": 0.1
			},
            {
				"itemId": 337,
				"name": "palladium arrow",
				"isIOU": false,
				"amount": 15,
				"odds": 0.025
			},
            {
                "itemId": 556,
				"name": "fuchsia key",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0025
            },
            {
                "itemId": 555,
				"name": "celadon key",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0005
            }
        ]
	},
	{
		"_id": 23,
		"desc": "Celadon Chest",
		"xpRewards": [],
		"requirements": [
            {
                "desc" : "player needs to have celadon key in their inventory",
                "type" : "inventoryitem",
                "itemid" : 555,
                "isiou" : false,
                "amount" : 1,
                "operator" : ">="
            }
        ],
		"baseProbabilityOfSuccess": 1,
		"maxLvlProbabilityOfSuccess": 1,
		"respawnTicks": 0,
        "oddsOfHavingLootOnRespawn": 1,
		"searchStartResult": [],
		"searchEndResult": [
            {
                "desc" : "celadon key removed from inventory",
                "type" : "PlayerGiveItems",
                "playerGiveItems" : [
                    { "id" : 555, "isIOU" : false, "amt" : 1 }
                ]
            }
        ],
        "rareLootProbability" : 0,
        "rootLoot" : null,
		"baseLoot": [
            {
				"itemId": 6,
				"name": "coins",
				"isIOU": false,
				"amount": 1000
			}
        ],
		"loot": [
            {
				"itemId": 6,
				"name": "coins",
				"isIOU": false,
				"amount": 5000,
				"odds": 0.25899
			},
            {
				"itemId": 175,
				"name": "flame scroll",
				"isIOU": false,
				"amount": 150,
				"odds": 0.1
			},
            {
				"itemId": 176,
				"name": "water scroll",
				"isIOU": false,
				"amount": 150,
				"odds": 0.1
			},
            {
				"itemId": 177,
				"name": "nature scroll",
				"isIOU": false,
				"amount": 150,
				"odds": 0.1
			},
            {
				"itemId": 178,
				"name": "fury scroll",
				"isIOU": false,
				"amount": 100,
				"odds": 0.075
			},
            {
				"itemId": 179,
				"name": "rage scroll",
				"isIOU": false,
				"amount": 75,
				"odds": 0.05
			},
            {
				"itemId": 181,
				"name": "warp scroll",
				"isIOU": false,
				"amount": 30,
				"odds": 0.045
			},
            {
				"itemId": 184,
				"name": "alchemy scroll",
				"isIOU": false,
				"amount": 50,
				"odds": 0.045
			},
            {
				"itemId": 358,
				"name": "blood scroll",
				"isIOU": false,
				"amount": 40,
				"odds": 0.015
			},
            {
				"itemId": 605,
				"name": "celadon knight's cape",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0035
			},
            {
				"itemId": 514,
				"name": "bronze platelegs (gold trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.003
			},
            {
				"itemId": 515,
				"name": "bronze platebody (gold trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.003
			},
            {
				"itemId": 516,
				"name": "bronze shield (gold trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.003
			},
            {
				"itemId": 517,
				"name": "bronze full helm (gold trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.003
			},
            {
				"itemId": 518,
				"name": "iron platelegs (gold trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.003
			},
            {
				"itemId": 519,
				"name": "iron platebody (gold trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.003
			},
            {
				"itemId": 520,
				"name": "iron shield (gold trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.003
			},
            {
				"itemId": 521,
				"name": "iron full helm (gold trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.003
			},
            {
				"itemId": 522,
				"name": "steel platelegs (gold trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.003
			},
            {
				"itemId": 523,
				"name": "steel platebody (gold trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.003
			},
            {
				"itemId": 524,
				"name": "steel shield (gold trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.003
			},
            {
				"itemId": 525,
				"name": "steel full helm (gold trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.003
			},
            {
				"itemId": 526,
				"name": "palladium platelegs (gold trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.003
			},
            {
				"itemId": 527,
				"name": "palladium platebody (gold trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.003
			},
            {
				"itemId": 528,
				"name": "palladium shield (gold trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.003
			},
            {
				"itemId": 529,
				"name": "palladium full helm (gold trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.003
			},
            {
				"itemId": 557,
				"name": "bronze platelegs (silver trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.003
			},
            {
				"itemId": 558,
				"name": "bronze paltebody (silver trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.003
			},
            {
				"itemId": 559,
				"name": "bronze shield (silver trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.003
			},
            {
				"itemId": 560,
				"name": "bronze full helm (silver trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.003
			},
            {
				"itemId": 561,
				"name": "iron platelegs (silver trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.003
			},
            {
				"itemId": 562,
				"name": "iron platebody (silver trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.003
			},
            {
				"itemId": 563,
				"name": "iron shield (silver trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.003
			},
            {
				"itemId": 564,
				"name": "iron full helm (silver trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.003
			},
            {
				"itemId": 565,
				"name": "steel platelegs (silver trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.003
			},
            {
				"itemId": 566,
				"name": "steel platebody (silver trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.003
			},
            {
				"itemId": 567,
				"name": "steel shield (silver trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.003
			},
            {
				"itemId": 568,
				"name": "steel full helm (silver trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.003
			},
            {
				"itemId": 569,
				"name": "palladium platelegs (silver trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.003
			},
            {
				"itemId": 570,
				"name": "palladium platebody (silver trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.003
			},
            {
				"itemId": 571,
				"name": "palladium shield (silver trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.003
			},
            {
				"itemId": 572,
				"name": "palladium full helm (silver trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.003
			},
            {
				"itemId": 581,
				"name": "bronze platelegs (red trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.003
			},
            {
				"itemId": 582,
				"name": "bronze platebody (red trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.003
			},
            {
				"itemId": 583,
				"name": "bronze shield (red trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.003
			},
            {
				"itemId": 584,
				"name": "bronze full helm (red trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.003
			},
            {
				"itemId": 585,
				"name": "iron platelegs (red trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.003
			},
            {
				"itemId": 586,
				"name": "iron platebody (red trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.003
			},
            {
				"itemId": 587,
				"name": "iron shield (red trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.003
			},
            {
				"itemId": 588,
				"name": "iron full helm (red trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.003
			},
            {
				"itemId": 589,
				"name": "steel platelegs (red trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.003
			},
            {
				"itemId": 590,
				"name": "steel platebody (red trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.003
			},
            {
				"itemId": 591,
				"name": "steel shield (red trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.003
			},
            {
				"itemId": 592,
				"name": "steel full helm (red trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.003
			},
            {
				"itemId": 593,
				"name": "palladium platelegs (red trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.003
			},
            {
				"itemId": 594,
				"name": "palladium platebody (red trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.003
			},
            {
				"itemId": 595,
				"name": "palladium shield (red trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.003
			},
            {
				"itemId": 596,
				"name": "palladium full helm (red trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.003
			},
            {
				"itemId": 427,
				"name": "gold amethyst necklace",
				"isIOU": false,
				"amount": 1,
				"odds": 0.00275
			},
            {
				"itemId": 530,
				"name": "coronium platelegs (gold trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0025
			},
            {
				"itemId": 531,
				"name": "coronium platebody (gold trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0025
			},
            {
				"itemId": 446,
				"name": "coronium shield (gold trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0025
			},
            {
				"itemId": 532,
				"name": "coronium full helm (gold trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0025
			},
            {
				"itemId": 573,
				"name": "coronium platelegs (silver trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0025
			},
            {
				"itemId": 574,
				"name": "coronium platebody (silver trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0025
			},
            {
				"itemId": 575,
				"name": "coronium shield (silver trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0025
			},
            {
				"itemId": 576,
				"name": "coronium full helm (silver trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0025
			},
            {
				"itemId": 597,
				"name": "coronium platelegs (red trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0025
			},
            {
				"itemId": 598,
				"name": "coronium platebody (red trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0025
			},
            {
				"itemId": 599,
				"name": "coronium shield (red trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0025
			},
            {
				"itemId": 600,
				"name": "coronium full helm (red trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0025
			},
            {
				"itemId": 428,
				"name": "gold sapphire necklace",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0025
			},
            {
				"itemId": 429,
				"name": "gold emerald necklace",
				"isIOU": false,
				"amount": 1,
				"odds": 0.00225
			},
            {
				"itemId": 430,
				"name": "gold topaz necklace",
				"isIOU": false,
				"amount": 1,
				"odds": 0.002
			},
            {
				"itemId": 431,
				"name": "gold citrine necklace",
				"isIOU": false,
				"amount": 1,
				"odds": 0.00175
			},
            {
				"itemId": 432,
				"name": "gold ruby necklace",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0015
			},
            {
				"itemId": 533,
				"name": "celadon platelegs (gold trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0015
			},
            {
				"itemId": 534,
				"name": "celadon platebody (gold trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0015
			},
            {
				"itemId": 449,
				"name": "celadon shield (gold trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0015
			},
            {
				"itemId": 535,
				"name": "celadon full helm (gold trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0015
			},
            {
				"itemId": 577,
				"name": "celadon platelegs (silver trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0015
			},
            {
				"itemId": 578,
				"name": "celadon platebody (silver trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0015
			},
            {
				"itemId": 579,
				"name": "celadon shield (silver trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0015
			},
            {
				"itemId": 580,
				"name": "celadon full helm (silver trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0015
			},
            {
				"itemId": 601,
				"name": "celadon platelegs (red trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0015
			},
            {
				"itemId": 602,
				"name": "celadon platebody (red trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0015
			},
            {
				"itemId": 603,
				"name": "celadon shield (red trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0015
			},
            {
				"itemId": 604,
				"name": "celadon full helm (red trim)",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0015
			},
            {
				"itemId": 433,
				"name": "gold diamond necklace",
				"isIOU": false,
				"amount": 1,
				"odds": 0.00125
			},
            {
				"itemId": 434,
				"name": "gold carbonado necklace",
				"isIOU": false,
				"amount": 1,
				"odds": 0.001
			},
            {
				"itemId": 6,
				"name": "coins",
				"isIOU": false,
				"amount": 50000,
				"odds": 0.0005
			}
        ],
        "minRandomizedStackableFactor":0.2,
        "showLootReceivedNotification":true,
        "rolls": [ 1.0, 0.65, 0.25, 0.2 ]
	},
	{
		"_id": 24,
		"desc": "Fuchsia Chest",
		"xpRewards": [],
		"requirements": [
            {
                "desc" : "player needs to have fuchsia key in their inventory",
                "type" : "inventoryitem",
                "itemid" : 556,
                "isiou" : false,
                "amount" : 1,
                "operator" : ">="
            }
        ],
		"baseProbabilityOfSuccess": 1,
		"maxLvlProbabilityOfSuccess": 1,
		"respawnTicks": 0,
        "oddsOfHavingLootOnRespawn": 1,
		"searchStartResult": [],
		"searchEndResult": [
            {
                "desc" : "fuchsia key removed from inventory",
                "type" : "PlayerGiveItems",
                "playerGiveItems" : [
                    { "id" : 556, "isIOU" : false, "amt" : 1 }
                ]
            }
        ],
        "rareLootProbability" : 0,
        "rootLoot" : null,
		"baseLoot": [
            {
				"itemId": 6,
				"name": "coins",
				"isIOU": false,
				"amount": 100
			}
        ],
		"loot": [
            {
                "itemId": 6,
				"name": "coins",
				"isIOU": false,
				"amount": 5000,
				"odds": 0.41
            },
            {
                "itemId": 159,
				"name": "beer",
				"isIOU": false,
				"amount": 1,
				"odds": 0.075
            },
            {
                "itemId": 163,
				"name": "dew beer",
				"isIOU": false,
				"amount": 1,
				"odds": 0.075
            },
            {
				"itemId": 267,
				"name": "potion of fishing (2)",
				"isIOU": true,
				"amount": 5,
				"odds": 0.05
			},
            {
				"itemId": 269,
				"name": "potion of smithing (2)",
				"isIOU": true,
				"amount": 5,
				"odds": 0.05
			},
            {
				"itemId": 271,
				"name": "potion of mining (2)",
				"isIOU": true,
				"amount": 5,
				"odds": 0.05
			},
            {
				"itemId": 275,
				"name": "potion of forestry (2)",
				"isIOU": true,
				"amount": 5,
				"odds": 0.05
			},
            {
				"itemId": 511,
				"name": "potion of stamina (2)",
				"isIOU": true,
				"amount": 5,
				"odds": 0.05
			},
            {
				"itemId": 285,
				"name": "potion of mischief (2)",
				"isIOU": true,
				"amount": 5,
				"odds": 0.05
			},
            {
				"itemId": 136,
				"name": "bandits mask",
				"isIOU": false,
				"amount": 1,
				"odds": 0.025
			},
            {
				"itemId": 201,
				"name": "robe top",
				"isIOU": false,
				"amount": 1,
				"odds": 0.01
			},
            {
				"itemId": 202,
				"name": "robe bottoms",
				"isIOU": false,
				"amount": 1,
				"odds": 0.01
			},
            {
				"itemId": 308,
				"name": "old hood",
				"isIOU": false,
				"amount": 1,
				"odds": 0.01
			},
            {
				"itemId": 205,
				"name": "sages top",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0075
			},
            {
				"itemId": 206,
				"name": "sages bottoms",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0075
			},
            {
				"itemId": 310,
				"name": "druids hood",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0075
			},
            {
				"itemId": 538,
				"name": "purple bandits mask",
				"isIOU": false,
				"amount": 1,
				"odds": 0.005
			},
            {
				"itemId": 539,
				"name": "red bandits mask",
				"isIOU": false,
				"amount": 1,
				"odds": 0.005
			},
            {
				"itemId": 540,
				"name": "green bandits mask",
				"isIOU": false,
				"amount": 1,
				"odds": 0.005
			},
            {
				"itemId": 541,
				"name": "blue bandits mask",
				"isIOU": false,
				"amount": 1,
				"odds": 0.005
			},
            {
				"itemId": 607,
				"name": "elite chefs hat",
				"isIOU": false,
				"amount": 1,
				"odds": 0.005
			},
            {
				"itemId": 608,
				"name": "thiefs cape",
				"isIOU": false,
				"amount": 1,
				"odds": 0.005
			},
            {
				"itemId": 215,
				"name": "giant gnome hat",
				"isIOU": false,
				"amount": 1,
				"odds": 0.005
			},
            {
				"itemId": 216,
				"name": "giant gnomes top",
				"isIOU": false,
				"amount": 1,
				"odds": 0.005
			},
            {
				"itemId": 606,
				"name": "fuchsia knights cape",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0035
			},
            {
				"itemId": 543,
				"name": "silver royal crown",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0035
			},
            {
				"itemId": 544,
				"name": "foresters pendant",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0035
			},
            {
				"itemId": 545,
				"name": "fishermans pendant",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0035
			},
            {
				"itemId": 546,
				"name": "miners pendant",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0035
			},
            {
				"itemId": 547,
				"name": "harvesters pendant",
				"isIOU": false,
				"amount": 1,
				"odds": 0.0035
			},
            {
				"itemId": 542,
				"name": "golden royal crown",
				"isIOU": false,
				"amount": 1,
				"odds": 0.001
			},
            {
                "itemId": 6,
				"name": "coins",
				"isIOU": false,
				"amount": 50000,
				"odds": 0.00049
            }
        ],
        "minRandomizedStackableFactor":0.2,
        "showLootReceivedNotification":true,
        "rolls": [ 1.0, 0.65, 0.25, 0.2 ]
	},
	{
		"_id": 25,
		"desc": "Picklock Deserted Island chest",
		"xpRewards": [
			{
				"skill": "crime",
				"amount": 150
			}
		],
		"requirements": [
			{
				"desc" : "player crime skill >= 65",
				"type" : "skill",
				"skill" : "crime",
				"level" : 65,
				"operator" : ">=",
                "checkCurrentLevel" : true
			}
		],
		"baseProbabilityOfSuccess": 0.025,
		"maxLvlProbabilityOfSuccess": 0.25,
		"respawnTicks": 25,
        "oddsOfHavingLootOnRespawn": 1,
		"searchStartResult": [],
		"searchEndResult": [],
        "rareLootProbability" : 0,
        "rootLoot" : null,
		"baseLoot": [
			{
				"itemId": 6,
				"name": "coins",
				"isIOU": false,
				"amount": 50
			}
		],
		"loot": [
			{
				"itemId": 13,
				"name": "raw crab",
				"isIOU": false,
				"amount": 1,
				"odds": 0.2
			},
            {
				"itemId": 21,
				"name": "raw tuna",
				"isIOU": false,
				"amount": 1,
				"odds": 0.125
			},
            {
				"itemId": 17,
				"name": "raw marlin",
				"isIOU": false,
				"amount": 1,
				"odds": 0.1
			},
            {
				"itemId": 23,
				"name": "raw octopus",
				"isIOU": false,
				"amount": 1,
				"odds": 0.05
			}
        ]
	}
]