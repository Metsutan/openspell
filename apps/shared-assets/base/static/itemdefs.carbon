[
{
	"_id" : 1,
	"name" : "unknown item",
    "description" : "Unknown id",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : false,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0
},
{
	"_id" : 2,
	"name" : "raw bass",
    "description" : "I hope it doesn't start singing",
    "isNamePlural" : false,
	"cost" : 5,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : 1,
	"expFromObtaining" : {
		"skill" : "fishing",
		"amount" : 15
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.5
},
{
	"_id" : 3,
	"name" : "bass",
    "description" : "A fully-cooked bass",
    "isNamePlural" : false,
	"cost" : 8,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"eat"
	],
	"edibleEffects" : [
		{
            "type" : "Default",
            "effect": {
                "skill" : "hitpoints",
			    "amount" : 3
            }
		}
	],
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : 0.8,
	"expFromObtaining" : {
		"skill" : "cooking",
		"amount" : 20
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.4
},
{
	"_id" : 4,
	"name" : "raw bluegill",
    "description" : "Yep it has blue gills",
    "isNamePlural" : false,
	"cost" : 8,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : 0.98,
	"expFromObtaining" : {
		"skill" : "fishing",
		"amount" : 20
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.4
},
{
	"_id" : 5,
	"name" : "bluegill",
    "description" : "A tasty bluegill",
    "isNamePlural" : false,
	"cost" : 10,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"eat"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "hitpoints",
			    "amount" : 3
            }
		}
	],
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : 0.7,
	"expFromObtaining" : {
		"skill" : "cooking",
		"amount" : 25
	},
    "recipe" : null,
    "metalType" : null
    ,
    "weight": 0.3
},
{
	"_id" : 6,
	"name" : "coins",
    "description" : "I love money",
    "isNamePlural" : true,
	"cost" : 1,
	"isStackable" : true,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0
},
{
	"_id" : 7,
	"name" : "basic rod",
    "description" : "A beginner's fishing rod",
    "isNamePlural" : false,
	"cost" : 20,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : [
		{
			"skill" : "fishing",
			"amount" : 1
		}
	],
	"equipmentType" : "weapon",
    "equipmentSpriteId" : 0,
    "equipmentSpriteSheet" : "weapon1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weaponSpeed" : 7,
    "removeEquipmentOnEquip" : [
        "shield"
    ],
    "weight": 0.25
},
{
	"_id" : 8,
	"name" : "great rod",
    "description" : "A rod for experienced anglers",
    "isNamePlural" : false,
	"cost" : 200,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : [
		{
			"skill" : "fishing",
			"amount" : 10
		}
	],
	"equipmentType" : "weapon",
    "equipmentSpriteId" : 0,
    "equipmentSpriteSheet" : "weapon1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weaponSpeed" : 7,
    "removeEquipmentOnEquip" : [
        "shield"
    ],
    "weight": 0.25
},
{
	"_id" : 9,
	"name" : "ultra rod",
    "description" : "A highly technical fishing rod",
    "isNamePlural" : false,
	"cost" : 1000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : [
		{
			"skill" : "fishing",
			"amount" : 35
		}
	],
	"equipmentType" : "weapon",
    "equipmentSpriteId" : 0,
    "equipmentSpriteSheet" : "weapon1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weaponSpeed" : 7,
    "removeEquipmentOnEquip" : [
        "shield"
    ],
    "weight": 0.25
},
{
	"_id" : 10,
	"name" : "master rod",
    "description" : "A fishing rod for true fishing masters",
    "isNamePlural" : false,
	"cost" : 15000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : [
		{
			"skill" : "fishing",
			"amount" : 50
		}
	],
	"equipmentType" : "weapon",
    "equipmentSpriteId" : 3,
    "equipmentSpriteSheet" : "weapon1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weaponSpeed" : 7,
    "removeEquipmentOnEquip" : [
        "shield"
    ],
    "weight": 0.25
},
{
	"_id" : 11,
	"name" : "raw stingray",
    "description" : "Watch out for its stinger",
    "isNamePlural" : false,
	"cost" : 40,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : 0.925,
	"expFromObtaining" : {
		"skill" : "fishing",
		"amount" : 50
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.75
},
{
	"_id" : 12,
	"name" : "stingray",
    "description" : "A cooked stingray",
    "isNamePlural" : false,
	"cost" : 50,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"eat"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "hitpoints",
			    "amount" : 6
            }
		}
	],
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : 0.325,
	"expFromObtaining" : {
		"skill" : "cooking",
		"amount" : 50
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.5
},
{
	"_id" : 13,
	"name" : "raw crab",
    "description" : "Those claws look dangerous",
    "isNamePlural" : false,
	"cost" : 65,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : 0.885,
	"expFromObtaining" : {
		"skill" : "fishing",
		"amount" : 105
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.4
},
{
	"_id" : 14,
	"name" : "crab",
    "description" : "A crunchy crab",
    "isNamePlural" : false,
	"cost" : 70,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"eat"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "hitpoints",
			    "amount" : 10
            }
		}
	],
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : 0.18,
	"expFromObtaining" : {
		"skill" : "cooking",
		"amount" : 100
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.35
},
{
	"_id" : 15,
	"name" : "raw clownfish",
    "description" : "They are often found among coral reefs",
    "isNamePlural" : false,
	"cost" : 65,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : 0.45,
	"expFromObtaining" : {
		"skill" : "fishing",
		"amount" : 225
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.075
},
{
	"_id" : 16,
	"name" : "clownfish",
    "description" : "Eating it probably won't fill me up",
    "isNamePlural" : false,
	"cost" : 65,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"eat"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "hitpoints",
			    "amount" : 2
            }
		}
	],
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : 0.125,
	"expFromObtaining" : {
		"skill" : "cooking",
		"amount" : 20
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.05
},
{
	"_id" : 17,
	"name" : "raw marlin",
    "description" : "I bet it can swim real fast",
    "isNamePlural" : false,
	"cost" : 70,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : 0.675,
	"expFromObtaining" : {
		"skill" : "fishing",
		"amount" : 115
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.75
},
{
	"_id" : 18,
	"name" : "marlin",
    "description" : "A cooked marlin",
    "isNamePlural" : false,
	"cost" : 70,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"eat"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "hitpoints",
			    "amount" : 14
            }
		}
	],
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : 0.145,
	"expFromObtaining" : {
		"skill" : "cooking",
		"amount" : 120
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.5
},
{
	"_id" : 19,
	"name" : "raw whaleshark",
    "description" : "So is it a whale or a shark?",
    "isNamePlural" : false,
	"cost" : 75,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : 0.4,
	"expFromObtaining" : {
		"skill" : "fishing",
		"amount" : 150
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 1
},
{
	"_id" : 20,
	"name" : "whaleshark",
    "description" : "Eating this will definitely fill me up",
    "isNamePlural" : false,
	"cost" : 70,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"eat"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "hitpoints",
			    "amount" : 20
            }
		}
	],
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : 0.11,
	"expFromObtaining" : {
		"skill" : "cooking",
		"amount" : 175
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.75
},
{
	"_id" : 21,
	"name" : "raw tuna",
    "description" : "An ordinary blue-finned tunafish",
    "isNamePlural" : false,
	"cost" : 60,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : 0.85,
	"expFromObtaining" : {
		"skill" : "fishing",
		"amount" : 110
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.8
},
{
	"_id" : 22,
	"name" : "tuna",
    "description" : "A cooked tuna",
    "isNamePlural" : false,
	"cost" : 60,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"eat"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "hitpoints",
			    "amount" : 12
            }
		}
	],
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : 0.17,
	"expFromObtaining" : {
		"skill" : "cooking",
		"amount" : 110
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.75
},
{
	"_id" : 23,
	"name" : "raw octopus",
    "description" : "Better watch those suction cups",
    "isNamePlural" : false,
	"cost" : 100,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : 0.325,
	"expFromObtaining" : {
		"skill" : "fishing",
		"amount" : 175
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 1
},
{
	"_id" : 24,
	"name" : "octopus",
    "description" : "A sizzling octopus fresh off the grill",
    "isNamePlural" : false,
	"cost" : 70,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"eat"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "hitpoints",
			    "amount" : 22
            }
		}
	],
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : 0.1,
	"expFromObtaining" : {
		"skill" : "cooking",
		"amount" : 190
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.85
},
{
	"_id" : 25,
	"name" : "raw salmon",
    "description" : "It can survive in both fresh water and salt water",
    "isNamePlural" : false,
	"cost" : 10,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : 0.95,
	"expFromObtaining" : {
		"skill" : "fishing",
		"amount" : 30
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.4
},
{
	"_id" : 26,
	"name" : "salmon",
    "description" : "Fresh grilled salmon",
    "isNamePlural" : false,
	"cost" : 10,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"eat"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "hitpoints",
			    "amount" : 5
            }
		}
	],
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : 0.5,
	"expFromObtaining" : {
		"skill" : "cooking",
		"amount" : 35
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.3
},
{
	"_id" : 27,
	"name" : "raw piranha",
    "description" : "Small but vicious",
    "isNamePlural" : false,
	"cost" : 15,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : 0.92,
	"expFromObtaining" : {
		"skill" : "fishing",
		"amount" : 60
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.25
},
{
	"_id" : 28,
	"name" : "piranha",
    "description" : "A cooked piranha",
    "isNamePlural" : false,
	"cost" : 10,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"eat"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "hitpoints",
			    "amount" : 6
            }
		}
	],
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : 0.25,
	"expFromObtaining" : {
		"skill" : "cooking",
		"amount" : 65
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.2
},
{
	"_id" : 29,
	"name" : "raw koi",
    "description" : "A colorful, ornamental fish",
    "isNamePlural" : false,
	"cost" : 25,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : 0.85,
	"expFromObtaining" : {
		"skill" : "fishing",
		"amount" : 110
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.3
},
{
	"_id" : 30,
	"name" : "koi",
    "description" : "A cooked koi fish",
    "isNamePlural" : false,
	"cost" : 25,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"eat"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "hitpoints",
			    "amount" : 8
            }
		}
	],
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : 0.16,
	"expFromObtaining" : {
		"skill" : "cooking",
		"amount" : 110
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.25
},
{
	"_id" : 31,
	"name" : "raw turtle",
    "description" : "It's a turtle",
    "isNamePlural" : false,
	"cost" : 40,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : 0.6,
	"expFromObtaining" : {
		"skill" : "fishing",
		"amount" : 130
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.5
},
{
	"_id" : 32,
	"name" : "turtle",
    "description" : "Although it's cooked, its mouth can still snap shut",
    "isNamePlural" : false,
	"cost" : 45,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"eat"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "hitpoints",
			    "amount" : 15
            }
		}
	],
    "edibleResult" : {
        "id" : 508,
        "amount" : 1,
        "isIOU" : false
    },
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : 0.135,
	"expFromObtaining" : {
		"skill" : "cooking",
		"amount" : 150
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.4
},
{
	"_id" : 33,
	"name" : "raw carp",
    "description" : "A common carp",
    "isNamePlural" : false,
	"cost" : 15,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : 0.94,
	"expFromObtaining" : {
		"skill" : "fishing",
		"amount" : 40
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.5
},
{
	"_id" : 34,
	"name" : "carp",
    "description" : "A fully-cooked carp",
    "isNamePlural" : false,
	"cost" : 15,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"eat"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "hitpoints",
			    "amount" : 6
            }
		}
	],
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : 0.4,
	"expFromObtaining" : {
		"skill" : "cooking",
		"amount" : 40
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.4
},
{
	"_id" : 35,
	"name" : "raw walleye",
    "description" : "Also known as a yellow pike",
    "isNamePlural" : false,
	"cost" : 20,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : 0.89,
	"expFromObtaining" : {
		"skill" : "fishing",
		"amount" : 75
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.35
},
{
	"_id" : 36,
	"name" : "walleye",
    "description" : "A crispy walleye",
    "isNamePlural" : false,
	"cost" : 15,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"eat"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "hitpoints",
			    "amount" : 9
            }
		}
	],
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : 0.2,
	"expFromObtaining" : {
		"skill" : "cooking",
		"amount" : 85
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.3
},
{
	"_id" : 37,
	"name" : "raw frog",
    "description" : "Ribbit",
    "isNamePlural" : false,
	"cost" : 30,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : 0.75,
	"expFromObtaining" : {
		"skill" : "fishing",
		"amount" : 111
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.15
},
{
	"_id" : 38,
	"name" : "frog",
    "description" : "Yum, frog legs",
    "isNamePlural" : false,
	"cost" : 35,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"eat"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "hitpoints",
			    "amount" : 11
            }
		}
	],
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : 0.14,
	"expFromObtaining" : {
		"skill" : "cooking",
		"amount" : 125
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.1
},
{
	"_id" : 39,
	"name" : "bones",
    "description" : "R.I.P.",
    "isNamePlural" : true,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.5
},
{
	"_id" : 40,
	"name" : "bronze chestplate",
    "description" : "Protective chest armour made of bronze",
    "isNamePlural" : false,
	"cost" : 200,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 12
        },
        {
            "skill" : "magic",
            "amount" : -15
        },
        {
            "skill" : "range",
            "amount" : -15
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 1
		}
	],
	"equipmentType" : "chest",
    "equipmentSpriteId" : 0,
    "equipmentSpriteSheet" : "chest1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 125
    },
    "recipe" : [
        {
            "desc" : "bronze bar",
            "itemId" : 70,
            "amount" : 5
        }
    ],
    "metalType" : "bronze",
    "weight": 10
},
{
	"_id" : 41,
	"name" : "bronze platelegs",
    "description" : "Protective leg armour made of bronze",
    "isNamePlural" : true,
	"cost" : 100,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 8
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 1
		}
	],
	"equipmentType" : "legs",
    "equipmentSpriteId" : 0,
    "equipmentSpriteSheet" : "legs1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 75
    },
    "recipe" : [
        {
            "desc" : "bronze bar",
            "itemId" : 70,
            "amount" : 3
        }
    ],
    "metalType" : "bronze",
    "weight": 6,
    "removeEquipmentOnEquip" : [
        "boots"
    ]
},
{
	"_id" : 42,
	"name" : "steel chestplate",
    "description" : "Protective chest armour made of steel",
    "isNamePlural" : false,
	"cost" : 1600,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 39
        },
        {
            "skill" : "magic",
            "amount" : -15
        },
        {
            "skill" : "range",
            "amount" : -15
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 20
		}
	],
	"equipmentType" : "chest",
    "equipmentSpriteId" : 1,
    "equipmentSpriteSheet" : "chest1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 250
    },
    "recipe" : [
        {
            "desc" : "steel bar",
            "itemId" : 143,
            "amount" : 5
        }
    ],
    "metalType" : "steel",
    "weight": 10
},
{
	"_id" : 43,
	"name" : "steel platelegs",
    "description" : "Protective leg armour made of steel",
    "isNamePlural" : true,
	"cost" : 800,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 27
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 20
		}
	],
	"equipmentType" : "legs",
    "equipmentSpriteId" : 1,
    "equipmentSpriteSheet" : "legs1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 150
    },
    "recipe" : [
        {
            "desc" : "steel bar",
            "itemId" : 143,
            "amount" : 3
        }
    ],
    "metalType" : "steel",
    "weight": 6,
    "removeEquipmentOnEquip" : [
        "boots"
    ]
},
{
	"_id" : 44,
	"name" : "palladium chestplate",
    "description" : "Protective chest armour made of palladium",
    "isNamePlural" : false,
	"cost" : 4000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 54
        },
        {
            "skill" : "magic",
            "amount" : -15
        },
        {
            "skill" : "range",
            "amount" : -15
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 30
		}
	],
	"equipmentType" : "chest",
    "equipmentSpriteId" : 2,
    "equipmentSpriteSheet" : "chest1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 375
    },
    "recipe" : [
        {
            "desc" : "palladium bar",
            "itemId" : 144,
            "amount" : 5
        }
    ],
    "metalType" : "palladium",
    "weight": 10
},
{
	"_id" : 45,
	"name" : "palladium platelegs",
    "description" : "Protective leg armour made of palladium",
    "isNamePlural" : true,
	"cost" : 2000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 38
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 30
		}
	],
	"equipmentType" : "legs",
    "equipmentSpriteId" : 2,
    "equipmentSpriteSheet" : "legs1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 225
    },
    "recipe" : [
        {
            "desc" : "palladium bar",
            "itemId" : 144,
            "amount" : 3
        }
    ],
    "metalType" : "palladium",
    "weight": 6,
    "removeEquipmentOnEquip" : [
        "boots"
    ]
},
{
	"_id" : 46,
	"name" : "coronium chestplate",
    "description" : "Protective chest armour made of coronium",
    "isNamePlural" : false,
	"cost" : 35000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 70
        },
        {
            "skill" : "magic",
            "amount" : -15
        },
        {
            "skill" : "range",
            "amount" : -15
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 40
		}
	],
	"equipmentType" : "chest",
    "equipmentSpriteId" : 3,
    "equipmentSpriteSheet" : "chest1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 750
    },
    "recipe" : [
        {
            "desc" : "coronium bar",
            "itemId" : 145,
            "amount" : 5
        }
    ],
    "metalType" : "coronium",
    "weight": 10
},
{
	"_id" : 47,
	"name" : "coronium platelegs",
    "description" : "Protective leg armour made of coronium",
    "isNamePlural" : true,
	"cost" : 17500,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 50
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 40
		}
	],
	"equipmentType" : "legs",
    "equipmentSpriteId" : 3,
    "equipmentSpriteSheet" : "legs1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 450
    },
    "recipe" : [
        {
            "desc" : "coronium bar",
            "itemId" : 145,
            "amount" : 3
        }
    ],
    "metalType" : "coronium",
    "weight": 6,
    "removeEquipmentOnEquip" : [
        "boots"
    ]
},
{
	"_id" : 48,
	"name" : "palladium ore",
    "description" : "Raw palladium ore",
    "isNamePlural" : true,
	"cost" : 60,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
    "hidesSpritesUnderneath" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "mining",
        "amount" : 150
    },
    "recipe" : null,
    "metalType" : null,
    "weight": 2.5
},
{
	"_id" : 49,
	"name" : "copper ore",
    "description" : "Raw copper ore",
    "isNamePlural" : true,
	"cost" : 3,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
    "hidesSpritesUnderneath" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "mining",
        "amount" : 20
    },
    "recipe" : null,
    "metalType" : null,
    "weight": 2
},
{
	"_id" : 50,
	"name" : "tin ore",
    "description" : "Raw tin ore",
    "isNamePlural" : true,
	"cost" : 3,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
    "hidesSpritesUnderneath" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "mining",
        "amount" : 20
    },
    "recipe" : null,
    "metalType" : null,
    "weight": 2.5
},
{
	"_id" : 51,
	"name" : "coronium ore",
    "description" : "Raw coronium ore",
    "isNamePlural" : true,
	"cost" : 500,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
    "hidesSpritesUnderneath" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "mining",
        "amount" : 300
    },
    "recipe" : null,
    "metalType" : null,
    "weight": 2.5
},
{
	"_id" : 52,
	"name" : "bronze helm",
    "description" : "An open-faced helmet made from bronze",
    "isNamePlural" : false,
	"cost" : 30,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 4
        },
        {
            "skill" : "accuracy",
            "amount" : 1
        },
        {
            "skill" : "magic",
            "amount" : -3
        },
        {
            "skill" : "range",
            "amount" : -3
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 1
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 0,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 25
    },
    "recipe" : [
        {
            "desc" : "bronze bar",
            "itemId" : 70,
            "amount" : 1
        }
    ],
    "metalType" : "bronze",
    "weight": 2
},
{
	"_id" : 53,
	"name" : "steel helm",
    "description" : "An open-faced helmet made from steel",
    "isNamePlural" : false,
	"cost" : 250,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 13
        },
        {
            "skill" : "accuracy",
            "amount" : 1
        },
        {
            "skill" : "magic",
            "amount" : -3
        },
        {
            "skill" : "range",
            "amount" : -3
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 20
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 2,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 50
    },
    "recipe" : [
        {
            "desc" : "steel bar",
            "itemId" : 143,
            "amount" : 1
        }
    ],
    "metalType" : "steel",
    "weight": 2
},
{
	"_id" : 54,
	"name" : "palladium helm",
    "description" : "An open-faced helmet made from palladium",
    "isNamePlural" : false,
	"cost" : 600,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 19
        },
        {
            "skill" : "accuracy",
            "amount" : 1
        },
        {
            "skill" : "magic",
            "amount" : -3
        },
        {
            "skill" : "range",
            "amount" : -3
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 30
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 3,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 75
    },
    "recipe" : [
        {
            "desc" : "palladium bar",
            "itemId" : 144,
            "amount" : 1
        }
    ],
    "metalType" : "palladium",
    "weight": 2
},
{
	"_id" : 55,
	"name" : "coronium helm",
    "description" : "An open-faced helmet made from coronium",
    "isNamePlural" : false,
	"cost" : 5000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 26
        },
        {
            "skill" : "accuracy",
            "amount" : 1
        },
        {
            "skill" : "magic",
            "amount" : -3
        },
        {
            "skill" : "range",
            "amount" : -3
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 40
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 4,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 150
    },
    "recipe" : [
        {
            "desc" : "coronium bar",
            "itemId" : 145,
            "amount" : 1
        }
    ],
    "metalType" : "coronium",
    "weight": 2
},
{
	"_id" : 56,
	"name" : "bronze battleaxe",
    "description" : "A dangerous battleaxe",
    "isNamePlural" : false,
	"cost" : 100,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "accuracy",
            "amount" : 10
        },
        {
            "skill" : "strength",
            "amount" : 13
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "accuracy",
			"amount" : 1
		}
	],
	"equipmentType" : "weapon",
    "equipmentSpriteId" : 9,
    "equipmentSpriteSheet" : "weapon1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 75
    },
    "recipe" : [
        {
            "desc" : "bronze bar",
            "itemId" : 70,
            "amount" : 3
        }
    ],
    "metalType" : "bronze",
    "weight": 3.5,
    "weaponSpeed" : 6
},
{
	"_id" : 57,
	"name" : "iron battleaxe",
    "description" : "A dangerous battleaxe",
    "isNamePlural" : false,
	"cost" : 320,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "accuracy",
            "amount" : 14
        },
        {
            "skill" : "strength",
            "amount" : 19
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "accuracy",
			"amount" : 10
		}
	],
	"equipmentType" : "weapon",
    "equipmentSpriteId" : 15,
    "equipmentSpriteSheet" : "weapon1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 105
    },
    "recipe" : [
        {
            "desc" : "iron bar",
            "itemId" : 148,
            "amount" : 3
        }
    ],
    "metalType" : "iron",
    "weight": 3.5,
    "weaponSpeed" : 6
},
{
	"_id" : 58,
	"name" : "bronze longsword",
    "description" : "A sharp sword crafted from bronze",
    "isNamePlural" : false,
	"cost" : 60,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
		{
			"skill" : "accuracy",
			"amount" : 10
		},
		{
			"skill" : "strength",
			"amount" : 9
		}
	],
	"equippableRequirements" : [
		{
			"skill" : "accuracy",
			"amount" : 1
		}
	],
	"equipmentType" : "weapon",
	"equipmentSpriteId" : 4,
	"equipmentSpriteSheet" : "weapon1",
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "smithing",
		"amount" : 50
	},
    "recipe" : [
        {
            "desc" : "bronze bar",
            "itemId" : 70,
            "amount" : 2
        }
    ],
    "metalType" : "bronze",
    "weaponSpeed" : 5,
    "weight": 2
},
{
	"_id" : 59,
	"name" : "iron longsword",
    "description" : "A sharp sword crafted from iron",
    "isNamePlural" : false,
	"cost" : 200,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
		{
			"skill" : "accuracy",
			"amount" : 14
		},
		{
			"skill" : "strength",
			"amount" : 13
		}
	],
	"equippableRequirements" : [
		{
			"skill" : "accuracy",
			"amount" : 10
		}
	],
	"equipmentType" : "weapon",
	"equipmentSpriteId" : 5,
	"equipmentSpriteSheet" : "weapon1",
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "smithing",
		"amount" : 70
	},
    "recipe" : [
        {
            "desc" : "iron bar",
            "itemId" : 148,
            "amount" : 2
        }
    ],
    "metalType" : "iron",
    "weaponSpeed" : 5,
    "weight": 2
},
{
	"_id" : 60,
	"name" : "steel longsword",
    "description" : "A sharp sword made from steel",
    "isNamePlural" : false,
	"cost" : 500,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
		{
			"skill" : "accuracy",
			"amount" : 21
		},
		{
			"skill" : "strength",
			"amount" : 20
		}
	],
	"equippableRequirements" : [
		{
			"skill" : "accuracy",
			"amount" : 20
		}
	],
	"equipmentType" : "weapon",
	"equipmentSpriteId" : 6,
	"equipmentSpriteSheet" : "weapon1",
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "smithing",
		"amount" : 100
	},
    "recipe" : [
        {
            "desc" : "steel bar",
            "itemId" : 143,
            "amount" : 2
        }
    ],
    "metalType" : "steel",
    "weaponSpeed" : 5,
    "weight": 2
},
{
	"_id" : 61,
	"name" : "palladium longsword",
    "description" : "A sharp sword made from palladium",
    "isNamePlural" : false,
	"cost" : 1200,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
		{
			"skill" : "accuracy",
			"amount" : 31
		},
		{
			"skill" : "strength",
			"amount" : 30
		}
	],
	"equippableRequirements" : [
		{
			"skill" : "accuracy",
			"amount" : 30
		}
	],
	"equipmentType" : "weapon",
	"equipmentSpriteId" : 7,
	"equipmentSpriteSheet" : "weapon1",
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "smithing",
		"amount" : 150
	},
    "recipe" : [
        {
            "desc" : "palladium bar",
            "itemId" : 144,
            "amount" : 2
        }
    ],
    "metalType" : "palladium",
    "weaponSpeed" : 5,
    "weight": 2
},
{
	"_id" : 62,
	"name" : "coronium longsword",
    "description" : "A sharp sword crafted from coronium",
    "isNamePlural" : false,
	"cost" : 10000,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
		{
			"skill" : "accuracy",
			"amount" : 44
		},
		{
			"skill" : "strength",
			"amount" : 43
		}
	],
	"equippableRequirements" : [
		{
			"skill" : "accuracy",
			"amount" : 40
		}
	],
	"equipmentType" : "weapon",
	"equipmentSpriteId" : 8,
	"equipmentSpriteSheet" : "weapon1",
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "smithing",
		"amount" : 300
	},
    "recipe" : [
        {
            "desc" : "coronium bar",
            "itemId" : 145,
            "amount" : 2
        }
    ],
    "metalType" : "coronium",
    "weaponSpeed" : 5,
    "weight": 2
},
{
	"_id" : 63,
	"name" : "steel battleaxe",
    "description" : "A dangerous battleaxe",
    "isNamePlural" : false,
	"cost" : 800,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "accuracy",
            "amount" : 21
        },
        {
            "skill" : "strength",
            "amount" : 27
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "accuracy",
			"amount" : 20
		}
	],
	"equipmentType" : "weapon",
    "equipmentSpriteId" : 16,
    "equipmentSpriteSheet" : "weapon1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 150
    },
    "recipe" : [
        {
            "desc" : "steel bar",
            "itemId" : 143,
            "amount" : 3
        }
    ],
    "metalType" : "steel",
    "weight": 3.5,
    "weaponSpeed" : 6
},
{
	"_id" : 64,
	"name" : "logs",
    "description" : "Logs from a tree",
    "isNamePlural" : true,
	"cost" : 2,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "forestry",
		"amount" : 20
    },
    "recipe" : null,
    "metalType" : null,
    "weight": 2
},
{
	"_id" : 65,
	"name" : "pine logs",
    "description" : "Logs from a pine tree",
    "isNamePlural" : true,
	"cost" : 5,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "forestry",
		"amount" : 50
    },
    "recipe" : null,
    "metalType" : null,
    "weight": 2
},
{
	"_id" : 66,
	"name" : "oak logs",
    "description" : "Logs from an oak tree",
    "isNamePlural" : true,
	"cost" : 15,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "forestry",
		"amount" : 100
    },
    "recipe" : null,
    "metalType" : null,
    "weight": 2
},
{
	"_id" : 67,
	"name" : "palm logs",
    "description" : "Logs from a palm tree",
    "isNamePlural" : true,
	"cost" : 30,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "forestry",
		"amount" : 150
    },
    "recipe" : null,
    "metalType" : null,
    "weight": 2
},
{
	"_id" : 68,
	"name" : "cherry logs",
    "description" : "Logs from a cherry blossom tree",
    "isNamePlural" : true,
	"cost" : 50,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "forestry",
		"amount" : 225
    },
    "recipe" : null,
    "metalType" : null,
    "weight": 2
},
{
	"_id" : 69,
	"name" : "money bag",
    "description" : "I wonder how much is inside?",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"open"
	],
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "forestry",
		"amount" : 50
    },
    "recipe" : null,
    "metalType" : null,
    "weight": 1
},
{
	"_id" : 70,
	"name" : "bronze bar",
    "description" : "A solid bar of bronze",
    "isNamePlural" : false,
	"cost" : 15,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 25
    },
    "recipe" : [
        {
            "desc" : "copper ore",
            "itemId" : 49,
            "amount" : 1
        },
        {
            "desc" : "tin ore",
            "itemId" : 50,
            "amount" : 1
        }
    ],
    "metalType" : "bronze",
    "weight": 2
},
{
	"_id" : 71,
	"name" : "silver bar",
    "description" : "A solid bar of silver",
    "isNamePlural" : false,
	"cost" : 200,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 60
    },
    "recipe" : [
        {
            "desc" : "silver nugget",
            "itemId" : 89,
            "amount" : 4
        }
    ],
    "metalType" : "silver",
    "weight": 2
},
{
	"_id" : 72,
	"name" : "gold bar",
    "description" : "A solid bar of gold!",
    "isNamePlural" : false,
	"cost" : 1000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 100
    },
    "recipe" : [
        {
            "desc" : "gold nugget",
            "itemId" : 90,
            "amount" : 4
        }
    ],
    "metalType" : "gold",
    "weight": 2
},
{
	"_id" : 73,
	"name" : "bronze pickaxe",
    "description" : "A pickaxe made of bronze",
    "isNamePlural" : false,
	"cost" : 30,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
		{
			"skill" : "accuracy",
			"amount" : 1
		},
		{
			"skill" : "strength",
			"amount" : 1
		}
	],
	"equippableRequirements" : [
        {
            "skill" : "mining",
            "amount" : 1
        }
    ],
	"equipmentType" : "weapon",
	"equipmentSpriteId" : 10,
	"equipmentSpriteSheet" : "weapon1",
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "smithing",
		"amount" : 25
	},
    "recipe" : [
        {
            "desc" : "bronze bar",
            "itemId" : 70,
            "amount" : 1
        }
    ],
    "metalType" : "bronze",
    "weight": 1.25,
    "weaponSpeed" : 5
},
{
	"_id" : 74,
	"name" : "iron pickaxe",
    "description" : "A pickaxe made of iron",
    "isNamePlural" : false,
	"cost" : 100,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
		{
			"skill" : "accuracy",
			"amount" : 2
		},
		{
			"skill" : "strength",
			"amount" : 2
		}
	],
	"equippableRequirements" : [
        {
            "skill" : "mining",
            "amount" : 10
        }
    ],
	"equipmentType" : "weapon",
	"equipmentSpriteId" : 11,
	"equipmentSpriteSheet" : "weapon1",
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "smithing",
		"amount" : 35
	},
    "recipe" : [
        {
            "desc" : "iron bar",
            "itemId" : 148,
            "amount" : 1
        }
    ],
    "metalType" : "iron",
    "weight": 1.25,
    "weaponSpeed" : 5
},
{
	"_id" : 75,
	"name" : "steel pickaxe",
    "description" : "A pickaxe made of steel",
    "isNamePlural" : false,
	"cost" : 250,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
		{
			"skill" : "accuracy",
			"amount" : 3
		},
		{
			"skill" : "strength",
			"amount" : 3
		}
	],
	"equippableRequirements" : [
        {
            "skill" : "mining",
            "amount" : 20
        }
    ],
	"equipmentType" : "weapon",
	"equipmentSpriteId" : 12,
	"equipmentSpriteSheet" : "weapon1",
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "smithing",
		"amount" : 50
	},
    "recipe" : [
        {
            "desc" : "steel bar",
            "itemId" : 143,
            "amount" : 1
        }
    ],
    "metalType" : "steel",
    "weight": 1.25,
    "weaponSpeed" : 5
},
{
	"_id" : 76,
	"name" : "palladium pickaxe",
    "description" : "A pickaxe made of palladium",
    "isNamePlural" : false,
	"cost" : 600,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
		{
			"skill" : "accuracy",
			"amount" : 4
		},
		{
			"skill" : "strength",
			"amount" : 4
		}
	],
	"equippableRequirements" : [
        {
            "skill" : "mining",
            "amount" : 30
        }
    ],
	"equipmentType" : "weapon",
	"equipmentSpriteId" : 13,
	"equipmentSpriteSheet" : "weapon1",
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "smithing",
		"amount" : 75
	},
    "recipe" : [
        {
            "desc" : "palladium bar",
            "itemId" : 144,
            "amount" : 1
        }
    ],
    "metalType" : "palladium",
    "weight": 1.25,
    "weaponSpeed" : 5
},
{
	"_id" : 77,
	"name" : "coronium pickaxe",
    "description" : "A pickaxe made of coronium",
    "isNamePlural" : false,
	"cost" : 5000,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
		{
			"skill" : "accuracy",
			"amount" : 5
		},
		{
			"skill" : "strength",
			"amount" : 5
		}
	],
	"equippableRequirements" : [
        {
            "skill" : "mining",
            "amount" : 40
        }
    ],
	"equipmentType" : "weapon",
	"equipmentSpriteId" : 14,
	"equipmentSpriteSheet" : "weapon1",
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "smithing",
		"amount" : 150
	},
    "recipe" : [
        {
            "desc" : "coronium bar",
            "itemId" : 145,
            "amount" : 1
        }
    ],
    "metalType" : "coronium",
    "weight": 1.25,
    "weaponSpeed" : 5
},
{
	"_id" : 78,
	"name" : "palladium battleaxe",
    "description" : "A dangerous battleaxe",
    "isNamePlural" : false,
	"cost" : 2000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "accuracy",
            "amount" : 31
        },
        {
            "skill" : "strength",
            "amount" : 39
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "accuracy",
			"amount" : 30
		}
	],
	"equipmentType" : "weapon",
    "equipmentSpriteId" : 17,
    "equipmentSpriteSheet" : "weapon1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 225
    },
    "recipe" : [
        {
            "desc" : "palladium bar",
            "itemId" : 144,
            "amount" : 3
        }
    ],
    "metalType" : "palladium",
    "weight": 3.5,
    "weaponSpeed" : 6
},
{
	"_id" : 79,
	"name" : "iron ore",
    "description" : "Raw iron ore",
    "isNamePlural" : true,
	"cost" : 10,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "mining",
		"amount" : 30
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 2.5
},
{
	"_id" : 80,
	"name" : "amethyst gem",
    "description" : "A sparkling amethyst gemstone",
    "isNamePlural" : false,
	"cost" : 200,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "crafting",
		"amount" : 40
	},
    "recipe" : [
        {
            "desc" : "rough amethyst",
            "itemId" : 298,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 0.01
},
{
	"_id" : 81,
	"name" : "sapphire gem",
    "description" : "A blue sapphire gemstone",
    "isNamePlural" : false,
	"cost" : 400,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "crafting",
		"amount" : 50
	},
    "recipe" : [
        {
            "desc" : "rough sapphire",
            "itemId" : 299,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 0.01
},
{
	"_id" : 82,
	"name" : "emerald gem",
    "description" : "A bright green emerald gemstone",
    "isNamePlural" : false,
	"cost" : 600,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "crafting",
		"amount" : 75
	},
    "recipe" : [
        {
            "desc" : "rough emerald",
            "itemId" : 300,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 0.01
},
{
	"_id" : 83,
	"name" : "topaz gem",
    "description" : "An electric-yellow topaz gemstone",
    "isNamePlural" : false,
	"cost" : 800,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "crafting",
		"amount" : 125
	},
    "recipe" : [
        {
            "desc" : "rough topaz",
            "itemId" : 301,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 0.01
},
{
	"_id" : 84,
	"name" : "citrine gem",
    "description" : "A strong citrine gemstone",
    "isNamePlural" : false,
	"cost" : 1000,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "crafting",
		"amount" : 175
	},
    "recipe" : [
        {
            "desc" : "rough citrine",
            "itemId" : 302,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 0.01
},
{
	"_id" : 85,
	"name" : "ruby gem",
    "description" : "A beautiful red ruby gemstone",
    "isNamePlural" : false,
	"cost" : 1200,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "crafting",
		"amount" : 250
	},
    "recipe" : [
        {
            "desc" : "rough ruby",
            "itemId" : 303,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 0.01
},
{
	"_id" : 86,
	"name" : "diamond gem",
    "description" : "A super-hard diamond gemstone",
    "isNamePlural" : false,
	"cost" : 1400,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : true,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "crafting",
		"amount" : 350
	},
    "recipe" : [
        {
            "desc" : "rough diamond",
            "itemId" : 304,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 0.01
},
{
	"_id" : 87,
	"name" : "carbonado gem",
    "description" : "An ultra-hard gemstone, also known as black diamond",
    "isNamePlural" : false,
	"cost" : 1600,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : true,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "crafting",
		"amount" : 500
	},
    "recipe" : [
        {
            "desc" : "rough carbonado",
            "itemId" : 305,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 0.01
},
{
	"_id" : 88,
	"name" : "uranium ore",
    "description" : "I need to be careful handling this stuff",
    "isNamePlural" : true,
	"cost" : 1000,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "mining",
		"amount" : 200
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 2.5
},
{
	"_id" : 89,
	"name" : "silver nugget",
    "description" : "A small silver nugget",
    "isNamePlural" : false,
	"cost" : 75,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "mining",
		"amount" : 75
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.5
},
{
	"_id" : 90,
	"name" : "gold nugget",
    "description" : "A small gold nugget",
    "isNamePlural" : false,
	"cost" : 350,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "mining",
		"amount" : 150
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.5
},
{
	"_id" : 91,
	"name" : "cyclops eye",
    "description" : "Its staring right at me...",
    "isNamePlural" : false,
	"cost" : 350,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "accuracy",
            "amount" : 3
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 6,
    "equipmentSpriteSheet" : "helmet1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.05
},
{
	"_id" : 92,
	"name" : "bronze gloves",
    "description" : "These will protect my fingers",
    "isNamePlural" : true,
	"cost" : 30,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 1
        },
        {
            "skill" : "magic",
            "amount" : -3
        },
        {
            "skill" : "range",
            "amount" : -3
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "harvesting",
			"amount" : 1
		}
	],
	"equipmentType" : "gloves",
    "equipmentSpriteId" : 0,
    "equipmentSpriteSheet" : "gloves1",
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 25
    },
    "recipe" : [
        {
            "desc" : "bronze bar",
            "itemId" : 70,
            "amount" : 1
        }
    ],
    "metalType" : "bronze",
    "weight": 1.5
},
{
	"_id" : 93,
	"name" : "steel gloves",
    "description" : "These will protect my fingers",
    "isNamePlural" : true,
	"cost" : 250,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 3
        },
        {
            "skill" : "accuracy",
            "amount" : 2
        },
        {
            "skill" : "magic",
            "amount" : -3
        },
        {
            "skill" : "range",
            "amount" : -3
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "harvesting",
			"amount" : 20
		}
	],
	"equipmentType" : "gloves",
    "equipmentSpriteId" : 1,
    "equipmentSpriteSheet" : "gloves1",
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 50
    },
    "recipe" : [
        {
            "desc" : "steel bar",
            "itemId" : 143,
            "amount" : 1
        }
    ],
    "metalType" : "steel",
    "weight": 1.5
},
{
	"_id" : 94,
	"name" : "palladium gloves",
    "description" : "These will protect my fingers",
    "isNamePlural" : true,
	"cost" : 600,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 4
        },
        {
            "skill" : "accuracy",
            "amount" : 3
        },
        {
            "skill" : "magic",
            "amount" : -3
        },
        {
            "skill" : "range",
            "amount" : -3
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "harvesting",
			"amount" : 30
		}
	],
	"equipmentType" : "gloves",
    "equipmentSpriteId" : 2,
    "equipmentSpriteSheet" : "gloves1",
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 75
    },
    "recipe" : [
        {
            "desc" : "palladium bar",
            "itemId" : 144,
            "amount" : 1
        }
    ],
    "metalType" : "palladium",
    "weight": 1.5
},
{
	"_id" : 95,
	"name" : "coronium gloves",
    "description" : "These will protect my fingers",
    "isNamePlural" : true,
	"cost" : 5000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 5
        },
        {
            "skill" : "accuracy",
            "amount" : 4
        },
        {
            "skill" : "magic",
            "amount" : -3
        },
        {
            "skill" : "range",
            "amount" : -3
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "harvesting",
			"amount" : 40
		}
	],
	"equipmentType" : "gloves",
    "equipmentSpriteId" : 3,
    "equipmentSpriteSheet" : "gloves1",
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 150
    },
    "recipe" : [
        {
            "desc" : "coronium bar",
            "itemId" : 145,
            "amount" : 1
        }
    ],
    "metalType" : "coronium",
    "weight": 1.5
},
{
	"_id" : 96,
	"name" : "coronium battleaxe",
    "description" : "A dangerous battleaxe",
    "isNamePlural" : false,
	"cost" : 17500,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "accuracy",
            "amount" : 44
        },
        {
            "skill" : "strength",
            "amount" : 55
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "accuracy",
			"amount" : 40
		}
	],
	"equipmentType" : "weapon",
    "equipmentSpriteId" : 18,
    "equipmentSpriteSheet" : "weapon1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 450
    },
    "recipe" : [
        {
            "desc" : "coronium bar",
            "itemId" : 145,
            "amount" : 3
        }
    ],
    "metalType" : "coronium",
    "weight": 3.5,
    "weaponSpeed" : 6
},
{
	"_id" : 97,
	"name" : "bronze great sword",
    "description" : "I wouldn't want to get whacked over the head by this thing",
    "isNamePlural" : false,
	"cost" : 150,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "accuracy",
            "amount" : 8
        },
        {
            "skill" : "strength",
            "amount" : 14
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "accuracy",
			"amount" : 1
		}
	],
	"equipmentType" : "weapon",
    "equipmentSpriteId" : 4,
    "equipmentSpriteSheet" : "weapon1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 100
    },
    "recipe" : [
        {
            "desc" : "bronze bar",
            "itemId" : 70,
            "amount" : 4
        }
    ],
    "metalType" : "bronze",
    "weight": 5,
    "weaponSpeed" : 6,
    "removeEquipmentOnEquip" : [
        "shield"
    ]
},
{
	"_id" : 98,
	"name" : "potato",
    "description" : "Starchy",
    "isNamePlural" : false,
	"cost" : 2,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"eat"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "hitpoints",
			    "amount" : 1
            }
		}
	],
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "harvesting",
		"amount" : 10
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.25
},
{
	"_id" : 99,
	"name" : "wheat",
    "description" : "I can grind this up into flour",
    "isNamePlural" : true,
	"cost" : 3,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "harvesting",
		"amount" : 15
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.05
},
{
	"_id" : 100,
	"name" : "corn",
    "description" : "A freshly-picked ear of corn",
    "isNamePlural" : true,
	"cost" : 5,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"eat"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "hitpoints",
			    "amount" : 1
            }
		}
	],
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "harvesting",
		"amount" : 25
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.2
},
{
	"_id" : 101,
	"name" : "tomato",
    "description" : "A ripe tomato",
    "isNamePlural" : false,
	"cost" : 10,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"eat"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "hitpoints",
			    "amount" : 1
            }
		}
	],
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "harvesting",
		"amount" : 40
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.2
},
{
	"_id" : 102,
	"name" : "onion",
    "description" : "It has a strong aroma",
    "isNamePlural" : false,
	"cost" : 15,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "harvesting",
		"amount" : 60
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.5
},
{
	"_id" : 103,
	"name" : "strawberry",
    "description" : "A bright red strawberry",
    "isNamePlural" : false,
	"cost" : 20,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"eat"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "hitpoints",
			    "amount" : 1
            }
		}
	],
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "harvesting",
		"amount" : 80
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.1
},
{
	"_id" : 104,
	"name" : "watermelon",
    "description" : "A big juicy melon",
    "isNamePlural" : false,
	"cost" : 35,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "harvesting",
		"amount" : 110
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 1
},
{
	"_id" : 105,
	"name" : "pumpkin",
    "description" : "A big heavy melon",
    "isNamePlural" : false,
	"cost" : 50,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "harvesting",
		"amount" : 150
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 1.5
},
{
	"_id" : 106,
	"name" : "grapes",
    "description" : "A cluster of grapes",
    "isNamePlural" : true,
	"cost" : 60,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"eat"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "hitpoints",
			    "amount" : 1
            }
		}
	],
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "harvesting",
		"amount" : 180
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.25
},
{
	"_id" : 107,
	"name" : "rose",
    "description" : "A romantic red rose",
    "isNamePlural" : false,
	"cost" : 100,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "harvesting",
		"amount" : 200
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.1
},
{
	"_id" : 108,
	"name" : "pinecone",
    "description" : "It fell from a pine tree",
    "isNamePlural" : false,
	"cost" : 2,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "harvesting",
		"amount" : 50
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.1
},
{
	"_id" : 109,
	"name" : "golden pinecone",
    "description" : "Wow! A golden pinecone!",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : false,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "harvesting",
		"amount" : 500
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.2
},
{
	"_id" : 110,
	"name" : "acorn",
    "description" : "Squirrels love these nuts",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "harvesting",
		"amount" : 75
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.01
},
{
	"_id" : 111,
	"name" : "golden acorn",
    "description" : "This acorn is made of pure gold!",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : false,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "harvesting",
		"amount" : 750
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.02
},
{
	"_id" : 112,
	"name" : "leaf",
    "description" : "A green leaf that fell from a tree",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "harvesting",
		"amount" : 20
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.01
},
{
	"_id" : 113,
	"name" : "golden leaf",
    "description" : "A golden leaf!",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : false,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "harvesting",
		"amount" : 200
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.02
},
{
	"_id" : 114,
	"name" : "coconut",
    "description" : "Nature's bowling ball",
    "isNamePlural" : false,
	"cost" : 10,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "harvesting",
		"amount" : 120
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.75
},
{
	"_id" : 115,
	"name" : "golden coconut",
    "description" : "Nature's golden bowling ball!",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : false,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "harvesting",
		"amount" : 1200
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 1
},
{
	"_id" : 116,
	"name" : "cherry blossom",
    "description" : "A beautiful pink flower",
    "isNamePlural" : false,
	"cost" : 15,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "harvesting",
		"amount" : 150
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.05
},
{
	"_id" : 117,
	"name" : "golden blossom",
    "description" : "Wow its so golden and beautiful!",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : false,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "harvesting",
		"amount" : 1500
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.1
},
{
	"_id" : 118,
	"name" : "iron chestplate",
    "description" : "Protective chest armour made of iron",
    "isNamePlural" : false,
	"cost" : 640,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 25
        },
        {
            "skill" : "magic",
            "amount" : -15
        },
        {
            "skill" : "range",
            "amount" : -15
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 10
		}
	],
	"equipmentType" : "chest",
    "equipmentSpriteId" : 6,
    "equipmentSpriteSheet" : "chest1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 175
    },
    "recipe" : [
        {
            "desc" : "iron bar",
            "itemId" : 148,
            "amount" : 5
        }
    ],
    "metalType" : "iron",
    "weight": 10
},
{
	"_id" : 119,
	"name" : "iron platelegs",
    "description" : "Protective leg armour made of iron",
    "isNamePlural" : true,
	"cost" : 320,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 17
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 10
		}
	],
	"equipmentType" : "legs",
    "equipmentSpriteId" : 6,
    "equipmentSpriteSheet" : "legs1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 105
    },
    "recipe" : [
        {
            "desc" : "iron bar",
            "itemId" : 148,
            "amount" : 3
        }
    ],
    "metalType" : "iron",
    "weight": 6,
    "removeEquipmentOnEquip" : [
        "boots"
    ]
},
{
	"_id" : 120,
	"name" : "iron helm",
    "description" : "An open-faced helmet made of iron",
    "isNamePlural" : false,
	"cost" : 100,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 8
        },
        {
            "skill" : "accuracy",
            "amount" : 1
        },
        {
            "skill" : "magic",
            "amount" : -3
        },
        {
            "skill" : "range",
            "amount" : -3
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 10
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 1,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 35
    },
    "recipe" : [
        {
            "desc" : "iron bar",
            "itemId" : 148,
            "amount" : 1
        }
    ],
    "metalType" : "iron",
    "weight": 2
},
{
	"_id" : 121,
	"name" : "iron gloves",
    "description" : "These will protect my fingers",
    "isNamePlural" : true,
	"cost" : 100,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 2
        },
        {
            "skill" : "accuracy",
            "amount" : 1
        },
        {
            "skill" : "magic",
            "amount" : -3
        },
        {
            "skill" : "range",
            "amount" : -3
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "harvesting",
			"amount" : 10
		}
	],
	"equipmentType" : "gloves",
    "equipmentSpriteId" : 6,
    "equipmentSpriteSheet" : "gloves1",
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 35
    },
    "recipe" : [
        {
            "desc" : "iron bar",
            "itemId" : 148,
            "amount" : 1
        }
    ],
    "metalType" : "iron",
    "weight": 1.5
},
{
	"_id" : 122,
	"name" : "bronze full helm",
    "description" : "A full-faced helmet made of bronze",
    "isNamePlural" : false,
	"cost" : 60,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 6
        },
        {
            "skill" : "magic",
            "amount" : -6
        },
        {
            "skill" : "range",
            "amount" : -6
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 1
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 7,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 50
    },
    "recipe" : [
        {
            "desc" : "bronze bar",
            "itemId" : 70,
            "amount" : 2
        }
    ],
    "metalType" : "bronze",
    "weight": 4
},
{
	"_id" : 123,
	"name" : "steel full helm",
    "description" : "A full-faced helmet made from steel",
    "isNamePlural" : false,
	"cost" : 250,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 17
        },
        {
            "skill" : "magic",
            "amount" : -6
        },
        {
            "skill" : "range",
            "amount" : -6
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 20
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 9,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 100
    },
    "recipe" : [
        {
            "desc" : "steel bar",
            "itemId" : 143,
            "amount" : 2
        }
    ],
    "metalType" : "steel",
    "weight": 4
},
{
	"_id" : 124,
	"name" : "palladium full helm",
    "description" : "A full-faced helmet made from palladium",
    "isNamePlural" : false,
	"cost" : 1200,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 24
        },
        {
            "skill" : "magic",
            "amount" : -6
        },
        {
            "skill" : "range",
            "amount" : -6
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 30
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 10,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 150
    },
    "recipe" : [
        {
            "desc" : "palladium bar",
            "itemId" : 144,
            "amount" : 2
        }
    ],
    "metalType" : "palladium",
    "weight": 4
},
{
	"_id" : 125,
	"name" : "coronium full helm",
    "description" : "A full-faced helmet made from coronium",
    "isNamePlural" : false,
	"cost" : 10000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 32
        },
        {
            "skill" : "magic",
            "amount" : -6
        },
        {
            "skill" : "range",
            "amount" : -6
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 40
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 11,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 300
    },
    "recipe" : [
        {
            "desc" : "coronium bar",
            "itemId" : 145,
            "amount" : 2
        }
    ],
    "metalType" : "coronium",
    "weight": 4
},
{
	"_id" : 126,
	"name" : "iron great sword",
    "description" : "I wouldn't want to get whacked over the head by this thing",
    "isNamePlural" : false,
	"cost" : 480,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "accuracy",
            "amount" : 12
        },
        {
            "skill" : "strength",
            "amount" : 21
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "accuracy",
			"amount" : 10
		}
	],
	"equipmentType" : "weapon",
    "equipmentSpriteId" : 5,
    "equipmentSpriteSheet" : "weapon1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 140
    },
    "recipe" : [
        {
            "desc" : "iron bar",
            "itemId" : 148,
            "amount" : 4
        }
    ],
    "metalType" : "iron",
    "weight": 5,
    "weaponSpeed" : 6,
    "removeEquipmentOnEquip" : [
        "shield"
    ]
},
{
	"_id" : 127,
	"name" : "steel great sword",
    "description" : "I wouldn't want to get whacked over the head by this thing",
    "isNamePlural" : false,
	"cost" : 1200,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "accuracy",
            "amount" : 20
        },
        {
            "skill" : "strength",
            "amount" : 32
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "accuracy",
			"amount" : 20
		}
	],
	"equipmentType" : "weapon",
    "equipmentSpriteId" : 6,
    "equipmentSpriteSheet" : "weapon1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 200
    },
    "recipe" : [
        {
            "desc" : "steel bar",
            "itemId" : 143,
            "amount" : 4
        }
    ],
    "metalType" : "steel",
    "weight": 5,
    "weaponSpeed" : 6,
    "removeEquipmentOnEquip" : [
        "shield"
    ]
},
{
	"_id" : 128,
	"name" : "iron full helm",
    "description" : "A full-faced helmet made of iron",
    "isNamePlural" : false,
	"cost" : 200,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 11
        },
        {
            "skill" : "magic",
            "amount" : -6
        },
        {
            "skill" : "range",
            "amount" : -6
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 10
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 8,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 70
    },
    "recipe" : [
        {
            "desc" : "iron bar",
            "itemId" : 148,
            "amount" : 2
        }
    ],
    "metalType" : "iron",
    "weight": 4
},
{
	"_id" : 129,
	"name" : "red cape",
    "description" : "A bright red cape",
    "isNamePlural" : false,
	"cost" : 20,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 2
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 1
		}
	],
	"equipmentType" : "back",
    "equipmentSpriteId" : 0,
    "equipmentSpriteSheet" : "back1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.5
},
{
	"_id" : 130,
	"name" : "blue cape",
    "description" : "A bright blue cape",
    "isNamePlural" : false,
	"cost" : 20,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 2
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 1
		}
	],
	"equipmentType" : "back",
    "equipmentSpriteId" : 1,
    "equipmentSpriteSheet" : "back1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.5
},
{
	"_id" : 131,
	"name" : "green cape",
    "description" : "A bright green cape",
    "isNamePlural" : false,
	"cost" : 20,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 2
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 1
		}
	],
	"equipmentType" : "back",
    "equipmentSpriteId" : 2,
    "equipmentSpriteSheet" : "back1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.5
},
{
	"_id" : 132,
	"name" : "black cape",
    "description" : "A dark, black cape",
    "isNamePlural" : false,
	"cost" : 20,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 2
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 1
		}
	],
	"equipmentType" : "back",
    "equipmentSpriteId" : 3,
    "equipmentSpriteSheet" : "back1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.5
},
{
	"_id" : 133,
	"name" : "orange cape",
    "description" : "A bright orange cape",
    "isNamePlural" : false,
	"cost" : 20,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 2
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 1
		}
	],
	"equipmentType" : "back",
    "equipmentSpriteId" : 4,
    "equipmentSpriteSheet" : "back1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.5
},
{
	"_id" : 134,
	"name" : "yellow cape",
    "description" : "A bright yellow cape",
    "isNamePlural" : false,
	"cost" : 20,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 2
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 1
		}
	],
	"equipmentType" : "back",
    "equipmentSpriteId" : 5,
    "equipmentSpriteSheet" : "back1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.5
},
{
	"_id" : 135,
	"name" : "purple cape",
    "description" : "A royal purple cape",
    "isNamePlural" : false,
	"cost" : 20,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 2
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 1
		}
	],
	"equipmentType" : "back",
    "equipmentSpriteId" : 6,
    "equipmentSpriteSheet" : "back1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.5
},
{
	"_id" : 136,
	"name" : "bandit mask",
    "description" : "A mask worn by outlaws",
    "isNamePlural" : false,
	"cost" : 15,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "crime",
            "amount" : 1
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 15,
    "equipmentSpriteSheet" : "helmet1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.1
},
{
	"_id" : 137,
	"name" : "black leather gloves",
    "description" : "These will protect my fingers",
    "isNamePlural" : true,
	"cost" : 30,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 1
        },
        {
            "skill" : "strength",
            "amount" : 2
        },
        {
            "skill" : "crime",
            "amount" : 1
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "harvesting",
			"amount" : 1
        },
        {
			"skill" : "strength",
			"amount" : 10
		}
	],
	"equipmentType" : "gloves",
    "equipmentSpriteId" : 7,
    "equipmentSpriteSheet" : "gloves1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.25
},
{
	"_id" : 138,
	"name" : "coronium full helm (gold plating)",
    "description" : "A coronium full-faced helmet plated in gold",
    "isNamePlural" : false,
	"cost" : 10000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 32
        },
        {
            "skill" : "magic",
            "amount" : -6
        },
        {
            "skill" : "range",
            "amount" : -6
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 40
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 13,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "coronium",
    "weight": 4
},
{
	"_id" : 139,
	"name" : "coronium chestplate (gold plating)",
    "description" : "Coronium chest armour plated in gold",
    "isNamePlural" : false,
	"cost" : 35000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 70
        },
        {
            "skill" : "magic",
            "amount" : -15
        },
        {
            "skill" : "range",
            "amount" : -15
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 40
		}
	],
	"equipmentType" : "chest",
    "equipmentSpriteId" : 7,
    "equipmentSpriteSheet" : "chest1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "coronium",
    "weight": 10
},
{
	"_id" : 140,
	"name" : "coronium platelegs (gold plating)",
    "description" : "Coronium leg armour plated in gold",
    "isNamePlural" : true,
	"cost" : 35000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 50
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 40
		}
	],
	"equipmentType" : "legs",
    "equipmentSpriteId" : 7,
    "equipmentSpriteSheet" : "legs1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "coronium",
    "weight": 6,
    "removeEquipmentOnEquip" : [
        "boots"
    ]
},
{
	"_id" : 141,
	"name" : "coronium helm (gold plating)",
    "description" : "A coronium open-faced helmet plated in gold",
    "isNamePlural" : false,
	"cost" : 5000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 26
        },
        {
            "skill" : "accuracy",
            "amount" : 1
        },
        {
            "skill" : "magic",
            "amount" : -3
        },
        {
            "skill" : "range",
            "amount" : -3
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 40
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 17,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "coronium",
    "weight": 2
},
{
	"_id" : 142,
	"name" : "coal",
    "description" : "A lump of coal",
    "isNamePlural" : true,
	"cost" : 25,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : {
        "skill" : "mining",
        "amount" : 60
    },
    "recipe" : null,
    "metalType" : null,
    "weight": 2.5
},
{
	"_id" : 143,
	"name" : "steel bar",
    "description" : "A solid bar of steel",
    "isNamePlural" : false,
	"cost" : 125,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 50
    },
    "recipe" : [
        {
            "desc" : "iron ore",
            "itemId" : 79,
            "amount" : 1
        },
        {
            "desc" : "coal",
            "itemId" : 142,
            "amount" : 1
        }
    ],
    "metalType" : "steel",
    "weight": 2
},
{
	"_id" : 144,
	"name" : "palladium bar",
    "description" : "A solid bar of palladium",
    "isNamePlural" : false,
	"cost" : 300,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 75
    },
    "recipe" : [
        {
            "desc" : "palladium ore",
            "itemId" : 48,
            "amount" : 1
        },
        {
            "desc" : "coal",
            "itemId" : 142,
            "amount" : 2
        }
    ],
    "metalType" : "palladium",
    "weight": 2
},
{
	"_id" : 145,
	"name" : "coronium bar",
    "description" : "A solid bar of coronium",
    "isNamePlural" : false,
	"cost" : 2500,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 150
    },
    "recipe" : [
        {
            "desc" : "coronium ore",
            "itemId" : 51,
            "amount" : 1
        },
        {
            "desc" : "coal",
            "itemId" : 142,
            "amount" : 4
        }
    ],
    "metalType" : "coronium",
    "weight": 2
},
{
	"_id" : 146,
	"name" : "palladium great sword",
    "description" : "I wouldn't want to get whacked over the head by this thing",
    "isNamePlural" : false,
	"cost" : 3000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "accuracy",
            "amount" : 32
        },
        {
            "skill" : "strength",
            "amount" : 47
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "accuracy",
			"amount" : 30
		}
	],
	"equipmentType" : "weapon",
    "equipmentSpriteId" : 7,
    "equipmentSpriteSheet" : "weapon1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 300
    },
    "recipe" : [
        {
            "desc" : "palladium bar",
            "itemId" : 144,
            "amount" : 4
        }
    ],
    "metalType" : "palladium",
    "weight": 5,
    "weaponSpeed" : 6,
    "removeEquipmentOnEquip" : [
        "shield"
    ]
},
{
	"_id" : 147,
	"name" : "coronium great sword",
    "description" : "I wouldn't want to get whacked over the head by this thing",
    "isNamePlural" : false,
	"cost" : 26250,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "accuracy",
            "amount" : 48
        },
        {
            "skill" : "strength",
            "amount" : 66
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "accuracy",
			"amount" : 40
		}
	],
	"equipmentType" : "weapon",
    "equipmentSpriteId" : 8,
    "equipmentSpriteSheet" : "weapon1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 600
    },
    "recipe" : [
        {
            "desc" : "coronium bar",
            "itemId" : 145,
            "amount" : 4
        }
    ],
    "metalType" : "coronium",
    "weight": 5,
    "weaponSpeed" : 6,
    "removeEquipmentOnEquip" : [
        "shield"
    ]
},
{
	"_id" : 148,
	"name" : "iron bar",
    "description" : "A metal bar smelted from iron ore",
    "isNamePlural" : false,
	"cost" : 50,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 35
    },
    "recipe" : [
        {
            "desc" : "iron ore",
            "itemId" : 79,
            "amount" : 1
        }
    ],
    "metalType" : "iron",
    "weight": 2
},
{
	"_id" : 149,
	"name" : "scroll",
    "description" : "A scroll carved from a log",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 15
    },
    "recipe" : [
        {
            "desc" : "logs",
            "itemId" : 64,
            "amount" : 1
        }
    ],
    "weight": 0.1
},
{
	"_id" : 150,
	"name" : "pine scroll",
    "description" : "A scroll carved from a pine log",
    "isNamePlural" : false,
	"cost" : 3,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 25
    },
    "recipe" : [
        {
            "desc" : "pine logs",
            "itemId" : 65,
            "amount" : 1
        }
    ],
    "weight": 0.1
},
{
	"_id" : 151,
	"name" : "oak scroll",
    "description" : "A scroll carved from an oak log",
    "isNamePlural" : false,
	"cost" : 10,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 40
    },
    "recipe" : [
        {
            "desc" : "oak logs",
            "itemId" : 66,
            "amount" : 1
        }
    ],
    "weight": 0.1
},
{
	"_id" : 152,
	"name" : "palm scroll",
    "description" : "A scroll carved from a palm log",
    "isNamePlural" : false,
	"cost" : 15,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 65
    },
    "recipe" : [
        {
            "desc" : "palm logs",
            "itemId" : 67,
            "amount" : 1
        }
    ],
    "weight": 0.1
},
{
	"_id" : 153,
	"name" : "sakura scroll",
    "description" : "A scroll carved from a cherry log",
    "isNamePlural" : false,
	"cost" : 30,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 90
    },
    "recipe" : [
        {
            "desc" : "cherry logs",
            "itemId" : 68,
            "amount" : 1
        }
    ],
    "weight": 0.1
},
{
	"_id" : 154,
	"name" : "chisel",
    "description" : "Used for carving",
    "isNamePlural" : false,
	"cost" : 5,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : null,
    "useItemOnItemActions" : [
		{
            "targetItemId" : 64,
            "skillToCreate" : "crafting",
            "canCreateMultiple" : true,
			"resultItems" : [
                {
                    "id" : 149,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 64,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        },
        {
			"targetItemId" : 65,
            "skillToCreate" : "crafting",
            "canCreateMultiple" : true,
			"resultItems" : [
                {
                    "id" : 150,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 65,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
		},
        {
			"targetItemId" : 66,
            "skillToCreate" : "crafting",
            "canCreateMultiple" : true,
			"resultItems" : [
                {
                    "id" : 151,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 66,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
		},
        {
			"targetItemId" : 67,
            "skillToCreate" : "crafting",
            "canCreateMultiple" : true,
			"resultItems" : [
                {
                    "id" : 152,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 67,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
		},
        {
			"targetItemId" : 68,
            "skillToCreate" : "crafting",
            "canCreateMultiple" : true,
			"resultItems" : [
                {
                    "id" : 153,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 68,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
		},
        {
			"targetItemId" : 182,
            "skillToCreate" : "crafting",
            "canCreateMultiple" : true,
			"resultItems" : [
                {
                    "id" : 183,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 182,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
		},
        {
			"targetItemId" : 298,
            "skillToCreate" : "crafting",
            "canCreateMultiple" : true,
			"resultItems" : [
                {
                    "id" : 80,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 298,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
		},
        {
			"targetItemId" : 299,
            "skillToCreate" : "crafting",
            "canCreateMultiple" : true,
			"resultItems" : [
                {
                    "id" : 81,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 299,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
		},
        {
			"targetItemId" : 300,
            "skillToCreate" : "crafting",
            "canCreateMultiple" : true,
			"resultItems" : [
                {
                    "id" : 82,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 300,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
		},
        {
			"targetItemId" : 301,
            "skillToCreate" : "crafting",
            "canCreateMultiple" : true,
			"resultItems" : [
                {
                    "id" : 83,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 301,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
		},
        {
			"targetItemId" : 302,
            "skillToCreate" : "crafting",
            "canCreateMultiple" : true,
			"resultItems" : [
                {
                    "id" : 84,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 302,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
		},
        {
			"targetItemId" : 303,
            "skillToCreate" : "crafting",
            "canCreateMultiple" : true,
			"resultItems" : [
                {
                    "id" : 85,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 303,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
		},
        {
			"targetItemId" : 304,
            "skillToCreate" : "crafting",
            "canCreateMultiple" : true,
			"resultItems" : [
                {
                    "id" : 86,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 304,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
		},
        {
			"targetItemId" : 305,
            "skillToCreate" : "crafting",
            "canCreateMultiple" : true,
			"resultItems" : [
                {
                    "id" : 87,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 305,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
		},
        {
			"targetItemId" : 353,
            "skillToCreate" : "crafting",
            "canCreateMultiple" : true,
			"resultItems" : [
                {
                    "id" : 354,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 353,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
		},
        {
			"targetItemId" : 356,
            "skillToCreate" : "crafting",
            "canCreateMultiple" : true,
			"resultItems" : [
                {
                    "id" : 357,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 356,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
		}
	],
    "weight": 0.5
},
{
	"_id" : 155,
	"name" : "hammer",
    "description" : "Used for beating malleable objects",
    "isNamePlural" : false,
	"cost" : 5,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : null,
    "weight": 0.75
},
{
	"_id" : 156,
	"name" : "empty glass",
    "description" : "An empty glass cup",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : null,
    "useItemOnItemActions" : null,
    "weight": 0.1
},
{
	"_id" : 157,
	"name" : "glass of water",
    "description" : "A glass cup filled with water",
    "isNamePlural" : false,
	"cost" : 2,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : null,
    "useItemOnItemActions" : [
        {
            "targetItemId" : 99,
            "skillToCreate" : null,
            "canCreateMultiple" : true,
			"resultItems" : [
                {
                    "id" : 158,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 157,
                    "amount" : 1,
                    "isIOU" : false
                },
                {
                    "id" : 99,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        }
    ],
    "weight": 0.2
},
{
	"_id" : 158,
	"name" : "unheated mash",
    "description" : "I should try adding heat to this",
    "isNamePlural" : true,
	"cost" : 3,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : null,
    "useItemOnItemActions" : null,
    "weight": 0.2
},
{
	"_id" : 159,
	"name" : "beer",
    "description" : "Freshly brewed beer",
    "isNamePlural" : true,
	"cost" : 5,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"drink"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "accuracy",
			    "amount" : -0.05
            }
		},
        {
            "type" : "Default",
            "effect": {
                "skill" : "strength",
			    "amount" : 0.05
            }
		}
	],
    "edibleResult" : {
        "id" : 160,
        "amount" : 1,
        "isIOU" : false
    },
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : null,
    "useItemOnItemActions" : null,
    "weight": 0.2
},
{
	"_id" : 160,
	"name" : "half glass of beer",
    "description" : "A glass cup half-filled with beer",
    "isNamePlural" : false,
	"cost" : 2,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"drink"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "accuracy",
			    "amount" : -0.05
            }
		},
        {
            "type" : "Default",
            "effect": {
                "skill" : "strength",
			    "amount" : 0.05
            }
		}
	],
    "edibleResult" : {
        "id" : 156,
        "amount" : 1,
        "isIOU" : false
    },
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : null,
    "useItemOnItemActions" : [
		{
            "targetItemId" : 160,
            "skillToCreate" : null,
            "canCreateMultiple" : false,
			"resultItems" : [
                {
                    "id" : 159,
                    "amount" : 1,
                    "isIOU" : false
                },
                {
                    "id" : 156,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 160,
                    "amount" : 2,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        }
    ],
    "weight": 0.15
},
{
	"_id" : 161,
	"name" : "mt. tan dew",
    "description" : "A glass cup filled with dew gathered from the peak of Mt. Tan",
    "isNamePlural" : true,
	"cost" : 10,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : null,
    "useItemOnItemActions" : [
        {
            "targetItemId" : 99,
            "skillToCreate" : null,
            "canCreateMultiple" : true,
			"resultItems" : [
                {
                    "id" : 162,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 161,
                    "amount" : 1,
                    "isIOU" : false
                },
                {
                    "id" : 99,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        }
    ],
    "weight": 0.2
},
{
	"_id" : 162,
	"name" : "unheated dew mash",
    "description" : "I should try adding heat to this",
    "isNamePlural" : true,
	"cost" : 10,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : null,
    "useItemOnItemActions" : null,
    "weight": 0.2
},
{
	"_id" : 163,
	"name" : "dew beer",
    "description" : "Freshly brewed beer with the flavoring of Mt. Tan",
    "isNamePlural" : true,
	"cost" : 20,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"drink"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "accuracy",
			    "amount" : -0.05
            }
		},
        {
            "type" : "Default",
            "effect": {
                "skill" : "strength",
			    "amount" : 0.15
            }
		}
	],
    "edibleResult" : {
        "id" : 164,
        "amount" : 1,
        "isIOU" : false
    },
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : null,
    "useItemOnItemActions" : null,
    "weight": 0.2
},
{
	"_id" : 164,
	"name" : "half glass of dew beer",
    "description" : "A glass cup half-filled with dew beer",
    "isNamePlural" : false,
	"cost" : 10,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"drink"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "accuracy",
			    "amount" : -0.05
            }
		},
        {
            "type" : "Default",
            "effect": {
                "skill" : "strength",
			    "amount" : 0.15
            }
		}
	],
    "edibleResult" : {
        "id" : 156,
        "amount" : 1,
        "isIOU" : false
    },
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : null,
    "useItemOnItemActions" : [
		{
            "targetItemId" : 164,
            "skillToCreate" : null,
            "canCreateMultiple" : false,
			"resultItems" : [
                {
                    "id" : 163,
                    "amount" : 1,
                    "isIOU" : false
                },
                {
                    "id" : 156,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 164,
                    "amount" : 2,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        }
    ],
    "weight": 0.15
},
{
	"_id" : 165,
	"name" : "giant's milk",
    "description" : "I don't know if I want to drink this",
    "isNamePlural" : true,
	"cost" : 15,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"drink"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "hitpoints",
			    "amount" : 5
            }
		}
	],
    "edibleResult" : {
        "id" : 166,
        "amount" : 1,
        "isIOU" : false
    },
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : null,
    "useItemOnItemActions" : [
        {
            "targetItemId" : 168,
            "skillToCreate" : null,
            "canCreateMultiple" : true,
			"resultItems" : [
                {
                    "id" : 169,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 165,
                    "amount" : 1,
                    "isIOU" : false
                },
                {
                    "id" : 168,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        }
    ],
    "weight": 0.2
},
{
	"_id" : 166,
	"name" : "half glass of giant's milk",
    "description" : "A glass cup half-filled with giant's milk",
    "isNamePlural" : false,
	"cost" : 7,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"drink"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "hitpoints",
			    "amount" : 5
            }
		}
	],
    "edibleResult" : {
        "id" : 156,
        "amount" : 1,
        "isIOU" : false
    },
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : null,
    "useItemOnItemActions" : [
		{
            "targetItemId" : 166,
            "skillToCreate" : null,
            "canCreateMultiple" : false,
			"resultItems" : [
                {
                    "id" : 165,
                    "amount" : 1,
                    "isIOU" : false
                },
                {
                    "id" : 156,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 166,
                    "amount" : 2,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        }
    ],
    "weight": 0.15
},
{
	"_id" : 167,
	"name" : "pestle and mortar",
    "description" : "I can grind things into a fine powder with this",
    "isNamePlural" : false,
	"cost" : 5,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : null,
    "useItemOnItemActions" : [
		{
            "targetItemId" : 39,
            "skillToCreate" : null,
            "canCreateMultiple" : true,
			"resultItems" : [
                {
                    "id" : 168,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 39,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        },
        {
            "targetItemId" : 99,
            "skillToCreate" : null,
            "canCreateMultiple" : true,
			"resultItems" : [
                {
                    "id" : 189,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 99,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        },
        {
            "targetItemId" : 421,
            "skillToCreate" : null,
            "canCreateMultiple" : true,
			"resultItems" : [
                {
                    "id" : 422,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 421,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        }
	],
    "weight": 0.1
},
{
	"_id" : 168,
	"name" : "bone meal",
    "description" : "A good source of calcium",
    "isNamePlural" : true,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : [
        {
            "desc" : "bones",
            "itemId" : 39,
            "amount" : 1
        }
    ],
    "useItemOnItemActions" : null,
    "weight": 0.25
},
{
	"_id" : 169,
	"name" : "calcium brew",
    "description" : "A good way to boost my defense",
    "isNamePlural" : true,
	"cost" : 20,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"drink"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "hitpoints",
			    "amount" : 5
            }
		},
        {
            "type" : "Default",
            "effect": {
                "skill" : "defense",
			    "amount" : 0.05
            }
		}
    ],
    "edibleResult" : {
        "id" : 170,
        "amount" : 1,
        "isIOU" : false
    },
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : null,
    "useItemOnItemActions" : null,
    "weight": 0.2
},
{
	"_id" : 170,
	"name" : "half glass of calcium brew",
    "description" : "A glass cup half-filled with calcium brew",
    "isNamePlural" : false,
	"cost" : 10,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"drink"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "hitpoints",
			    "amount" : 5
            }
		},
        {
            "type" : "Default",
            "effect": {
                "skill" : "defense",
			    "amount" : 0.05
            }
		}
    ],
    "edibleResult" : {
        "id" : 156,
        "amount" : 1,
        "isIOU" : false
    },
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : null,
    "useItemOnItemActions" : [
		{
            "targetItemId" : 170,
            "skillToCreate" : null,
            "canCreateMultiple" : false,
			"resultItems" : [
                {
                    "id" : 169,
                    "amount" : 1,
                    "isIOU" : false
                },
                {
                    "id" : 156,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 170,
                    "amount" : 2,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        }
    ],
    "weight": 0.15
},
{
	"_id" : 171,
	"name" : "coronium full helm (silver plating)",
    "description" : "A coronium full-faced helmet plated in silver",
    "isNamePlural" : false,
	"cost" : 10000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 32
        },
        {
            "skill" : "magic",
            "amount" : -6
        },
        {
            "skill" : "range",
            "amount" : -6
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 40
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 14,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "coronium",
    "weight": 4
},
{
	"_id" : 172,
	"name" : "coronium chestplate (silver plating)",
    "description" : "Coronium chest armour plated in silver",
    "isNamePlural" : false,
	"cost" : 35000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 70
        },
        {
            "skill" : "magic",
            "amount" : -15
        },
        {
            "skill" : "range",
            "amount" : -15
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 40
		}
	],
	"equipmentType" : "chest",
    "equipmentSpriteId" : 8,
    "equipmentSpriteSheet" : "chest1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "coronium",
    "weight": 10
},
{
	"_id" : 173,
	"name" : "coronium platelegs (silver plating)",
    "description" : "Coronium leg armour plated in silver",
    "isNamePlural" : true,
	"cost" : 17500,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 50
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 40
		}
	],
	"equipmentType" : "legs",
    "equipmentSpriteId" : 8,
    "equipmentSpriteSheet" : "legs1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "coronium",
    "weight": 6,
    "removeEquipmentOnEquip" : [
        "boots"
    ]
},
{
	"_id" : 174,
	"name" : "coronium helm (silver plating)",
    "description" : "A coronium open-faced helmet made plated in silver",
    "isNamePlural" : false,
	"cost" : 5000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 26
        },
        {
            "skill" : "accuracy",
            "amount" : 1
        },
        {
            "skill" : "magic",
            "amount" : -3
        },
        {
            "skill" : "range",
            "amount" : -3
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 40
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 19,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "coronium",
    "weight": 2
},
{
	"_id" : 175,
	"name" : "fire scroll",
    "description" : "A magical scroll used for fire spells",
    "isNamePlural" : false,
	"cost" : 3,
	"isStackable" : true,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "enchanting",
		"amount" : 8
	},
    "recipe" : [
        {
            "desc" : "scroll",
            "itemId" : 149,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 0
},
{
	"_id" : 176,
	"name" : "water scroll",
    "description" : "A magical scroll used for water spells",
    "isNamePlural" : false,
	"cost" : 3,
	"isStackable" : true,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "enchanting",
		"amount" : 5
	},
    "recipe" : [
        {
            "desc" : "scroll",
            "itemId" : 149,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 0
},
{
	"_id" : 177,
	"name" : "nature scroll",
    "description" : "A magical scroll used for natural spells",
    "isNamePlural" : false,
	"cost" : 3,
	"isStackable" : true,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "enchanting",
		"amount" : 6
	},
    "recipe" : [
        {
            "desc" : "scroll",
            "itemId" : 149,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 0
},
{
	"_id" : 178,
	"name" : "fury scroll",
    "description" : "A magical scroll used for basic combat spells",
    "isNamePlural" : false,
	"cost" : 4,
	"isStackable" : true,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "enchanting",
		"amount" : 9
	},
    "recipe" : [
        {
            "desc" : "pine scroll",
            "itemId" : 150,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 0
},
{
	"_id" : 179,
	"name" : "rage scroll",
    "description" : "A magical scroll used for combat spells",
    "isNamePlural" : false,
	"cost" : 5,
	"isStackable" : true,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "enchanting",
		"amount" : 11
	},
    "recipe" : [
        {
            "desc" : "oak scroll",
            "itemId" : 151,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 0
},
{
	"_id" : 180,
	"name" : "energy scroll",
    "description" : "A magical scroll used for energy spells",
    "isNamePlural" : false,
	"cost" : 6,
	"isStackable" : true,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "enchanting",
		"amount" : 10
	},
    "recipe" : [
        {
            "desc" : "palm scroll",
            "itemId" : 152,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 0
},
{
	"_id" : 181,
	"name" : "warp scroll",
    "description" : "A magical scroll used for teleportation spells",
    "isNamePlural" : false,
	"cost" : 10,
	"isStackable" : true,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "enchanting",
		"amount" : 14
	},
    "recipe" : [
        {
            "desc" : "sakura scroll",
            "itemId" : 153,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 0
},
{
	"_id" : 182,
	"name" : "lucky logs",
    "description" : "These logs look pretty lucky!",
    "isNamePlural" : true,
	"cost" : 100,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "forestry",
		"amount" : 80
    },
    "recipe" : null,
    "metalType" : null,
    "weight": 2
},
{
	"_id" : 183,
	"name" : "lucky scroll",
    "description" : "A scroll carved from a lucky log",
    "isNamePlural" : false,
	"cost" : 50,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 80
    },
    "recipe" : [
        {
            "desc" : "lucky logs",
            "itemId" : 182,
            "amount" : 1
        }
    ],
    "weight": 0.1
},
{
	"_id" : 184,
	"name" : "alchemy scroll",
    "description" : "A magical scroll used for alchemy spells",
    "isNamePlural" : false,
	"cost" : 8,
	"isStackable" : true,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "enchanting",
		"amount" : 12
	},
    "recipe" : [
        {
            "desc" : "lucky scroll",
            "itemId" : 183,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 0
},
{
	"_id" : 185,
	"name" : "bronze shield",
    "description" : "A heavy shield made from bronze",
    "isNamePlural" : false,
	"cost" : 100,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 7
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 1
		}
	],
	"equipmentType" : "shield",
    "equipmentSpriteId" : 0,
    "equipmentSpriteSheet" : "shield1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 75
    },
    "recipe" : [
        {
            "desc" : "bronze bar",
            "itemId" : 70,
            "amount" : 3
        }
    ],
    "metalType" : "bronze",
    "weight": 6
},
{
	"_id" : 186,
	"name" : "steel shield",
    "description" : "A heavy shield made from steel",
    "isNamePlural" : false,
	"cost" : 800,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 24
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 20
		}
	],
	"equipmentType" : "shield",
    "equipmentSpriteId" : 1,
    "equipmentSpriteSheet" : "shield1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 150
    },
    "recipe" : [
        {
            "desc" : "steel bar",
            "itemId" : 143,
            "amount" : 3
        }
    ],
    "metalType" : "steel",
    "weight": 6
},
{
	"_id" : 187,
	"name" : "palladium shield",
    "description" : "A heavy shield made from palladium",
    "isNamePlural" : false,
	"cost" : 2000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 34
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 30
		}
	],
	"equipmentType" : "shield",
    "equipmentSpriteId" : 2,
    "equipmentSpriteSheet" : "shield1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 225
    },
    "recipe" : [
        {
            "desc" : "palladium bar",
            "itemId" : 144,
            "amount" : 3
        }
    ],
    "metalType" : "palladium",
    "weight": 6
},
{
	"_id" : 188,
	"name" : "coronium shield",
    "description" : "A heavy shield made from coronium",
    "isNamePlural" : false,
	"cost" : 17500,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 45
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 40
		}
	],
	"equipmentType" : "shield",
    "equipmentSpriteId" : 3,
    "equipmentSpriteSheet" : "shield1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 450
    },
    "recipe" : [
        {
            "desc" : "coronium bar",
            "itemId" : 145,
            "amount" : 3
        }
    ],
    "metalType" : "coronium",
    "weight": 6
},
{
	"_id" : 189,
	"name" : "flour",
    "description" : "Ground-up wheat",
    "isNamePlural" : true,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : [
        {
            "desc" : "wheat",
            "itemId" : 99,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 0.04
},
{
	"_id" : 190,
	"name" : "giant bones",
    "description" : "R.I.P.",
    "isNamePlural" : true,
	"cost" : 5,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 1
},
{
	"_id" : 191,
	"name" : "iron shield",
    "description" : "A heavy shield made from iron",
    "isNamePlural" : false,
	"cost" : 320,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 15
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 10
		}
	],
	"equipmentType" : "shield",
    "equipmentSpriteId" : 6,
    "equipmentSpriteSheet" : "shield1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 105
    },
    "recipe" : [
        {
            "desc" : "iron bar",
            "itemId" : 148,
            "amount" : 3
        }
    ],
    "metalType" : "iron",
    "weight": 6
},
{
	"_id" : 192,
	"name" : "coronium shield (gold plating)",
    "description" : "A coronium shield plated in gold",
    "isNamePlural" : false,
	"cost" : 17500,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 45
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 40
		}
	],
	"equipmentType" : "shield",
    "equipmentSpriteId" : 7,
    "equipmentSpriteSheet" : "shield1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "coronium",
    "weight": 6
},
{
	"_id" : 193,
	"name" : "coronium shield (silver plating)",
    "description" : "A coronium shield plated in silver",
    "isNamePlural" : false,
	"cost" : 17500,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 45
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 40
		}
	],
	"equipmentType" : "shield",
    "equipmentSpriteId" : 8,
    "equipmentSpriteSheet" : "shield1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "coronium",
    "weight": 6
},
{
	"_id" : 194,
	"name" : "amethyst necklace",
    "description" : "A silver necklace with an amethyst gem",
    "isNamePlural" : false,
	"cost" : 300,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "magic",
            "amount" : 3
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "neck",
    "equipmentSpriteId" : 0,
    "equipmentSpriteSheet" : "neck1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 25
    },
    "recipe" : [
        {
            "desc" : "silver bar",
            "itemId" : 71,
            "amount" : 1
        },
        {
            "desc" : "amethyst gem",
            "itemId" : 80,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 0.05
},
{
	"_id" : 195,
	"name" : "sapphire necklace",
    "description" : "A silver necklace with a sapphire gem",
    "isNamePlural" : false,
	"cost" : 600,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "accuracy",
            "amount" : 3
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "neck",
    "equipmentSpriteId" : 1,
    "equipmentSpriteSheet" : "neck1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 50
    },
    "recipe" : [
        {
            "desc" : "silver bar",
            "itemId" : 71,
            "amount" : 1
        },
        {
            "desc" : "sapphire gem",
            "itemId" : 81,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 0.05
},
{
	"_id" : 196,
	"name" : "emerald necklace",
    "description" : "A silver necklace with an emerald gem",
    "isNamePlural" : false,
	"cost" : 900,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "range",
            "amount" : 3
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "neck",
    "equipmentSpriteId" : 2,
    "equipmentSpriteSheet" : "neck1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 75
    },
    "recipe" : [
        {
            "desc" : "silver bar",
            "itemId" : 71,
            "amount" : 1
        },
        {
            "desc" : "emerald gem",
            "itemId" : 82,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 0.05
},
{
	"_id" : 197,
	"name" : "topaz necklace",
    "description" : "A silver necklace with a topaz gem",
    "isNamePlural" : false,
	"cost" : 1200,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 3
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "neck",
    "equipmentSpriteId" : 3,
    "equipmentSpriteSheet" : "neck1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 100
    },
    "recipe" : [
        {
            "desc" : "silver bar",
            "itemId" : 71,
            "amount" : 1
        },
        {
            "desc" : "topaz gem",
            "itemId" : 83,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 0.05
},
{
	"_id" : 198,
	"name" : "citrine necklace",
    "description" : "A silver necklace with a citrine gem",
    "isNamePlural" : false,
	"cost" : 1500,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "strength",
            "amount" : 3
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "neck",
    "equipmentSpriteId" : 4,
    "equipmentSpriteSheet" : "neck1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 125
    },
    "recipe" : [
        {
            "desc" : "silver bar",
            "itemId" : 71,
            "amount" : 1
        },
        {
            "desc" : "citrine gem",
            "itemId" : 84,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 0.05
},
{
	"_id" : 199,
	"name" : "ruby necklace",
    "description" : "A silver necklace with a ruby gem",
    "isNamePlural" : false,
	"cost" : 1800,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "accuracy",
            "amount" : 2
        },
        {
            "skill" : "defense",
            "amount" : 2
        },
        {
            "skill" : "strength",
            "amount" : 3
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "neck",
    "equipmentSpriteId" : 5,
    "equipmentSpriteSheet" : "neck1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 150
    },
    "recipe" : [
        {
            "desc" : "silver bar",
            "itemId" : 71,
            "amount" : 1
        },
        {
            "desc" : "ruby gem",
            "itemId" : 85,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 0.05
},
{
	"_id" : 200,
	"name" : "diamond necklace",
    "description" : "A silver necklace with a diamond gem",
    "isNamePlural" : false,
	"cost" : 2100,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "accuracy",
            "amount" : 3
        },
        {
            "skill" : "defense",
            "amount" : 2
        },
        {
            "skill" : "strength",
            "amount" : 2
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "neck",
    "equipmentSpriteId" : 6,
    "equipmentSpriteSheet" : "neck1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 175
    },
    "recipe" : [
        {
            "desc" : "silver bar",
            "itemId" : 71,
            "amount" : 1
        },
        {
            "desc" : "diamond gem",
            "itemId" : 86,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 0.05
},
{
	"_id" : 201,
	"name" : "robe top",
    "description" : "An old robe top",
    "isNamePlural" : false,
	"cost" : 10,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 1
        },
        {
            "skill" : "strength",
            "amount" : 2
        },
        {
            "skill" : "accuracy",
            "amount" : 1
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "chest",
    "equipmentSpriteId" : 9,
    "equipmentSpriteSheet" : "chest1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 1
},
{
	"_id" : 202,
	"name" : "robe bottoms",
    "description" : "Some old robe bottoms",
    "isNamePlural" : false,
	"cost" : 10,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 1
        },
        {
            "skill" : "strength",
            "amount" : 2
        },
        {
            "skill" : "accuracy",
            "amount" : 1
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "legs",
    "equipmentSpriteId" : 9,
    "equipmentSpriteSheet" : "legs1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 1
},
{
	"_id" : 203,
	"name" : "wizard's top",
    "description" : "A magic robe worn by wizards",
    "isNamePlural" : false,
	"cost" : 250,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 1
        },
        {
            "skill" : "magic",
            "amount" : 8
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "chest",
    "equipmentSpriteId" : 10,
    "equipmentSpriteSheet" : "chest1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 1
},
{
	"_id" : 204,
	"name" : "wizard's bottoms",
    "description" : "Magical robe bottoms worn by wizards",
    "isNamePlural" : false,
	"cost" : 250,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 1
        },
        {
            "skill" : "magic",
            "amount" : 5
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "legs",
    "equipmentSpriteId" : 10,
    "equipmentSpriteSheet" : "legs1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 1
},
{
	"_id" : 205,
	"name" : "sage's top",
    "description" : "A robe worn by wise sages",
    "isNamePlural" : false,
	"cost" : 20,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 1
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "chest",
    "equipmentSpriteId" : 11,
    "equipmentSpriteSheet" : "chest1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 1
},
{
	"_id" : 206,
	"name" : "sage's bottoms",
    "description" : "Robe bottoms worn by wise sages",
    "isNamePlural" : false,
	"cost" : 20,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 1
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "legs",
    "equipmentSpriteId" : 11,
    "equipmentSpriteSheet" : "legs1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 1
},
{
	"_id" : 207,
	"name" : "wizard's hat",
    "description" : "A magical hat worn by wizards",
    "isNamePlural" : false,
	"cost" : 250,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 1
        },
        {
            "skill" : "magic",
            "amount" : 2
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 20,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.5
},
{
	"_id" : 208,
	"name" : "witch's top",
    "description" : "A dark magic robe worn by witches",
    "isNamePlural" : false,
	"cost" : 20,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 1
        },
        {
            "skill" : "magic",
            "amount" : 8
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "chest",
    "equipmentSpriteId" : 12,
    "equipmentSpriteSheet" : "chest1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 1
},
{
	"_id" : 209,
	"name" : "witch's bottoms",
    "description" : "Dark magical robe bottoms worn by witches",
    "isNamePlural" : false,
	"cost" : 20,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 1
        },
        {
            "skill" : "magic",
            "amount" : 5
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "legs",
    "equipmentSpriteId" : 12,
    "equipmentSpriteSheet" : "legs1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 1
},
{
	"_id" : 210,
	"name" : "witch's hat",
    "description" : "A dark magical hat worn by witches",
    "isNamePlural" : false,
	"cost" : 20,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 1
        },
        {
            "skill" : "magic",
            "amount" : 2
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 21,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.5
},
{
	"_id" : 211,
	"name" : "blue wizard's top",
    "description" : "A magic robe worn by powerful wizards",
    "isNamePlural" : false,
	"cost" : 500,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 1
        },
        {
            "skill" : "magic",
            "amount" : 20
        }
    ],
	"equippableRequirements" : [
        {
            "skill" : "magic",
            "amount" : 40
        }
    ],
	"equipmentType" : "chest",
    "equipmentSpriteId" : 13,
    "equipmentSpriteSheet" : "chest1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 1
},
{
	"_id" : 212,
	"name" : "blue wizard's bottoms",
    "description" : "Magical robe bottoms worn by powerful wizards",
    "isNamePlural" : false,
	"cost" : 375,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 1
        },
        {
            "skill" : "magic",
            "amount" : 15
        }
    ],
	"equippableRequirements" : [
        {
            "skill" : "magic",
            "amount" : 40
        }
    ],
	"equipmentType" : "legs",
    "equipmentSpriteId" : 13,
    "equipmentSpriteSheet" : "legs1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 1
},
{
	"_id" : 213,
	"name" : "blue wizard's hat",
    "description" : "A magical hat worn by powerful wizards",
    "isNamePlural" : false,
	"cost" : 250,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 1
        },
        {
            "skill" : "magic",
            "amount" : 10
        }
    ],
	"equippableRequirements" : [
        {
            "skill" : "magic",
            "amount" : 40
        }
    ],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 22,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.5
},
{
	"_id" : 214,
	"name" : "gnome's hat",
    "description" : "A tiny little gnome hat",
    "isNamePlural" : false,
	"cost" : 5,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "magic",
            "amount" : 1
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 24,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.05
},
{
	"_id" : 215,
	"name" : "giant gnome's hat",
    "description" : "A hat for big gnomes",
    "isNamePlural" : false,
	"cost" : 15,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "magic",
            "amount" : 5
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 23,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.25
},
{
	"_id" : 216,
	"name" : "giant gnome's top",
    "description" : "A shirt worn by big gnomes",
    "isNamePlural" : false,
	"cost" : 20,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "magic",
            "amount" : 10
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "chest",
    "equipmentSpriteId" : 14,
    "equipmentSpriteSheet" : "chest1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 1
},
{
	"_id" : 217,
	"name" : "blood robe top",
    "description" : "A magical robe worn by evil mages",
    "isNamePlural" : false,
	"cost" : 750,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 1
        },
        {
            "skill" : "magic",
            "amount" : 25
        }
    ],
	"equippableRequirements" : [
        {
            "skill" : "magic",
            "amount" : 50
        }
    ],
	"equipmentType" : "chest",
    "equipmentSpriteId" : 15,
    "equipmentSpriteSheet" : "chest1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 1
},
{
	"_id" : 218,
	"name" : "blood robe bottoms",
    "description" : "Magical robe bottoms worn by evil mages",
    "isNamePlural" : false,
	"cost" : 600,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 1
        },
        {
            "skill" : "magic",
            "amount" : 18
        }
    ],
	"equippableRequirements" : [
        {
            "skill" : "magic",
            "amount" : 50
        }
    ],
	"equipmentType" : "legs",
    "equipmentSpriteId" : 14,
    "equipmentSpriteSheet" : "legs1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 1
},
{
	"_id" : 219,
	"name" : "blood hat",
    "description" : "A magical hat worn by evil mages",
    "isNamePlural" : false,
	"cost" : 450,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 1
        },
        {
            "skill" : "magic",
            "amount" : 12
        }
    ],
	"equippableRequirements" : [
        {
            "skill" : "magic",
            "amount" : 50
        }
    ],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 25,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.5
},
{
	"_id" : 220,
	"name" : "scallop shell",
    "description" : "It's a scallop shell",
    "isNamePlural" : false,
	"cost" : 10,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.01
},
{
	"_id" : 221,
	"name" : "sand dollar",
    "description" : "Underwater currency",
    "isNamePlural" : false,
	"cost" : 100,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.01
},
{
	"_id" : 222,
	"name" : "conch",
    "description" : "I can hear the ocean when I put it up to my ear",
    "isNamePlural" : false,
	"cost" : 500,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.1
},
{
	"_id" : 223,
	"name" : "seaweed",
    "description" : "Weeds from the sea",
    "isNamePlural" : true,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.05
},
{
	"_id" : 224,
	"name" : "starfish",
    "description" : "Doesn't look like a fish to me",
    "isNamePlural" : false,
	"cost" : 50,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.025
},
{
	"_id" : 225,
	"name" : "driftwood",
    "description" : "Some old wood that had been floating in the ocean",
    "isNamePlural" : true,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.05
},
{
	"_id" : 226,
	"name" : "seashell shores bank key",
    "description" : "A key to get into the basement of the Seashell Shores bank",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : false,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.01
},
{
	"_id" : 227,
	"name" : "pirate's key",
    "description" : "I bet it unlocks a hidden treasure chest",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.01
},
{
	"_id" : 228,
	"name" : "elf ears",
    "description" : "They're rather pointy",
    "isNamePlural" : false,
	"cost" : 100,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 26,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.025
},
{
	"_id" : 229,
	"name" : "sewer key",
    "description" : "Whats that brown stuff all over it",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : false,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.01
},
{
	"_id" : 230,
	"name" : "trumpet",
    "description" : "A horn that one can toot",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : false,
	"isForMission" : true,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.75
},
{
	"_id" : 231,
	"name" : "leprechaun sketch",
    "description" : "A detailed sketch of a leprechaun",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : false,
	"isForMission" : true,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0
},
{
	"_id" : 232,
	"name" : "tattered skirt",
    "description" : "A tattered old skirt",
    "isNamePlural" : false,
	"cost" : 5,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 0
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "legs",
    "equipmentSpriteId" : 15,
    "equipmentSpriteSheet" : "legs1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.75
},
{
	"_id" : 233,
	"name" : "raw beef",
    "description" : "A raw slab of beef",
    "isNamePlural" : true,
	"cost" : 3,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.4
},
{
	"_id" : 234,
	"name" : "steak",
    "description" : "A juicy steak",
    "isNamePlural" : true,
	"cost" : 5,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"eat"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "hitpoints",
			    "amount" : 4
            }
		}
	],
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : 0.8,
	"expFromObtaining" : {
		"skill" : "cooking",
		"amount" : 15
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.3
},
{
	"_id" : 235,
	"name" : "rat tail",
    "description" : "I think it just twitched",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.01
},
{
	"_id" : 236,
	"name" : "squirrel pelt",
    "description" : "The skin of a dead squirrel",
    "isNamePlural" : false,
	"cost" : 3,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.1
},
{
	"_id" : 237,
	"name" : "raw chicken",
    "description" : "Probably best to cook before eating it",
    "isNamePlural" : false,
	"cost" : 3,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.25
},
{
	"_id" : 238,
	"name" : "chicken",
    "description" : "A savoury roasted chicken",
    "isNamePlural" : false,
	"cost" : 5,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"eat"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "hitpoints",
			    "amount" : 3
            }
		}
	],
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : 0.8,
	"expFromObtaining" : {
		"skill" : "cooking",
		"amount" : 15
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.2
},
{
	"_id" : 239,
	"name" : "raw rodent meat",
    "description" : "Raw meat from a small rodent",
    "isNamePlural" : true,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.1
},
{
	"_id" : 240,
	"name" : "rodent meat",
    "description" : "Theres not a whole lot of meat here",
    "isNamePlural" : true,
	"cost" : 2,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"eat"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "hitpoints",
			    "amount" : 2
            }
		}
	],
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : 0.85,
	"expFromObtaining" : {
		"skill" : "cooking",
		"amount" : 10
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.08
},
{
	"_id" : 241,
	"name" : "helmet of melee",
    "description" : "An medium helmet made from a sinister metal",
    "isNamePlural" : false,
	"cost" : 100000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 36
        },
        {
            "skill" : "strength",
            "amount" : 5
        },
        {
            "skill" : "accuracy",
            "amount" : 1
        },
        {
            "skill" : "magic",
            "amount" : -3
        },
        {
            "skill" : "range",
            "amount" : -3
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 60
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 27,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 2.5
},
{
	"_id" : 242,
	"name" : "barbarian helm",
    "description" : "Check out those horns on it",
    "isNamePlural" : false,
	"cost" : 500,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 8
        },
        {
            "skill" : "strength",
            "amount" : 2
        },
        {
            "skill" : "accuracy",
            "amount" : 1
        },
        {
            "skill" : "magic",
            "amount" : -3
        },
        {
            "skill" : "range",
            "amount" : -3
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 10
        },
        {
			"skill" : "strength",
			"amount" : 10
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 28,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 2.5
},
{
	"_id" : 243,
	"name" : "celadon chestplate",
    "description" : "Protective chest armour made of celadium metal",
    "isNamePlural" : false,
	"cost" : 70000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 82
        },
        {
            "skill" : "magic",
            "amount" : -15
        },
        {
            "skill" : "range",
            "amount" : -15
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 70
		}
	],
	"equipmentType" : "chest",
    "equipmentSpriteId" : 4,
    "equipmentSpriteSheet" : "chest1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 1500
    },
    "recipe" : [
        {
            "desc" : "celadium bar",
            "itemId" : 253,
            "amount" : 5
        }
    ],
    "metalType" : "celadium",
    "weight": 10
},
{
	"_id" : 244,
	"name" : "celadon platelegs",
    "description" : "Protective leg armour made of celadium metal",
    "isNamePlural" : true,
	"cost" : 35000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 59
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 70
		}
	],
	"equipmentType" : "legs",
    "equipmentSpriteId" : 4,
    "equipmentSpriteSheet" : "legs1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 900
    },
    "recipe" : [
        {
            "desc" : "celadium bar",
            "itemId" : 253,
            "amount" : 3
        }
    ],
    "metalType" : "celadium",
    "weight": 6,
    "removeEquipmentOnEquip" : [
        "boots"
    ]
},
{
	"_id" : 245,
	"name" : "celadon pickaxe",
    "description" : "A pickaxe made of celadium metal",
    "isNamePlural" : false,
	"cost" : 10000,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
		{
			"skill" : "accuracy",
			"amount" : 6
		},
		{
			"skill" : "strength",
			"amount" : 6
		}
	],
	"equippableRequirements" : [
        {
            "skill" : "mining",
            "amount" : 70
        }
    ],
	"equipmentType" : "weapon",
	"equipmentSpriteId" : 19,
	"equipmentSpriteSheet" : "weapon1",
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "smithing",
		"amount" : 300
	},
    "recipe" : [
        {
            "desc" : "celadium bar",
            "itemId" : 253,
            "amount" : 1
        }
    ],
    "metalType" : "celadium",
    "weight": 1.25,
    "weaponSpeed" : 5
},
{
	"_id" : 246,
	"name" : "celadon gloves",
    "description" : "These will protect my fingers",
    "isNamePlural" : true,
	"cost" : 10000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 6
        },
        {
            "skill" : "accuracy",
            "amount" : 5
        },
        {
            "skill" : "magic",
            "amount" : -3
        },
        {
            "skill" : "range",
            "amount" : -3
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "harvesting",
			"amount" : 70
		}
	],
	"equipmentType" : "gloves",
    "equipmentSpriteId" : 4,
    "equipmentSpriteSheet" : "gloves1",
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 300
    },
    "recipe" : [
        {
            "desc" : "celadium bar",
            "itemId" : 253,
            "amount" : 1
        }
    ],
    "metalType" : "celadium",
    "weight": 1.5
},
{
	"_id" : 247,
	"name" : "celadon full helm",
    "description" : "A full-faced helmet made of celadium metal",
    "isNamePlural" : false,
	"cost" : 20000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 38
        },
        {
            "skill" : "magic",
            "amount" : -6
        },
        {
            "skill" : "range",
            "amount" : -6
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 70
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 12,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 600
    },
    "recipe" : [
        {
            "desc" : "celadium bar",
            "itemId" : 253,
            "amount" : 2
        }
    ],
    "metalType" : "celadium",
    "weight": 4
},
{
	"_id" : 248,
	"name" : "celadon shield",
    "description" : "A heavy shield made of celadium metal",
    "isNamePlural" : false,
	"cost" : 35000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 54
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 70
		}
	],
	"equipmentType" : "shield",
    "equipmentSpriteId" : 4,
    "equipmentSpriteSheet" : "shield1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 900
    },
    "recipe" : [
        {
            "desc" : "celadium bar",
            "itemId" : 253,
            "amount" : 3
        }
    ],
    "metalType" : "celadium",
    "weight": 6
},
{
	"_id" : 249,
	"name" : "celadon longsword",
    "description" : "A sharp sword crafted of celadium metal",
    "isNamePlural" : false,
	"cost" : 20000,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
		{
			"skill" : "accuracy",
			"amount" : 60
		},
		{
			"skill" : "strength",
			"amount" : 59
		}
	],
	"equippableRequirements" : [
		{
			"skill" : "accuracy",
			"amount" : 70
		}
	],
	"equipmentType" : "weapon",
	"equipmentSpriteId" : 22,
	"equipmentSpriteSheet" : "weapon1",
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "smithing",
		"amount" : 600
	},
    "recipe" : [
        {
            "desc" : "celadium bar",
            "itemId" : 253,
            "amount" : 2
        }
    ],
    "metalType" : "celadium",
    "weaponSpeed" : 5,
    "weight": 2
},
{
	"_id" : 250,
	"name" : "celadon battleaxe",
    "description" : "A dangerous battleaxe made of celadium metal",
    "isNamePlural" : false,
	"cost" : 35000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "accuracy",
            "amount" : 60
        },
        {
            "skill" : "strength",
            "amount" : 75
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "accuracy",
			"amount" : 70
		}
	],
	"equipmentType" : "weapon",
    "equipmentSpriteId" : 23,
    "equipmentSpriteSheet" : "weapon1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 900
    },
    "recipe" : [
        {
            "desc" : "celadium bar",
            "itemId" : 253,
            "amount" : 3
        }
    ],
    "metalType" : "celadium",
    "weight": 3.5,
    "weaponSpeed" : 6
},
{
	"_id" : 251,
	"name" : "celadon great sword",
    "description" : "I wouldn't want to get whacked over the head by this thing",
    "isNamePlural" : false,
	"cost" : 52500,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "accuracy",
            "amount" : 68
        },
        {
            "skill" : "strength",
            "amount" : 89
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "accuracy",
			"amount" : 70
		}
	],
	"equipmentType" : "weapon",
    "equipmentSpriteId" : 22,
    "equipmentSpriteSheet" : "weapon1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 1200
    },
    "recipe" : [
        {
            "desc" : "celadium bar",
            "itemId" : 253,
            "amount" : 4
        }
    ],
    "metalType" : "celadium",
    "weight": 5,
    "weaponSpeed" : 6,
    "removeEquipmentOnEquip" : [
        "shield"
    ]
},
{
	"_id" : 252,
	"name" : "celadium ore",
    "description" : "Raw celadium ore",
    "isNamePlural" : true,
	"cost" : 1000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
    "hidesSpritesUnderneath" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "mining",
        "amount" : 600
    },
    "recipe" : null,
    "metalType" : null,
    "weight": 2.5
},
{
	"_id" : 253,
	"name" : "celadium bar",
    "description" : "A solid bar of celadium",
    "isNamePlural" : false,
	"cost" : 5000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 300
    },
    "recipe" : [
        {
            "desc" : "celadium ore",
            "itemId" : 252,
            "amount" : 1
        },
        {
            "desc" : "coal",
            "itemId" : 142,
            "amount" : 8
        }
    ],
    "metalType" : "celadium",
    "weight": 2
},
{
	"_id" : 254,
	"name" : "gold warrior helm",
    "description" : "A decorative full-faced helmet made from pure gold",
    "isNamePlural" : false,
	"cost" : 30000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 2
        },
        {
            "skill" : "strength",
            "amount" : 2
        },
        {
            "skill" : "magic",
            "amount" : -3
        },
        {
            "skill" : "range",
            "amount" : -3
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 20
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 16,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 200
    },
    "recipe" : [
        {
            "desc" : "gold bar",
            "itemId" : 72,
            "amount" : 2
        }
    ],
    "metalType" : "gold",
    "weight": 4
},
{
	"_id" : 255,
	"name" : "silver warrior helm",
    "description" : "A decorative full-faced helmet made from pure silver",
    "isNamePlural" : false,
	"cost" : 4000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 4
        },
        {
            "skill" : "strength",
            "amount" : 1
        },
        {
            "skill" : "magic",
            "amount" : -3
        },
        {
            "skill" : "range",
            "amount" : -3
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 10
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 18,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 120
    },
    "recipe" : [
        {
            "desc" : "silver bar",
            "itemId" : 71,
            "amount" : 2
        }
    ],
    "metalType" : "silver",
    "weight": 4
},
{
	"_id" : 256,
	"name" : "coronium gloves (silver plating)",
    "description" : "These will protect my fingers",
    "isNamePlural" : true,
	"cost" : 5000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 5
        },
        {
            "skill" : "accuracy",
            "amount" : 4
        },
        {
            "skill" : "magic",
            "amount" : -3
        },
        {
            "skill" : "range",
            "amount" : -3
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "harvesting",
			"amount" : 40
		}
	],
	"equipmentType" : "gloves",
    "equipmentSpriteId" : 5,
    "equipmentSpriteSheet" : "gloves1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "coronium",
    "weight": 1.5
},
{
	"_id" : 257,
	"name" : "coronium gloves (gold plating)",
    "description" : "These will protect my fingers",
    "isNamePlural" : true,
	"cost" : 5000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 5
        },
        {
            "skill" : "accuracy",
            "amount" : 4
        },
        {
            "skill" : "magic",
            "amount" : -3
        },
        {
            "skill" : "range",
            "amount" : -3
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "harvesting",
			"amount" : 40
		}
	],
	"equipmentType" : "gloves",
    "equipmentSpriteId" : 8,
    "equipmentSpriteSheet" : "gloves1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "coronium",
    "weight": 1.5
},
{
	"_id" : 258,
	"name" : "celadon helm",
    "description" : "An open-faced helmet made of celadium metal",
    "isNamePlural" : false,
	"cost" : 10000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 33
        },
        {
            "skill" : "accuracy",
            "amount" : 1
        },
        {
            "skill" : "magic",
            "amount" : -3
        },
        {
            "skill" : "range",
            "amount" : -3
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 70
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 5,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 300
    },
    "recipe" : [
        {
            "desc" : "celadium bar",
            "itemId" : 253,
            "amount" : 1
        }
    ],
    "metalType" : "celadium",
    "weight": 2
},
{
	"_id" : 259,
	"name" : "vial",
    "description" : "An empty glass vial",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : null,
    "useItemOnItemActions" : null,
    "weight": 0.1
},
{
	"_id" : 260,
	"name" : "vial of water",
    "description" : "A vial filled with water",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : null,
    "useItemOnItemActions" : null,
    "weight": 0.2
},
{
	"_id" : 261,
	"name" : "potion of accuracy (2)",
    "description" : "An accuracy-boosting potion",
    "isNamePlural" : false,
	"cost" : 20,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"drink"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "accuracy",
			    "amount" : 0.1
            }
		}
    ],
    "edibleResult" : {
        "id" : 262,
        "amount" : 1,
        "isIOU" : false
    },
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : {
        "skill" : "potionmaking",
        "amount" : 25
    },
    "recipe" : [
        {
            "desc" : "vial",
            "itemId" : 259,
            "amount" : 1
        },
        {
            "desc" : "aruba root",
            "itemId" : 283,
            "amount" : 1
        },
        {
            "desc" : "carrot",
            "itemId" : 287,
            "amount" : 1
        }
    ],
    "useItemOnItemActions" : null,
    "weight": 0.2
},
{
	"_id" : 262,
	"name" : "potion of accuracy (1)",
    "description" : "An accuracy-boosting potion",
    "isNamePlural" : false,
	"cost" : 10,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"drink"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "accuracy",
			    "amount" : 0.1
            }
		}
    ],
    "edibleResult" : {
        "id" : 259,
        "amount" : 1,
        "isIOU" : false
    },
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : null,
    "useItemOnItemActions" : [
		{
            "targetItemId" : 262,
            "skillToCreate" : null,
            "canCreateMultiple" : false,
			"resultItems" : [
                {
                    "id" : 261,
                    "amount" : 1,
                    "isIOU" : false
                },
                {
                    "id" : 259,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 262,
                    "amount" : 2,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        }
	],
    "weight": 0.15
},
{
	"_id" : 263,
	"name" : "potion of defense (2)",
    "description" : "A defense-boosting potion",
    "isNamePlural" : false,
	"cost" : 20,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"drink"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "defense",
			    "amount" : 0.1
            }
		}
    ],
    "edibleResult" : {
        "id" : 264,
        "amount" : 1,
        "isIOU" : false
    },
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : {
        "skill" : "potionmaking",
        "amount" : 40
    },
    "recipe" : [
        {
            "desc" : "vial",
            "itemId" : 259,
            "amount" : 1
        },
        {
            "desc" : "grenada root",
            "itemId" : 284,
            "amount" : 1
        },
        {
            "desc" : "bonemeal",
            "itemId" : 168,
            "amount" : 1
        }
    ],
    "useItemOnItemActions" : null,
    "weight": 0.2
},
{
	"_id" : 264,
	"name" : "potion of defense (1)",
    "description" : "A defense-boosting potion",
    "isNamePlural" : false,
	"cost" : 10,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"drink"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "defense",
			    "amount" : 0.1
            }
		}
    ],
    "edibleResult" : {
        "id" : 259,
        "amount" : 1,
        "isIOU" : false
    },
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : null,
    "useItemOnItemActions" : [
		{
            "targetItemId" : 264,
            "skillToCreate" : null,
            "canCreateMultiple" : false,
			"resultItems" : [
                {
                    "id" : 263,
                    "amount" : 1,
                    "isIOU" : false
                },
                {
                    "id" : 259,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 264,
                    "amount" : 2,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        }
	],
    "weight": 0.15
},
{
	"_id" : 265,
	"name" : "potion of strength (2)",
    "description" : "A strength-boosting potion",
    "isNamePlural" : false,
	"cost" : 20,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"drink"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "strength",
			    "amount" : 0.1
            }
		}
    ],
    "edibleResult" : {
        "id" : 266,
        "amount" : 1,
        "isIOU" : false
    },
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : {
        "skill" : "potionmaking",
        "amount" : 65
    },
    "recipe" : [
        {
            "desc" : "vial",
            "itemId" : 259,
            "amount" : 1
        },
        {
            "desc" : "samoan root",
            "itemId" : 282,
            "amount" : 1
        },
        {
            "desc" : "grapes",
            "itemId" : 106,
            "amount" : 1
        }
    ],
    "useItemOnItemActions" : null,
    "weight": 0.2
},
{
	"_id" : 266,
	"name" : "potion of strength (1)",
    "description" : "A strength-boosting potion",
    "isNamePlural" : false,
	"cost" : 10,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"drink"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "strength",
			    "amount" : 0.1
            }
		}
    ],
    "edibleResult" : {
        "id" : 259,
        "amount" : 1,
        "isIOU" : false
    },
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : null,
    "useItemOnItemActions" : [
		{
            "targetItemId" : 266,
            "skillToCreate" : null,
            "canCreateMultiple" : false,
			"resultItems" : [
                {
                    "id" : 265,
                    "amount" : 1,
                    "isIOU" : false
                },
                {
                    "id" : 259,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 266,
                    "amount" : 2,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        }
	],
    "weight": 0.15
},
{
	"_id" : 267,
	"name" : "potion of fishing (2)",
    "description" : "A potion that provides a fishing boost",
    "isNamePlural" : false,
	"cost" : 20,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"drink"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "fishing",
			    "amount" : 0.05
            }
		}
    ],
    "edibleResult" : {
        "id" : 268,
        "amount" : 1,
        "isIOU" : false
    },
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : {
        "skill" : "potionmaking",
        "amount" : 35
    },
    "recipe" : [
        {
            "desc" : "vial",
            "itemId" : 259,
            "amount" : 1
        },
        {
            "desc" : "sardinian root",
            "itemId" : 288,
            "amount" : 1
        },
        {
            "desc" : "starfish",
            "itemId" : 224,
            "amount" : 1
        }
    ],
    "useItemOnItemActions" : null,
    "weight": 0.2
},
{
	"_id" : 268,
	"name" : "potion of fishing (1)",
    "description" : "A potion that provides a fishing boost",
    "isNamePlural" : false,
	"cost" : 10,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"drink"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "fishing",
			    "amount" : 0.05
            }
		}
    ],
    "edibleResult" : {
        "id" : 259,
        "amount" : 1,
        "isIOU" : false
    },
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : null,
    "useItemOnItemActions" : [
		{
            "targetItemId" : 268,
            "skillToCreate" : null,
            "canCreateMultiple" : false,
			"resultItems" : [
                {
                    "id" : 267,
                    "amount" : 1,
                    "isIOU" : false
                },
                {
                    "id" : 259,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 268,
                    "amount" : 2,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        }
	],
    "weight": 0.15
},
{
	"_id" : 269,
	"name" : "potion of smithing (2)",
    "description" : "A potion that provides a smithing boost",
    "isNamePlural" : false,
	"cost" : 20,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"drink"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "smithing",
			    "amount" : 0.05
            }
		}
    ],
    "edibleResult" : {
        "id" : 270,
        "amount" : 1,
        "isIOU" : false
    },
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : {
        "skill" : "potionmaking",
        "amount" : 45
    },
    "recipe" : [
        {
            "desc" : "vial",
            "itemId" : 259,
            "amount" : 1
        },
        {
            "desc" : "tonga root",
            "itemId" : 278,
            "amount" : 1
        },
        {
            "desc" : "palladium bar",
            "itemId" : 144,
            "amount" : 1
        }
    ],
    "useItemOnItemActions" : null,
    "weight": 0.2
},
{
	"_id" : 270,
	"name" : "potion of smithing (1)",
    "description" : "A potion that provides a smithing boost",
    "isNamePlural" : false,
	"cost" : 10,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"drink"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "smithing",
			    "amount" : 0.05
            }
		}
    ],
    "edibleResult" : {
        "id" : 259,
        "amount" : 1,
        "isIOU" : false
    },
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : null,
    "useItemOnItemActions" : [
		{
            "targetItemId" : 270,
            "skillToCreate" : null,
            "canCreateMultiple" : false,
			"resultItems" : [
                {
                    "id" : 269,
                    "amount" : 1,
                    "isIOU" : false
                },
                {
                    "id" : 259,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 270,
                    "amount" : 2,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        }
	],
    "weight": 0.15
},
{
	"_id" : 271,
	"name" : "potion of mining (2)",
    "description" : "A potion that provides a mining boost",
    "isNamePlural" : false,
	"cost" : 20,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"drink"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "mining",
			    "amount" : 0.05
            }
		}
    ],
    "edibleResult" : {
        "id" : 272,
        "amount" : 1,
        "isIOU" : false
    },
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : {
        "skill" : "potionmaking",
        "amount" : 50
    },
    "recipe" : [
        {
            "desc" : "vial",
            "itemId" : 259,
            "amount" : 1
        },
        {
            "desc" : "maui root",
            "itemId" : 280,
            "amount" : 1
        },
        {
            "desc" : "palladium ore",
            "itemId" : 48,
            "amount" : 1
        }
    ],
    "useItemOnItemActions" : null,
    "weight": 0.2
},
{
	"_id" : 272,
	"name" : "potion of mining (1)",
    "description" : "A potion that provides a mining boost",
    "isNamePlural" : false,
	"cost" : 10,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"drink"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "mining",
			    "amount" : 0.05
            }
		}
    ],
    "edibleResult" : {
        "id" : 259,
        "amount" : 1,
        "isIOU" : false
    },
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : null,
    "useItemOnItemActions" : [
		{
            "targetItemId" : 272,
            "skillToCreate" : null,
            "canCreateMultiple" : false,
			"resultItems" : [
                {
                    "id" : 271,
                    "amount" : 1,
                    "isIOU" : false
                },
                {
                    "id" : 259,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 272,
                    "amount" : 2,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        }
	],
    "weight": 0.15
},
{
	"_id" : 273,
	"name" : "potion of restoration (2)",
    "description" : "A stat-restoring potion",
    "isNamePlural" : false,
	"cost" : 20,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"drink"
	],
	"edibleEffects" : null,
    "edibleResult" : {
        "id" : 274,
        "amount" : 1,
        "isIOU" : false
    },
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : {
        "skill" : "potionmaking",
        "amount" : 55
    },
    "recipe" : [
        {
            "desc" : "vial",
            "itemId" : 259,
            "amount" : 1
        },
        {
            "desc" : "nauru root",
            "itemId" : 279,
            "amount" : 1
        },
        {
            "desc" : "strawberry",
            "itemId" : 103,
            "amount" : 1
        }
    ],
    "useItemOnItemActions" : null,
    "weight": 0.2
},
{
	"_id" : 274,
	"name" : "potion of restoration (1)",
    "description" : "A stat-restoring potion",
    "isNamePlural" : false,
	"cost" : 10,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"drink"
	],
	"edibleEffects" : null,
    "edibleResult" : {
        "id" : 259,
        "amount" : 1,
        "isIOU" : false
    },
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : null,
    "useItemOnItemActions" : [
		{
            "targetItemId" : 274,
            "skillToCreate" : null,
            "canCreateMultiple" : false,
			"resultItems" : [
                {
                    "id" : 273,
                    "amount" : 1,
                    "isIOU" : false
                },
                {
                    "id" : 259,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 274,
                    "amount" : 2,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        }
	],
    "weight": 0.15
},
{
	"_id" : 275,
	"name" : "potion of forestry (2)",
    "description" : "A potion that provides a forestry boost",
    "isNamePlural" : false,
	"cost" : 20,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"drink"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "forestry",
			    "amount" : 0.05
            }
		}
    ],
    "edibleResult" : {
        "id" : 276,
        "amount" : 1,
        "isIOU" : false
    },
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : {
        "skill" : "potionmaking",
        "amount" : 30
    },
    "recipe" : [
        {
            "desc" : "vial",
            "itemId" : 259,
            "amount" : 1
        },
        {
            "desc" : "fiji root",
            "itemId" : 277,
            "amount" : 1
        },
        {
            "desc" : "leaf",
            "itemId" : 112,
            "amount" : 1
        }
    ],
    "useItemOnItemActions" : null,
    "weight": 0.2
},
{
	"_id" : 276,
	"name" : "potion of forestry (1)",
    "description" : "A potion that provides a forestry boost",
    "isNamePlural" : false,
	"cost" : 10,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"drink"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "forestry",
			    "amount" : 0.05
            }
		}
    ],
    "edibleResult" : {
        "id" : 259,
        "amount" : 1,
        "isIOU" : false
    },
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : null,
    "useItemOnItemActions" : [
		{
            "targetItemId" : 276,
            "skillToCreate" : null,
            "canCreateMultiple" : false,
			"resultItems" : [
                {
                    "id" : 275,
                    "amount" : 1,
                    "isIOU" : false
                },
                {
                    "id" : 259,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 276,
                    "amount" : 2,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        }
	],
    "weight": 0.15
},
{
	"_id" : 277,
	"name" : "fiji root",
    "description" : "A root used in a potion recipe",
    "isNamePlural" : false,
	"cost" : 5,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "harvesting",
		"amount" : 80
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.1
},
{
	"_id" : 278,
	"name" : "tonga root",
    "description" : "A root used in a potion recipe",
    "isNamePlural" : false,
	"cost" : 5,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "harvesting",
		"amount" : 160
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.1
},
{
	"_id" : 279,
	"name" : "nauru root",
    "description" : "A root used in a potion recipe",
    "isNamePlural" : false,
	"cost" : 5,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "harvesting",
		"amount" : 180
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.1
},
{
	"_id" : 280,
	"name" : "maui root",
    "description" : "A root used in a potion recipe",
    "isNamePlural" : false,
	"cost" : 5,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "harvesting",
		"amount" : 120
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.1
},
{
	"_id" : 281,
	"name" : "vanua root",
    "description" : "A root used in a potion recipe",
    "isNamePlural" : false,
	"cost" : 5,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "harvesting",
		"amount" : 220
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.1
},
{
	"_id" : 282,
	"name" : "samoan root",
    "description" : "A root used in a potion recipe",
    "isNamePlural" : false,
	"cost" : 5,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "harvesting",
		"amount" : 200
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.1
},
{
	"_id" : 283,
	"name" : "aruba root",
    "description" : "A root used in a potion recipe",
    "isNamePlural" : false,
	"cost" : 5,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "harvesting",
		"amount" : 60
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.1
},
{
	"_id" : 284,
	"name" : "grenada root",
    "description" : "A root used in a potion recipe",
    "isNamePlural" : false,
	"cost" : 5,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "harvesting",
		"amount" : 140
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.1
},
{
	"_id" : 285,
	"name" : "potion of mischief (2)",
    "description" : "A misbehavior-inducing potion",
    "isNamePlural" : false,
	"cost" : 20,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"drink"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "crime",
			    "amount" : 0.05
            }
		}
    ],
    "edibleResult" : {
        "id" : 286,
        "amount" : 1,
        "isIOU" : false
    },
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : {
        "skill" : "potionmaking",
        "amount" : 80
    },
    "recipe" : [
        {
            "desc" : "vial",
            "itemId" : 259,
            "amount" : 1
        },
        {
            "desc" : "vanua root",
            "itemId" : 281,
            "amount" : 1
        },
        {
            "desc" : "rat tail",
            "itemId" : 235,
            "amount" : 1
        }
    ],
    "useItemOnItemActions" : null,
    "weight": 0.2
},
{
	"_id" : 286,
	"name" : "potion of mischief (1)",
    "description" : "A misbehavior-inducing potion",
    "isNamePlural" : false,
	"cost" : 10,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"drink"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "crime",
			    "amount" : 0.05
            }
		}
    ],
    "edibleResult" : {
        "id" : 259,
        "amount" : 1,
        "isIOU" : false
    },
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : null,
    "useItemOnItemActions" : [
		{
            "targetItemId" : 286,
            "skillToCreate" : null,
            "canCreateMultiple" : false,
			"resultItems" : [
                {
                    "id" : 285,
                    "amount" : 1,
                    "isIOU" : false
                },
                {
                    "id" : 259,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 286,
                    "amount" : 2,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        }
	],
    "weight": 0.15
},
{
	"_id" : 287,
	"name" : "carrot",
    "description" : "A freshly harvested carrot",
    "isNamePlural" : false,
	"cost" : 5,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"eat"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "hitpoints",
			    "amount" : 2
            }
		}
	],
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "harvesting",
		"amount" : 20
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.1
},
{
	"_id" : 288,
	"name" : "sardinian root",
    "description" : "A root used in a potion recipe",
    "isNamePlural" : false,
	"cost" : 5,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "harvesting",
		"amount" : 100
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.1
},
{
	"_id" : 289,
	"name" : "baked potato",
    "description" : "A freshly baked potato",
    "isNamePlural" : false,
	"cost" : 3,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"eat"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "hitpoints",
			    "amount" : 2
            }
		}
	],
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : 0.85,
	"expFromObtaining" : {
		"skill" : "cooking",
		"amount" : 5
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.2
},
{
	"_id" : 290,
	"name" : "grilled corn",
    "description" : "Some grilled corn on the cob",
    "isNamePlural" : true,
	"cost" : 5,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"eat"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "hitpoints",
			    "amount" : 3
            }
		}
	],
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : 0.825,
	"expFromObtaining" : {
		"skill" : "cooking",
		"amount" : 10
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.175
},
{
	"_id" : 291,
	"name" : "potion of magic (2)",
    "description" : "A magic-boosting potion",
    "isNamePlural" : false,
	"cost" : 20,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"drink"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "magic",
			    "amount" : 0.1
            }
		}
    ],
    "edibleResult" : {
        "id" : 292,
        "amount" : 1,
        "isIOU" : false
    },
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : {
        "skill" : "potionmaking",
        "amount" : 125
    },
    "recipe" : [
        {
            "desc" : "vial",
            "itemId" : 259,
            "amount" : 1
        },
        {
            "desc" : "mariana root",
            "itemId" : 293,
            "amount" : 1
        },
        {
            "desc" : "elf ears",
            "itemId" : 228,
            "amount" : 1
        }
    ],
    "useItemOnItemActions" : null,
    "weight": 0.2
},
{
	"_id" : 292,
	"name" : "potion of magic (1)",
    "description" : "A magic-boosting potion",
    "isNamePlural" : false,
	"cost" : 10,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"drink"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "magic",
			    "amount" : 0.1
            }
		}
    ],
    "edibleResult" : {
        "id" : 259,
        "amount" : 1,
        "isIOU" : false
    },
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : null,
    "useItemOnItemActions" : [
		{
            "targetItemId" : 292,
            "skillToCreate" : null,
            "canCreateMultiple" : false,
			"resultItems" : [
                {
                    "id" : 291,
                    "amount" : 1,
                    "isIOU" : false
                },
                {
                    "id" : 259,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 292,
                    "amount" : 2,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        }
	],
    "weight": 0.15
},
{
	"_id" : 293,
	"name" : "mariana root",
    "description" : "A root used in a potion recipe",
    "isNamePlural" : false,
	"cost" : 5,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "harvesting",
		"amount" : 240
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.1
},
{
	"_id" : 294,
	"name" : "red mushroom",
    "description" : "I wonder if its poisonous",
    "isNamePlural" : false,
	"cost" : 5,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "harvesting",
		"amount" : 80
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.1
},
{
	"_id" : 295,
	"name" : "leprechaun hat",
    "description" : "A lucky ol' hat",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : false,
	"isForMission" : true,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 1
        },
        {
            "skill" : "magic",
            "amount" : 2
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 29,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.5
},
{
	"_id" : 296,
	"name" : "gnome jail key",
    "description" : "A key used to unlock the jail cell under Gnome Hill",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : false,
	"isForMission" : true,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.01
},
{
	"_id" : 297,
	"name" : "leprechaun flute",
    "description" : "A magical Leprechaun Flute",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : false,
	"isForMission" : true,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.2
},
{
	"_id" : 298,
	"name" : "rough amethyst",
    "description" : "A rough amethyst gemstone",
    "isNamePlural" : false,
	"cost" : 100,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "mining",
		"amount" : 50
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.02
},
{
	"_id" : 299,
	"name" : "rough sapphire",
    "description" : "A rough sapphire gemstone",
    "isNamePlural" : false,
	"cost" : 200,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "mining",
		"amount" : 70
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.02
},
{
	"_id" : 300,
	"name" : "rough emerald",
    "description" : "A rough emerald gemstone",
    "isNamePlural" : false,
	"cost" : 300,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "mining",
		"amount" : 100
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.02
},
{
	"_id" : 301,
	"name" : "rough topaz",
    "description" : "An rough topaz gemstone",
    "isNamePlural" : false,
	"cost" : 400,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "mining",
		"amount" : 165
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.02
},
{
	"_id" : 302,
	"name" : "rough citrine",
    "description" : "A rough citrine gemstone",
    "isNamePlural" : false,
	"cost" : 500,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "mining",
		"amount" : 200
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.02
},
{
	"_id" : 303,
	"name" : "rough ruby",
    "description" : "A rough ruby gemstone",
    "isNamePlural" : false,
	"cost" : 600,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "mining",
		"amount" : 240
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.02
},
{
	"_id" : 304,
	"name" : "rough diamond",
    "description" : "A rough diamond gemstone",
    "isNamePlural" : false,
	"cost" : 700,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : true,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "mining",
		"amount" : 350
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.02
},
{
	"_id" : 305,
	"name" : "rough carbonado",
    "description" : "A rough carbonado gemstone",
    "isNamePlural" : false,
	"cost" : 800,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : true,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "mining",
		"amount" : 500
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.02
},
{
	"_id" : 306,
	"name" : "chef's hat",
    "description" : "A tall white hat",
    "isNamePlural" : false,
	"cost" : 20,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "cooking",
            "amount" : 1
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 30,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.25
},
{
	"_id" : 307,
	"name" : "blood hood",
    "description" : "A red, magical hood",
    "isNamePlural" : false,
	"cost" : 800,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 4
        },
        {
            "skill" : "magic",
            "amount" : 8
        }
    ],
	"equippableRequirements" : [
        {
            "skill" : "magic",
            "amount" : 50
        }
    ],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 31,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.5
},
{
	"_id" : 308,
	"name" : "old hood",
    "description" : "An old hood",
    "isNamePlural" : false,
	"cost" : 30,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 2
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 32,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.5
},
{
	"_id" : 309,
	"name" : "dark hood",
    "description" : "A dark-colored hood",
    "isNamePlural" : false,
	"cost" : 30,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 2
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 33,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.5
},
{
	"_id" : 310,
	"name" : "druid's hood",
    "description" : "A hood worn by druids",
    "isNamePlural" : false,
	"cost" : 30,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 2
        },
        {
            "skill" : "magic",
            "amount" : 1
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 34,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.5
},
{
	"_id" : 311,
	"name" : "helmet of ranging",
    "description" : "An medium helmet made from a sinister metal",
    "isNamePlural" : false,
	"cost" : 100000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 36
        },
        {
            "skill" : "range",
            "amount" : 10
        },
        {
            "skill" : "accuracy",
            "amount" : 1
        },
        {
            "skill" : "magic",
            "amount" : -3
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 60
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 35,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 2.5
},
{
	"_id" : 312,
	"name" : "helmet of magic",
    "description" : "An medium helmet made from a sinister metal",
    "isNamePlural" : false,
	"cost" : 100000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 36
        },
        {
            "skill" : "magic",
            "amount" : 11
        },
        {
            "skill" : "accuracy",
            "amount" : 1
        },
        {
            "skill" : "range",
            "amount" : -3
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 60
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 36,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 2.5
},
{
	"_id" : 313,
	"name" : "armoury key",
    "description" : "A key the Anglham Castle armoury",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : false,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.01
},
{
	"_id" : 314,
	"name" : "bronze hatchet",
    "description" : "A woodcutting axe made of bronze",
    "isNamePlural" : false,
	"cost" : 30,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
		{
			"skill" : "accuracy",
			"amount" : 1
		},
		{
			"skill" : "strength",
			"amount" : 1
		}
	],
	"equippableRequirements" : [
        {
            "skill" : "forestry",
            "amount" : 1
        }
    ],
	"equipmentType" : "weapon",
	"equipmentSpriteId" : 9,
	"equipmentSpriteSheet" : "weapon1",
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "smithing",
		"amount" : 25
	},
    "recipe" : [
        {
            "desc" : "bronze bar",
            "itemId" : 70,
            "amount" : 1
        }
    ],
    "metalType" : "bronze",
    "weight": 1.25,
    "weaponSpeed" : 5
},
{
	"_id" : 315,
	"name" : "iron hatchet",
    "description" : "A woodcutting axe made of iron",
    "isNamePlural" : false,
	"cost" : 100,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
		{
			"skill" : "accuracy",
			"amount" : 2
		},
		{
			"skill" : "strength",
			"amount" : 2
		}
	],
	"equippableRequirements" : [
        {
            "skill" : "forestry",
            "amount" : 10
        }
    ],
	"equipmentType" : "weapon",
	"equipmentSpriteId" : 15,
	"equipmentSpriteSheet" : "weapon1",
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "smithing",
		"amount" : 35
	},
    "recipe" : [
        {
            "desc" : "iron bar",
            "itemId" : 148,
            "amount" : 1
        }
    ],
    "metalType" : "iron",
    "weight": 1.25,
    "weaponSpeed" : 5
},
{
	"_id" : 316,
	"name" : "steel hatchet",
    "description" : "A woodcutting axe made of steel",
    "isNamePlural" : false,
	"cost" : 250,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
		{
			"skill" : "accuracy",
			"amount" : 3
		},
		{
			"skill" : "strength",
			"amount" : 3
		}
	],
	"equippableRequirements" : [
        {
            "skill" : "forestry",
            "amount" : 20
        }
    ],
	"equipmentType" : "weapon",
	"equipmentSpriteId" : 16,
	"equipmentSpriteSheet" : "weapon1",
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "smithing",
		"amount" : 50
	},
    "recipe" : [
        {
            "desc" : "steel bar",
            "itemId" : 143,
            "amount" : 1
        }
    ],
    "metalType" : "steel",
    "weight": 1.25,
    "weaponSpeed" : 5
},
{
	"_id" : 317,
	"name" : "palladium hatchet",
    "description" : "A woodcutting axe made of palladium",
    "isNamePlural" : false,
	"cost" : 600,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
		{
			"skill" : "accuracy",
			"amount" : 4
		},
		{
			"skill" : "strength",
			"amount" : 4
		}
	],
	"equippableRequirements" : [
        {
            "skill" : "forestry",
            "amount" : 30
        }
    ],
	"equipmentType" : "weapon",
	"equipmentSpriteId" : 17,
	"equipmentSpriteSheet" : "weapon1",
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "smithing",
		"amount" : 75
	},
    "recipe" : [
        {
            "desc" : "palladium bar",
            "itemId" : 144,
            "amount" : 1
        }
    ],
    "metalType" : "palladium",
    "weight": 1.25,
    "weaponSpeed" : 5
},
{
	"_id" : 318,
	"name" : "coronium hatchet",
    "description" : "A woodcutting axe made of coronium",
    "isNamePlural" : false,
	"cost" : 5000,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
		{
			"skill" : "accuracy",
			"amount" : 5
		},
		{
			"skill" : "strength",
			"amount" : 5
		}
	],
	"equippableRequirements" : [
        {
            "skill" : "forestry",
            "amount" : 40
        }
    ],
	"equipmentType" : "weapon",
	"equipmentSpriteId" : 18,
	"equipmentSpriteSheet" : "weapon1",
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "smithing",
		"amount" : 150
	},
    "recipe" : [
        {
            "desc" : "coronium bar",
            "itemId" : 145,
            "amount" : 1
        }
    ],
    "metalType" : "coronium",
    "weight": 1.25,
    "weaponSpeed" : 5
},
{
	"_id" : 319,
	"name" : "celadon hatchet",
    "description" : "A woodcutting axe made of celadium metal",
    "isNamePlural" : false,
	"cost" : 10000,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
		{
			"skill" : "accuracy",
			"amount" : 6
		},
		{
			"skill" : "strength",
			"amount" : 6
		}
	],
	"equippableRequirements" : [
        {
            "skill" : "forestry",
            "amount" : 70
        }
    ],
	"equipmentType" : "weapon",
	"equipmentSpriteId" : 23,
	"equipmentSpriteSheet" : "weapon1",
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "smithing",
		"amount" : 300
	},
    "recipe" : [
        {
            "desc" : "celadium bar",
            "itemId" : 253,
            "amount" : 1
        }
    ],
    "metalType" : "celadium",
    "weight": 1.25,
    "weaponSpeed" : 5
},
{
	"_id" : 320,
	"name" : "red headband",
    "description" : "A red headband",
    "isNamePlural" : false,
	"cost" : 100,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "strength",
            "amount" : 2
        },
        {
            "skill" : "accuracy",
            "amount" : 2
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 37,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.1
},
{
	"_id" : 321,
	"name" : "raw game meat",
    "description" : "Raw meat from a wild animal",
    "isNamePlural" : true,
	"cost" : 5,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.5
},
{
	"_id" : 322,
	"name" : "game meat",
    "description" : "Lean game meat from a wild animal",
    "isNamePlural" : true,
	"cost" : 10,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"eat"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "hitpoints",
			    "amount" : 5
            }
		}
	],
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : 0.75,
	"expFromObtaining" : {
		"skill" : "cooking",
		"amount" : 20
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.4
},
{
	"_id" : 323,
	"name" : "brown bear paw",
    "description" : "That's a big paw",
    "isNamePlural" : false,
	"cost" : 100,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : null,
    "useItemOnItemActions" : null,
    "weight": 0.25
},
{
	"_id" : 324,
	"name" : "black bear paw",
    "description" : "That's a big paw",
    "isNamePlural" : false,
	"cost" : 150,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : null,
    "useItemOnItemActions" : null,
    "weight": 0.25
},
{
	"_id" : 325,
	"name" : "burnt food",
    "description" : "It's a bit too well-done",
    "isNamePlural" : true,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : null,
    "useItemOnItemActions" : null,
    "weight": 0.1
},
{
	"_id" : 326,
	"name" : "arrow shafts",
    "description" : "Arrows shafts cut from a log",
    "isNamePlural" : true,
	"cost" : 1,
	"isStackable" : true,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 1
    },
    "recipe" : [
        {
            "desc" : "logs",
            "itemId" : 64,
            "amount" : 1
        }
    ],
    "weight": 0
},
{
	"_id" : 327,
	"name" : "headless arrows",
    "description" : "They're just missing some arrowheads",
    "isNamePlural" : true,
	"cost" : 2,
	"isStackable" : true,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 1
    },
    "recipe" : [
        {
            "desc" : "arrow shafts",
            "itemId" : 326,
            "amount" : 1
        },
        {
            "desc" : "feather",
            "itemId" : 340,
            "amount" : 1
        }
    ],
    "useItemOnItemActions" : [
		{
            "targetItemId" : 328,
            "skillToCreate" : "crafting",
            "canCreateMultiple" : false,
			"resultItems" : [
                {
                    "id" : 334,
                    "amount" : 5,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 327,
                    "amount" : 5,
                    "isIOU" : false
                },
                {
                    "id" : 328,
                    "amount" : 5,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        },
        {
            "targetItemId" : 329,
            "skillToCreate" : "crafting",
            "canCreateMultiple" : false,
			"resultItems" : [
                {
                    "id" : 335,
                    "amount" : 5,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 327,
                    "amount" : 5,
                    "isIOU" : false
                },
                {
                    "id" : 329,
                    "amount" : 5,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        },
        {
            "targetItemId" : 330,
            "skillToCreate" : "crafting",
            "canCreateMultiple" : false,
			"resultItems" : [
                {
                    "id" : 336,
                    "amount" : 5,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 327,
                    "amount" : 5,
                    "isIOU" : false
                },
                {
                    "id" : 330,
                    "amount" : 5,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        },
        {
            "targetItemId" : 331,
            "skillToCreate" : "crafting",
            "canCreateMultiple" : false,
			"resultItems" : [
                {
                    "id" : 337,
                    "amount" : 5,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 327,
                    "amount" : 5,
                    "isIOU" : false
                },
                {
                    "id" : 331,
                    "amount" : 5,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        },
        {
            "targetItemId" : 332,
            "skillToCreate" : "crafting",
            "canCreateMultiple" : false,
			"resultItems" : [
                {
                    "id" : 338,
                    "amount" : 5,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 327,
                    "amount" : 5,
                    "isIOU" : false
                },
                {
                    "id" : 332,
                    "amount" : 5,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        },
        {
            "targetItemId" : 333,
            "skillToCreate" : "crafting",
            "canCreateMultiple" : false,
			"resultItems" : [
                {
                    "id" : 339,
                    "amount" : 5,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 327,
                    "amount" : 5,
                    "isIOU" : false
                },
                {
                    "id" : 333,
                    "amount" : 5,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        }
    ],
    "weight": 0
},
{
	"_id" : 328,
	"name" : "bronze arrowheads",
    "description" : "Arrowheads smithed from a bronze bar",
    "isNamePlural" : true,
	"cost" : 3,
	"isStackable" : true,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 5
    },
    "recipe" : [
        {
            "desc" : "bronze bar",
            "itemId" : 70,
            "amount" : 1
        }
    ],
    "metalType" : "bronze",
    "weight": 0
},
{
	"_id" : 329,
	"name" : "iron arrowheads",
    "description" : "Arrowheads smithed from an iron bar",
    "isNamePlural" : true,
	"cost" : 5,
	"isStackable" : true,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 7
    },
    "recipe" : [
        {
            "desc" : "iron bar",
            "itemId" : 148,
            "amount" : 1
        }
    ],
    "metalType" : "iron",
    "weight": 0
},
{
	"_id" : 330,
	"name" : "steel arrowheads",
    "description" : "Arrowheads smithed from a steel bar",
    "isNamePlural" : true,
	"cost" : 10,
	"isStackable" : true,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 10
    },
    "recipe" : [
        {
            "desc" : "steel bar",
            "itemId" : 143,
            "amount" : 1
        }
    ],
    "metalType" : "steel",
    "weight": 0
},
{
	"_id" : 331,
	"name" : "palladium arrowheads",
    "description" : "Arrowheads smithed from a palladium bar",
    "isNamePlural" : true,
	"cost" : 25,
	"isStackable" : true,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 15
    },
    "recipe" : [
        {
            "desc" : "palladium bar",
            "itemId" : 144,
            "amount" : 1
        }
    ],
    "metalType" : "palladium",
    "weight": 0
},
{
	"_id" : 332,
	"name" : "coronium arrowheads",
    "description" : "Arrowheads smithed from a coronium bar",
    "isNamePlural" : true,
	"cost" : 65,
	"isStackable" : true,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 30
    },
    "recipe" : [
        {
            "desc" : "coronium bar",
            "itemId" : 145,
            "amount" : 1
        }
    ],
    "metalType" : "coronium",
    "weight": 0
},
{
	"_id" : 333,
	"name" : "celadon arrowheads",
    "description" : "Arrowheads smithed from celadium metal",
    "isNamePlural" : true,
	"cost" : 125,
	"isStackable" : true,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 60
    },
    "recipe" : [
        {
            "desc" : "celadium bar",
            "itemId" : 253,
            "amount" : 1
        }
    ],
    "metalType" : "celadium",
    "weight": 0
},
{
	"_id" : 334,
	"name" : "bronze arrows",
    "description" : "Arrows tipped with bronze arrowheads",
    "isNamePlural" : true,
	"cost" : 3,
	"isStackable" : true,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "range",
            "amount" : 3
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "range",
			"amount" : 1
		}
	],
	"equipmentType" : "projectile",
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 5
    },
    "recipe" : [
        {
            "desc" : "headless arrows",
            "itemId" : 327,
            "amount" : 1
        },
        {
            "desc" : "bronze arrowheads",
            "itemId" : 328,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 0
},
{
	"_id" : 335,
	"name" : "iron arrows",
    "description" : "Arrows tipped with iron arrowheads",
    "isNamePlural" : true,
	"cost" : 7,
	"isStackable" : true,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "range",
            "amount" : 6
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "range",
			"amount" : 10
		}
	],
	"equipmentType" : "projectile",
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 10
    },
    "recipe" : [
        {
            "desc" : "headless arrows",
            "itemId" : 327,
            "amount" : 1
        },
        {
            "desc" : "iron arrowheads",
            "itemId" : 329,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 0
},
{
	"_id" : 336,
	"name" : "steel arrows",
    "description" : "Arrows tipped with steel arrowheads",
    "isNamePlural" : true,
	"cost" : 15,
	"isStackable" : true,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "range",
            "amount" : 9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "range",
			"amount" : 20
		}
	],
	"equipmentType" : "projectile",
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 15
    },
    "recipe" : [
        {
            "desc" : "headless arrows",
            "itemId" : 327,
            "amount" : 1
        },
        {
            "desc" : "steel arrowheads",
            "itemId" : 330,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 0
},
{
	"_id" : 337,
	"name" : "palladium arrows",
    "description" : "Arrows tipped with palladium arrowheads",
    "isNamePlural" : true,
	"cost" : 40,
	"isStackable" : true,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "range",
            "amount" : 12
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "range",
			"amount" : 30
		}
	],
	"equipmentType" : "projectile",
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 20
    },
    "recipe" : [
        {
            "desc" : "headless arrows",
            "itemId" : 327,
            "amount" : 1
        },
        {
            "desc" : "palladium arrowheads",
            "itemId" : 331,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 0
},
{
	"_id" : 338,
	"name" : "coronium arrows",
    "description" : "Arrows tipped with coronium arrowheads",
    "isNamePlural" : true,
	"cost" : 85,
	"isStackable" : true,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "range",
            "amount" : 15
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "range",
			"amount" : 40
		}
	],
	"equipmentType" : "projectile",
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 25
    },
    "recipe" : [
        {
            "desc" : "headless arrows",
            "itemId" : 327,
            "amount" : 1
        },
        {
            "desc" : "coronium arrowheads",
            "itemId" : 332,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 0
},
{
	"_id" : 339,
	"name" : "celadon arrows",
    "description" : "Arrows tipped with celadon arrowheads",
    "isNamePlural" : true,
	"cost" : 150,
	"isStackable" : true,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "range",
            "amount" : 18
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "range",
			"amount" : 70
		}
	],
	"equipmentType" : "projectile",
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 30
    },
    "recipe" : [
        {
            "desc" : "headless arrows",
            "itemId" : 327,
            "amount" : 1
        },
        {
            "desc" : "celadon arrowheads",
            "itemId" : 333,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 0
},
{
	"_id" : 340,
	"name" : "feathers",
    "description" : "Some bird feathers",
    "isNamePlural" : true,
	"cost" : 1,
	"isStackable" : true,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "useItemOnItemActions" : [
		{
            "targetItemId" : 326,
            "skillToCreate" : "crafting",
            "canCreateMultiple" : false,
			"resultItems" : [
                {
                    "id" : 327,
                    "amount" : 5,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 326,
                    "amount" : 5,
                    "isIOU" : false
                },
                {
                    "id" : 340,
                    "amount" : 5,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        }
    ],
    "weight": 0
},
{
	"_id" : 341,
	"name" : "wooden bow",
    "description" : "A bow carved out from a piece of wood",
    "isNamePlural" : false,
	"cost" : 30,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
		{
			"skill" : "range",
			"amount" : 4
		}
	],
	"equippableRequirements" : [
		{
			"skill" : "range",
			"amount" : 1
		}
	],
	"equipmentType" : "weapon",
	"equipmentSpriteId" : 24,
	"equipmentSpriteSheet" : "weapon1",
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 10
    },
    "recipe" : [
        {
            "desc" : "string",
            "itemId" : 352,
            "amount" : 1
        },
        {
            "desc" : "unstrung bow",
            "itemId" : 347,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weaponSpeed" : 5,
    "removeEquipmentOnEquip" : [
        "shield"
    ],
    "weight": 1.25
},
{
	"_id" : 342,
	"name" : "pine bow",
    "description" : "A bow carved out from a piece of pine wood",
    "isNamePlural" : false,
	"cost" : 75,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
		{
			"skill" : "range",
			"amount" : 8
		}
	],
	"equippableRequirements" : [
		{
			"skill" : "range",
			"amount" : 10
		}
	],
	"equipmentType" : "weapon",
	"equipmentSpriteId" : 24,
	"equipmentSpriteSheet" : "weapon1",
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 20
    },
    "recipe" : [
        {
            "desc" : "string",
            "itemId" : 352,
            "amount" : 1
        },
        {
            "desc" : "unstrung pine bow",
            "itemId" : 348,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weaponSpeed" : 5,
    "removeEquipmentOnEquip" : [
        "shield"
    ],
    "weight": 1.25
},
{
	"_id" : 343,
	"name" : "oak bow",
    "description" : "A bow carved out from a piece of oak",
    "isNamePlural" : false,
	"cost" : 150,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
		{
			"skill" : "range",
			"amount" : 12
		}
	],
	"equippableRequirements" : [
		{
			"skill" : "range",
			"amount" : 20
		}
	],
	"equipmentType" : "weapon",
	"equipmentSpriteId" : 24,
	"equipmentSpriteSheet" : "weapon1",
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 35
    },
    "recipe" : [
        {
            "desc" : "string",
            "itemId" : 352,
            "amount" : 1
        },
        {
            "desc" : "unstrung oak bow",
            "itemId" : 349,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weaponSpeed" : 5,
    "removeEquipmentOnEquip" : [
        "shield"
    ],
    "weight": 1.25
},
{
	"_id" : 344,
	"name" : "palm bow",
    "description" : "A bow carved out from a piece of palm tree wood",
    "isNamePlural" : false,
	"cost" : 375,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
		{
			"skill" : "range",
			"amount" : 16
		}
	],
	"equippableRequirements" : [
		{
			"skill" : "range",
			"amount" : 30
		}
	],
	"equipmentType" : "weapon",
	"equipmentSpriteId" : 24,
	"equipmentSpriteSheet" : "weapon1",
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 50
    },
    "recipe" : [
        {
            "desc" : "string",
            "itemId" : 352,
            "amount" : 1
        },
        {
            "desc" : "unstrung palm bow",
            "itemId" : 350,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weaponSpeed" : 5,
    "removeEquipmentOnEquip" : [
        "shield"
    ],
    "weight": 1.25
},
{
	"_id" : 345,
	"name" : "cherry bow",
    "description" : "A bow carved out from a piece of cherry blossom wood",
    "isNamePlural" : false,
	"cost" : 750,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
		{
			"skill" : "range",
			"amount" : 20
		}
	],
	"equippableRequirements" : [
		{
			"skill" : "range",
			"amount" : 40
		}
	],
	"equipmentType" : "weapon",
	"equipmentSpriteId" : 24,
	"equipmentSpriteSheet" : "weapon1",
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 75
    },
    "recipe" : [
        {
            "desc" : "string",
            "itemId" : 352,
            "amount" : 1
        },
        {
            "desc" : "unstrung cherry bow",
            "itemId" : 351,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weaponSpeed" : 5,
    "removeEquipmentOnEquip" : [
        "shield"
    ],
    "weight": 1.25
},
{
	"_id" : 346,
	"name" : "knife",
    "description" : "A sharp knife",
    "isNamePlural" : false,
	"cost" : 5,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : null,
    "useItemOnItemActions" : [
		{
            "targetItemId" : 64,
            "skillToCreate" : "crafting",
            "canCreateMultiple" : true,
			"resultItems" : [
                {
                    "id" : 326,
                    "amount" : 5,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 64,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        },
        {
            "targetItemId" : 64,
            "skillToCreate" : "crafting",
            "canCreateMultiple" : true,
			"resultItems" : [
                {
                    "id" : 347,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 64,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        },
        {
            "targetItemId" : 65,
            "skillToCreate" : "crafting",
            "canCreateMultiple" : true,
			"resultItems" : [
                {
                    "id" : 348,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 65,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        },
        {
            "targetItemId" : 66,
            "skillToCreate" : "crafting",
            "canCreateMultiple" : true,
			"resultItems" : [
                {
                    "id" : 349,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 66,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        },
        {
            "targetItemId" : 67,
            "skillToCreate" : "crafting",
            "canCreateMultiple" : true,
			"resultItems" : [
                {
                    "id" : 350,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 67,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        },
        {
            "targetItemId" : 68,
            "skillToCreate" : "crafting",
            "canCreateMultiple" : true,
			"resultItems" : [
                {
                    "id" : 351,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 68,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        },
        {
            "targetItemId" : 353,
            "skillToCreate" : "crafting",
            "canCreateMultiple" : true,
			"resultItems" : [
                {
                    "id" : 359,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 353,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        },
        {
            "targetItemId" : 356,
            "skillToCreate" : "crafting",
            "canCreateMultiple" : true,
			"resultItems" : [
                {
                    "id" : 361,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 356,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        }
	],
    "weight": 0.2
},
{
	"_id" : 347,
	"name" : "unstrung bow",
    "description" : "I should attach a string to this",
    "isNamePlural" : false,
	"cost" : 15,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 10
    },
    "recipe" : [
        {
            "desc" : "logs",
            "itemId" : 64,
            "amount" : 1
        }
    ],
    "weight": 1.25
},
{
	"_id" : 348,
	"name" : "unstrung pine bow",
    "description" : "I should attach a string to this",
    "isNamePlural" : false,
	"cost" : 35,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 20
    },
    "recipe" : [
        {
            "desc" : "pine logs",
            "itemId" : 65,
            "amount" : 1
        }
    ],
    "weight": 1.25
},
{
	"_id" : 349,
	"name" : "unstrung oak bow",
    "description" : "I should attach a string to this",
    "isNamePlural" : false,
	"cost" : 75,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 35
    },
    "recipe" : [
        {
            "desc" : "oak logs",
            "itemId" : 66,
            "amount" : 1
        }
    ],
    "weight": 1.25
},
{
	"_id" : 350,
	"name" : "unstrung palm bow",
    "description" : "I should attach a string to this",
    "isNamePlural" : false,
	"cost" : 190,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 50
    },
    "recipe" : [
        {
            "desc" : "palm logs",
            "itemId" : 67,
            "amount" : 1
        }
    ],
    "weight": 1.25
},
{
	"_id" : 351,
	"name" : "unstrung cherry bow",
    "description" : "I should attach a string to this",
    "isNamePlural" : false,
	"cost" : 375,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 75
    },
    "recipe" : [
        {
            "desc" : "cherry logs",
            "itemId" : 68,
            "amount" : 1
        }
    ],
    "weight": 1.25
},
{
	"_id" : 352,
	"name" : "string",
    "description" : "How long is a piece of string",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : {
		"skill" : "crafting",
		"amount" : 8
	},
    "recipe" : [
        {
            "desc" : "flax",
            "itemId" : 378,
            "amount" : 1
        }
    ],
    "useItemOnItemActions" : [
		{
            "targetItemId" : 347,
            "skillToCreate" : "crafting",
            "canCreateMultiple" : true,
			"resultItems" : [
                {
                    "id" : 341,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 352,
                    "amount" : 1,
                    "isIOU" : false
                },
                {
                    "id" : 347,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        },
        {
            "targetItemId" : 348,
            "skillToCreate" : "crafting",
            "canCreateMultiple" : true,
			"resultItems" : [
                {
                    "id" : 342,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 352,
                    "amount" : 1,
                    "isIOU" : false
                },
                {
                    "id" : 348,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        },
        {
            "targetItemId" : 349,
            "skillToCreate" : "crafting",
            "canCreateMultiple" : true,
			"resultItems" : [
                {
                    "id" : 343,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 352,
                    "amount" : 1,
                    "isIOU" : false
                },
                {
                    "id" : 349,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        },
        {
            "targetItemId" : 350,
            "skillToCreate" : "crafting",
            "canCreateMultiple" : true,
			"resultItems" : [
                {
                    "id" : 344,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 352,
                    "amount" : 1,
                    "isIOU" : false
                },
                {
                    "id" : 350,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        },
        {
            "targetItemId" : 351,
            "skillToCreate" : "crafting",
            "canCreateMultiple" : true,
			"resultItems" : [
                {
                    "id" : 345,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 352,
                    "amount" : 1,
                    "isIOU" : false
                },
                {
                    "id" : 351,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        },
        {
            "targetItemId" : 359,
            "skillToCreate" : "crafting",
            "canCreateMultiple" : true,
			"resultItems" : [
                {
                    "id" : 360,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 352,
                    "amount" : 1,
                    "isIOU" : false
                },
                {
                    "id" : 359,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        },
        {
            "targetItemId" : 361,
            "skillToCreate" : "crafting",
            "canCreateMultiple" : true,
			"resultItems" : [
                {
                    "id" : 362,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 352,
                    "amount" : 1,
                    "isIOU" : false
                },
                {
                    "id" : 361,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        }
	],
    "weight": 0.001
},
{
	"_id" : 353,
	"name" : "wizard logs",
    "description" : "These logs are imbued with magic",
    "isNamePlural" : true,
	"cost" : 150,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "forestry",
		"amount" : 265
    },
    "recipe" : null,
    "metalType" : null,
    "weight": 2
},
{
	"_id" : 354,
	"name" : "wizard scroll",
    "description" : "A scroll carved from a wizard log",
    "isNamePlural" : false,
	"cost" : 75,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 120
    },
    "recipe" : [
        {
            "desc" : "wizard logs",
            "itemId" : 354,
            "amount" : 1
        }
    ],
    "weight": 0.1
},
{
	"_id" : 355,
	"name" : "magic scroll",
    "description" : "A very magical scroll used for magic spells",
    "isNamePlural" : false,
	"cost" : 15,
	"isStackable" : true,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "enchanting",
		"amount" : 15
	},
    "recipe" : [
        {
            "desc" : "wizard scroll",
            "itemId" : 355,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 0
},
{
	"_id" : 356,
	"name" : "deadwood logs",
    "description" : "These logs are oozing with blood",
    "isNamePlural" : true,
	"cost" : 175,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "forestry",
		"amount" : 300
    },
    "recipe" : null,
    "metalType" : null,
    "weight": 2
},
{
	"_id" : 357,
	"name" : "deadwood scroll",
    "description" : "A scroll carved from a deadwood log",
    "isNamePlural" : false,
	"cost" : 90,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 135
    },
    "recipe" : [
        {
            "desc" : "deadwood logs",
            "itemId" : 356,
            "amount" : 1
        }
    ],
    "weight": 0.1
},
{
	"_id" : 358,
	"name" : "blood scroll",
    "description" : "A magical scroll used for combat spells",
    "isNamePlural" : false,
	"cost" : 20,
	"isStackable" : true,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "enchanting",
		"amount" : 17
	},
    "recipe" : [
        {
            "desc" : "deadwood scroll",
            "itemId" : 357,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 0
},
{
	"_id" : 359,
	"name" : "unstrung wizard's bow",
    "description" : "I should attach a string to this",
    "isNamePlural" : false,
	"cost" : 400,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 90
    },
    "recipe" : [
        {
            "desc" : "wizard logs",
            "itemId" : 353,
            "amount" : 1
        }
    ],
    "weight": 1.25
},
{
	"_id" : 360,
	"name" : "wizard's bow",
    "description" : "A bow carved out from a piece of wizard wood",
    "isNamePlural" : false,
	"cost" : 800,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
		{
			"skill" : "range",
			"amount" : 24
		}
	],
	"equippableRequirements" : [
		{
			"skill" : "range",
			"amount" : 50
		}
	],
	"equipmentType" : "weapon",
	"equipmentSpriteId" : 25,
	"equipmentSpriteSheet" : "weapon1",
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 85
    },
    "recipe" : [
        {
            "desc" : "string",
            "itemId" : 352,
            "amount" : 1
        },
        {
            "desc" : "unstrung wizard bow",
            "itemId" : 359,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weaponSpeed" : 5,
    "removeEquipmentOnEquip" : [
        "shield"
    ],
    "weight": 1.25
},
{
	"_id" : 361,
	"name" : "unstrung deadwood bow",
    "description" : "I should attach a string to this",
    "isNamePlural" : false,
	"cost" : 500,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 120
    },
    "recipe" : [
        {
            "desc" : "deadwood logs",
            "itemId" : 356,
            "amount" : 1
        }
    ],
    "weight": 1.25
},
{
	"_id" : 362,
	"name" : "deadwood bow",
    "description" : "A bow carved out from a piece of deadwood",
    "isNamePlural" : false,
	"cost" : 1000,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
		{
			"skill" : "range",
			"amount" : 28
		}
	],
	"equippableRequirements" : [
		{
			"skill" : "range",
			"amount" : 60
		}
	],
	"equipmentType" : "weapon",
	"equipmentSpriteId" : 26,
	"equipmentSpriteSheet" : "weapon1",
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 100
    },
    "recipe" : [
        {
            "desc" : "string",
            "itemId" : 352,
            "amount" : 1
        },
        {
            "desc" : "unstrung deadwood bow",
            "itemId" : 361,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weaponSpeed" : 5,
    "removeEquipmentOnEquip" : [
        "shield"
    ],
    "weight": 1.25
},
{
	"_id" : 363,
	"name" : "staff",
    "description" : "A wooden staff",
    "isNamePlural" : false,
	"cost" : 25,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
		{
			"skill" : "accuracy",
			"amount" : 2
        },
        {
			"skill" : "strength",
			"amount" : 2
		},
        {
			"skill" : "defense",
			"amount" : 4
		},
        {
			"skill" : "magic",
			"amount" : 4
		}
	],
	"equippableRequirements" : null,
	"equipmentType" : "weapon",
    "equipmentSpriteId" : 27,
    "equipmentSpriteSheet" : "weapon1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weaponSpeed" : 6,
    "weight": 2
},
{
	"_id" : 364,
	"name" : "bronze scimitar",
    "description" : "A sword with a deadly, curved blade",
    "isNamePlural" : false,
	"cost" : 54,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
		{
			"skill" : "accuracy",
			"amount" : 3
		},
		{
			"skill" : "strength",
			"amount" : 5
		}
	],
	"equippableRequirements" : [
		{
			"skill" : "accuracy",
			"amount" : 1
		}
	],
	"equipmentType" : "weapon",
	"equipmentSpriteId" : 4,
	"equipmentSpriteSheet" : "weapon1",
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "smithing",
		"amount" : 50
	},
    "recipe" : [
        {
            "desc" : "bronze bar",
            "itemId" : 70,
            "amount" : 2
        }
    ],
    "metalType" : "bronze",
    "weaponSpeed" : 4,
    "weight": 2
},
{
	"_id" : 365,
	"name" : "iron scimitar",
    "description" : "A sword with a deadly, curved blade",
    "isNamePlural" : false,
	"cost" : 180,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
		{
			"skill" : "accuracy",
			"amount" : 6
		},
		{
			"skill" : "strength",
			"amount" : 9
		}
	],
	"equippableRequirements" : [
		{
			"skill" : "accuracy",
			"amount" : 10
		}
	],
	"equipmentType" : "weapon",
	"equipmentSpriteId" : 5,
	"equipmentSpriteSheet" : "weapon1",
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "smithing",
		"amount" : 70
	},
    "recipe" : [
        {
            "desc" : "iron bar",
            "itemId" : 148,
            "amount" : 2
        }
    ],
    "metalType" : "iron",
    "weaponSpeed" : 4,
    "weight": 2
},
{
	"_id" : 366,
	"name" : "steel scimitar",
    "description" : "A sword with a deadly, curved blade",
    "isNamePlural" : false,
	"cost" : 450,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
		{
			"skill" : "accuracy",
			"amount" : 11
		},
		{
			"skill" : "strength",
			"amount" : 15
		}
	],
	"equippableRequirements" : [
		{
			"skill" : "accuracy",
			"amount" : 20
		}
	],
	"equipmentType" : "weapon",
	"equipmentSpriteId" : 6,
	"equipmentSpriteSheet" : "weapon1",
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "smithing",
		"amount" : 100
	},
    "recipe" : [
        {
            "desc" : "steel bar",
            "itemId" : 143,
            "amount" : 2
        }
    ],
    "metalType" : "steel",
    "weaponSpeed" : 4,
    "weight": 2
},
{
	"_id" : 367,
	"name" : "palladium scimitar",
    "description" : "A sword with a deadly, curved blade",
    "isNamePlural" : false,
	"cost" : 1080,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
		{
			"skill" : "accuracy",
			"amount" : 18
		},
		{
			"skill" : "strength",
			"amount" : 23
		}
	],
	"equippableRequirements" : [
		{
			"skill" : "accuracy",
			"amount" : 30
		}
	],
	"equipmentType" : "weapon",
	"equipmentSpriteId" : 7,
	"equipmentSpriteSheet" : "weapon1",
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "smithing",
		"amount" : 150
	},
    "recipe" : [
        {
            "desc" : "palladium bar",
            "itemId" : 144,
            "amount" : 2
        }
    ],
    "metalType" : "palladium",
    "weaponSpeed" : 4,
    "weight": 2
},
{
	"_id" : 368,
	"name" : "coronium scimitar",
    "description" : "A sword with a deadly, curved blade",
    "isNamePlural" : false,
	"cost" : 9000,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
		{
			"skill" : "accuracy",
			"amount" : 27
		},
		{
			"skill" : "strength",
			"amount" : 33
		}
	],
	"equippableRequirements" : [
		{
			"skill" : "accuracy",
			"amount" : 40
		}
	],
	"equipmentType" : "weapon",
	"equipmentSpriteId" : 8,
	"equipmentSpriteSheet" : "weapon1",
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "smithing",
		"amount" : 300
	},
    "recipe" : [
        {
            "desc" : "coronium bar",
            "itemId" : 145,
            "amount" : 2
        }
    ],
    "metalType" : "coronium",
    "weaponSpeed" : 4,
    "weight": 2
},
{
	"_id" : 369,
	"name" : "celadon scimitar",
    "description" : "A sword with a deadly, curved blade",
    "isNamePlural" : false,
	"cost" : 18000,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
		{
			"skill" : "accuracy",
			"amount" : 38
		},
		{
			"skill" : "strength",
			"amount" : 45
		}
	],
	"equippableRequirements" : [
		{
			"skill" : "accuracy",
			"amount" : 70
		}
	],
	"equipmentType" : "weapon",
	"equipmentSpriteId" : 22,
	"equipmentSpriteSheet" : "weapon1",
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "smithing",
		"amount" : 600
	},
    "recipe" : [
        {
            "desc" : "celadium bar",
            "itemId" : 253,
            "amount" : 2
        }
    ],
    "metalType" : "celadium",
    "weaponSpeed" : 4,
    "weight": 2
},
{
	"_id" : 370,
	"name" : "bronze chainmail body",
    "description" : "Protective body armour linked together from a series of rings",
    "isNamePlural" : false,
	"cost" : 100,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 9
        },
        {
            "skill" : "accuracy",
            "amount" : 2
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 1
		}
	],
	"equipmentType" : "chest",
    "equipmentSpriteId" : 16,
    "equipmentSpriteSheet" : "chest1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 75
    },
    "recipe" : [
        {
            "desc" : "bronze bar",
            "itemId" : 70,
            "amount" : 3
        }
    ],
    "metalType" : "bronze",
    "weight": 6
},
{
	"_id" : 371,
	"name" : "iron chainmail body",
    "description" : "Protective body armour linked together from a series of rings",
    "isNamePlural" : false,
	"cost" : 320,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 19
        },
        {
            "skill" : "accuracy",
            "amount" : 2
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 10
		}
	],
	"equipmentType" : "chest",
    "equipmentSpriteId" : 5,
    "equipmentSpriteSheet" : "chest1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 105
    },
    "recipe" : [
        {
            "desc" : "iron bar",
            "itemId" : 148,
            "amount" : 3
        }
    ],
    "metalType" : "iron",
    "weight": 6
},
{
	"_id" : 372,
	"name" : "steel chainmail body",
    "description" : "Protective body armour linked together from a series of rings",
    "isNamePlural" : false,
	"cost" : 800,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 31
        },
        {
            "skill" : "accuracy",
            "amount" : 2
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 20
		}
	],
	"equipmentType" : "chest",
    "equipmentSpriteId" : 17,
    "equipmentSpriteSheet" : "chest1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 150
    },
    "recipe" : [
        {
            "desc" : "steel bar",
            "itemId" : 143,
            "amount" : 3
        }
    ],
    "metalType" : "steel",
    "weight": 6
},
{
	"_id" : 373,
	"name" : "palladium chainmail body",
    "description" : "Protective body armour linked together from a series of rings",
    "isNamePlural" : false,
	"cost" : 2000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 45
        },
        {
            "skill" : "accuracy",
            "amount" : 2
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 30
		}
	],
	"equipmentType" : "chest",
    "equipmentSpriteId" : 18,
    "equipmentSpriteSheet" : "chest1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 225
    },
    "recipe" : [
        {
            "desc" : "palladium bar",
            "itemId" : 144,
            "amount" : 3
        }
    ],
    "metalType" : "palladium",
    "weight": 6
},
{
	"_id" : 374,
	"name" : "coronium chainmail body",
    "description" : "Protective body armour linked together from a series of rings",
    "isNamePlural" : false,
	"cost" : 17500,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 60
        },
        {
            "skill" : "accuracy",
            "amount" : 2
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 40
		}
	],
	"equipmentType" : "chest",
    "equipmentSpriteId" : 19,
    "equipmentSpriteSheet" : "chest1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 450
    },
    "recipe" : [
        {
            "desc" : "coronium bar",
            "itemId" : 145,
            "amount" : 3
        }
    ],
    "metalType" : "coronium",
    "weight": 6
},
{
	"_id" : 375,
	"name" : "coronium chainmail body (silver plating)",
    "description" : "Protective body armour linked together from a series of rings, plated in silver",
    "isNamePlural" : false,
	"cost" : 17500,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 60
        },
        {
            "skill" : "accuracy",
            "amount" : 2
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 40
		}
	],
	"equipmentType" : "chest",
    "equipmentSpriteId" : 22,
    "equipmentSpriteSheet" : "chest1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "coronium",
    "weight": 6
},
{
	"_id" : 376,
	"name" : "coronium chainmail body (gold plating)",
    "description" : "Protective body armour linked together from a series of rings, plated in gold",
    "isNamePlural" : false,
	"cost" : 35000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 60
        },
        {
            "skill" : "accuracy",
            "amount" : 2
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 40
		}
	],
	"equipmentType" : "chest",
    "equipmentSpriteId" : 21,
    "equipmentSpriteSheet" : "chest1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "coronium",
    "weight": 6
},
{
	"_id" : 377,
	"name" : "celadon chainmail body",
    "description" : "Protective body armour linked together from a series of rings",
    "isNamePlural" : false,
	"cost" : 35000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 72
        },
        {
            "skill" : "accuracy",
            "amount" : 2
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 70
		}
	],
	"equipmentType" : "chest",
    "equipmentSpriteId" : 20,
    "equipmentSpriteSheet" : "chest1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "smithing",
        "amount" : 900
    },
    "recipe" : [
        {
            "desc" : "celadium bar",
            "itemId" : 253,
            "amount" : 3
        }
    ],
    "metalType" : "celadium",
    "weight": 6
},
{
	"_id" : 378,
	"name" : "flax",
    "description" : "I can create some string from this plant",
    "isNamePlural" : true,
	"cost" : 3,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
	"equipmentSpriteId" : null,
	"equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : {
		"skill" : "harvesting",
		"amount" : 10
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.075
},
{
	"_id" : 379,
	"name" : "mansion key",
    "description" : "A key to Lord Percy's mansion",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : false,
	"isForMission" : true,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.01
},
{
	"_id" : 380,
	"name" : "monk's necklace",
    "description" : "A religious necklace worn by monks",
    "isNamePlural" : false,
	"cost" : 200,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "accuracy",
            "amount" : 1
        },
        {
            "skill" : "defense",
            "amount" : 1
        },
        {
            "skill" : "strength",
            "amount" : 1
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "neck",
    "equipmentSpriteId" : 7,
    "equipmentSpriteSheet" : "neck1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 40
    },
    "recipe" : [
        {
            "desc" : "silver bar",
            "itemId" : 71,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 0.05
},
{
	"_id" : 381,
	"name" : "pirate's bandana",
    "description" : "A red bandana with an eyepatch",
    "isNamePlural" : false,
	"cost" : 100,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "strength",
            "amount" : 2
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 38,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.2
},
{
	"_id" : 382,
	"name" : "kitchen key",
    "description" : "A silver key",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : false,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.01
},
{
	"_id" : 383,
	"name" : "pig iron bar",
    "description" : "A bar of low quality iron",
    "isNamePlural" : false,
	"cost" : 5,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : [
        {
            "desc" : "iron ore",
            "itemId" : 79,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 2
},
{
	"_id" : 384,
	"name" : "necklace mould",
    "description" : "Used for creating necklaces",
    "isNamePlural" : false,
	"cost" : 15,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : null,
    "weight": 0.1
},
{
	"_id" : 385,
	"name" : "monk's necklace mould",
    "description" : "Used for creating monk's necklaces",
    "isNamePlural" : false,
	"cost" : 25,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : null,
    "weight": 0.1
},
{
	"_id" : 386,
	"name" : "undercroft key",
    "description" : "A key used to leave the first room of the Undercroft",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : false,
	"isForMission" : true,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.01
},
{
	"_id" : 387,
	"name" : "undercroft key",
    "description" : "A key used to leave the second room of the Undercroft",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : false,
	"isForMission" : true,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.01
},
{
	"_id" : 388,
	"name" : "undercroft key",
    "description" : "A key used to leave the third room of the Undercroft",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : false,
	"isForMission" : true,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.01
},
{
	"_id" : 389,
	"name" : "undercroft key",
    "description" : "A key used to leave the fourth room of the Undercroft",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : false,
	"isForMission" : true,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.01
},
{
	"_id" : 390,
	"name" : "undercroft key",
    "description" : "A key used to leave the fifth room of the Undercroft",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : false,
	"isForMission" : true,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.01
},
{
	"_id" : 391,
	"name" : "undercroft key",
    "description" : "A key used to leave the sixth room of the Undercroft",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : false,
	"isForMission" : true,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.01
},
{
	"_id" : 392,
	"name" : "undercroft key",
    "description" : "A key used to leave the seventh room of the Undercroft",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : false,
	"isForMission" : true,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.01
},
{
	"_id" : 393,
	"name" : "undercroft key",
    "description" : "A key used to leave the eighth room of the Undercroft",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : false,
	"isForMission" : true,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.01
},
{
	"_id" : 394,
	"name" : "undercroft key",
    "description" : "A key used to leave the ninth room of the Undercroft",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : false,
	"isForMission" : true,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.01
},
{
	"_id" : 395,
	"name" : "undercroft key",
    "description" : "A key used to leave the tenth room of the Undercroft",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : false,
	"isForMission" : true,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.01
},
{
	"_id" : 396,
	"name" : "undercroft key",
    "description" : "A key used to leave the eleventh room of the Undercroft",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : false,
	"isForMission" : true,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.01
},
{
	"_id" : 397,
	"name" : "undercroft key",
    "description" : "A key used to leave the twelfth room of the Undercroft",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : false,
	"isForMission" : true,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.01
},
{
	"_id" : 398,
	"name" : "undercroft key",
    "description" : "A key used to leave the thirteenth room of the Undercroft",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : false,
	"isForMission" : true,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.01
},
{
	"_id" : 399,
	"name" : "undercroft key",
    "description" : "A key used to leave the fourteenth room of the Undercroft",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : false,
	"isForMission" : true,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.01
},
{
	"_id" : 400,
	"name" : "undercroft key",
    "description" : "A key used to leave the fifteenth room of the Undercroft",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : false,
	"isForMission" : true,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.01
},
{
	"_id" : 401,
	"name" : "undercroft key",
    "description" : "A key used to leave the sixteenth room of the Undercroft",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : false,
	"isForMission" : true,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.01
},
{
	"_id" : 402,
	"name" : "undercroft key",
    "description" : "A key used to leave the seventeenth room of the Undercroft",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : false,
	"isForMission" : true,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.01
},
{
	"_id" : 403,
	"name" : "undercroft key",
    "description" : "A key used to leave the eighteenth room of the Undercroft",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : false,
	"isForMission" : true,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.01
},
{
	"_id" : 404,
	"name" : "undercroft key",
    "description" : "A key used to leave the nineteenth room of the Undercroft",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : false,
	"isForMission" : true,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.01
},
{
	"_id" : 405,
	"name" : "undercroft key",
    "description" : "A key used to leave the twentieth room of the Undercroft",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : false,
	"isForMission" : true,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.01
},
{
	"_id" : 406,
	"name" : "undercroft key",
    "description" : "A key used to leave the twenty-first room of the Undercroft",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : false,
	"isForMission" : true,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.01
},
{
	"_id" : 407,
	"name" : "undercroft key",
    "description" : "A key used to leave the twenty-second room of the Undercroft",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : false,
	"isForMission" : true,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.01
},
{
	"_id" : 408,
	"name" : "celadon orb",
    "description" : "A magical orb given to me by Sato. It is glowing extremely bright",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : false,
	"isForMission" : true,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : [
		"rub"
	],
	"edibleEffects" : null,
    "edibleResult" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : null,
    "useItemOnItemActions" : null,
    "weight": 0.25
},
{
	"_id" : 409,
	"name" : "celadon orb",
    "description" : "A magical orb given to me by Sato. It is glowing fairly bright",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : false,
	"isForMission" : true,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : [
		"rub"
	],
	"edibleEffects" : null,
    "edibleResult" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : null,
    "useItemOnItemActions" : null,
    "weight": 0.25
},
{
	"_id" : 410,
	"name" : "celadon orb",
    "description" : "A magical orb given to me by Sato. It has a dim glow",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : false,
	"isForMission" : true,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : [
		"rub"
	],
	"edibleEffects" : null,
    "edibleResult" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : null,
    "useItemOnItemActions" : null,
    "weight": 0.25
},
{
	"_id" : 411,
	"name" : "celadon orb",
    "description" : "A magical orb given to me by Sato. It has a faint glow",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : false,
	"isForMission" : true,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : [
		"rub"
	],
	"edibleEffects" : null,
    "edibleResult" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : null,
    "useItemOnItemActions" : null,
    "weight": 0.25
},
{
	"_id" : 412,
	"name" : "celadon orb",
    "description" : "A magical orb given to me by Sato. It is just barely glowing still",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : false,
	"isForMission" : true,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : [
		"rub"
	],
	"edibleEffects" : null,
    "edibleResult" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : null,
    "useItemOnItemActions" : null,
    "weight": 0.25
},
{
	"_id" : 413,
	"name" : "celadon orb",
    "description" : "A magical orb given to me by Sato. It is looking rather dull",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : false,
	"isForMission" : true,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : [
		"rub"
	],
	"edibleEffects" : null,
    "edibleResult" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : null,
    "useItemOnItemActions" : null,
    "weight": 0.25
},
{
	"_id" : 414,
	"name" : "red santa hat",
    "description" : "A red Santa hat",
    "isNamePlural" : false,
	"cost" : 100,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "magic",
            "amount" : 5
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 39,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.5
},
{
	"_id" : 415,
	"name" : "green santa hat",
    "description" : "A green Santa hat",
    "isNamePlural" : false,
	"cost" : 100,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "magic",
            "amount" : 5
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 40,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.5
},
{
	"_id" : 416,
	"name" : "blue santa hat",
    "description" : "A blue Santa hat",
    "isNamePlural" : false,
	"cost" : 100,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "magic",
            "amount" : 5
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 41,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.5
},
{
	"_id" : 417,
	"name" : "cyan christmas present (2023)",
    "description" : "A present from Santa",
    "isNamePlural" : false,
	"cost" : 100,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"open"
	],
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.6
},
{
	"_id" : 418,
	"name" : "green christmas present (2023)",
    "description" : "A present from Santa",
    "isNamePlural" : false,
	"cost" : 100,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"open"
	],
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.6
},
{
	"_id" : 419,
	"name" : "white christmas present (2023)",
    "description" : "A present from Santa",
    "isNamePlural" : false,
	"cost" : 100,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"open"
	],
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.6
},
{
	"_id" : 420,
	"name" : "red christmas present (2023)",
    "description" : "A present from Santa",
    "isNamePlural" : false,
	"cost" : 100,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"open"
	],
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.6
},
{
	"_id" : 421,
	"name" : "charred bones",
    "description" : "R.I.P.",
    "isNamePlural" : true,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.45
},
{
	"_id" : 422,
	"name" : "charred bone meal",
    "description" : "The result of grinding up some charred bones",
    "isNamePlural" : true,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : [
        {
            "desc" : "charred bones",
            "itemId" : 421,
            "amount" : 1
        }
    ],
    "useItemOnItemActions" : null,
    "weight": 0.225
},
{
	"_id" : 423,
	"name" : "empty bottle",
    "description" : "An empty glass bottle",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : null,
    "useItemOnItemActions" : null,
    "weight": 0.2
},
{
	"_id" : 424,
	"name" : "bottle of rum",
    "description" : "An alcoholic beverage",
    "isNamePlural" : false,
	"cost" : 10,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"drink"
	],
	"edibleEffects" : [
        {
            "type" : "Default",
            "effect": {
                "skill" : "accuracy",
			    "amount" : -0.1
            }
		},
        {
            "type" : "Default",
            "effect": {
                "skill" : "strength",
			    "amount" : 0.1
            }
		}
	],
    "edibleResult" : {
        "id" : 423,
        "amount" : 1,
        "isIOU" : false
    },
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : null,
    "useItemOnItemActions" : null,
    "weight": 0.3
},
{
	"_id" : 425,
	"name" : "message in a bottle",
    "description" : "There's something inside",
    "isNamePlural" : false,
	"cost" : 5,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"open"
	],
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.3
},
{
	"_id" : 426,
	"name" : "carbonado necklace",
    "description" : "A silver necklace with a carbonado gem",
    "isNamePlural" : false,
	"cost" : 2400,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "accuracy",
            "amount" : 2
        },
        {
            "skill" : "defense",
            "amount" : 3
        },
        {
            "skill" : "strength",
            "amount" : 2
        },
        {
            "skill" : "magic",
            "amount" : 2
        },
        {
            "skill" : "range",
            "amount" : 2
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "neck",
    "equipmentSpriteId" : 8,
    "equipmentSpriteSheet" : "neck1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 200
    },
    "recipe" : [
        {
            "desc" : "silver bar",
            "itemId" : 71,
            "amount" : 1
        },
        {
            "desc" : "carbonado gem",
            "itemId" : 87,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 0.05
},
{
	"_id" : 427,
	"name" : "gold amethyst necklace",
    "description" : "A golden necklace with an amethyst gem",
    "isNamePlural" : false,
	"cost" : 900,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "magic",
            "amount" : 5
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "neck",
    "equipmentSpriteId" : 9,
    "equipmentSpriteSheet" : "neck1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 250
    },
    "recipe" : [
        {
            "desc" : "gold bar",
            "itemId" : 72,
            "amount" : 1
        },
        {
            "desc" : "amethyst gem",
            "itemId" : 80,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 0.05
},
{
	"_id" : 428,
	"name" : "gold sapphire necklace",
    "description" : "A golden necklace with a sapphire gem",
    "isNamePlural" : false,
	"cost" : 1800,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "accuracy",
            "amount" : 5
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "neck",
    "equipmentSpriteId" : 10,
    "equipmentSpriteSheet" : "neck1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 300
    },
    "recipe" : [
        {
            "desc" : "gold bar",
            "itemId" : 72,
            "amount" : 1
        },
        {
            "desc" : "sapphire gem",
            "itemId" : 81,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 0.05
},
{
	"_id" : 429,
	"name" : "gold emerald necklace",
    "description" : "A golden necklace with an emerald gem",
    "isNamePlural" : false,
	"cost" : 2700,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "range",
            "amount" : 5
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "neck",
    "equipmentSpriteId" : 11,
    "equipmentSpriteSheet" : "neck1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 350
    },
    "recipe" : [
        {
            "desc" : "gold bar",
            "itemId" : 72,
            "amount" : 1
        },
        {
            "desc" : "emerald gem",
            "itemId" : 82,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 0.05
},
{
	"_id" : 430,
	"name" : "gold topaz necklace",
    "description" : "A golden necklace with a topaz gem",
    "isNamePlural" : false,
	"cost" : 3600,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 5
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "neck",
    "equipmentSpriteId" : 12,
    "equipmentSpriteSheet" : "neck1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 400
    },
    "recipe" : [
        {
            "desc" : "gold bar",
            "itemId" : 72,
            "amount" : 1
        },
        {
            "desc" : "topaz gem",
            "itemId" : 83,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 0.05
},
{
	"_id" : 431,
	"name" : "gold citrine necklace",
    "description" : "A golden necklace with a citrine gem",
    "isNamePlural" : false,
	"cost" : 4500,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "strength",
            "amount" : 5
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "neck",
    "equipmentSpriteId" : 13,
    "equipmentSpriteSheet" : "neck1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 450
    },
    "recipe" : [
        {
            "desc" : "gold bar",
            "itemId" : 72,
            "amount" : 1
        },
        {
            "desc" : "citrine gem",
            "itemId" : 84,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 0.05
},
{
	"_id" : 432,
	"name" : "gold ruby necklace",
    "description" : "A golden necklace with a ruby gem",
    "isNamePlural" : false,
	"cost" : 5400,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "accuracy",
            "amount" : 4
        },
        {
            "skill" : "defense",
            "amount" : 4
        },
        {
            "skill" : "strength",
            "amount" : 5
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "neck",
    "equipmentSpriteId" : 14,
    "equipmentSpriteSheet" : "neck1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 500
    },
    "recipe" : [
        {
            "desc" : "gold bar",
            "itemId" : 72,
            "amount" : 1
        },
        {
            "desc" : "ruby gem",
            "itemId" : 85,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 0.05
},
{
	"_id" : 433,
	"name" : "gold diamond necklace",
    "description" : "A golden necklace with a diamond gem",
    "isNamePlural" : false,
	"cost" : 6300,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "accuracy",
            "amount" : 5
        },
        {
            "skill" : "defense",
            "amount" : 4
        },
        {
            "skill" : "strength",
            "amount" : 4
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "neck",
    "equipmentSpriteId" : 15,
    "equipmentSpriteSheet" : "neck1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 550
    },
    "recipe" : [
        {
            "desc" : "gold bar",
            "itemId" : 72,
            "amount" : 1
        },
        {
            "desc" : "diamond gem",
            "itemId" : 86,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 0.05
},
{
	"_id" : 434,
	"name" : "gold carbonado necklace",
    "description" : "A golden necklace with a carbonado gem",
    "isNamePlural" : false,
	"cost" : 7200,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "accuracy",
            "amount" : 4
        },
        {
            "skill" : "defense",
            "amount" : 5
        },
        {
            "skill" : "strength",
            "amount" : 4
        },
        {
            "skill" : "magic",
            "amount" : 4
        },
        {
            "skill" : "range",
            "amount" : 4
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "neck",
    "equipmentSpriteId" : 16,
    "equipmentSpriteSheet" : "neck1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 600
    },
    "recipe" : [
        {
            "desc" : "gold bar",
            "itemId" : 72,
            "amount" : 1
        },
        {
            "desc" : "carbonado gem",
            "itemId" : 87,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 0.05
},
{
	"_id" : 435,
	"name" : "ember staff",
    "description" : "A magical wooden staff",
    "isNamePlural" : false,
	"cost" : 1000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
		{
			"skill" : "accuracy",
			"amount" : 2
        },
        {
			"skill" : "strength",
			"amount" : 2
		},
        {
			"skill" : "defense",
			"amount" : 4
		},
        {
			"skill" : "magic",
			"amount" : 10
		}
	],
	"equippableRequirements" : [
        {
            "skill" : "magic",
            "amount" : 40
        }
    ],
	"equipmentType" : "weapon",
    "equipmentSpriteId" : 27,
    "equipmentSpriteSheet" : "weapon1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weaponSpeed" : 6,
    "weight": 2
},
{
	"_id" : 436,
	"name" : "hydro staff",
    "description" : "A magical wooden staff",
    "isNamePlural" : false,
	"cost" : 1000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
		{
			"skill" : "accuracy",
			"amount" : 2
        },
        {
			"skill" : "strength",
			"amount" : 2
		},
        {
			"skill" : "defense",
			"amount" : 4
		},
        {
			"skill" : "magic",
			"amount" : 10
		}
	],
	"equippableRequirements" : [
        {
            "skill" : "magic",
            "amount" : 40
        }
    ],
	"equipmentType" : "weapon",
    "equipmentSpriteId" : 27,
    "equipmentSpriteSheet" : "weapon1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weaponSpeed" : 6,
    "weight": 2
},
{
	"_id" : 437,
	"name" : "forest staff",
    "description" : "A magical wooden staff",
    "isNamePlural" : false,
	"cost" : 1000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
		{
			"skill" : "accuracy",
			"amount" : 2
        },
        {
			"skill" : "strength",
			"amount" : 2
		},
        {
			"skill" : "defense",
			"amount" : 4
		},
        {
			"skill" : "magic",
			"amount" : 10
		}
	],
	"equippableRequirements" : [
        {
            "skill" : "magic",
            "amount" : 40
        }
    ],
	"equipmentType" : "weapon",
    "equipmentSpriteId" : 27,
    "equipmentSpriteSheet" : "weapon1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weaponSpeed" : 6,
    "weight": 2
},
{
	"_id" : 438,
	"name" : "knight's cape",
    "description" : "A cape worn by knights",
    "isNamePlural" : false,
	"cost" : 10000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 7
        },
        {
            "skill" : "strength",
            "amount" : 7
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "strength",
			"amount" : 50
		}
	],
	"equipmentType" : "back",
    "equipmentSpriteId" : 7,
    "equipmentSpriteSheet" : "back1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 1.5
},
{
	"_id" : 439,
	"name" : "magician's cape",
    "description" : "A magical cape",
    "isNamePlural" : false,
	"cost" : 10000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 7
        },
        {
            "skill" : "magic",
            "amount" : 7
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "magic",
			"amount" : 50
		}
	],
	"equipmentType" : "back",
    "equipmentSpriteId" : 8,
    "equipmentSpriteSheet" : "back1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 1.5
},
{
	"_id" : 440,
	"name" : "archer's cape",
    "description" : "A cape worn by archers",
    "isNamePlural" : false,
	"cost" : 10000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 7
        },
        {
            "skill" : "range",
            "amount" : 7
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "range",
			"amount" : 50
		}
	],
	"equipmentType" : "back",
    "equipmentSpriteId" : 9,
    "equipmentSpriteSheet" : "back1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 1.5
},
{
	"_id" : 441,
	"name" : "champion's cape",
    "description" : "A cape worn by champions",
    "isNamePlural" : false,
	"cost" : 15000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 5
        },
        {
            "skill" : "strength",
            "amount" : 5
        },
        {
            "skill" : "accuracy",
            "amount" : 5
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 50
		},
        {
			"skill" : "accuracy",
			"amount" : 50
		},
        {
			"skill" : "strength",
			"amount" : 50
		}
	],
	"equipmentType" : "back",
    "equipmentSpriteId" : 10,
    "equipmentSpriteSheet" : "back1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 1.5
},
{
	"_id" : 442,
	"name" : "treasure map",
    "description" : "It's a map to a hidden treasure location",
    "isNamePlural" : false,
	"cost" : 0,
	"isStackable" : false,
	"isTradeable" : false,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : [
		"look_at"
	],
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "isOnlyDiscardable" : true,
    "hasUniqueData" : true,
    "weight": 0.01
},
{
	"_id" : 443,
	"name" : "treasure map",
    "description" : "It's a map to a hidden treasure location",
    "isNamePlural" : false,
	"cost" : 0,
	"isStackable" : false,
	"isTradeable" : false,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : [
		"look_at"
	],
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "isOnlyDiscardable" : true,
    "hasUniqueData" : true,
    "weight": 0.01
},
{
	"_id" : 444,
	"name" : "shovel",
    "description" : "Good for digging holes",
    "isNamePlural" : false,
	"cost" : 15,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"dig"
	],
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : null,
    "weight": 1
},
{
	"_id" : 445,
	"name" : "halo",
    "description" : "It's a golden halo",
    "isNamePlural" : false,
	"cost" : 1000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 42,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0
},
{
	"_id" : 446,
	"name" : "coronium shield (gold trim)",
    "description" : "A heavy shield made from coronium, with gold trimming",
    "isNamePlural" : false,
	"cost" : 35000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 45
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 40
		}
	],
	"equipmentType" : "shield",
    "equipmentSpriteId" : 9,
    "equipmentSpriteSheet" : "shield1",
    "equipmentTrimSpriteId" : 0,
    "equipmentTrimSpriteSheet" : "shieldtrim1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "coronium",
    "weight": 6
},
{
	"_id" : 447,
	"name" : "coronium shield (silver plating and gold trim)",
    "description" : "A coronium shield plated in silver, with gold trimming",
    "isNamePlural" : false,
	"cost" : 17500,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 45
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 40
		}
	],
	"equipmentType" : "shield",
    "equipmentSpriteId" : 10,
    "equipmentSpriteSheet" : "shield1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "coronium",
    "weight": 6
},
{
	"_id" : 448,
	"name" : "coronium shield (gold plating and gold trim)",
    "description" : "A coronium shield plated in gold, with gold trimming",
    "isNamePlural" : false,
	"cost" : 17500,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 45
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 40
		}
	],
	"equipmentType" : "shield",
    "equipmentSpriteId" : 11,
    "equipmentSpriteSheet" : "shield1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "coronium",
    "weight": 6
},
{
	"_id" : 449,
	"name" : "celadon shield (gold trim)",
    "description" : "A heavy shield made of celadium metal, with gold trimming",
    "isNamePlural" : false,
	"cost" : 105000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 54
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 70
		}
	],
	"equipmentType" : "shield",
    "equipmentSpriteId" : 12,
    "equipmentSpriteSheet" : "shield1",
    "equipmentTrimSpriteId" : 0,
    "equipmentTrimSpriteSheet" : "shieldtrim1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "celadium",
    "weight": 6
},
{
	"_id" : 450,
	"name" : "coronium full helm (gold plume)",
    "description" : "A full-faced helmet made from coronium, with a gold plume",
    "isNamePlural" : false,
	"cost" : 10000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 32
        },
        {
            "skill" : "magic",
            "amount" : -6
        },
        {
            "skill" : "range",
            "amount" : -6
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 40
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 43,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "coronium",
    "weight": 4
},
{
	"_id" : 451,
	"name" : "coronium full helm (silver plating and gold plume)",
    "description" : "A coronium full-faced helmet plated in silver, with a gold plume",
    "isNamePlural" : false,
	"cost" : 10000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 32
        },
        {
            "skill" : "magic",
            "amount" : -6
        },
        {
            "skill" : "range",
            "amount" : -6
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 40
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 44,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "coronium",
    "weight": 4
},
{
	"_id" : 452,
	"name" : "coronium full helm (gold plating and gold plume)",
    "description" : "A coronium full-faced helmet plated in gold, with a gold plume",
    "isNamePlural" : false,
	"cost" : 10000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 32
        },
        {
            "skill" : "magic",
            "amount" : -6
        },
        {
            "skill" : "range",
            "amount" : -6
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 40
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 45,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "coronium",
    "weight": 4
},
{
	"_id" : 453,
	"name" : "celadon full helm (gold plume)",
    "description" : "A full-faced helmet made of celadium metal, with a gold plume",
    "isNamePlural" : false,
	"cost" : 20000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 38
        },
        {
            "skill" : "magic",
            "amount" : -6
        },
        {
            "skill" : "range",
            "amount" : -6
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 70
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 46,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "celadium",
    "weight": 4
},
{
	"_id" : 454,
	"name" : "coronium full helm (purple plume)",
    "description" : "A full-faced helmet made from coronium, with a purple plume",
    "isNamePlural" : false,
	"cost" : 10000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 32
        },
        {
            "skill" : "magic",
            "amount" : -6
        },
        {
            "skill" : "range",
            "amount" : -6
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 40
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 47,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "coronium",
    "weight": 4
},
{
	"_id" : 455,
	"name" : "celadon full helm (purple plume)",
    "description" : "A full-faced helmet made of celadium metal, with a purple plume",
    "isNamePlural" : false,
	"cost" : 20000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 38
        },
        {
            "skill" : "magic",
            "amount" : -6
        },
        {
            "skill" : "range",
            "amount" : -6
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 70
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 48,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "celadium",
    "weight": 4
},
{
	"_id" : 456,
	"name" : "treasure map",
    "description" : "It's a map to a hidden treasure location",
    "isNamePlural" : false,
	"cost" : 0,
	"isStackable" : false,
	"isTradeable" : false,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : [
		"look_at"
	],
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "isOnlyDiscardable" : true,
    "hasUniqueData" : true,
    "weight": 0.01
},
{
	"_id" : 457,
	"name" : "green headband",
    "description" : "A green headband",
    "isNamePlural" : false,
	"cost" : 100,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "accuracy",
            "amount" : 4
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 49,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.1
},
{
	"_id" : 458,
	"name" : "blue headband",
    "description" : "A blue headband",
    "isNamePlural" : false,
	"cost" : 100,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 4
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 50,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.1
},
{
	"_id" : 459,
	"name" : "celadon full helm (silver plating)",
    "description" : "A full-faced helmet made of celadium metal, plated in silver",
    "isNamePlural" : false,
	"cost" : 20000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 38
        },
        {
            "skill" : "magic",
            "amount" : -6
        },
        {
            "skill" : "range",
            "amount" : -6
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 70
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 14,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "celadium",
    "weight": 4
},
{
	"_id" : 460,
	"name" : "celadon helm (silver plating)",
    "description" : "An open-faced helmet made of celadium metal, plated in silver",
    "isNamePlural" : false,
	"cost" : 10000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 33
        },
        {
            "skill" : "accuracy",
            "amount" : 1
        },
        {
            "skill" : "magic",
            "amount" : -3
        },
        {
            "skill" : "range",
            "amount" : -3
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 70
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 19,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "celadium",
    "weight": 2
},
{
	"_id" : 461,
	"name" : "celadon chestplate (silver plating)",
    "description" : "Protective chest armour made of celadium metal, plated in silver",
    "isNamePlural" : false,
	"cost" : 70000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 82
        },
        {
            "skill" : "magic",
            "amount" : -15
        },
        {
            "skill" : "range",
            "amount" : -15
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 70
		}
	],
	"equipmentType" : "chest",
    "equipmentSpriteId" : 8,
    "equipmentSpriteSheet" : "chest1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "celadium",
    "weight": 10
},
{
	"_id" : 462,
	"name" : "celadon chainmail body (silver plating)",
    "description" : "Protective body armour linked together from a series of rings, plated in silver",
    "isNamePlural" : false,
	"cost" : 35000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 72
        },
        {
            "skill" : "accuracy",
            "amount" : 2
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 70
		}
	],
	"equipmentType" : "chest",
    "equipmentSpriteId" : 22,
    "equipmentSpriteSheet" : "chest1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "celadium",
    "weight": 6
},
{
	"_id" : 463,
	"name" : "celadon platelegs (silver plating)",
    "description" : "Protective leg armour made of celadium metal, plated in silver",
    "isNamePlural" : true,
	"cost" : 35000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 59
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 70
		}
	],
	"equipmentType" : "legs",
    "equipmentSpriteId" : 8,
    "equipmentSpriteSheet" : "legs1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "celadium",
    "weight": 6,
    "removeEquipmentOnEquip" : [
        "boots"
    ]
},
{
	"_id" : 464,
	"name" : "celadon shield (silver plating)",
    "description" : "A heavy shield made of celadium metal, plated in silver",
    "isNamePlural" : false,
	"cost" : 35000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 54
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 70
		}
	],
	"equipmentType" : "shield",
    "equipmentSpriteId" : 8,
    "equipmentSpriteSheet" : "shield1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "celadium",
    "weight": 6
},
{
	"_id" : 465,
	"name" : "celadon gloves (silver plating)",
    "description" : "These will protect my fingers",
    "isNamePlural" : true,
	"cost" : 10000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 6
        },
        {
            "skill" : "accuracy",
            "amount" : 5
        },
        {
            "skill" : "magic",
            "amount" : -3
        },
        {
            "skill" : "range",
            "amount" : -3
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "harvesting",
			"amount" : 70
		}
	],
	"equipmentType" : "gloves",
    "equipmentSpriteId" : 5,
    "equipmentSpriteSheet" : "gloves1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "celadium",
    "weight": 1.5
},
{
	"_id" : 466,
	"name" : "celadon full helm (silver plating and gold plume)",
    "description" : "A full-faced helmet made of celadium metal, plated in silver, with a gold plume",
    "isNamePlural" : false,
	"cost" : 20000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 38
        },
        {
            "skill" : "magic",
            "amount" : -6
        },
        {
            "skill" : "range",
            "amount" : -6
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 70
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 44,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "celadium",
    "weight": 4
},
{
	"_id" : 467,
	"name" : "celadon shield (silver plating and gold trim)",
    "description" : "A heavy shield made of celadium metal, plated in silver, with gold trimming",
    "isNamePlural" : false,
	"cost" : 35000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 54
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 70
		}
	],
	"equipmentType" : "shield",
    "equipmentSpriteId" : 10,
    "equipmentSpriteSheet" : "shield1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "celadium",
    "weight": 6
},
{
	"_id" : 468,
	"name" : "celadon full helm (gold plating)",
    "description" : "A full-faced helmet made of celadium metal, plated in gold",
    "isNamePlural" : false,
	"cost" : 20000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 38
        },
        {
            "skill" : "magic",
            "amount" : -6
        },
        {
            "skill" : "range",
            "amount" : -6
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 70
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 13,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "celadium",
    "weight": 4
},
{
	"_id" : 469,
	"name" : "celadon helm (gold plating)",
    "description" : "An open-faced helmet made of celadium metal, plated in gold",
    "isNamePlural" : false,
	"cost" : 10000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 33
        },
        {
            "skill" : "accuracy",
            "amount" : 1
        },
        {
            "skill" : "magic",
            "amount" : -3
        },
        {
            "skill" : "range",
            "amount" : -3
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 70
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 17,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "celadium",
    "weight": 2
},
{
	"_id" : 470,
	"name" : "celadon chestplate (gold plating)",
    "description" : "Protective chest armour made of celadium metal, plated in gold",
    "isNamePlural" : false,
	"cost" : 70000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 82
        },
        {
            "skill" : "magic",
            "amount" : -15
        },
        {
            "skill" : "range",
            "amount" : -15
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 70
		}
	],
	"equipmentType" : "chest",
    "equipmentSpriteId" : 7,
    "equipmentSpriteSheet" : "chest1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "celadium",
    "weight": 10
},
{
	"_id" : 471,
	"name" : "celadon chainmail body (gold plating)",
    "description" : "Protective body armour linked together from a series of rings, plated in gold",
    "isNamePlural" : false,
	"cost" : 35000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 72
        },
        {
            "skill" : "accuracy",
            "amount" : 2
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 70
		}
	],
	"equipmentType" : "chest",
    "equipmentSpriteId" : 21,
    "equipmentSpriteSheet" : "chest1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "celadium",
    "weight": 6
},
{
	"_id" : 472,
	"name" : "celadon platelegs (gold plating)",
    "description" : "Protective leg armour made of celadium metal, plated in gold",
    "isNamePlural" : true,
	"cost" : 35000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 59
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 70
		}
	],
	"equipmentType" : "legs",
    "equipmentSpriteId" : 7,
    "equipmentSpriteSheet" : "legs1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "celadium",
    "weight": 6,
    "removeEquipmentOnEquip" : [
        "boots"
    ]
},
{
	"_id" : 473,
	"name" : "celadon shield (gold plating)",
    "description" : "A heavy shield made of celadium metal, plated in gold",
    "isNamePlural" : false,
	"cost" : 35000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 54
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 70
		}
	],
	"equipmentType" : "shield",
    "equipmentSpriteId" : 7,
    "equipmentSpriteSheet" : "shield1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "celadium",
    "weight": 6
},
{
	"_id" : 474,
	"name" : "celadon gloves (gold plating)",
    "description" : "These will protect my fingers",
    "isNamePlural" : true,
	"cost" : 10000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 6
        },
        {
            "skill" : "accuracy",
            "amount" : 5
        },
        {
            "skill" : "magic",
            "amount" : -3
        },
        {
            "skill" : "range",
            "amount" : -3
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "harvesting",
			"amount" : 70
		}
	],
	"equipmentType" : "gloves",
    "equipmentSpriteId" : 8,
    "equipmentSpriteSheet" : "gloves1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "celadium",
    "weight": 1.5
},
{
	"_id" : 475,
	"name" : "celadon full helm (gold plating and gold plume)",
    "description" : "A full-faced helmet made of celadium metal, plated in gold, with a gold plume",
    "isNamePlural" : false,
	"cost" : 20000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 38
        },
        {
            "skill" : "magic",
            "amount" : -6
        },
        {
            "skill" : "range",
            "amount" : -6
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 70
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 45,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "celadium",
    "weight": 4
},
{
	"_id" : 476,
	"name" : "celadon shield (gold plating and gold trim)",
    "description" : "A heavy shield made of celadium metal, plated in gold, with gold trimming",
    "isNamePlural" : false,
	"cost" : 35000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 54
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 70
		}
	],
	"equipmentType" : "shield",
    "equipmentSpriteId" : 11,
    "equipmentSpriteSheet" : "shield1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "celadium",
    "weight": 6
},
{
	"_id" : 477,
	"name" : "wizard's gloves",
    "description" : "Magic gloves worn by wizards",
    "isNamePlural" : true,
	"cost" : 1000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 1
        },
        {
            "skill" : "magic",
            "amount" : 3
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "gloves",
    "equipmentSpriteId" : 9,
    "equipmentSpriteSheet" : "gloves1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.25
},
{
	"_id" : 478,
	"name" : "blue wizard's gloves",
    "description" : "Magic gloves worn by powerful wizards",
    "isNamePlural" : true,
	"cost" : 2000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 1
        },
        {
            "skill" : "magic",
            "amount" : 8
        }
    ],
	"equippableRequirements" : [
        {
            "skill" : "magic",
            "amount" : 40
        }
    ],
	"equipmentType" : "gloves",
    "equipmentSpriteId" : 10,
    "equipmentSpriteSheet" : "gloves1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.25
},
{
	"_id" : 479,
	"name" : "blood gloves",
    "description" : "Magic gloves worn by evil wizards",
    "isNamePlural" : true,
	"cost" : 2500,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 1
        },
        {
            "skill" : "magic",
            "amount" : 15
        }
    ],
	"equippableRequirements" : [
        {
            "skill" : "magic",
            "amount" : 50
        }
    ],
	"equipmentType" : "gloves",
    "equipmentSpriteId" : 11,
    "equipmentSpriteSheet" : "gloves1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.25
},
{
	"_id" : 480,
	"name" : "archer's gloves",
    "description" : "Gloves worn by expert archers",
    "isNamePlural" : true,
	"cost" : 5000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 1
        },
        {
            "skill" : "range",
            "amount" : 15
        }
    ],
	"equippableRequirements" : [
        {
            "skill" : "range",
            "amount" : 40
        }
    ],
	"equipmentType" : "gloves",
    "equipmentSpriteId" : 12,
    "equipmentSpriteSheet" : "gloves1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.25,
    "useItemOnItemActions" : [
        {
            "targetItemId" : 493,
            "skillToCreate" : null,
            "canCreateMultiple" : false,
			"resultItems" : [
                {
                    "id" : 611,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 480,
                    "amount" : 1,
                    "isIOU" : false
                },
                {
                    "id" : 493,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        },
        {
            "targetItemId" : 494,
            "skillToCreate" : null,
            "canCreateMultiple" : false,
			"resultItems" : [
                {
                    "id" : 612,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 480,
                    "amount" : 1,
                    "isIOU" : false
                },
                {
                    "id" : 494,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        },
        {
            "targetItemId" : 495,
            "skillToCreate" : null,
            "canCreateMultiple" : false,
			"resultItems" : [
                {
                    "id" : 613,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 480,
                    "amount" : 1,
                    "isIOU" : false
                },
                {
                    "id" : 495,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        },
        {
            "targetItemId" : 496,
            "skillToCreate" : null,
            "canCreateMultiple" : false,
			"resultItems" : [
                {
                    "id" : 614,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 480,
                    "amount" : 1,
                    "isIOU" : false
                },
                {
                    "id" : 496,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        },
        {
            "targetItemId" : 552,
            "skillToCreate" : null,
            "canCreateMultiple" : false,
			"resultItems" : [
                {
                    "id" : 615,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 480,
                    "amount" : 1,
                    "isIOU" : false
                },
                {
                    "id" : 552,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        },
        {
            "targetItemId" : 554,
            "skillToCreate" : null,
            "canCreateMultiple" : false,
			"resultItems" : [
                {
                    "id" : 616,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 480,
                    "amount" : 1,
                    "isIOU" : false
                },
                {
                    "id" : 554,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        }
    ]
},
{
	"_id" : 481,
	"name" : "goblin banker's key",
    "description" : "I wonder what this will let me unlock",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : false,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : false,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.01
},
{
	"_id" : 482,
	"name" : "legendary scimitar",
    "description" : "A sword with a deadly, curved blade",
    "isNamePlural" : false,
	"cost" : 36000,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
		{
			"skill" : "accuracy",
			"amount" : 45
		},
		{
			"skill" : "strength",
			"amount" : 53
		}
	],
	"equippableRequirements" : [
		{
			"skill" : "accuracy",
			"amount" : 80
		}
	],
	"equipmentType" : "weapon",
	"equipmentSpriteId" : 20,
	"equipmentSpriteSheet" : "weapon1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weaponSpeed" : 4,
    "weight": 2
},
{
	"_id" : 483,
	"name" : "legendary longsword",
    "description" : "A sharp sword crafted of a legendary metal",
    "isNamePlural" : false,
	"cost" : 40000,
	"isStackable" : false,
	"isTradeable" : true,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
		{
			"skill" : "accuracy",
			"amount" : 68
		},
		{
			"skill" : "strength",
			"amount" : 67
		}
	],
	"equippableRequirements" : [
		{
			"skill" : "accuracy",
			"amount" : 80
		}
	],
	"equipmentType" : "weapon",
	"equipmentSpriteId" : 20,
	"equipmentSpriteSheet" : "weapon1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weaponSpeed" : 5,
    "weight": 2
},
{
	"_id" : 484,
	"name" : "legendary battleaxe",
    "description" : "A dangerous battleaxe made of a legendary metal",
    "isNamePlural" : false,
	"cost" : 70000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "accuracy",
            "amount" : 69
        },
        {
            "skill" : "strength",
            "amount" : 86
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "accuracy",
			"amount" : 80
		}
	],
	"equipmentType" : "weapon",
    "equipmentSpriteId" : 21,
    "equipmentSpriteSheet" : "weapon1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 3.5,
    "weaponSpeed" : 6
},
{
	"_id" : 485,
	"name" : "legendary shield",
    "description" : "A heavy shield made of a legendary metal",
    "isNamePlural" : false,
	"cost" : 70000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 64
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 80
		}
	],
	"equipmentType" : "shield",
    "equipmentSpriteId" : 5,
    "equipmentSpriteSheet" : "shield1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 6
},
{
	"_id" : 486,
	"name" : "cave bear paw",
    "description" : "That's a big paw",
    "isNamePlural" : false,
	"cost" : 200,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : null,
    "useItemOnItemActions" : null,
    "weight": 0.5
},
{
	"_id" : 487,
	"name" : "damogui's staff",
    "description" : "A sinister staff",
    "isNamePlural" : false,
    "isNamePronoun" : true,
	"cost" : 25000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
		{
			"skill" : "accuracy",
			"amount" : 10
        },
        {
			"skill" : "strength",
			"amount" : 10
		},
        {
			"skill" : "defense",
			"amount" : 4
		},
        {
			"skill" : "magic",
			"amount" : 17
		}
	],
	"equippableRequirements" : [
        {
            "skill" : "magic",
            "amount" : 70
        }
    ],
	"equipmentType" : "weapon",
    "equipmentSpriteId" : 28,
    "equipmentSpriteSheet" : "weapon1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weaponSpeed" : 6,
    "weight": 3
},
{
	"_id" : 488,
	"name" : "leather",
    "description" : "Leather from a cow",
    "isNamePlural" : true,
	"cost" : 10,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 1.5
},
{
	"_id" : 489,
	"name" : "plains dragonleather",
    "description" : "Green leather from a Plains Dragon",
    "isNamePlural" : true,
	"cost" : 60,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 1.5
},
{
	"_id" : 490,
	"name" : "water dragonleather",
    "description" : "Blue leather from a Water Dragon",
    "isNamePlural" : true,
	"cost" : 90,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 1.5
},
{
	"_id" : 491,
	"name" : "fire dragonleather",
    "description" : "Red leather from a Fire Dragon",
    "isNamePlural" : true,
	"cost" : 120,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 1.5
},
{
	"_id" : 492,
	"name" : "leather body armour",
    "description" : "Protective leather armour",
    "isNamePlural" : true,
	"cost" : 45,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 8
        },
        {
            "skill" : "range",
            "amount" : 6
        },
        {
            "skill" : "magic",
            "amount" : -6
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "chest",
    "equipmentSpriteId" : 23,
    "equipmentSpriteSheet" : "chest1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 45
    },
    "recipe" : [
        {
            "desc" : "leather",
            "itemId" : 488,
            "amount" : 3
        }
    ],
    "metalType" : null,
    "weight": 3
},
{
	"_id" : 493,
	"name" : "leather bracers",
    "description" : "These will protected my forearms when firing arrows",
    "isNamePlural" : true,
	"cost" : 15,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 2
        },
        {
            "skill" : "range",
            "amount" : 3
        },
        {
            "skill" : "magic",
            "amount" : -3
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "gloves",
    "equipmentSpriteId" : 13,
    "equipmentSpriteSheet" : "gloves1",
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 15
    },
    "recipe" : [
        {
            "desc" : "leather",
            "itemId" : 488,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 1
},
{
	"_id" : 494,
	"name" : "plains dragonleather bracers",
    "description" : "These will protected my forearms when firing arrows",
    "isNamePlural" : true,
	"cost" : 600,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 3
        },
        {
            "skill" : "range",
            "amount" : 6
        },
        {
            "skill" : "magic",
            "amount" : -6
        }
    ],
	"equippableRequirements" : [
        {
            "skill" : "range",
            "amount" : 10
        }
    ],
	"equipmentType" : "gloves",
    "equipmentSpriteId" : 14,
    "equipmentSpriteSheet" : "gloves1",
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 60
    },
    "recipe" : [
        {
            "desc" : "plains dragonleather",
            "itemId" : 489,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 1
},
{
	"_id" : 495,
	"name" : "water dragonleather bracers",
    "description" : "These will protected my forearms when firing arrows",
    "isNamePlural" : true,
	"cost" : 750,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 4
        },
        {
            "skill" : "range",
            "amount" : 9
        },
        {
            "skill" : "magic",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
        {
            "skill" : "range",
            "amount" : 20
        }
    ],
	"equipmentType" : "gloves",
    "equipmentSpriteId" : 15,
    "equipmentSpriteSheet" : "gloves1",
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 75
    },
    "recipe" : [
        {
            "desc" : "water dragonleather",
            "itemId" : 490,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 1
},
{
	"_id" : 496,
	"name" : "fire dragonleather bracers",
    "description" : "These will protected my forearms when firing arrows",
    "isNamePlural" : true,
	"cost" : 900,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 5
        },
        {
            "skill" : "range",
            "amount" : 12
        },
        {
            "skill" : "magic",
            "amount" : -12
        }
    ],
	"equippableRequirements" : [
        {
            "skill" : "range",
            "amount" : 30
        }
    ],
	"equipmentType" : "gloves",
    "equipmentSpriteId" : 16,
    "equipmentSpriteSheet" : "gloves1",
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 90
    },
    "recipe" : [
        {
            "desc" : "fire dragonleather",
            "itemId" : 491,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 1
},
{
	"_id" : 497,
	"name" : "royal cape",
    "description" : "A cape worn by royalty",
    "isNamePlural" : false,
	"cost" : 5000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 3
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 1
		}
	],
	"equipmentType" : "back",
    "equipmentSpriteId" : 11,
    "equipmentSpriteSheet" : "back1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 1.5
},
{
	"_id" : 498,
	"name" : "leather boots",
    "description" : "A nice pair of leather boots",
    "isNamePlural" : true,
	"cost" : 25,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 2
        },
        {
            "skill" : "range",
            "amount" : 2
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "boots",
    "equipmentSpriteId" : 0,
    "equipmentSpriteSheet" : "boots1",
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 20
    },
    "recipe" : [
        {
            "desc" : "leather",
            "itemId" : 488,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 0.4
},
{
	"_id" : 499,
	"name" : "wizard's boots",
    "description" : "Magic boots worn by wizards",
    "isNamePlural" : true,
	"cost" : 1500,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 2
        },
        {
            "skill" : "magic",
            "amount" : 4
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "boots",
    "equipmentSpriteId" : 1,
    "equipmentSpriteSheet" : "boots1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.25
},
{
	"_id" : 500,
	"name" : "blue wizard's boots",
    "description" : "Magic boots worn by powerful wizards",
    "isNamePlural" : true,
	"cost" : 3000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 2
        },
        {
            "skill" : "magic",
            "amount" : 8
        }
    ],
	"equippableRequirements" : [
        {
            "skill" : "magic",
            "amount" : 40
        }
    ],
	"equipmentType" : "boots",
    "equipmentSpriteId" : 2,
    "equipmentSpriteSheet" : "boots1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.25
},
{
	"_id" : 501,
	"name" : "archer's boots",
    "description" : "Boots worn by expert archers",
    "isNamePlural" : true,
	"cost" : 5000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 2
        },
        {
            "skill" : "range",
            "amount" : 8
        }
    ],
	"equippableRequirements" : [
        {
            "skill" : "range",
            "amount" : 40
        }
    ],
	"equipmentType" : "boots",
    "equipmentSpriteId" : 3,
    "equipmentSpriteSheet" : "boots1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.25
},
{
	"_id" : 502,
	"name" : "black leather boots",
    "description" : "A nice pair of leather boots",
    "isNamePlural" : true,
	"cost" : 1000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 2
        },
        {
            "skill" : "range",
            "amount" : 2
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "boots",
    "equipmentSpriteId" : 4,
    "equipmentSpriteSheet" : "boots1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.4
},
{
	"_id" : 503,
	"name" : "leather gloves",
    "description" : "These will protect my fingers",
    "isNamePlural" : true,
	"cost" : 20,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 1
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "harvesting",
			"amount" : 1
        }
	],
	"equipmentType" : "gloves",
    "equipmentSpriteId" : 17,
    "equipmentSpriteSheet" : "gloves1",
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 15
    },
    "recipe" : [
        {
            "desc" : "leather",
            "itemId" : 488,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 0.25
},
{
	"_id" : 504,
	"name" : "plains dragonleather chaps",
    "description" : "A solid pair of chaps",
    "isNamePlural" : true,
	"cost" : 1200,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 6
        },
        {
            "skill" : "range",
            "amount" : 9
        },
        {
            "skill" : "magic",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
        {
            "skill" : "range",
            "amount" : 10
        }
    ],
	"equipmentType" : "legs",
    "equipmentSpriteId" : 16,
    "equipmentSpriteSheet" : "legs1",
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 120
    },
    "recipe" : [
        {
            "desc" : "plains dragonleather",
            "itemId" : 489,
            "amount" : 2
        }
    ],
    "metalType" : null,
    "weight": 2
},
{
	"_id" : 505,
	"name" : "water dragonleather chaps",
    "description" : "A solid pair of chaps",
    "isNamePlural" : true,
	"cost" : 1500,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 8
        },
        {
            "skill" : "range",
            "amount" : 12
        },
        {
            "skill" : "magic",
            "amount" : -12
        }
    ],
	"equippableRequirements" : [
        {
            "skill" : "range",
            "amount" : 20
        }
    ],
	"equipmentType" : "legs",
    "equipmentSpriteId" : 17,
    "equipmentSpriteSheet" : "legs1",
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 150
    },
    "recipe" : [
        {
            "desc" : "water dragonleather",
            "itemId" : 490,
            "amount" : 2
        }
    ],
    "metalType" : null,
    "weight": 2
},
{
	"_id" : 506,
	"name" : "fire dragonleather chaps",
    "description" : "A solid pair of chaps",
    "isNamePlural" : true,
	"cost" : 1800,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 10
        },
        {
            "skill" : "range",
            "amount" : 15
        },
        {
            "skill" : "magic",
            "amount" : -15
        }
    ],
	"equippableRequirements" : [
        {
            "skill" : "range",
            "amount" : 30
        }
    ],
	"equipmentType" : "legs",
    "equipmentSpriteId" : 18,
    "equipmentSpriteSheet" : "legs1",
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 180
    },
    "recipe" : [
        {
            "desc" : "fire dragonleather",
            "itemId" : 491,
            "amount" : 2
        }
    ],
    "metalType" : null,
    "weight": 2
},
{
	"_id" : 507,
	"name" : "leather chaps",
    "description" : "A solid pair of chaps",
    "isNamePlural" : true,
	"cost" : 30,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 5
        },
        {
            "skill" : "range",
            "amount" : 5
        },
        {
            "skill" : "magic",
            "amount" : -5
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "legs",
    "equipmentSpriteId" : 19,
    "equipmentSpriteSheet" : "legs1",
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 30
    },
    "recipe" : [
        {
            "desc" : "leather",
            "itemId" : 488,
            "amount" : 2
        }
    ],
    "metalType" : null,
    "weight": 2
},
{
	"_id" : 508,
	"name" : "empty turtle shell",
    "description" : "It's just a shell of its former self",
    "isNamePlural" : false,
	"cost" : 1,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : null,
    "useItemOnItemActions" : null,
    "weight": 0.1
},
{
	"_id" : 509,
	"name" : "goblin whistle",
    "description" : "It's a whistle carved out of wood",
    "isNamePlural" : false,
	"cost" : 5,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"blow"
	],
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.01
},
{
	"_id" : 510,
	"name" : "legendary gloves",
    "description" : "These will protect my fingers",
    "isNamePlural" : true,
	"cost" : 18000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 7
        },
        {
            "skill" : "accuracy",
            "amount" : 7
        },
        {
            "skill" : "strength",
            "amount" : 7
        },
        {
            "skill" : "magic",
            "amount" : -3
        },
        {
            "skill" : "range",
            "amount" : -3
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "harvesting",
			"amount" : 80
		}
	],
	"equipmentType" : "gloves",
    "equipmentSpriteId" : 18,
    "equipmentSpriteSheet" : "gloves1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 1.5
},
{
	"_id" : 511,
	"name" : "potion of stamina (2)",
    "description" : "A stamina-restoring potion",
    "isNamePlural" : false,
	"cost" : 20,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"drink"
	],
	"edibleEffects" : [
        {
            "type" : "StaminaRestoration",
            "effect": {
			    "amount" : 5000
            }
		}
    ],
    "edibleResult" : {
        "id" : 512,
        "amount" : 1,
        "isIOU" : false
    },
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : {
        "skill" : "potionmaking",
        "amount" : 50
    },
    "recipe" : [
        {
            "desc" : "vial",
            "itemId" : 259,
            "amount" : 1
        },
        {
            "desc" : "aruba root",
            "itemId" : 283,
            "amount" : 1
        },
        {
            "desc" : "golden koi",
            "itemId" : 513,
            "amount" : 1
        }
    ],
    "useItemOnItemActions" : null,
    "weight": 0.2
},
{
	"_id" : 512,
	"name" : "potion of stamina (1)",
    "description" : "A stamina-restoring potion",
    "isNamePlural" : false,
	"cost" : 10,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"drink"
	],
	"edibleEffects" : [
        {
            "type" : "StaminaRestoration",
            "effect": {
			    "amount" : 5000
            }
		}
    ],
    "edibleResult" : {
        "id" : 259,
        "amount" : 1,
        "isIOU" : false
    },
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
    "expFromObtaining" : null,
    "recipe" : null,
    "useItemOnItemActions" : [
		{
            "targetItemId" : 512,
            "skillToCreate" : null,
            "canCreateMultiple" : false,
			"resultItems" : [
                {
                    "id" : 511,
                    "amount" : 1,
                    "isIOU" : false
                },
                {
                    "id" : 259,
                    "amount" : 1,
                    "isIOU" : false
                }
            ],
            "itemsToRemove" : [
                {
                    "id" : 512,
                    "amount" : 2,
                    "isIOU" : false
                }
            ],
			"resultEntityId" : null
        }
	],
    "weight": 0.15
},
{
	"_id" : 513,
	"name" : "golden koi",
    "description" : "A colorful, ornamental fish",
    "isNamePlural" : false,
	"cost" : 50,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : 0.85,
	"expFromObtaining" : {
		"skill" : "fishing",
		"amount" : 110
	},
    "recipe" : null,
    "metalType" : null,
    "weight": 0.3
},
{
	"_id" : 514,
	"name" : "bronze platelegs (gold trim)",
    "description" : "Protective leg armour made of bronze, with gold trimming",
    "isNamePlural" : true,
	"cost" : 1000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 8
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 1
		}
	],
	"equipmentType" : "legs",
    "equipmentSpriteId" : 0,
    "equipmentSpriteSheet" : "legs1",
    "equipmentTrimSpriteId" : 0,
    "equipmentTrimSpriteSheet" : "legstrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "bronze",
    "weight": 6,
    "removeEquipmentOnEquip" : [
        "boots"
    ]
},
{
	"_id" : 515,
	"name" : "bronze chestplate (gold trim)",
    "description" : "Protective chest armour made of bronze, with gold trimming",
    "isNamePlural" : false,
	"cost" : 2000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 12
        },
        {
            "skill" : "magic",
            "amount" : -15
        },
        {
            "skill" : "range",
            "amount" : -15
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 1
		}
	],
	"equipmentType" : "chest",
    "equipmentSpriteId" : 0,
    "equipmentSpriteSheet" : "chest1",
    "equipmentTrimSpriteId" : 0,
    "equipmentTrimSpriteSheet" : "chesttrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "bronze",
    "weight": 10
},
{
	"_id" : 516,
	"name" : "bronze shield (gold trim)",
    "description" : "A heavy shield made from bronze, with gold trimming",
    "isNamePlural" : false,
	"cost" : 1000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 7
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 1
		}
	],
	"equipmentType" : "shield",
    "equipmentSpriteId" : 0,
    "equipmentSpriteSheet" : "shield1",
    "equipmentTrimSpriteId" : 0,
    "equipmentTrimSpriteSheet" : "shieldtrim1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "bronze",
    "weight": 6
},
{
	"_id" : 517,
	"name" : "bronze full helm (gold trim)",
    "description" : "A full-faced helmet made of bronze, with gold trimming",
    "isNamePlural" : false,
	"cost" : 600,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 6
        },
        {
            "skill" : "magic",
            "amount" : -6
        },
        {
            "skill" : "range",
            "amount" : -6
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 1
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 7,
    "equipmentSpriteSheet" : "helmet1",
    "equipmentTrimSpriteId" : 0,
    "equipmentTrimSpriteSheet" : "helmettrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "bronze",
    "weight": 4
},
{
	"_id" : 518,
	"name" : "iron platelegs (gold trim)",
    "description" : "Protective leg armour made of iron, with gold trimming",
    "isNamePlural" : true,
	"cost" : 3200,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 17
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 10
		}
	],
	"equipmentType" : "legs",
    "equipmentSpriteId" : 6,
    "equipmentSpriteSheet" : "legs1",
    "equipmentTrimSpriteId" : 0,
    "equipmentTrimSpriteSheet" : "legstrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "iron",
    "weight": 6,
    "removeEquipmentOnEquip" : [
        "boots"
    ]
},
{
	"_id" : 519,
	"name" : "iron chestplate (gold trim)",
    "description" : "Protective chest armour made of iron, with gold trimming",
    "isNamePlural" : false,
	"cost" : 6400,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 25
        },
        {
            "skill" : "magic",
            "amount" : -15
        },
        {
            "skill" : "range",
            "amount" : -15
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 10
		}
	],
	"equipmentType" : "chest",
    "equipmentSpriteId" : 6,
    "equipmentSpriteSheet" : "chest1",
    "equipmentTrimSpriteId" : 0,
    "equipmentTrimSpriteSheet" : "chesttrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "iron",
    "weight": 10
},
{
	"_id" : 520,
	"name" : "iron shield (gold trim)",
    "description" : "A heavy shield made from iron, with gold trimming",
    "isNamePlural" : false,
	"cost" : 3200,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 15
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 10
		}
	],
	"equipmentType" : "shield",
    "equipmentSpriteId" : 6,
    "equipmentSpriteSheet" : "shield1",
    "equipmentTrimSpriteId" : 0,
    "equipmentTrimSpriteSheet" : "shieldtrim1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "iron",
    "weight": 6
},
{
	"_id" : 521,
	"name" : "iron full helm (gold trim)",
    "description" : "A full-faced helmet made of iron, with gold trimming",
    "isNamePlural" : false,
	"cost" : 2000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 11
        },
        {
            "skill" : "magic",
            "amount" : -6
        },
        {
            "skill" : "range",
            "amount" : -6
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 10
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 8,
    "equipmentSpriteSheet" : "helmet1",
    "equipmentTrimSpriteId" : 0,
    "equipmentTrimSpriteSheet" : "helmettrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "iron",
    "weight": 4
},
{
	"_id" : 522,
	"name" : "steel platelegs (gold trim)",
    "description" : "Protective leg armour made of steel, with gold trimming",
    "isNamePlural" : true,
	"cost" : 8000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 27
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 20
		}
	],
	"equipmentType" : "legs",
    "equipmentSpriteId" : 1,
    "equipmentSpriteSheet" : "legs1",
    "equipmentTrimSpriteId" : 0,
    "equipmentTrimSpriteSheet" : "legstrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "steel",
    "weight": 6,
    "removeEquipmentOnEquip" : [
        "boots"
    ]
},
{
	"_id" : 523,
	"name" : "steel chestplate (gold trim)",
    "description" : "Protective chest armour made of steel, with gold trimming",
    "isNamePlural" : false,
	"cost" : 16000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 39
        },
        {
            "skill" : "magic",
            "amount" : -15
        },
        {
            "skill" : "range",
            "amount" : -15
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 20
		}
	],
	"equipmentType" : "chest",
    "equipmentSpriteId" : 1,
    "equipmentSpriteSheet" : "chest1",
    "equipmentTrimSpriteId" : 0,
    "equipmentTrimSpriteSheet" : "chesttrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "steel",
    "weight": 10
},
{
	"_id" : 524,
	"name" : "steel shield (gold trim)",
    "description" : "A heavy shield made from steel, with gold trimming",
    "isNamePlural" : false,
	"cost" : 8000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 24
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 20
		}
	],
	"equipmentType" : "shield",
    "equipmentSpriteId" : 1,
    "equipmentSpriteSheet" : "shield1",
    "equipmentTrimSpriteId" : 0,
    "equipmentTrimSpriteSheet" : "shieldtrim1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "steel",
    "weight": 6
},
{
	"_id" : 525,
	"name" : "steel full helm (gold trim)",
    "description" : "A full-faced helmet made from steel, with gold trimming",
    "isNamePlural" : false,
	"cost" : 2500,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 17
        },
        {
            "skill" : "magic",
            "amount" : -6
        },
        {
            "skill" : "range",
            "amount" : -6
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 20
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 9,
    "equipmentSpriteSheet" : "helmet1",
    "equipmentTrimSpriteId" : 0,
    "equipmentTrimSpriteSheet" : "helmettrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "steel",
    "weight": 4
},
{
	"_id" : 526,
	"name" : "palladium platelegs (gold trim)",
    "description" : "Protective leg armour made of palladium, with gold trimming",
    "isNamePlural" : true,
	"cost" : 20000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 38
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 30
		}
	],
	"equipmentType" : "legs",
    "equipmentSpriteId" : 2,
    "equipmentSpriteSheet" : "legs1",
    "equipmentTrimSpriteId" : 0,
    "equipmentTrimSpriteSheet" : "legstrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "palladium",
    "weight": 6,
    "removeEquipmentOnEquip" : [
        "boots"
    ]
},
{
	"_id" : 527,
	"name" : "palladium chestplate (gold trim)",
    "description" : "Protective chest armour made of palladium, with gold trimming",
    "isNamePlural" : false,
	"cost" : 40000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 54
        },
        {
            "skill" : "magic",
            "amount" : -15
        },
        {
            "skill" : "range",
            "amount" : -15
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 30
		}
	],
	"equipmentType" : "chest",
    "equipmentSpriteId" : 2,
    "equipmentSpriteSheet" : "chest1",
    "equipmentTrimSpriteId" : 0,
    "equipmentTrimSpriteSheet" : "chesttrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "palladium",
    "weight": 10
},
{
	"_id" : 528,
	"name" : "palladium shield (gold trim)",
    "description" : "A heavy shield made from palladium, with gold trimming",
    "isNamePlural" : false,
	"cost" : 20000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 34
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 30
		}
	],
	"equipmentType" : "shield",
    "equipmentSpriteId" : 2,
    "equipmentSpriteSheet" : "shield1",
    "equipmentTrimSpriteId" : 0,
    "equipmentTrimSpriteSheet" : "shieldtrim1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "palladium",
    "weight": 6
},
{
	"_id" : 529,
	"name" : "palladium full helm (gold trim)",
    "description" : "A full-faced helmet made from palladium, with gold trimming",
    "isNamePlural" : false,
	"cost" : 12000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 24
        },
        {
            "skill" : "magic",
            "amount" : -6
        },
        {
            "skill" : "range",
            "amount" : -6
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 30
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 10,
    "equipmentSpriteSheet" : "helmet1",
    "equipmentTrimSpriteId" : 0,
    "equipmentTrimSpriteSheet" : "helmettrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "palladium",
    "weight": 4
},
{
	"_id" : 530,
	"name" : "coronium platelegs (gold trim)",
    "description" : "Protective leg armour made of coronium, with gold trimming",
    "isNamePlural" : true,
	"cost" : 35000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 50
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 40
		}
	],
	"equipmentType" : "legs",
    "equipmentSpriteId" : 3,
    "equipmentSpriteSheet" : "legs1",
    "equipmentTrimSpriteId" : 0,
    "equipmentTrimSpriteSheet" : "legstrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "coronium",
    "weight": 6,
    "removeEquipmentOnEquip" : [
        "boots"
    ]
},
{
	"_id" : 531,
	"name" : "coronium chestplate (gold trim)",
    "description" : "Protective chest armour made of coronium, with gold trimming",
    "isNamePlural" : false,
	"cost" : 70000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 70
        },
        {
            "skill" : "magic",
            "amount" : -15
        },
        {
            "skill" : "range",
            "amount" : -15
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 40
		}
	],
	"equipmentType" : "chest",
    "equipmentSpriteId" : 3,
    "equipmentSpriteSheet" : "chest1",
    "equipmentTrimSpriteId" : 0,
    "equipmentTrimSpriteSheet" : "chesttrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "coronium",
    "weight": 10
},
{
	"_id" : 532,
	"name" : "coronium full helm (gold trim)",
    "description" : "A full-faced helmet made from coronium, with gold trimming",
    "isNamePlural" : false,
	"cost" : 20000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 32
        },
        {
            "skill" : "magic",
            "amount" : -6
        },
        {
            "skill" : "range",
            "amount" : -6
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 40
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 11,
    "equipmentSpriteSheet" : "helmet1",
    "equipmentTrimSpriteId" : 0,
    "equipmentTrimSpriteSheet" : "helmettrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "coronium",
    "weight": 4
},
{
	"_id" : 533,
	"name" : "celadon platelegs (gold trim)",
    "description" : "Protective leg armour made of celadium metal, with gold trimming",
    "isNamePlural" : true,
	"cost" : 105000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 59
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 70
		}
	],
	"equipmentType" : "legs",
    "equipmentSpriteId" : 4,
    "equipmentSpriteSheet" : "legs1",
    "equipmentTrimSpriteId" : 0,
    "equipmentTrimSpriteSheet" : "legstrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "celadium",
    "weight": 6,
    "removeEquipmentOnEquip" : [
        "boots"
    ]
},
{
	"_id" : 534,
	"name" : "celadon chestplate (gold trim)",
    "description" : "Protective chest armour made of celadium metal, with gold trimming",
    "isNamePlural" : false,
	"cost" : 210000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 82
        },
        {
            "skill" : "magic",
            "amount" : -15
        },
        {
            "skill" : "range",
            "amount" : -15
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 70
		}
	],
	"equipmentType" : "chest",
    "equipmentSpriteId" : 4,
    "equipmentSpriteSheet" : "chest1",
    "equipmentTrimSpriteId" : 0,
    "equipmentTrimSpriteSheet" : "chesttrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "celadium",
    "weight": 10
},
{
	"_id" : 535,
	"name" : "celadon full helm (gold trim)",
    "description" : "A full-faced helmet made of celadium metal, with gold trimming",
    "isNamePlural" : false,
	"cost" : 60000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 38
        },
        {
            "skill" : "magic",
            "amount" : -6
        },
        {
            "skill" : "range",
            "amount" : -6
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 70
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 12,
    "equipmentSpriteSheet" : "helmet1",
    "equipmentTrimSpriteId" : 0,
    "equipmentTrimSpriteSheet" : "helmettrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "celadium",
    "weight": 4
},
{
	"_id" : 536,
	"name" : "legendary great sword",
    "description" : "I wouldn't want to get whacked over the head by this thing",
    "isNamePlural" : false,
	"cost" : 140000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "accuracy",
            "amount" : 78
        },
        {
            "skill" : "strength",
            "amount" : 102
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "accuracy",
			"amount" : 80
		}
	],
	"equipmentType" : "weapon",
    "equipmentSpriteId" : 20,
    "equipmentSpriteSheet" : "weapon1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 5,
    "weaponSpeed" : 6,
    "removeEquipmentOnEquip" : [
        "shield"
    ]
},
{
	"_id" : 537,
	"name" : "legendary helm",
    "description" : "An medium helmet made from a legendary metal",
    "isNamePlural" : false,
	"cost" : 105000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 42
        },
        {
            "skill" : "strength",
            "amount" : 4
        },
        {
            "skill" : "accuracy",
            "amount" : 4
        },
        {
            "skill" : "magic",
            "amount" : -3
        },
        {
            "skill" : "range",
            "amount" : -3
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 80
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 51,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 2.5
},
{
	"_id" : 538,
	"name" : "purple bandit mask",
    "description" : "A mask worn by outlaws",
    "isNamePlural" : false,
	"cost" : 5000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "crime",
            "amount" : 1
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 52,
    "equipmentSpriteSheet" : "helmet1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.1
},
{
	"_id" : 539,
	"name" : "red bandit mask",
    "description" : "A mask worn by outlaws",
    "isNamePlural" : false,
	"cost" : 5000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "crime",
            "amount" : 1
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 53,
    "equipmentSpriteSheet" : "helmet1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.1
},
{
	"_id" : 540,
	"name" : "green bandit mask",
    "description" : "A mask worn by outlaws",
    "isNamePlural" : false,
	"cost" : 5000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "crime",
            "amount" : 1
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 54,
    "equipmentSpriteSheet" : "helmet1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.1
},
{
	"_id" : 541,
	"name" : "blue bandit mask",
    "description" : "A mask worn by outlaws",
    "isNamePlural" : false,
	"cost" : 5000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "crime",
            "amount" : 1
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 55,
    "equipmentSpriteSheet" : "helmet1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.1
},
{
	"_id" : 542,
	"name" : "golden royal crown",
    "description" : "A headpiece fit for royalty",
    "isNamePlural" : false,
	"cost" : 150000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 56,
    "equipmentSpriteSheet" : "helmet1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 1.0
},
{
	"_id" : 543,
	"name" : "silver royal crown",
    "description" : "A headpiece fit for royalty",
    "isNamePlural" : false,
	"cost" : 125000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 57,
    "equipmentSpriteSheet" : "helmet1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 1.0
},
{
	"_id" : 544,
	"name" : "forester's pendant",
    "description" : "It's in the shape of a miniature log",
    "isNamePlural" : false,
	"cost" : 10000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "forestry",
            "amount" : 5
        }
    ],
	"equippableRequirements" : [
        {
            "skill" : "forestry",
            "amount" : 40
        }
    ],
	"equipmentType" : "neck",
    "equipmentSpriteId" : 17,
    "equipmentSpriteSheet" : "neck1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.05
},
{
	"_id" : 545,
	"name" : "fisherman's pendant",
    "description" : "A small fish pendant I can wear around my neck",
    "isNamePlural" : false,
	"cost" : 10000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "fishing",
            "amount" : 5
        }
    ],
	"equippableRequirements" : [
        {
            "skill" : "fishing",
            "amount" : 40
        }
    ],
	"equipmentType" : "neck",
    "equipmentSpriteId" : 18,
    "equipmentSpriteSheet" : "neck1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.05
},
{
	"_id" : 546,
	"name" : "miner's pendant",
    "description" : "A pendant in the shape of a small pickaxe",
    "isNamePlural" : false,
	"cost" : 10000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "mining",
            "amount" : 5
        }
    ],
	"equippableRequirements" : [
        {
            "skill" : "mining",
            "amount" : 40
        }
    ],
	"equipmentType" : "neck",
    "equipmentSpriteId" : 19,
    "equipmentSpriteSheet" : "neck1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.05
},
{
	"_id" : 547,
	"name" : "harvester's pendant",
    "description" : "A small, strawberry-shaped pendant",
    "isNamePlural" : false,
	"cost" : 10000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "harvesting",
            "amount" : 5
        }
    ],
	"equippableRequirements" : [
        {
            "skill" : "harvesting",
            "amount" : 40
        }
    ],
	"equipmentType" : "neck",
    "equipmentSpriteId" : 20,
    "equipmentSpriteSheet" : "neck1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.05
},
{
	"_id" : 548,
	"name" : "shadow dragonleather",
    "description" : "Black leather from a Shadow Dragon",
    "isNamePlural" : true,
	"cost" : 150,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 1.5
},
{
	"_id" : 549,
	"name" : "sky dragonleather",
    "description" : "White leather from a Sky Dragon",
    "isNamePlural" : true,
	"cost" : 180,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 1.5
},
{
	"_id" : 550,
	"name" : "ice bones",
    "description" : "I can't tell if they are bones, or just ice",
    "isNamePlural" : true,
	"cost" : 3,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.5
},
{
	"_id" : 551,
	"name" : "shadow dragonleather chaps",
    "description" : "A solid pair of chaps",
    "isNamePlural" : true,
	"cost" : 2100,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 12
        },
        {
            "skill" : "range",
            "amount" : 18
        },
        {
            "skill" : "magic",
            "amount" : -18
        }
    ],
	"equippableRequirements" : [
        {
            "skill" : "range",
            "amount" : 50
        }
    ],
	"equipmentType" : "legs",
    "equipmentSpriteId" : 20,
    "equipmentSpriteSheet" : "legs1",
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 210
    },
    "recipe" : [
        {
            "desc" : "shadow dragonleather",
            "itemId" : 548,
            "amount" : 2
        }
    ],
    "metalType" : null,
    "weight": 2
},
{
	"_id" : 552,
	"name" : "shadow dragonleather bracers",
    "description" : "These will protected my forearms when firing arrows",
    "isNamePlural" : true,
	"cost" : 1050,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 6
        },
        {
            "skill" : "range",
            "amount" : 15
        },
        {
            "skill" : "magic",
            "amount" : -15
        }
    ],
	"equippableRequirements" : [
        {
            "skill" : "range",
            "amount" : 50
        }
    ],
	"equipmentType" : "gloves",
    "equipmentSpriteId" : 19,
    "equipmentSpriteSheet" : "gloves1",
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 105
    },
    "recipe" : [
        {
            "desc" : "shadow dragonleather",
            "itemId" : 548,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 1
},
{
	"_id" : 553,
	"name" : "sky dragonleather chaps",
    "description" : "A solid pair of chaps",
    "isNamePlural" : true,
	"cost" : 2100,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 12
        },
        {
            "skill" : "range",
            "amount" : 18
        },
        {
            "skill" : "magic",
            "amount" : -18
        }
    ],
	"equippableRequirements" : [
        {
            "skill" : "range",
            "amount" : 50
        }
    ],
	"equipmentType" : "legs",
    "equipmentSpriteId" : 21,
    "equipmentSpriteSheet" : "legs1",
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 210
    },
    "recipe" : [
        {
            "desc" : "sky dragonleather",
            "itemId" : 549,
            "amount" : 2
        }
    ],
    "metalType" : null,
    "weight": 2
},
{
	"_id" : 554,
	"name" : "sky dragonleather bracers",
    "description" : "These will protected my forearms when firing arrows",
    "isNamePlural" : true,
	"cost" : 1050,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 6
        },
        {
            "skill" : "range",
            "amount" : 15
        },
        {
            "skill" : "magic",
            "amount" : -15
        }
    ],
	"equippableRequirements" : [
        {
            "skill" : "range",
            "amount" : 50
        }
    ],
	"equipmentType" : "gloves",
    "equipmentSpriteId" : 20,
    "equipmentSpriteSheet" : "gloves1",
	"resourceProbability" : null,
	"expFromObtaining" : {
        "skill" : "crafting",
        "amount" : 105
    },
    "recipe" : [
        {
            "desc" : "sky dragonleather",
            "itemId" : 549,
            "amount" : 1
        }
    ],
    "metalType" : null,
    "weight": 1
},
{
	"_id" : 555,
	"name" : "celadon key",
    "description" : "A celadon-coloured metal key",
    "isNamePlural" : false,
	"cost" : 100,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.01
},
{
	"_id" : 556,
	"name" : "fuchsia key",
    "description" : "A fuchsia-coloured metal key",
    "isNamePlural" : false,
	"cost" : 100,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : null,
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.01
},
{
	"_id" : 557,
	"name" : "bronze platelegs (silver trim)",
    "description" : "Protective leg armour made of bronze, with silver trimming",
    "isNamePlural" : true,
	"cost" : 1000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 8
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 1
		}
	],
	"equipmentType" : "legs",
    "equipmentSpriteId" : 0,
    "equipmentSpriteSheet" : "legs1",
    "equipmentTrimSpriteId" : 1,
    "equipmentTrimSpriteSheet" : "legstrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "bronze",
    "weight": 6,
    "removeEquipmentOnEquip" : [
        "boots"
    ]
},
{
	"_id" : 558,
	"name" : "bronze chestplate (silver trim)",
    "description" : "Protective chest armour made of bronze, with silver trimming",
    "isNamePlural" : false,
	"cost" : 2000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 12
        },
        {
            "skill" : "magic",
            "amount" : -15
        },
        {
            "skill" : "range",
            "amount" : -15
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 1
		}
	],
	"equipmentType" : "chest",
    "equipmentSpriteId" : 0,
    "equipmentSpriteSheet" : "chest1",
    "equipmentTrimSpriteId" : 1,
    "equipmentTrimSpriteSheet" : "chesttrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "bronze",
    "weight": 10
},
{
	"_id" : 559,
	"name" : "bronze shield (silver trim)",
    "description" : "A heavy shield made from bronze, with silver trimming",
    "isNamePlural" : false,
	"cost" : 1000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 7
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 1
		}
	],
	"equipmentType" : "shield",
    "equipmentSpriteId" : 0,
    "equipmentSpriteSheet" : "shield1",
    "equipmentTrimSpriteId" : 1,
    "equipmentTrimSpriteSheet" : "shieldtrim1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "bronze",
    "weight": 6
},
{
	"_id" : 560,
	"name" : "bronze full helm (silver trim)",
    "description" : "A full-faced helmet made of bronze, with silver trimming",
    "isNamePlural" : false,
	"cost" : 600,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 6
        },
        {
            "skill" : "magic",
            "amount" : -6
        },
        {
            "skill" : "range",
            "amount" : -6
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 1
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 7,
    "equipmentSpriteSheet" : "helmet1",
    "equipmentTrimSpriteId" : 4,
    "equipmentTrimSpriteSheet" : "helmettrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "bronze",
    "weight": 4
},
{
	"_id" : 561,
	"name" : "iron platelegs (silver trim)",
    "description" : "Protective leg armour made of iron, with silver trimming",
    "isNamePlural" : true,
	"cost" : 3200,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 17
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 10
		}
	],
	"equipmentType" : "legs",
    "equipmentSpriteId" : 6,
    "equipmentSpriteSheet" : "legs1",
    "equipmentTrimSpriteId" : 1,
    "equipmentTrimSpriteSheet" : "legstrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "iron",
    "weight": 6,
    "removeEquipmentOnEquip" : [
        "boots"
    ]
},
{
	"_id" : 562,
	"name" : "iron chestplate (silver trim)",
    "description" : "Protective chest armour made of iron, with silver trimming",
    "isNamePlural" : false,
	"cost" : 6400,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 25
        },
        {
            "skill" : "magic",
            "amount" : -15
        },
        {
            "skill" : "range",
            "amount" : -15
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 10
		}
	],
	"equipmentType" : "chest",
    "equipmentSpriteId" : 6,
    "equipmentSpriteSheet" : "chest1",
    "equipmentTrimSpriteId" : 1,
    "equipmentTrimSpriteSheet" : "chesttrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "iron",
    "weight": 10
},
{
	"_id" : 563,
	"name" : "iron shield (silver trim)",
    "description" : "A heavy shield made from iron, with silver trimming",
    "isNamePlural" : false,
	"cost" : 3200,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 15
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 10
		}
	],
	"equipmentType" : "shield",
    "equipmentSpriteId" : 6,
    "equipmentSpriteSheet" : "shield1",
    "equipmentTrimSpriteId" : 1,
    "equipmentTrimSpriteSheet" : "shieldtrim1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "iron",
    "weight": 6
},
{
	"_id" : 564,
	"name" : "iron full helm (silver trim)",
    "description" : "A full-faced helmet made of iron, with silver trimming",
    "isNamePlural" : false,
	"cost" : 2000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 11
        },
        {
            "skill" : "magic",
            "amount" : -6
        },
        {
            "skill" : "range",
            "amount" : -6
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 10
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 8,
    "equipmentSpriteSheet" : "helmet1",
    "equipmentTrimSpriteId" : 4,
    "equipmentTrimSpriteSheet" : "helmettrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "iron",
    "weight": 4
},
{
	"_id" : 565,
	"name" : "steel platelegs (silver trim)",
    "description" : "Protective leg armour made of steel, with silver trimming",
    "isNamePlural" : true,
	"cost" : 8000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 27
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 20
		}
	],
	"equipmentType" : "legs",
    "equipmentSpriteId" : 1,
    "equipmentSpriteSheet" : "legs1",
    "equipmentTrimSpriteId" : 1,
    "equipmentTrimSpriteSheet" : "legstrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "steel",
    "weight": 6,
    "removeEquipmentOnEquip" : [
        "boots"
    ]
},
{
	"_id" : 566,
	"name" : "steel chestplate (silver trim)",
    "description" : "Protective chest armour made of steel, with silver trimming",
    "isNamePlural" : false,
	"cost" : 16000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 39
        },
        {
            "skill" : "magic",
            "amount" : -15
        },
        {
            "skill" : "range",
            "amount" : -15
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 20
		}
	],
	"equipmentType" : "chest",
    "equipmentSpriteId" : 1,
    "equipmentSpriteSheet" : "chest1",
    "equipmentTrimSpriteId" : 1,
    "equipmentTrimSpriteSheet" : "chesttrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "steel",
    "weight": 10
},
{
	"_id" : 567,
	"name" : "steel shield (silver trim)",
    "description" : "A heavy shield made from steel, with silver trimming",
    "isNamePlural" : false,
	"cost" : 8000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 24
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 20
		}
	],
	"equipmentType" : "shield",
    "equipmentSpriteId" : 1,
    "equipmentSpriteSheet" : "shield1",
    "equipmentTrimSpriteId" : 1,
    "equipmentTrimSpriteSheet" : "shieldtrim1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "steel",
    "weight": 6
},
{
	"_id" : 568,
	"name" : "steel full helm (silver trim)",
    "description" : "A full-faced helmet made from steel, with silver trimming",
    "isNamePlural" : false,
	"cost" : 2500,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 17
        },
        {
            "skill" : "magic",
            "amount" : -6
        },
        {
            "skill" : "range",
            "amount" : -6
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 20
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 9,
    "equipmentSpriteSheet" : "helmet1",
    "equipmentTrimSpriteId" : 4,
    "equipmentTrimSpriteSheet" : "helmettrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "steel",
    "weight": 4
},
{
	"_id" : 569,
	"name" : "palladium platelegs (silver trim)",
    "description" : "Protective leg armour made of palladium, with silver trimming",
    "isNamePlural" : true,
	"cost" : 20000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 38
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 30
		}
	],
	"equipmentType" : "legs",
    "equipmentSpriteId" : 2,
    "equipmentSpriteSheet" : "legs1",
    "equipmentTrimSpriteId" : 1,
    "equipmentTrimSpriteSheet" : "legstrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "palladium",
    "weight": 6,
    "removeEquipmentOnEquip" : [
        "boots"
    ]
},
{
	"_id" : 570,
	"name" : "palladium chestplate (silver trim)",
    "description" : "Protective chest armour made of palladium, with silver trimming",
    "isNamePlural" : false,
	"cost" : 40000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 54
        },
        {
            "skill" : "magic",
            "amount" : -15
        },
        {
            "skill" : "range",
            "amount" : -15
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 30
		}
	],
	"equipmentType" : "chest",
    "equipmentSpriteId" : 2,
    "equipmentSpriteSheet" : "chest1",
    "equipmentTrimSpriteId" : 1,
    "equipmentTrimSpriteSheet" : "chesttrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "palladium",
    "weight": 10
},
{
	"_id" : 571,
	"name" : "palladium shield (silver trim)",
    "description" : "A heavy shield made from palladium, with silver trimming",
    "isNamePlural" : false,
	"cost" : 20000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 34
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 30
		}
	],
	"equipmentType" : "shield",
    "equipmentSpriteId" : 2,
    "equipmentSpriteSheet" : "shield1",
    "equipmentTrimSpriteId" : 1,
    "equipmentTrimSpriteSheet" : "shieldtrim1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "palladium",
    "weight": 6
},
{
	"_id" : 572,
	"name" : "palladium full helm (silver trim)",
    "description" : "A full-faced helmet made from palladium, with silver trimming",
    "isNamePlural" : false,
	"cost" : 12000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 24
        },
        {
            "skill" : "magic",
            "amount" : -6
        },
        {
            "skill" : "range",
            "amount" : -6
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 30
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 10,
    "equipmentSpriteSheet" : "helmet1",
    "equipmentTrimSpriteId" : 4,
    "equipmentTrimSpriteSheet" : "helmettrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "palladium",
    "weight": 4
},
{
	"_id" : 573,
	"name" : "coronium platelegs (silver trim)",
    "description" : "Protective leg armour made of coronium, with silver trimming",
    "isNamePlural" : true,
	"cost" : 35000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 50
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 40
		}
	],
	"equipmentType" : "legs",
    "equipmentSpriteId" : 3,
    "equipmentSpriteSheet" : "legs1",
    "equipmentTrimSpriteId" : 1,
    "equipmentTrimSpriteSheet" : "legstrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "coronium",
    "weight": 6,
    "removeEquipmentOnEquip" : [
        "boots"
    ]
},
{
	"_id" : 574,
	"name" : "coronium chestplate (silver trim)",
    "description" : "Protective chest armour made of coronium, with silver trimming",
    "isNamePlural" : false,
	"cost" : 70000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 70
        },
        {
            "skill" : "magic",
            "amount" : -15
        },
        {
            "skill" : "range",
            "amount" : -15
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 40
		}
	],
	"equipmentType" : "chest",
    "equipmentSpriteId" : 3,
    "equipmentSpriteSheet" : "chest1",
    "equipmentTrimSpriteId" : 1,
    "equipmentTrimSpriteSheet" : "chesttrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "coronium",
    "weight": 10
},
{
	"_id" : 575,
	"name" : "coronium shield (silver trim)",
    "description" : "A heavy shield made from coronium, with silver trimming",
    "isNamePlural" : false,
	"cost" : 35000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 45
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 40
		}
	],
	"equipmentType" : "shield",
    "equipmentSpriteId" : 9,
    "equipmentSpriteSheet" : "shield1",
    "equipmentTrimSpriteId" : 1,
    "equipmentTrimSpriteSheet" : "shieldtrim1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "coronium",
    "weight": 6
},
{
	"_id" : 576,
	"name" : "coronium full helm (silver trim)",
    "description" : "A full-faced helmet made from coronium, with silver trimming",
    "isNamePlural" : false,
	"cost" : 20000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 32
        },
        {
            "skill" : "magic",
            "amount" : -6
        },
        {
            "skill" : "range",
            "amount" : -6
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 40
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 11,
    "equipmentSpriteSheet" : "helmet1",
    "equipmentTrimSpriteId" : 4,
    "equipmentTrimSpriteSheet" : "helmettrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "coronium",
    "weight": 4
},
{
	"_id" : 577,
	"name" : "celadon platelegs (silver trim)",
    "description" : "Protective leg armour made of celadium metal, with silver trimming",
    "isNamePlural" : true,
	"cost" : 105000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 59
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 70
		}
	],
	"equipmentType" : "legs",
    "equipmentSpriteId" : 4,
    "equipmentSpriteSheet" : "legs1",
    "equipmentTrimSpriteId" : 1,
    "equipmentTrimSpriteSheet" : "legstrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "celadium",
    "weight": 6,
    "removeEquipmentOnEquip" : [
        "boots"
    ]
},
{
	"_id" : 578,
	"name" : "celadon chestplate (silver trim)",
    "description" : "Protective chest armour made of celadium metal, with silver trimming",
    "isNamePlural" : false,
	"cost" : 210000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 82
        },
        {
            "skill" : "magic",
            "amount" : -15
        },
        {
            "skill" : "range",
            "amount" : -15
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 70
		}
	],
	"equipmentType" : "chest",
    "equipmentSpriteId" : 4,
    "equipmentSpriteSheet" : "chest1",
    "equipmentTrimSpriteId" : 1,
    "equipmentTrimSpriteSheet" : "chesttrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "celadium",
    "weight": 10
},
{
	"_id" : 579,
	"name" : "celadon shield (silver trim)",
    "description" : "A heavy shield made of celadium metal, with silver trimming",
    "isNamePlural" : false,
	"cost" : 105000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 54
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 70
		}
	],
	"equipmentType" : "shield",
    "equipmentSpriteId" : 12,
    "equipmentSpriteSheet" : "shield1",
    "equipmentTrimSpriteId" : 1,
    "equipmentTrimSpriteSheet" : "shieldtrim1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "celadium",
    "weight": 6
},
{
	"_id" : 580,
	"name" : "celadon full helm (silver trim)",
    "description" : "A full-faced helmet made of celadium metal, with silver trimming",
    "isNamePlural" : false,
	"cost" : 60000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 38
        },
        {
            "skill" : "magic",
            "amount" : -6
        },
        {
            "skill" : "range",
            "amount" : -6
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 70
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 12,
    "equipmentSpriteSheet" : "helmet1",
    "equipmentTrimSpriteId" : 4,
    "equipmentTrimSpriteSheet" : "helmettrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "celadium",
    "weight": 4
},
{
	"_id" : 581,
	"name" : "bronze platelegs (red trim)",
    "description" : "Protective leg armour made of bronze, with red trimming",
    "isNamePlural" : true,
	"cost" : 1000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 8
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 1
		}
	],
	"equipmentType" : "legs",
    "equipmentSpriteId" : 0,
    "equipmentSpriteSheet" : "legs1",
    "equipmentTrimSpriteId" : 2,
    "equipmentTrimSpriteSheet" : "legstrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "bronze",
    "weight": 6,
    "removeEquipmentOnEquip" : [
        "boots"
    ]
},
{
	"_id" : 582,
	"name" : "bronze chestplate (red trim)",
    "description" : "Protective chest armour made of bronze, with red trimming",
    "isNamePlural" : false,
	"cost" : 2000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 12
        },
        {
            "skill" : "magic",
            "amount" : -15
        },
        {
            "skill" : "range",
            "amount" : -15
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 1
		}
	],
	"equipmentType" : "chest",
    "equipmentSpriteId" : 0,
    "equipmentSpriteSheet" : "chest1",
    "equipmentTrimSpriteId" : 2,
    "equipmentTrimSpriteSheet" : "chesttrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "bronze",
    "weight": 10
},
{
	"_id" : 583,
	"name" : "bronze shield (red trim)",
    "description" : "A heavy shield made from bronze, with red trimming",
    "isNamePlural" : false,
	"cost" : 1000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 7
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 1
		}
	],
	"equipmentType" : "shield",
    "equipmentSpriteId" : 0,
    "equipmentSpriteSheet" : "shield1",
    "equipmentTrimSpriteId" : 2,
    "equipmentTrimSpriteSheet" : "shieldtrim1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "bronze",
    "weight": 6
},
{
	"_id" : 584,
	"name" : "bronze full helm (red trim)",
    "description" : "A full-faced helmet made of bronze, with red trimming",
    "isNamePlural" : false,
	"cost" : 600,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 6
        },
        {
            "skill" : "magic",
            "amount" : -6
        },
        {
            "skill" : "range",
            "amount" : -6
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 1
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 7,
    "equipmentSpriteSheet" : "helmet1",
    "equipmentTrimSpriteId" : 5,
    "equipmentTrimSpriteSheet" : "helmettrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "bronze",
    "weight": 4
},
{
	"_id" : 585,
	"name" : "iron platelegs (red trim)",
    "description" : "Protective leg armour made of iron, with red trimming",
    "isNamePlural" : true,
	"cost" : 3200,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 17
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 10
		}
	],
	"equipmentType" : "legs",
    "equipmentSpriteId" : 6,
    "equipmentSpriteSheet" : "legs1",
    "equipmentTrimSpriteId" : 2,
    "equipmentTrimSpriteSheet" : "legstrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "iron",
    "weight": 6,
    "removeEquipmentOnEquip" : [
        "boots"
    ]
},
{
	"_id" : 586,
	"name" : "iron chestplate (red trim)",
    "description" : "Protective chest armour made of iron, with red trimming",
    "isNamePlural" : false,
	"cost" : 6400,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 25
        },
        {
            "skill" : "magic",
            "amount" : -15
        },
        {
            "skill" : "range",
            "amount" : -15
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 10
		}
	],
	"equipmentType" : "chest",
    "equipmentSpriteId" : 6,
    "equipmentSpriteSheet" : "chest1",
    "equipmentTrimSpriteId" : 2,
    "equipmentTrimSpriteSheet" : "chesttrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "iron",
    "weight": 10
},
{
	"_id" : 587,
	"name" : "iron shield (red trim)",
    "description" : "A heavy shield made from iron, with red trimming",
    "isNamePlural" : false,
	"cost" : 3200,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 15
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 10
		}
	],
	"equipmentType" : "shield",
    "equipmentSpriteId" : 6,
    "equipmentSpriteSheet" : "shield1",
    "equipmentTrimSpriteId" : 2,
    "equipmentTrimSpriteSheet" : "shieldtrim1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "iron",
    "weight": 6
},
{
	"_id" : 588,
	"name" : "iron full helm (red trim)",
    "description" : "A full-faced helmet made of iron, with red trimming",
    "isNamePlural" : false,
	"cost" : 2000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 11
        },
        {
            "skill" : "magic",
            "amount" : -6
        },
        {
            "skill" : "range",
            "amount" : -6
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 10
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 8,
    "equipmentSpriteSheet" : "helmet1",
    "equipmentTrimSpriteId" : 5,
    "equipmentTrimSpriteSheet" : "helmettrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "iron",
    "weight": 4
},
{
	"_id" : 589,
	"name" : "steel platelegs (red trim)",
    "description" : "Protective leg armour made of steel, with red trimming",
    "isNamePlural" : true,
	"cost" : 8000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 27
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 20
		}
	],
	"equipmentType" : "legs",
    "equipmentSpriteId" : 1,
    "equipmentSpriteSheet" : "legs1",
    "equipmentTrimSpriteId" : 2,
    "equipmentTrimSpriteSheet" : "legstrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "steel",
    "weight": 6,
    "removeEquipmentOnEquip" : [
        "boots"
    ]
},
{
	"_id" : 590,
	"name" : "steel chestplate (red trim)",
    "description" : "Protective chest armour made of steel, with red trimming",
    "isNamePlural" : false,
	"cost" : 16000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 39
        },
        {
            "skill" : "magic",
            "amount" : -15
        },
        {
            "skill" : "range",
            "amount" : -15
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 20
		}
	],
	"equipmentType" : "chest",
    "equipmentSpriteId" : 1,
    "equipmentSpriteSheet" : "chest1",
    "equipmentTrimSpriteId" : 2,
    "equipmentTrimSpriteSheet" : "chesttrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "steel",
    "weight": 10
},
{
	"_id" : 591,
	"name" : "steel shield (red trim)",
    "description" : "A heavy shield made from steel, with red trimming",
    "isNamePlural" : false,
	"cost" : 8000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 24
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 20
		}
	],
	"equipmentType" : "shield",
    "equipmentSpriteId" : 1,
    "equipmentSpriteSheet" : "shield1",
    "equipmentTrimSpriteId" : 2,
    "equipmentTrimSpriteSheet" : "shieldtrim1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "steel",
    "weight": 6
},
{
	"_id" : 592,
	"name" : "steel full helm (red trim)",
    "description" : "A full-faced helmet made from steel, with red trimming",
    "isNamePlural" : false,
	"cost" : 2500,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 17
        },
        {
            "skill" : "magic",
            "amount" : -6
        },
        {
            "skill" : "range",
            "amount" : -6
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 20
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 9,
    "equipmentSpriteSheet" : "helmet1",
    "equipmentTrimSpriteId" : 5,
    "equipmentTrimSpriteSheet" : "helmettrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "steel",
    "weight": 4
},
{
	"_id" : 593,
	"name" : "palladium platelegs (red trim)",
    "description" : "Protective leg armour made of palladium, with red trimming",
    "isNamePlural" : true,
	"cost" : 20000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 38
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 30
		}
	],
	"equipmentType" : "legs",
    "equipmentSpriteId" : 2,
    "equipmentSpriteSheet" : "legs1",
    "equipmentTrimSpriteId" : 2,
    "equipmentTrimSpriteSheet" : "legstrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "palladium",
    "weight": 6,
    "removeEquipmentOnEquip" : [
        "boots"
    ]
},
{
	"_id" : 594,
	"name" : "palladium chestplate (red trim)",
    "description" : "Protective chest armour made of palladium, with red trimming",
    "isNamePlural" : false,
	"cost" : 40000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 54
        },
        {
            "skill" : "magic",
            "amount" : -15
        },
        {
            "skill" : "range",
            "amount" : -15
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 30
		}
	],
	"equipmentType" : "chest",
    "equipmentSpriteId" : 2,
    "equipmentSpriteSheet" : "chest1",
    "equipmentTrimSpriteId" : 2,
    "equipmentTrimSpriteSheet" : "chesttrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "palladium",
    "weight": 10
},
{
	"_id" : 595,
	"name" : "palladium shield (red trim)",
    "description" : "A heavy shield made from palladium, with red trimming",
    "isNamePlural" : false,
	"cost" : 20000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 34
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 30
		}
	],
	"equipmentType" : "shield",
    "equipmentSpriteId" : 2,
    "equipmentSpriteSheet" : "shield1",
    "equipmentTrimSpriteId" : 2,
    "equipmentTrimSpriteSheet" : "shieldtrim1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "palladium",
    "weight": 6
},
{
	"_id" : 596,
	"name" : "palladium full helm (red trim)",
    "description" : "A full-faced helmet made from palladium, with red trimming",
    "isNamePlural" : false,
	"cost" : 12000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 24
        },
        {
            "skill" : "magic",
            "amount" : -6
        },
        {
            "skill" : "range",
            "amount" : -6
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 30
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 10,
    "equipmentSpriteSheet" : "helmet1",
    "equipmentTrimSpriteId" : 5,
    "equipmentTrimSpriteSheet" : "helmettrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "palladium",
    "weight": 4
},
{
	"_id" : 597,
	"name" : "coronium platelegs (red trim)",
    "description" : "Protective leg armour made of coronium, with red trimming",
    "isNamePlural" : true,
	"cost" : 35000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 50
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 40
		}
	],
	"equipmentType" : "legs",
    "equipmentSpriteId" : 3,
    "equipmentSpriteSheet" : "legs1",
    "equipmentTrimSpriteId" : 2,
    "equipmentTrimSpriteSheet" : "legstrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "coronium",
    "weight": 6,
    "removeEquipmentOnEquip" : [
        "boots"
    ]
},
{
	"_id" : 598,
	"name" : "coronium chestplate (red trim)",
    "description" : "Protective chest armour made of coronium, with red trimming",
    "isNamePlural" : false,
	"cost" : 70000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 70
        },
        {
            "skill" : "magic",
            "amount" : -15
        },
        {
            "skill" : "range",
            "amount" : -15
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 40
		}
	],
	"equipmentType" : "chest",
    "equipmentSpriteId" : 3,
    "equipmentSpriteSheet" : "chest1",
    "equipmentTrimSpriteId" : 2,
    "equipmentTrimSpriteSheet" : "chesttrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "coronium",
    "weight": 10
},
{
	"_id" : 599,
	"name" : "coronium shield (red trim)",
    "description" : "A heavy shield made from coronium, with red trimming",
    "isNamePlural" : false,
	"cost" : 35000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 45
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 40
		}
	],
	"equipmentType" : "shield",
    "equipmentSpriteId" : 9,
    "equipmentSpriteSheet" : "shield1",
    "equipmentTrimSpriteId" : 2,
    "equipmentTrimSpriteSheet" : "shieldtrim1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "coronium",
    "weight": 6
},
{
	"_id" : 600,
	"name" : "coronium full helm (red trim)",
    "description" : "A full-faced helmet made from coronium, with red trimming",
    "isNamePlural" : false,
	"cost" : 20000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 32
        },
        {
            "skill" : "magic",
            "amount" : -6
        },
        {
            "skill" : "range",
            "amount" : -6
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 40
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 11,
    "equipmentSpriteSheet" : "helmet1",
    "equipmentTrimSpriteId" : 5,
    "equipmentTrimSpriteSheet" : "helmettrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "coronium",
    "weight": 4
},
{
	"_id" : 601,
	"name" : "celadon platelegs (red trim)",
    "description" : "Protective leg armour made of celadium metal, with red trimming",
    "isNamePlural" : true,
	"cost" : 105000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 59
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 70
		}
	],
	"equipmentType" : "legs",
    "equipmentSpriteId" : 4,
    "equipmentSpriteSheet" : "legs1",
    "equipmentTrimSpriteId" : 2,
    "equipmentTrimSpriteSheet" : "legstrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "celadium",
    "weight": 6,
    "removeEquipmentOnEquip" : [
        "boots"
    ]
},
{
	"_id" : 602,
	"name" : "celadon chestplate (red trim)",
    "description" : "Protective chest armour made of celadium metal, with red trimming",
    "isNamePlural" : false,
	"cost" : 210000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 82
        },
        {
            "skill" : "magic",
            "amount" : -15
        },
        {
            "skill" : "range",
            "amount" : -15
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 70
		}
	],
	"equipmentType" : "chest",
    "equipmentSpriteId" : 4,
    "equipmentSpriteSheet" : "chest1",
    "equipmentTrimSpriteId" : 2,
    "equipmentTrimSpriteSheet" : "chesttrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "celadium",
    "weight": 10
},
{
	"_id" : 603,
	"name" : "celadon shield (red trim)",
    "description" : "A heavy shield made of celadium metal, with red trimming",
    "isNamePlural" : false,
	"cost" : 105000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 54
        },
        {
            "skill" : "magic",
            "amount" : -9
        },
        {
            "skill" : "range",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 70
		}
	],
	"equipmentType" : "shield",
    "equipmentSpriteId" : 12,
    "equipmentSpriteSheet" : "shield1",
    "equipmentTrimSpriteId" : 2,
    "equipmentTrimSpriteSheet" : "shieldtrim1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "celadium",
    "weight": 6
},
{
	"_id" : 604,
	"name" : "celadon full helm (red trim)",
    "description" : "A full-faced helmet made of celadium metal, with red trimming",
    "isNamePlural" : false,
	"cost" : 60000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 38
        },
        {
            "skill" : "magic",
            "amount" : -6
        },
        {
            "skill" : "range",
            "amount" : -6
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "defense",
			"amount" : 70
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 12,
    "equipmentSpriteSheet" : "helmet1",
    "equipmentTrimSpriteId" : 5,
    "equipmentTrimSpriteSheet" : "helmettrim1",
    "hidesSpritesUnderneath" : true,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : "celadium",
    "weight": 4
},
{
	"_id" : 605,
	"name" : "celadon knight's cape",
    "description" : "A cape worn by knights",
    "isNamePlural" : false,
	"cost" : 10000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 7
        },
        {
            "skill" : "strength",
            "amount" : 7
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "strength",
			"amount" : 50
		}
	],
	"equipmentType" : "back",
    "equipmentSpriteId" : 12,
    "equipmentSpriteSheet" : "back1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 1.5
},
{
	"_id" : 606,
	"name" : "fuchsia knight's cape",
    "description" : "A cape worn by knights",
    "isNamePlural" : false,
	"cost" : 10000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 7
        },
        {
            "skill" : "strength",
            "amount" : 7
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "strength",
			"amount" : 50
		}
	],
	"equipmentType" : "back",
    "equipmentSpriteId" : 13,
    "equipmentSpriteSheet" : "back1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 1.5
},
{
	"_id" : 607,
	"name" : "elite chef's hat",
    "description" : "A tall white hat with a gold band",
    "isNamePlural" : false,
	"cost" : 5000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "cooking",
            "amount" : 4
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "cooking",
			"amount" : 40
		}
	],
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 58,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.25
},
{
	"_id" : 608,
	"name" : "thief's cape",
    "description" : "A cape worn by thieves",
    "isNamePlural" : false,
	"cost" : 4000,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 2
        },
        {
            "skill" : "crime",
            "amount" : 3
        }
    ],
	"equippableRequirements" : [
		{
			"skill" : "crime",
			"amount" : 40
		}
	],
	"equipmentType" : "back",
    "equipmentSpriteId" : 14,
    "equipmentSpriteSheet" : "back1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 1.5
},
{
	"_id" : 609,
	"name" : "pumpkin cape",
    "description" : "Happy Halloween",
    "isNamePlural" : false,
	"cost" : 100,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : "back",
    "equipmentSpriteId" : 15,
    "equipmentSpriteSheet" : "back1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 1.5
},
{
	"_id" : 610,
	"name" : "black pumpkin cape",
    "description" : "Happy Halloween",
    "isNamePlural" : false,
	"cost" : 100,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : "back",
    "equipmentSpriteId" : 16,
    "equipmentSpriteSheet" : "back1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 1.5
},
{
	"_id" : 611,
	"name" : "leather bracers and archer's gloves",
    "description" : "These will protected my forearms and fingers when firing arrows",
    "isNamePlural" : true,
	"cost" : 5015,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip",
        "disassemble"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 3
        },
        {
            "skill" : "range",
            "amount" : 16
        },
        {
            "skill" : "magic",
            "amount" : -3
        }
    ],
	"equippableRequirements" : [
        {
            "skill" : "range",
            "amount" : 40
        }
    ],
	"equipmentType" : "gloves",
    "equipmentSpriteId" : 13,
    "equipmentSpriteSheet" : "gloves1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 1.25
},
{
	"_id" : 612,
	"name" : "plains dragonleather bracers and archer's gloves",
    "description" : "These will protected my forearms and fingers when firing arrows",
    "isNamePlural" : true,
	"cost" : 5600,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip",
        "disassemble"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 4
        },
        {
            "skill" : "range",
            "amount" : 17
        },
        {
            "skill" : "magic",
            "amount" : -6
        }
    ],
	"equippableRequirements" : [
        {
            "skill" : "range",
            "amount" : 40
        }
    ],
	"equipmentType" : "gloves",
    "equipmentSpriteId" : 14,
    "equipmentSpriteSheet" : "gloves1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 1.25
},
{
	"_id" : 613,
	"name" : "water dragonleather bracers and archer's gloves",
    "description" : "These will protected my forearms and fingers when firing arrows",
    "isNamePlural" : true,
	"cost" : 5750,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip",
        "disassemble"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 5
        },
        {
            "skill" : "range",
            "amount" : 18
        },
        {
            "skill" : "magic",
            "amount" : -9
        }
    ],
	"equippableRequirements" : [
        {
            "skill" : "range",
            "amount" : 40
        }
    ],
	"equipmentType" : "gloves",
    "equipmentSpriteId" : 15,
    "equipmentSpriteSheet" : "gloves1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 1.25
},
{
	"_id" : 614,
	"name" : "fire dragonleather bracers and archer's gloves",
    "description" : "These will protected my forearms and fingers when firing arrows",
    "isNamePlural" : true,
	"cost" : 5900,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip",
        "disassemble"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 6
        },
        {
            "skill" : "range",
            "amount" : 19
        },
        {
            "skill" : "magic",
            "amount" : -12
        }
    ],
	"equippableRequirements" : [
        {
            "skill" : "range",
            "amount" : 40
        }
    ],
	"equipmentType" : "gloves",
    "equipmentSpriteId" : 16,
    "equipmentSpriteSheet" : "gloves1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 1.25
},
{
	"_id" : 615,
	"name" : "shadow dragonleather bracers and archer's gloves",
    "description" : "These will protected my forearms and fingers when firing arrows",
    "isNamePlural" : true,
	"cost" : 6050,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip",
        "disassemble"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 7
        },
        {
            "skill" : "range",
            "amount" : 20
        },
        {
            "skill" : "magic",
            "amount" : -15
        }
    ],
	"equippableRequirements" : [
        {
            "skill" : "range",
            "amount" : 50
        }
    ],
	"equipmentType" : "gloves",
    "equipmentSpriteId" : 19,
    "equipmentSpriteSheet" : "gloves1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 1.25
},
{
	"_id" : 616,
	"name" : "sky dragonleather bracers and archer's gloves",
    "description" : "These will protected my forearms and fingers when firing arrows",
    "isNamePlural" : true,
	"cost" : 6050,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip",
        "disassemble"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "defense",
            "amount" : 7
        },
        {
            "skill" : "range",
            "amount" : 20
        },
        {
            "skill" : "magic",
            "amount" : -15
        }
    ],
	"equippableRequirements" : [
        {
            "skill" : "range",
            "amount" : 50
        }
    ],
	"equipmentType" : "gloves",
    "equipmentSpriteId" : 20,
    "equipmentSpriteSheet" : "gloves1",
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 1.25
},
{
	"_id" : 617,
	"name" : "pumpkin mask",
    "description" : "A scary mask",
    "isNamePlural" : false,
	"cost" : 500,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 59,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.1
},
{
	"_id" : 618,
	"name" : "christmas present",
    "description" : "A present from Santa",
    "isNamePlural" : false,
	"cost" : 100,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"open"
	],
	"edibleEffects" : null,
	"equippableEffects" : null,
	"equippableRequirements" : null,
	"equipmentType" : null,
    "equipmentSpriteId" : null,
    "equipmentSpriteSheet" : null,
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.6
},
{
	"_id" : 619,
	"name" : "golden santa hat",
    "description" : "A golden Santa hat",
    "isNamePlural" : false,
	"cost" : 100,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "magic",
            "amount" : 5
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 60,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.5
},
{
	"_id" : 620,
	"name" : "silver santa hat",
    "description" : "A silver Santa hat",
    "isNamePlural" : false,
	"cost" : 100,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "magic",
            "amount" : 5
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 61,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.5
},
{
	"_id" : 621,
	"name" : "purple santa hat",
    "description" : "A purple Santa hat",
    "isNamePlural" : false,
	"cost" : 100,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "magic",
            "amount" : 5
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 62,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.5
},
{
	"_id" : 622,
	"name" : "yellow santa hat",
    "description" : "A yellow Santa hat",
    "isNamePlural" : false,
	"cost" : 100,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "magic",
            "amount" : 5
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 63,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.5
},
{
	"_id" : 623,
	"name" : "pink santa hat",
    "description" : "A pink Santa hat",
    "isNamePlural" : false,
	"cost" : 100,
	"isStackable" : false,
	"isTradeable" : true,
	"isForMission" : false,
	"isMembers" : false,
	"canIOU" : true,
	"inventoryActions" : [
		"equip"
	],
	"edibleEffects" : null,
	"equippableEffects" : [
        {
            "skill" : "magic",
            "amount" : 5
        }
    ],
	"equippableRequirements" : null,
	"equipmentType" : "helmet",
    "equipmentSpriteId" : 64,
    "equipmentSpriteSheet" : "helmet1",
    "hidesSpritesUnderneath" : false,
	"resourceProbability" : null,
	"expFromObtaining" : null,
    "recipe" : null,
    "metalType" : null,
    "weight": 0.5
}
]