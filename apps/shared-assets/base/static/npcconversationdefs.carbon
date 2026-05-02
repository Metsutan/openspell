[
    {
        "_id":1,
        "description":"conversation with Hank",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":null,
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Hello",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Can I buy some helmets?",
                        "nextDialogueId":6
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"Hi",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Who are you?",
                        "nextDialogueId":2
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Nice weather we're having",
                        "nextDialogueId":5
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Hank",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Oh, nice name",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"So what do you do Hank",
                        "nextDialogueId":3
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"I sell helmets, want to buy some?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Sure",
                        "nextDialogueId":4
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"No",
                        "nextDialogueId":null
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":4,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":1
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":5,
                "npcText":"Sure is",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":[
					{
						"requirements":[
							{
								"desc":"player needs to have helmet of melee equipped",
								"type":"equippeditem",
								"equipmenttype":"helmet",
								"itemids":[241],
								"isequipped":true
							}
						],
						"nextDialogueId":7
					}
				]
            },
            {
                "id":6,
                "npcText":"Sure!",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":1
                    }
                ],
                "continuanceDialogues":null
            },
			{
				"id":7,
				"npcText":"By the way, that is a mighty fine helmet you have on your head!",
				"playerConversationOptions":null,
				"playerEventActions":null,
				"continuanceDialogues":null
			}
        ]
    },
    {
        "_id":2,
        "description":"Conversation with Frans, the makeover man",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":null,
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Hello",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Who are you?",
                        "nextDialogueId":13
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"Can you help me change my look?",
                        "nextDialogueId":18
                    },
                    {
                        "id":3,
                        "requirements":null,
                        "text":"Nice hair",
                        "nextDialogueId":26
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"Hey cutie, want to change your look? I can make you look fabulous",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"How can you change my look?",
                        "nextDialogueId":2
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"I already look fabulous",
                        "nextDialogueId":10
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Oh you know, maybe a suntan, a little dye here, a little snip snip there",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Snip snip?",
                        "nextDialogueId":3
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Will it hurt?",
                        "nextDialogueId":6
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"Sure, I'm ready for a new style",
                        "nextDialogueId":9
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"Oh relax sweetie it won't hurt too much",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Ok, I guess I'll try it out",
                        "nextDialogueId":4
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Uh no thanks sounds scary",
                        "nextDialogueId":5
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":4,
                "npcText":"Wonderful, lets get started then!",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"ChangeAppearance"
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":5,
                "npcText":"Fine suit yourself",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":6,
                "npcText":"Maybe",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Ok, I guess I'll try it out",
                        "nextDialogueId":7
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"No thanks, sounds dangerous",
                        "nextDialogueId":8
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":7,
                "npcText":"Wonderful, lets get started then!",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"ChangeAppearance"
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":8,
                "npcText":"Well, bye then!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":9,
                "npcText":"Great, lets get to it!",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"ChangeAppearance"
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":10,
                "npcText":"Oh you certainly do honey, but there is always room for improvement!",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Fine, improve me then",
                        "nextDialogueId":11
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"No thanks, I'm happy with the way I am",
                        "nextDialogueId":12
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":11,
                "npcText":"Wonderful, lets get started then!",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"ChangeAppearance"
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":12,
                "npcText":"Oh I just love your self confidence. Ok, bye now!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":13,
                "npcText":"I'm Frans, and I can help you with your look! So what do you say, are you ready for the new you?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"No",
                        "nextDialogueId":14
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"The new me?",
                        "nextDialogueId":15
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":14,
                "npcText":"Ok, have a good day then!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":15,
                "npcText":"Oh yes, I can see it now, you'll be the next trend-setter!",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"I've always wanted to set some trends",
                        "nextDialogueId":16
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Not interested",
                        "nextDialogueId":17
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":16,
                "npcText":"Oh how wonderful, lets get to it then!",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"ChangeAppearance"
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":17,
                "npcText":"Fine, suit yourself!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":18,
                "npcText":"Absolutely! It'll only be 5000 coins",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"5000 coins?!",
                        "nextDialogueId":19
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"What about 500?",
                        "nextDialogueId":22
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"Ok, I'm ready",
                        "nextDialogueId":25
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":19,
                "npcText":"Yep! And I guarantee you will not find a better service anywhere else",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Sorry, too expensive",
                        "nextDialogueId":20
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Ok, I'm ready",
                        "nextDialogueId":21
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":20,
                "npcText":"High class fashion doesn't come cheap!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":21,
                "npcText":"Great, lets get started!",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"ChangeAppearance"
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":22,
                "npcText":"Sorry sweetie, the price isn't negotiable!",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Sorry, too expensive",
                        "nextDialogueId":23
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Fine, 5000 it is",
                        "nextDialogueId":24
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":23,
                "npcText":"High class fashion doesn't come cheap!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":24,
                "npcText":"Great, lets get started!",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"ChangeAppearance"
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":25,
                "npcText":"Great, lets get started!",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"ChangeAppearance"
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":26,
                "npcText":"Thanks darling! What do you say, do you want to change your look?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"No",
                        "nextDialogueId":27
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"How can I change my look",
                        "nextDialogueId":28
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":27,
                "npcText":"Ok, goodbye then!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":28,
                "npcText":"Oh, don't you worry about that, leave it to me",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Ok, if you say so",
                        "nextDialogueId":29
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"On second thought, no thanks",
                        "nextDialogueId":null
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":29,
                "npcText":"Great, lets do it!",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"ChangeAppearance"
                    }
                ],
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":3,
        "description":"conversation with Man with no roof",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"A big gust of wind came and blew the roof off my house, can you believe that?",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":4,
        "description":"conversation with potato farmer",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Hey! Keep yer grubby hands off my potatoes!",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Yes sir",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"My hands aren't grubby",
                        "nextDialogueId":1
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"Don't matter, you can't harvest 'em without a pair of gloves anyway",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Thanks for the tip",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Oh can you give me a pair of gloves then",
                        "nextDialogueId":2
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Go get yer own ya little beggar",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":5,
        "description":"conversation about stupid jokes",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Hey, do you want to hear a joke?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Yes",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"No",
                        "nextDialogueId":9
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"Me too! Hey, tell me a joke!",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"No",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Uh ok... Why did the chicken cross the road?",
                        "nextDialogueId":2
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Hahaha! Thats hilarious!",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"But I didn't even get to the punchline",
                        "nextDialogueId":3
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Thanks, I'll be here all week",
                        "nextDialogueId":4
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"Punchline! Hahahaha!",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Ok...",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"I'll be going now...",
                        "nextDialogueId":null
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":4,
                "npcText":"All week? Ahahahaha!",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Haha... yeah, bye now",
                        "nextDialogueId":5
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Whats so funny about that?",
                        "nextDialogueId":6
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":5,
                "npcText":"Hahaha! Bye bye!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":6,
                "npcText":"Hahaha! I can't breath!",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"You sure are easily amused",
                        "nextDialogueId":7
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Well, bye now",
                        "nextDialogueId":null
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":7,
                "npcText":"Amused! Hahahaha! Hey, say the one about the chicken again!",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Why'd the chicken cross the road...",
                        "nextDialogueId":8
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":8,
                "npcText":"Ahaha! Its even funnier the second time!",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Thanks... I'll be going now...",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Yep, it sure is...",
                        "nextDialogueId":null
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":9,
                "npcText":"Well you're no fun!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":6,
        "description":"guard convo",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"I just enlisted, and they got me stationed way out here%%What are we supposed to be guarding out here anyways?",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":7,
        "description":"guard convo",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Sure is boring being stationed way out here",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":8,
        "description":"guard convo",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"I sure am hungry",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":9,
        "description":"farmer convo about bandits salting his fields",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"This used to be lush farmland, but a while back some bandits came and salted these fields, now hardly anything grows around here",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Why did they do that?",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Salted the fields?",
                        "nextDialogueId":2
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"Sounds to me like thats your problem",
                        "nextDialogueId":5
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"My guess is they were bribed to do it by the Imperial Legion%%They would love nothing more than to watch our Kingdom crumble",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"They dumped salt all over the ground, which prevents crops from growing",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Why did they do that?",
                        "nextDialogueId":3
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"You sound a bit salty",
                        "nextDialogueId":4
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"My guess is they were bribed to do it by the Imperial Legion%%They would love nothing more than to watch our Kingdom crumble",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":4,
                "npcText":"Oh we have a comedian over here%%I'm sure if your source of food and income was destroyed, you'd be a bit \"salty\" too!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":5,
                "npcText":"And the problem of everyone who relies on this land for their food",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":10,
        "description":"conversation with Clyde",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":null,
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Who are you",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Whats for sale boss?",
                        "nextDialogueId":4
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"Nice cape",
                        "nextDialogueId":6
                    },
                    {
                        "id":3,
                        "requirements":null,
                        "text":"What you got in the chest over there",
                        "nextDialogueId":8
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"I'm Clyde, a cape salesman! Want to buy some capes?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Sure",
                        "nextDialogueId":2
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Nope",
                        "nextDialogueId":3
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":2
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"Ok, well if you change your mind later, I'll be right here!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":4,
                "npcText":"I'm selling capes! Interested in buying any?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Sure",
                        "nextDialogueId":5
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Nope not interested",
                        "nextDialogueId":null
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":5,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":2
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":6,
                "npcText":"Thanks! I'm a cape seller, interested in buying any?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Sure",
                        "nextDialogueId":7
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Nope not interested",
                        "nextDialogueId":null
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":7,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":2
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":8,
                "npcText":"Thats where I store my products%%I'm a cape seller, interested in buying any?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Sure",
                        "nextDialogueId":9
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Nope not interested",
                        "nextDialogueId":null
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":9,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":2
                    }
                ],
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":11,
        "description":"conversation with Tenny (giant milk tavern)",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Welcome to Tenny's Giant's Milk Tavern! Freshly squeezed straight from Grompy over there",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Giant's milk?",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Why is your tavern hidden underground?",
                        "nextDialogueId":4
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"Can I milk Grompy?",
                        "nextDialogueId":6
                    },
                    {
                        "id":3,
                        "requirements":null,
                        "text":"Isn't Grompy a male giant?",
                        "nextDialogueId":8
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"Yep! Wanna buy some?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"I guess",
                        "nextDialogueId":2
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"No that sounds gross",
                        "nextDialogueId":3
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":3
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"Yes I will admit its an acquired taste",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":4,
                "npcText":"Lets just say milking giants might not be completely legal%%So, what do you say? Wanna buy some giant's milk?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Yes",
                        "nextDialogueId":5
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"No thank you",
                        "nextDialogueId":null
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":5,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":3
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":6,
                "npcText":"No he only lets me milk him",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Please",
                        "nextDialogueId":7
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Oh I understand",
                        "nextDialogueId":null
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":7,
                "npcText":"Nope we don't want to be held liable if he crushes you into a pulp",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":8,
                "npcText":"Sure is",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Oh I didn't know male giants could be milked",
                        "nextDialogueId":9
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"I think I'm gonna be sick",
                        "nextDialogueId":null
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":9,
                "npcText":"Yep, you just gotta squeeze real hard",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":12,
        "description":"conversation with Bartender (dragon slayer's inn)",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Welcome to The Dragon Slayer's Inn! Care for a drink?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Sure",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Maybe another time",
                        "nextDialogueId":2
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":4
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Alright",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":13,
        "description":"banker convo",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Welcome to the Bank of HighSpell",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"What do you do here?",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Can you protect my items?",
                        "nextDialogueId":3
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"Can I get a loan",
                        "nextDialogueId":4
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"I help look after customers' belongings",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Oh ok",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"So you can keep my items safe?",
                        "nextDialogueId":2
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Certainly!%%Just store your items in that bank chest over there, and you will be able to retrieve them later from any other bank branch",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"Certainly!%%Just store your items in that bank chest over there, and you will be able to retrieve them later from any other bank branch",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":4,
                "npcText":"How much are you looking for",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"2 coins",
                        "nextDialogueId":5
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Ten million oughta do it",
                        "nextDialogueId":6
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":5,
                "npcText":"Sorry, we don't provide loans that small",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":6,
                "npcText":"No way",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":14,
        "description":"shadow banker convo",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Welcome to the Bank of HighSpell",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"This doesn't look like a bank",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Can you protect my items?",
                        "nextDialogueId":3
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"Oh, well uh, thats because we're currently under construction",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Oh ok",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Is this really a bank, or is it a scam operation",
                        "nextDialogueId":2
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Yes",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"Sure!%%Just store your items in that trustworthy-looking chest over there, hehehe...",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":15,
        "description":"man convo about furnace",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"People smelt all sorts of ores in that furnace over there%%The public is free to use it!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":16,
        "description":"conversation with corn farmer",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"What do you call the corner of a cornfield?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"I don't know",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"What",
                        "nextDialogueId":2
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"A corner",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"A corner",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":17,
        "description":"conversation with lumberjack about money tree",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Rumor has it there are trees that grow money!",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Really? Where can I find one?",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Sounds like you'll believe anything",
                        "nextDialogueId":null
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"Not sure, haven't found one myself...%%But I haven't given up just yet!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":18,
        "description":"convo about old mans aching bones",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"My bones are aching, a storm must being coming%%Then again, maybe its because I'm too old to be hiking up this mountain...",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":19,
        "description":"convo with mountain sage",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"If one is consistent in their practice, they can achieve perfection sooner than they realize",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":20,
        "description":"convo with wizard at lightning obelisk",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"When used upon this obelisk, a scroll carved from a log may be enchanted with the power of lightning",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":21,
        "description":"convo with elder knight in caves",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"There is great evil deep within these caves, and it is my duty to make sure it stays down here%%I recommend turning back my friend",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":22,
        "description":"convo with ictirine general store owner",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Welcome to my shop%%Is there anything you're looking to buy or sell?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Show me what you're selling",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Yep I got some stuff I want to sell",
                        "nextDialogueId":2
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"Sorry I'm not interested in trading right now",
                        "nextDialogueId":3
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":5
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":5
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"Alright",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":23,
        "description":"convo with spawn general store owner",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Welcome to my shop%%Is there anything you're looking to buy or sell?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Show me what you're selling",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Yep I got some stuff I want to sell",
                        "nextDialogueId":2
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"Sorry I'm not interested in trading right now",
                        "nextDialogueId":3
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":6
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":6
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"Alright",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":24,
        "description":"convo with old man in jail",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"I didn't do it! I'm innocent, I swear! Hey, how'd you get in here anyways?%%What? The doors been unlocked this whole time?",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":25,
        "description":"convo with gnome in jail",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"So what are you in for?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Littering",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"I'm a gnome serial killer",
                        "nextDialogueId":2
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"Oh actually I'm not a criminal, I'm just visiting",
                        "nextDialogueId":3
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"Oh, yeah they like to keep this city nice and clean",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"What?%%Hey, stay away from me!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"Haha yeah me too%%Hey guards I'm not a criminal either, let me out!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":26,
        "description":"convo with lumberjack in jail",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"This is my first time in jail",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":27,
        "description":"convo with man in jail",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"I got caught pickpocketing...%%Will this go on my criminal record?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Yep",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"No don't worry they're just gonna execute you",
                        "nextDialogueId":2
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"Oh no...",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"What? But I only stole a couple of coins!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":28,
        "description":"convo with old man about water obelisk",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Earlier I saw someone enchanting a scroll on that tall blue rock right there!",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"What were they doing that for?",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Scroll?",
                        "nextDialogueId":2
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"Actually I'm not sure, I didn't ask them",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Yeah! You can make scrolls by using a chisel on some logs",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":29,
        "description":"conversation with Bar tender (the lazy warthog)",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Welcome to The Lazy Warthog! Thirsty?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Show me the beer",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"No thanks",
                        "nextDialogueId":2
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":7
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Alright, come back when you want something to drink",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":30,
        "description":"convo with Indigo general store owner",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Welcome to my shop%%Is there anything you're looking to buy or sell?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Show me what you're selling",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Yep I got some stuff I want to sell",
                        "nextDialogueId":2
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"Sorry I'm not interested in trading right now",
                        "nextDialogueId":3
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":8
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":8
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"Alright",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":31,
        "description":"convo with fisherman at ictirine docks",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"I once caught a ten foot snapping turtle right here in this lake, but no one believes me%%You believe me right?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Sure I believe you",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Ten feet long or ten feet wide?",
                        "nextDialogueId":2
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"How big is that in meters?",
                        "nextDialogueId":5
                    },
                    {
                        "id":3,
                        "requirements":null,
                        "text":"I thought turtles only had four feet",
                        "nextDialogueId":6
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"Finally someone who believes me!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Ten feet wide",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Oh then no I don't believe you",
                        "nextDialogueId":3
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Thats nothing I once caught an eleven footer",
                        "nextDialogueId":4
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"Its true, I swear!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":4,
                "npcText":"I don't believe you%%Hey now you know how I feel!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":5,
                "npcText":"Actually I don't know",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":6,
                "npcText":"...",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":32,
        "description":"old man tells a dumb secret about not brushing his teeth",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Hey I'll tell you a secret for 3 coins",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":[
                            {
                                "desc":"player needs to have 3 or more coins in their inventory to view this option",
                                "type":"inventoryitem",
                                "itemid":6,
                                "isiou":false,
                                "amount":3,
                                "operator":">="
                            }
                        ],
                        "text":"Ok heres 3 coins",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Not worth it",
                        "nextDialogueId":5
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"How about I just kill you if you don't tell me",
                        "nextDialogueId":6
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"Great, thanks",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Well whats the secret?",
                        "nextDialogueId":2
                    }
                ],
                "playerEventActions":[
                    {
                        "desc":"player gives 3 coins",
                        "type":"PlayerGiveItems",
                        "playerGiveItems":[
                            {
                                "id":6,
                                "isIOU":false,
                                "amt":3
                            }
                        ]
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Oh right%%This morning, I didn't brush my teeth",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Thats the secret?",
                        "nextDialogueId":3
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Thats not a secret I smelt you before I even saw you",
                        "nextDialogueId":4
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"Yep, don't tell anyone else",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":4,
                "npcText":"Hehe well either way I'm 3 coins richer now!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":5,
                "npcText":"Your loss",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":6,
                "npcText":"You wouldn't really kill an old man would you?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Let's find out",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Yeah you're right I'm not that cruel",
                        "nextDialogueId":null
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":33,
        "description":"convo with sewer guard",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"I am tasked with guarding the sewers",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Cool",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Well that stinks",
                        "nextDialogueId":1
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"Yes, it isn't a very glamorous job but someone has to do it",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Thanks for your service",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Why does someone need to guard the sewers?",
                        "nextDialogueId":2
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"You know, I actually never asked that question myself",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":34,
        "description":"sewer guard",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Please ignore the stench, thats just from the sewers%%...%%Seriously it wasn't me",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":35,
        "description":"man by sheas shields",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"I saw the coins on the ground, and traveled through the sewers for ages to get here%%Turns out there were only 5 coins, what a joke!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":36,
        "description":"Ronald",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":null,
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":[
                            {
                                "desc":"player needs to have not yet started Ronald's Trumpet quest",
                                "type":"quest",
                                "questid":0,
                                "checkpoint":0,
                                "booleanoperator":null,
                                "operator":"==="
                            }
                        ],
                        "text":"Hello there",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":[
                            {
                                "desc":"player needs to have not yet started Ronald's Trumpet quest",
                                "type":"quest",
                                "questid":0,
                                "checkpoint":0,
                                "booleanoperator":null,
                                "operator":"==="
                            }
                        ],
                        "text":"You look a bit sad, whats wrong?",
                        "nextDialogueId":2
                    },
                    {
                        "id":2,
                        "requirements":[
                            {
                                "desc":"Ronald's Trumpet",
                                "type":"quest",
                                "questid":0,
                                "checkpoint":1,
                                "booleanoperator":null,
                                "operator":"==="
                            }
                        ],
                        "text":"Why are you crying?",
                        "nextDialogueId":3
                    },
                    {
                        "id":3,
                        "requirements":[
                            {
                                "desc":"Ronald's Trumpet",
                                "type":"quest",
                                "questid":0,
                                "checkpoint":1,
                                "booleanoperator":null,
                                "operator":"==="
                            }
                        ],
                        "text":"Quit your crying kid",
                        "nextDialogueId":18
                    },
                    {
                        "id":4,
                        "requirements":[
                            {
                                "desc":"Ronald's Trumpet",
                                "type":"quest",
                                "questid":0,
                                "checkpoint":2,
                                "booleanoperator":null,
                                "operator":"==="
                            }
                        ],
                        "text":"I hope you never find your trumpet again",
                        "nextDialogueId":19
                    },
                    {
                        "id":5,
                        "requirements":[
                            {
                                "desc":"Ronald's Trumpet",
                                "type":"quest",
                                "questid":0,
                                "checkpoint":2,
                                "booleanoperator":null,
                                "operator":"==="
                            }
                        ],
                        "text":"So where'd you last see your trumpet?",
                        "nextDialogueId":20
                    },
                    {
                        "id":6,
                        "requirements":[
                            {
                                "desc":"Ronald's Trumpet",
                                "type":"quest",
                                "questid":0,
                                "checkpoint":3,
                                "booleanoperator":null,
                                "operator":"==="
                            }
                        ],
                        "text":"How exactly do I get underground?",
                        "nextDialogueId":25
                    },
                    {
                        "id":7,
                        "requirements":[
                            {
                                "desc":"Ronald's Trumpet",
                                "type":"quest",
                                "questid":0,
                                "checkpoint":3,
                                "booleanoperator":null,
                                "operator":"==="
                            }
                        ],
                        "text":"Why don't you go to this \"secret entrance\" yourself?",
                        "nextDialogueId":26
                    },
                    {
                        "id":8,
                        "requirements":[
                            {
                                "desc":"Ronald's Trumpet",
                                "type":"quest",
                                "questid":0,
                                "checkpoint":4,
                                "booleanoperator":null,
                                "operator":"==="
                            }
                        ],
                        "text":"I found the secret entrance",
                        "fullText":"I found the secret entrance, but apparently I need a password to get in",
                        "nextDialogueId":27
                    },
                    {
                        "id":9,
                        "requirements":[
                            {
                                "desc":"Ronald's Trumpet",
                                "type":"quest",
                                "questid":0,
                                "checkpoint":5,
                                "booleanoperator":null,
                                "operator":"==="
                            }
                        ],
                        "text":"What was the password again?",
                        "nextDialogueId":35
                    },
                    {
                        "id":10,
                        "requirements":[
                            {
                                "desc":"Ronald's Trumpet",
                                "type":"quest",
                                "questid":0,
                                "checkpoint":5,
                                "booleanoperator":null,
                                "operator":"==="
                            }
                        ],
                        "text":"I give up",
                        "fullText":"You know what, I give up. You can go get your trumpet yourself",
                        "nextDialogueId":36
                    },
                    {
                        "id":11,
                        "requirements":[
                            {
                                "desc":"Ronald's Trumpet",
                                "type":"quest",
                                "questid":0,
                                "checkpoint":6,
                                "booleanoperator":null,
                                "operator":"==="
                            },
                            {
                                "desc":"Needs to not have a Trumpet in inventory",
                                "type":"inventoryitem",
                                "itemid":230,
                                "isiou":false,
                                "amount":0,
                                "operator":"<="
                            }
                        ],
                        "text":"Hello",
                        "nextDialogueId":37
                    },
                    {
                        "id":12,
                        "requirements":[
                            {
                                "desc":"Ronald's Trumpet",
                                "type":"quest",
                                "questid":0,
                                "checkpoint":6,
                                "booleanoperator":null,
                                "operator":"==="
                            },
                            {
                                "desc":"Needs to not have a Trumpet in inventory",
                                "type":"inventoryitem",
                                "itemid":230,
                                "isiou":false,
                                "amount":0,
                                "operator":"<="
                            }
                        ],
                        "text":"Where is your trumpet again?",
                        "nextDialogueId":38
                    },
                    {
                        "id":13,
                        "requirements":[
                            {
                                "desc":"Ronald's Trumpet",
                                "type":"quest",
                                "questid":0,
                                "checkpoint":6,
                                "booleanoperator":null,
                                "operator":"==="
                            },
                            {
                                "desc":"Needs to not have a Trumpet in inventory",
                                "type":"inventoryitem",
                                "itemid":230,
                                "isiou":false,
                                "amount":1,
                                "operator":">="
                            }
                        ],
                        "text":"I finally found your trumpet!",
                        "fullText":"I did it, I finally found your trumpet!",
                        "nextDialogueId":39
                    },
                    {
                        "id":14,
                        "requirements":[
                            {
                                "desc":"Ronald's Trumpet",
                                "type":"quest",
                                "questid":0,
                                "checkpoint":6,
                                "booleanoperator":null,
                                "operator":"==="
                            },
                            {
                                "desc":"Needs to not have a Trumpet in inventory",
                                "type":"inventoryitem",
                                "itemid":230,
                                "isiou":false,
                                "amount":1,
                                "operator":">="
                            }
                        ],
                        "text":"Heres your stupid trumpet",
                        "nextDialogueId":40
                    },
                    {
                        "id":15,
                        "requirements":[
                            {
                                "desc":"Ronald's Trumpet",
                                "type":"quest",
                                "questid":0,
                                "checkpoint":7,
                                "booleanoperator":null,
                                "operator":"==="
                            }
                        ],
                        "text":"How goes the trumpet playing",
                        "nextDialogueId":41
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"Wahhh...%%Wahhh!%%WAHHH!!!",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"AdvanceQuest",
                        "description":"Ronald's Trumpet",
                        "questid":0,
                        "checkpoint":1,
                        "requirements":null
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Wahhh...%%Wahhh!%%WAHHH!!!",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"AdvanceQuest",
                        "description":"Ronald's Trumpet",
                        "questid":0,
                        "checkpoint":1,
                        "requirements":null
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"Wahhh...%%Wahhh!%%WAHHH!!!",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"So are you going to tell me or not?",
                        "nextDialogueId":4
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"I don't have time to deal with kids like you right now",
                        "nextDialogueId":16
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"If you don't shut up, I'll shut you up myself",
                        "nextDialogueId":17
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":4,
                "npcText":"WAHHH!!!",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Well have fun crying",
                        "nextDialogueId":5
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Fine I guess I won't help you",
                        "nextDialogueId":6
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":5,
                "npcText":"WAHHH!!!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":6,
                "npcText":"WAHHH!!!%%Wait!%%...sniff...%%You said you want to help me?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Actually I changed my mind",
                        "nextDialogueId":7
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Sure, but only if you give me one million coins",
                        "nextDialogueId":8
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"I guess",
                        "fullText":"I guess, just tell me whats wrong",
                        "nextDialogueId":9
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":7,
                "npcText":"WAHHH!!!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":8,
                "npcText":"WAHHH!!!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":9,
                "npcText":"...sniff...%%I lost my trumpet",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Oh thats good to hear, I hate trumpets",
                        "nextDialogueId":10
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Where'd you lose it at?",
                        "nextDialogueId":11
                    }
                ],
                "playerEventActions":[
                    {
                        "type":"AdvanceQuest",
                        "description":"Ronald's Trumpet",
                        "questid":0,
                        "checkpoint":2,
                        "requirements":null
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":10,
                "npcText":"WAHHH!!!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":11,
                "npcText":"Actually its in my house right here%%...sniff...%%But I locked myself out!%%WAHHH!!!",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Well that was pretty stupid of you",
                        "nextDialogueId":12
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Is there any other way to get into your house?",
                        "nextDialogueId":13
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":12,
                "npcText":"WAHHH!!!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":13,
                "npcText":"...sniff...%%Yeah...%%There is a secret entrance underground",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Alright",
                        "fullText":"Alright, I'll go find the secret entrance, and get your trumpet back!",
                        "nextDialogueId":14
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"How exactly do I get underground?",
                        "nextDialogueId":15
                    }
                ],
                "playerEventActions":[
                    {
                        "type":"AdvanceQuest",
                        "description":"Ronald's Trumpet",
                        "questid":0,
                        "checkpoint":3,
                        "requirements":null
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":14,
                "npcText":"Yay, thanks!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":15,
                "npcText":"Head west of here and you'll find the entrance of the Ictirine Sewers%%The secret entrance is somewhere down there",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":16,
                "npcText":"WAHHH!!!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":17,
                "npcText":"WAHHH!!!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":18,
                "npcText":"WAHHH!!!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":19,
                "npcText":"WAHHH!!!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":20,
                "npcText":"Actually its in my house right here%%...sniff...%%But I locked myself out!%%WAHHH!!!",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Well that was pretty stupid of you",
                        "nextDialogueId":21
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Is there any other way to get into your house?",
                        "nextDialogueId":22
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":21,
                "npcText":"WAHHH!!!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":22,
                "npcText":"...sniff...%%Yeah...%%There is a secret entrance underground",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Alright",
                        "fullText":"Alright, I'll go find the secret entrance, and get your trumpet back!",
                        "nextDialogueId":23
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"How exactly do I get underground?",
                        "nextDialogueId":24
                    }
                ],
                "playerEventActions":[
                    {
                        "type":"AdvanceQuest",
                        "description":"Ronald's Trumpet",
                        "questid":0,
                        "checkpoint":3,
                        "requirements":null
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":23,
                "npcText":"Yay, thanks!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":24,
                "npcText":"Head west of here and you'll find the entrance of the Ictirine Sewers%%The secret entrance is somewhere down there",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":25,
                "npcText":"Head west of here and you'll find the entrance of the Ictirine Sewers%%The secret entrance is somewhere down there",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":26,
                "npcText":"Because there's scary monsters down there!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":27,
                "npcText":"Oh, yep you'll need the password",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Why didn't you tell me I needed a password?",
                        "nextDialogueId":28
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"So whats the password",
                        "nextDialogueId":33
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":28,
                "npcText":"You didn't ask",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"You sure aren't making this easy",
                        "nextDialogueId":29
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"So whats the password",
                        "nextDialogueId":31
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":29,
                "npcText":"Well anyways, the password is \"password\"",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Seriously?",
                        "nextDialogueId":30
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Thats the dumbest thing I've ever heard",
                        "nextDialogueId":null
                    }
                ],
                "playerEventActions":[
                    {
                        "type":"AdvanceQuest",
                        "description":"Ronald's Trumpet",
                        "questid":0,
                        "checkpoint":5,
                        "requirements":null
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":30,
                "npcText":"Yep, I thought of it myself",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":31,
                "npcText":"Its easy%%The password is \"password\"",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Seriously?",
                        "nextDialogueId":32
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Thats the dumbest thing I've ever heard",
                        "nextDialogueId":null
                    }
                ],
                "playerEventActions":[
                    {
                        "type":"AdvanceQuest",
                        "description":"Ronald's Trumpet",
                        "questid":0,
                        "checkpoint":5,
                        "requirements":null
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":32,
                "npcText":"Yep, I thought of it myself",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":33,
                "npcText":"Its easy%%The password is \"password\"",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Seriously?",
                        "nextDialogueId":34
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Thats the dumbest thing I've ever heard",
                        "nextDialogueId":null
                    }
                ],
                "playerEventActions":[
                    {
                        "type":"AdvanceQuest",
                        "description":"Ronald's Trumpet",
                        "questid":0,
                        "checkpoint":5,
                        "requirements":null
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":34,
                "npcText":"Yep, I thought of it myself",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":35,
                "npcText":"Password",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Oh right",
                        "fullText":"Oh right how'd I forget...",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Thats the dumbest thing I've ever heard",
                        "nextDialogueId":null
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":36,
                "npcText":"No, please! Please help me get my trumpet!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":37,
                "npcText":"Hey wheres my trumpet?%%Hurry and find my trumpet!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":38,
                "npcText":"Its in a chest in my house right here%%Please hurry up and get it!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":39,
                "npcText":"Oh yay, thanks!",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"AdvanceQuest",
                        "description":"Ronald's Trumpet",
                        "questid":0,
                        "checkpoint":7,
                        "requirements":null
                    },
                    {
                        "desc":"player gives Ronald his Trumpet",
                        "type":"PlayerGiveItems",
                        "playerGiveItems":[
                            {
                                "id":230,
                                "isIOU":false,
                                "amt":1
                            }
                        ]
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":40,
                "npcText":"Oh yay, thanks!",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"AdvanceQuest",
                        "description":"Ronald's Trumpet",
                        "questid":0,
                        "checkpoint":7,
                        "requirements":null
                    },
                    {
                        "desc":"player gives Ronald his Trumpet",
                        "type":"PlayerGiveItems",
                        "playerGiveItems":[
                            {
                                "id":230,
                                "isIOU":false,
                                "amt":1
                            }
                        ]
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":41,
                "npcText":"Actually I'm bored of playing the trumpet now",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":37,
        "description":"Ronald's doorman",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Hello there",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Who are you?",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":[
                            {
                                "desc":"Ronald's Trumpet",
                                "type":"quest",
                                "questid":0,
                                "checkpoint":3,
                                "booleanoperator":null,
                                "operator":"==="
                            }
                        ],
                        "text":"Open the door",
                        "nextDialogueId":2
                    },
                    {
                        "id":2,
                        "requirements":[
                            {
                                "desc":"Ronald's Trumpet",
                                "type":"quest",
                                "questid":0,
                                "checkpoint":4,
                                "booleanoperator":null,
                                "operator":">="
                            },
                            {
                                "desc":"Ronald's Trumpet",
                                "type":"quest",
                                "questid":0,
                                "checkpoint":5,
                                "booleanoperator":null,
                                "operator":"<="
                            }
                        ],
                        "text":"Open the door",
                        "nextDialogueId":11
                    },
                    {
                        "id":3,
                        "requirements":[
                            {
                                "desc":"Ronald's Trumpet",
                                "type":"quest",
                                "questid":0,
                                "checkpoint":6,
                                "booleanoperator":null,
                                "operator":"==="
                            }
                        ],
                        "text":"Can I go in there?",
                        "nextDialogueId":26
                    },
                    {
                        "id":4,
                        "requirements":[
                            {
                                "desc":"Ronald's Trumpet",
                                "type":"quest",
                                "questid":0,
                                "checkpoint":7,
                                "booleanoperator":null,
                                "operator":"==="
                            }
                        ],
                        "text":"Can I go in there?",
                        "nextDialogueId":27
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"I'm the doorman",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Whats the password",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Banana",
                        "nextDialogueId":3
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Trumpet",
                        "nextDialogueId":4
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"Qwertyuiop",
                        "nextDialogueId":5
                    },
                    {
                        "id":3,
                        "requirements":null,
                        "text":"There's a password?",
                        "nextDialogueId":6
                    }
                ],
                "playerEventActions":[
                    {
                        "type":"AdvanceQuest",
                        "description":"Ronald's Trumpet",
                        "questid":0,
                        "checkpoint":4,
                        "requirements":null
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"Incorrect",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":4,
                "npcText":"Incorrect",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":5,
                "npcText":"Incorrect",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":6,
                "npcText":"Why of course there is%%So please give the password and I'll be able to let you in",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Banana",
                        "nextDialogueId":7
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Trumpet",
                        "nextDialogueId":8
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"Qwertyuiop",
                        "nextDialogueId":9
                    },
                    {
                        "id":3,
                        "requirements":null,
                        "text":"Ronald sent me",
                        "fullText":"Look Ronald sent me on an urgent mission, I need to get in there",
                        "nextDialogueId":10
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":7,
                "npcText":"Incorrect",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":8,
                "npcText":"Incorrect",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":9,
                "npcText":"Incorrect",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":10,
                "npcText":"Oh I see%%But I still need the password",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":11,
                "npcText":"Whats the password",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Banana",
                        "nextDialogueId":12
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Trumpet",
                        "nextDialogueId":13
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"Qwertyuiop",
                        "nextDialogueId":14
                    },
                    {
                        "id":3,
                        "requirements":[
                            {
                                "desc":"Ronald's Trumpet",
                                "type":"quest",
                                "questid":0,
                                "checkpoint":4,
                                "booleanoperator":null,
                                "operator":"==="
                            }
                        ],
                        "text":"Ronald sent me",
                        "fullText":"Look Ronald sent me on an urgent mission, I need to get in there",
                        "nextDialogueId":15
                    },
                    {
                        "id":4,
                        "requirements":[
                            {
                                "desc":"Ronald's Trumpet",
                                "type":"quest",
                                "questid":0,
                                "checkpoint":5,
                                "booleanoperator":null,
                                "operator":"==="
                            }
                        ],
                        "text":"Password",
                        "nextDialogueId":16
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":12,
                "npcText":"Incorrect",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":13,
                "npcText":"Incorrect",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":14,
                "npcText":"Incorrect",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":15,
                "npcText":"Oh I see%%But I still need the password",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":16,
                "npcText":"Yes, I need the password",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Lemon",
                        "nextDialogueId":17
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Ronald",
                        "nextDialogueId":18
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"12345678",
                        "nextDialogueId":19
                    },
                    {
                        "id":3,
                        "requirements":null,
                        "text":"Password",
                        "nextDialogueId":20
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":17,
                "npcText":"Incorrect",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":18,
                "npcText":"Incorrect",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":19,
                "npcText":"Incorrect",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":20,
                "npcText":"Yes, like I said, please tell me the password",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Pumpkin",
                        "nextDialogueId":21
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Open Sesame",
                        "nextDialogueId":22
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"1234567890",
                        "nextDialogueId":23
                    },
                    {
                        "id":3,
                        "requirements":null,
                        "text":"Password!",
                        "nextDialogueId":24
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":21,
                "npcText":"Incorrect",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":22,
                "npcText":"Incorrect",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":23,
                "npcText":"Incorrect",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":24,
                "npcText":"For the third time yes, please tell me the password%%And there's no need to yell",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Oh I guess I still don't know the password",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"I'm telling you the password is password!",
                        "nextDialogueId":25
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":25,
                "npcText":"Oh%%That's correct%%You may now enter as freely as you'd like",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"AdvanceQuest",
                        "description":"Ronald's Trumpet",
                        "questid":0,
                        "checkpoint":6,
                        "requirements":null
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":26,
                "npcText":"Sure, go on in",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":27,
                "npcText":"Yes, I recognize you from earlier%%Go on in",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":38,
        "description":"conversation with knight near giants",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Careful of those giants my friend, their behavior can be unpredictable",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":39,
        "description":"conversation with knight near giants by ictirine",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Giants are dangerous beings, you should be careful around them",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":40,
        "description":"convo with bethany",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Interested in battleaxes?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Oh yeah",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"No thanks sound too dangerous",
                        "nextDialogueId":2
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":10
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Ha, well I suppose battleaxes aren't for the weak",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":41,
        "description":"convo with shea",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Want to buy or sell some shields?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Sure",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"No",
                        "nextDialogueId":2
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":9
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Alright then",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":42,
        "description":"convo with pradmore",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Hello my friend%%Can I interest you in some scrolls?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Yes",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"No",
                        "nextDialogueId":2
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"Scrolls?",
                        "nextDialogueId":3
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":11
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Alright then",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"Yes, magical scrolls used for casting spells",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Oh, sure I'm interested",
                        "nextDialogueId":4
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"No thanks I don't believe in magic",
                        "nextDialogueId":5
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":4,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":11
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":5,
                "npcText":"Oh, well I'm sorry to hear that",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":43,
        "description":"convo with arnold",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":null,
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Want to trade?",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Can I use your anvil",
                        "nextDialogueId":2
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"What happened to your shirt",
                        "nextDialogueId":3
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"Why I'd love to",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":12
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Help yourself",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"I don't need a shirt",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":44,
        "description":"convo with generic man",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":null,
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Hello",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Weather sure is nice today",
                        "nextDialogueId":2
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"Can you give me some money",
                        "nextDialogueId":3
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"Hi there",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Yep its not too bad",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"No",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":45,
        "description":"convo with joe",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":null,
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Hello",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Let's trade",
                        "nextDialogueId":4
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"Howdy partner, any seafood you'd like to buy or sell?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Absolutely",
                        "nextDialogueId":2
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"No",
                        "nextDialogueId":3
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":13
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"Alright, well come back any time you'd like to trade!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":4,
                "npcText":"Let's!",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":13
                    }
                ],
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":46,
        "description":"convo with peggy",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":null,
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Anything for sale?",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":[
                            {
                                "desc":"player potionmaking skill less than 50",
                                "type":"skill",
                                "skill":"potionmaking",
                                "level":50,
                                "operator":"<"
                            }
                        ],
                        "text":"Whats in the room back there?",
                        "nextDialogueId":4
                    },
                    {
                        "id":2,
                        "requirements":[
                            {
                                "desc":"player potionmaking skill >= 50",
                                "type":"skill",
                                "skill":"potionmaking",
                                "level":50,
                                "operator":">="
                            }
                        ],
                        "text":"Whats in the room back there?",
                        "nextDialogueId":5
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"Yes my specialty products are potions and magic supplies",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Let's see them",
                        "nextDialogueId":2
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Not interested",
                        "nextDialogueId":3
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":14
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"Then go away",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":4,
                "npcText":"None of your business",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":5,
                "npcText":"Go see for yourself",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":47,
        "description":"conversation with lumberjack near giant squirrel",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"I think I accidentally chopped down that big squirrel's home...",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":48,
        "description":"conversation with ned",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Howdy there%%I'm Ned, and this is my squirrel ranch. I raise squirrels for their pelts%%Do you have any squirrel pelts? I'll buy five of them for 10 coins each",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":[
                            {
                                "desc":"player needs to have 5 or more squirrel pelts in their inventory to view this option",
                                "type":"inventoryitem",
                                "itemid":236,
                                "isiou":false,
                                "amount":5,
                                "operator":">="
                            }
                        ],
                        "text":"Sure, I'll sell some squirrel pelts",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":[
                            {
                                "desc":"player needs to have 5 or more squirrel pelts in their inventory to view this option",
                                "type":"inventoryitem",
                                "itemid":236,
                                "isiou":false,
                                "amount":5,
                                "operator":">="
                            }
                        ],
                        "text":"Sorry these pelts are mine",
                        "nextDialogueId":2
                    },
                    {
                        "id":2,
                        "requirements":[
                            {
                                "desc":"player needs to have less than 5 squirrel pelts in their inventory to view this option",
                                "type":"inventoryitem",
                                "itemid":236,
                                "isiou":false,
                                "amount":5,
                                "operator":"<"
                            }
                        ],
                        "text":"Sorry I don't have that many squirrel pelts",
                        "nextDialogueId":3
                    },
                    {
                        "id":3,
                        "requirements":[
                            {
                                "desc":"player needs to no squirrel pelts in their inventory to view this option",
                                "type":"inventoryitem",
                                "itemid":236,
                                "isiou":false,
                                "amount":0,
                                "operator":"<="
                            }
                        ],
                        "text":"How do I get squirrel pelts?",
                        "nextDialogueId":4
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"Great, here's your money!",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "desc":"player gives 5 squirrel pelts and receives 10 coins",
                        "type":"PlayerExchangeItems",
                        "playerGiveItems":[
                            {
                                "id":236,
                                "isIOU":false,
                                "amt":5
                            }
                        ],
                        "playerReceiveItems":[
                            {
                                "id":6,
                                "isIOU":false,
                                "amt":50
                            }
                        ]
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Well, if you change your mind please come back",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"Please come back when you do!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":4,
                "npcText":"From squirrels of course",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":49,
        "description":"convo with farmer guarding cows",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Hello there%%I'm standing guard to make sure the cows don't get out",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Cool",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Why don't you just put in a gate",
                        "nextDialogueId":1
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"Oh%%Guess I never thought of that",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":50,
        "description":"convo leprechaun-searching gnome",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":null,
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":4,
                                "booleanoperator":null,
                                "operator":"<="
                            }
                        ],
                        "text":"Hey whatcha up to?",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":5,
                                "booleanoperator":null,
                                "operator":">="
                            },
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":7,
                                "booleanoperator":null,
                                "operator":"<="
                            }
                        ],
                        "text":"Hey whatcha up to?",
                        "nextDialogueId":2
                    },
                    {
                        "id":2,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":10,
                                "booleanoperator":null,
                                "operator":">="
                            }
                        ],
                        "text":"So you caught the leprechaun huh?",
                        "nextDialogueId":3
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"We lookin' for a leprechaun, hes up there in that tree!%%I want the gold, gimme the gold!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"We did it! We done caught the leprechaun!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"Yup, we got him locked away!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":51,
        "description":"convo leprechaun-searching gnome",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":null,
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":4,
                                "booleanoperator":null,
                                "operator":"<="
                            }
                        ],
                        "text":"Hey whats up",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":5,
                                "booleanoperator":null,
                                "operator":">="
                            },
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":7,
                                "booleanoperator":null,
                                "operator":"<="
                            }
                        ],
                        "text":"Hey whats up",
                        "nextDialogueId":2
                    },
                    {
                        "id":2,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":10,
                                "booleanoperator":null,
                                "operator":">="
                            }
                        ],
                        "text":"So wheres that leprechaun at now?",
                        "nextDialogueId":3
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"Careful! Theres a magical leprechaun up in the tree!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"I'll tell you whats NOT up%%The leprechaun! He ain't up in the tree anymore, we finally caught him!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"Locked up in jail where he belongs!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":52,
        "description":"convo leprechaun-searching gnome",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":null,
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":4,
                                "booleanoperator":null,
                                "operator":"<="
                            }
                        ],
                        "text":"What are you guys doing here",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":5,
                                "booleanoperator":null,
                                "operator":">="
                            },
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":7,
                                "booleanoperator":null,
                                "operator":"<="
                            }
                        ],
                        "text":"What are you guys doing here",
                        "nextDialogueId":2
                    },
                    {
                        "id":2,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":10,
                                "booleanoperator":null,
                                "operator":">="
                            }
                        ],
                        "text":"So wheres that leprechaun you caught?",
                        "nextDialogueId":3
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"Trying to get the leprechaun up in that tree!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"We're catching leprechauns, and we just caught one!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"We got him locked up in jail!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":53,
        "description":"convo leprechaun-searching gnome",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":null,
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":0,
                                "booleanoperator":null,
                                "operator":"==="
                            }
                        ],
                        "text":"Whats everyone doing here",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":1,
                                "booleanoperator":null,
                                "operator":">="
                            },
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":5,
                                "booleanoperator":null,
                                "operator":"<="
                            }
                        ],
                        "text":"Have you caught the leprechaun yet?",
                        "nextDialogueId":10
                    },
                    {
                        "id":2,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":1,
                                "booleanoperator":null,
                                "operator":"==="
                            },
                            {
                                "desc":"player needs to not own a Leprechaun Sketch in bank, inv, or loadout",
                                "type":"playerownsitem",
                                "itemid":231,
                                "amount":0,
                                "isiou":false,
                                "operator":"==="
                            },
                            {
                                "desc":"player needs to have space in their inventory",
                                "type":"availableinventoryspace",
                                "itemid":231,
                                "isiou":false,
                                "availableslotsneeded":1,
                                "operator":">="
                            }
                        ],
                        "text":"I lost that leprechaun sketch, can you give me another?",
                        "nextDialogueId":11
                    },
                    {
                        "id":3,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":1,
                                "booleanoperator":null,
                                "operator":"==="
                            },
                            {
                                "desc":"player needs to not own a Leprechaun Sketch in bank, inv, or loadout",
                                "type":"playerownsitem",
                                "itemid":231,
                                "amount":0,
                                "isiou":false,
                                "operator":"==="
                            },
                            {
                                "desc":"player needs to have no space in their inventory",
                                "type":"availableinventoryspace",
                                "itemid":231,
                                "isiou":false,
                                "availableslotsneeded":0,
                                "operator":"==="
                            }
                        ],
                        "text":"I lost that leprechaun sketch, can you give me another?",
                        "nextDialogueId":12
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"Searching for a leprechaun!",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"A leprechaun huh?",
                        "nextDialogueId":2
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Maybe its just someone dressed up as a leprechaun",
                        "nextDialogueId":8
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"Leprechauns don't exist",
                        "nextDialogueId":9
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Yup!%%And we're after his gold!",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"How do you know he has any gold?",
                        "nextDialogueId":3
                    },
                    {
                        "id":1,
                        "requirements":[
                            {
                                "desc":"player needs to have space in their inventory",
                                "type":"availableinventoryspace",
                                "itemid":231,
                                "isiou":false,
                                "availableslotsneeded":1,
                                "operator":">="
                            }
                        ],
                        "text":"Can I help you find him?",
                        "nextDialogueId":6
                    },
                    {
                        "id":2,
                        "requirements":[
                            {
                                "desc":"player needs to have no space in their inventory",
                                "type":"availableinventoryspace",
                                "itemid":231,
                                "isiou":false,
                                "availableslotsneeded":0,
                                "operator":"==="
                            }
                        ],
                        "text":"Can I help you find him?",
                        "nextDialogueId":7
                    },
                    {
                        "id":3,
                        "requirements":null,
                        "text":"Well good luck with your search",
                        "nextDialogueId":null
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"All leprechauns have gold, don't you know anything?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Well good luck finding his gold then",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":[
                            {
                                "desc":"player needs to have space in their inventory",
                                "type":"availableinventoryspace",
                                "itemid":231,
                                "isiou":false,
                                "availableslotsneeded":1,
                                "operator":">="
                            }
                        ],
                        "text":"I see, maybe I can help you find him",
                        "nextDialogueId":4
                    },
                    {
                        "id":2,
                        "requirements":[
                            {
                                "desc":"player needs to have no space in their inventory",
                                "type":"availableinventoryspace",
                                "itemid":231,
                                "isiou":false,
                                "availableslotsneeded":0,
                                "operator":"==="
                            }
                        ],
                        "text":"I see, maybe I can help you find him",
                        "nextDialogueId":5
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":4,
                "npcText":"Alright, we could use the extra hands%%Here take this sketch I drew of the leprechaun",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"AdvanceQuest",
                        "description":"Leprechaun Flute",
                        "questid":1,
                        "checkpoint":1,
                        "requirements":null
                    },
                    {
                        "desc":"Player receives leprechaun sketch",
                        "type":"PlayerReceiveItems",
                        "playerReceiveItems":[
                            {
                                "id":231,
                                "isIOU":false,
                                "amt":1
                            }
                        ]
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":5,
                "npcText":"Alright, we could use the extra hands%%Here take this sketch I drew of the leprechaun%%Oh, looks like you have no space for this right now",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":6,
                "npcText":"Sure, we could use some extra help%%Here take this sketch I drew of the leprechaun",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"AdvanceQuest",
                        "description":"Leprechaun Flute",
                        "questid":1,
                        "checkpoint":1,
                        "requirements":null
                    },
                    {
                        "desc":"Player receives leprechaun sketch",
                        "type":"PlayerReceiveItems",
                        "playerReceiveItems":[
                            {
                                "id":231,
                                "isIOU":false,
                                "amt":1
                            }
                        ]
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":7,
                "npcText":"Sure, we could use some extra help%%Here take this sketch I drew of the leprechaun%%Oh, looks like you have no space for this right now",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":8,
                "npcText":"Yeah, its a leprechaun dressed up as a leprechaun dummy!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":9,
                "npcText":"Of course they do!%%All you gotta do is look up there in that tree!%%Who else seen the leprechaun say YEAH!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":10,
                "npcText":"Not yet, but my buddies think they saw him up there in that tree!%%Maybe you can go check it out for us",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":11,
                "npcText":"Yeah heres another",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "desc":"Player receives leprechaun sketch",
                        "type":"PlayerReceiveItems",
                        "playerReceiveItems":[
                            {
                                "id":231,
                                "isIOU":false,
                                "amt":1
                            }
                        ]
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":12,
                "npcText":"Yeah heres another%%Oh it seems your inventory is full right now",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":54,
        "description":"convo with leprechaun searching gnome (tree)",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"We finally caught the leprechaun!",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":5,
                                "booleanoperator":null,
                                "operator":"==="
                            }
                        ],
                        "text":"Congratulations!",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":5,
                                "booleanoperator":null,
                                "operator":"==="
                            }
                        ],
                        "text":"Where did you take him?",
                        "nextDialogueId":2
                    },
                    {
                        "id":2,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":6,
                                "booleanoperator":null,
                                "operator":">="
                            }
                        ],
                        "text":"Congratulations!",
                        "nextDialogueId":null
                    },
                    {
                        "id":3,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":6,
                                "booleanoperator":null,
                                "operator":">="
                            }
                        ],
                        "text":"Where did you take him?",
                        "nextDialogueId":3
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"AdvanceQuest",
                        "description":"Leprechaun Flute",
                        "questid":1,
                        "checkpoint":6,
                        "requirements":null
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Now don't you worry about that",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"AdvanceQuest",
                        "description":"Leprechaun Flute",
                        "questid":1,
                        "checkpoint":6,
                        "requirements":null
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"Now don't you worry about that",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":55,
        "description":"conversation with O'Shammy (tree)",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":null,
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":1,
                                "booleanoperator":null,
                                "operator":"==="
                            }
                        ],
                        "text":"What are you doing up here",
                        "fullText":"Hey what are you doing up here?",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":1,
                                "booleanoperator":null,
                                "operator":"==="
                            },
                            {
                                "desc":"player needs to have no leprechaun sketch in inventory",
                                "type":"inventoryitem",
                                "itemid":231,
                                "isiou":false,
                                "amount":0,
                                "operator":"==="
                            }
                        ],
                        "text":"Are you a leprechaun?",
                        "nextDialogueId":4
                    },
                    {
                        "id":2,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":1,
                                "booleanoperator":null,
                                "operator":"==="
                            },
                            {
                                "desc":"player needs to have a leprechaun sketch in inventory",
                                "type":"inventoryitem",
                                "itemid":231,
                                "isiou":false,
                                "amount":1,
                                "operator":">="
                            }
                        ],
                        "text":"Are you a leprechaun?",
                        "nextDialogueId":6
                    },
                    {
                        "id":3,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":2,
                                "booleanoperator":null,
                                "operator":"==="
                            }
                        ],
                        "text":"What am I supposed to be doing again?",
                        "nextDialogueId":16
                    },
                    {
                        "id":4,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":3,
                                "booleanoperator":null,
                                "operator":"==="
                            },
                            {
                                "desc":"player needs to have no space in their inventory",
                                "type":"availableinventoryspace",
                                "itemid":295,
                                "isiou":false,
                                "availableslotsneeded":0,
                                "operator":"==="
                            }
                        ],
                        "text":"I found your buddy",
                        "fullText":"I found your buddy, but hes saying he isn't a leprechaun",
                        "nextDialogueId":17
                    },
                    {
                        "id":5,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":3,
                                "booleanoperator":null,
                                "operator":"==="
                            },
                            {
                                "desc":"player needs to have space in their inventory",
                                "type":"availableinventoryspace",
                                "itemid":295,
                                "isiou":false,
                                "availableslotsneeded":1,
                                "operator":">="
                            }
                        ],
                        "text":"I found your buddy",
                        "fullText":"I found your buddy, but hes saying he isn't a leprechaun",
                        "nextDialogueId":18
                    },
                    {
                        "id":6,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":4,
                                "booleanoperator":null,
                                "operator":"==="
                            }
                        ],
                        "text":"What am I supposed to do again?",
                        "nextDialogueId":19
                    },
                    {
                        "id":7,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":4,
                                "booleanoperator":null,
                                "operator":"==="
                            },
                            {
                                "desc":"player needs to not own a Leprechaun hat in bank, inv, or loadout",
                                "type":"playerownsitem",
                                "itemid":295,
                                "amount":0,
                                "isiou":false,
                                "operator":"==="
                            },
                            {
                                "desc":"player needs to have no space in their inventory",
                                "type":"availableinventoryspace",
                                "itemid":295,
                                "isiou":false,
                                "availableslotsneeded":0,
                                "operator":"==="
                            }
                        ],
                        "text":"Can I have another Leprechaun Hat? I lost mine",
                        "nextDialogueId":20
                    },
                    {
                        "id":8,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":4,
                                "booleanoperator":null,
                                "operator":"==="
                            },
                            {
                                "desc":"player needs to not own a Leprechaun hat in bank, inv, or loadout",
                                "type":"playerownsitem",
                                "itemid":295,
                                "amount":0,
                                "isiou":false,
                                "operator":"==="
                            },
                            {
                                "desc":"player needs to have no space in their inventory",
                                "type":"availableinventoryspace",
                                "itemid":295,
                                "isiou":false,
                                "availableslotsneeded":1,
                                "operator":">="
                            }
                        ],
                        "text":"Can I have another Leprechaun Hat? I lost mine",
                        "nextDialogueId":21
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"Why I's just be enjoying the view up here",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Oh, yep its a nice view from up here",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"I'm looking for a leprechaun",
                        "nextDialogueId":2
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Oh well good luck",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Thanks",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"You kind of look like a leprechaun",
                        "nextDialogueId":3
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"Why, you's be mistaken my friend%%Now go 'n run along now, ya hear?",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":4,
                "npcText":"Of course I's not a leprechaun, why you's be askin' that?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Short, orange hair, green clothes...",
                        "nextDialogueId":5
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"You're right, I have no reason to ask that",
                        "nextDialogueId":null
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":5,
                "npcText":"Oh so you's be stereotypin' me, eh?%%I's not no leprechaun, now you's leave me be!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":6,
                "npcText":"Of course I's not a leprechaun, why you's be sayin' that?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Short, orange hair, green clothes...",
                        "nextDialogueId":7
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Some gnomes gave me this sketch, looks just like you",
                        "nextDialogueId":8
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":7,
                "npcText":"Oh so you's be stereotypin' me, eh?%%I's not no leprechaun, now you's leave me be!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":8,
                "npcText":"What sketch?%%Lemme take a look at that...%%...%%Why this be lookin' nothin' like me!",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Looks just like you",
                        "fullText":"Looks just like you, the similarity is uncanny",
                        "nextDialogueId":9
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"You're right this sketch is terrible",
                        "nextDialogueId":null
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":9,
                "npcText":"So some gnomes gave this to ya?%%Are you one of them?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Do I look like a gnome to you?",
                        "nextDialogueId":10
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Yeah I'm just a tall gnome",
                        "nextDialogueId":15
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":10,
                "npcText":"Well are ye workin' together with them gnomes?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Nope, they seem a bit fishy",
                        "nextDialogueId":11
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Yeah we're working together to find the leprechaun",
                        "nextDialogueId":14
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":11,
                "npcText":"In that case, ye gotta help me!%%Them gnomes be after me gold!%%If I come down from this tree, they'll catch me for sure!%%If only I had me lucky Leprechaun Flute...",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Lucky Leprechaun Flute?",
                        "nextDialogueId":12
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Well good luck getting down from here",
                        "nextDialogueId":null
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":12,
                "npcText":"Yeah, it'll let me teleport far away from here!%%Say, you wouldn't mind goin' and gettin' it for me, would ya?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Sure I'll go get it",
                        "nextDialogueId":13
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Sorry you're on your own pal",
                        "nextDialogueId":null
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":13,
                "npcText":"Great!%%There be an old lookin hut to the East, a buddy o' mine who lives there'll give it to ya!%%Just tell him O'Shammy sent ya!",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"AdvanceQuest",
                        "description":"Leprechaun Flute",
                        "questid":1,
                        "checkpoint":2,
                        "requirements":null
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":14,
                "npcText":"Well good luck findin' him",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":15,
                "npcText":"Oh%%Well like I told ye earlier, I's not a leprechaun",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":16,
                "npcText":"I needs you to get me lucky Leprechaun flute%%An old buddy o' mine lives in a hut to the East of here, he'll give it to ya!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":17,
                "npcText":"Oh, yea we leprechauns gotta lay low%%Lots of folks always be comin' after our gold%%Can't trust anyone%%Alright, I got an idea%%Take this here Leprechaun Hat, then maybe McGoldy'll think you are a leprechaun%%Might be willin' to help you out then%%Oops, looks like your inventory is too full to hold my Leprechaun Hat right now",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":18,
                "npcText":"Oh, yea we leprechauns gotta lay low%%Lots of folks always be comin' after our gold%%Can't trust anyone%%Alright, I got an idea%%Take this here Leprechaun Hat, then maybe McGoldy'll think you are a leprechaun%%Might be willin' to help you out then",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"AdvanceQuest",
                        "description":"Leprechaun Flute",
                        "questid":1,
                        "checkpoint":4,
                        "requirements":null
                    },
                    {
                        "desc":"Player receives leprechaun hat",
                        "type":"PlayerReceiveItems",
                        "playerReceiveItems":[
                            {
                                "id":295,
                                "isIOU":false,
                                "amt":1
                            }
                        ]
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":19,
                "npcText":"Go 'n talk to McGoldy while wearin' that Leprechaun Hat I gave ya%%Otherwise, he won't be trustin' ya too well",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":20,
                "npcText":"You think Leprechaun Hats just grow on trees or somethin'?%%Lucky for you, with a little bit o' Leprechaun Magic, I actually can make a new one grow on this here tree%%Now be a bit more careful next time, ya hear?%%Aye, your inventory be too full for me to give you a new Leprechaun Hat right now",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":21,
                "npcText":"You think Leprechaun Hats just grow on trees or somethin'?%%Lucky for you, with a little bit o' Leprechaun Magic, I actually can make a new one grow on this here tree%%Now be a bit more careful next time, ya hear?",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "desc":"Player receives leprechaun hat",
                        "type":"PlayerReceiveItems",
                        "playerReceiveItems":[
                            {
                                "id":295,
                                "isIOU":false,
                                "amt":1
                            }
                        ]
                    }
                ],
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":56,
        "description":"conversation with O'Shammy (jail)",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":null,
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":9,
                                "booleanoperator":null,
                                "operator":"==="
                            },
                            {
                                "desc":"player needs to have 0 Leprechaun Flute in their inventory",
                                "type":"inventoryitem",
                                "itemid":297,
                                "isiou":false,
                                "amount":0,
                                "operator":"==="
                            }
                        ],
                        "text":"Let's get you out of here!",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":9,
                                "booleanoperator":null,
                                "operator":"==="
                            },
                            {
                                "desc":"player needs to have 1 or more Leprechaun Flute in their inventory",
                                "type":"inventoryitem",
                                "itemid":297,
                                "isiou":false,
                                "amount":1,
                                "operator":">="
                            }
                        ],
                        "text":"Let's get you out of here!",
                        "nextDialogueId":4
                    },
                    {
                        "id":2,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":10,
                                "booleanoperator":null,
                                "operator":">="
                            }
                        ],
                        "text":"Why are you still here?",
                        "nextDialogueId":7
                    },
                    {
                        "id":3,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":10,
                                "booleanoperator":null,
                                "operator":">="
                            }
                        ],
                        "text":"Can I get a Leprechaun Flute for myself?",
                        "nextDialogueId":8
                    },
                    {
                        "id":4,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":10,
                                "booleanoperator":null,
                                "operator":">="
                            },
                            {
                                "desc":"player needs to not own a Leprechaun Hat in bank, inv, or loadout",
                                "type":"playerownsitem",
                                "itemid":295,
                                "amount":0,
                                "isiou":false,
                                "operator":"==="
                            },
                            {
                                "desc":"player needs to have no space in their inventory",
                                "type":"availableinventoryspace",
                                "itemid":295,
                                "isiou":false,
                                "availableslotsneeded":0,
                                "operator":"==="
                            }
                        ],
                        "text":"Can I have another Leprechaun Hat?",
                        "nextDialogueId":9
                    },
                    {
                        "id":5,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":10,
                                "booleanoperator":null,
                                "operator":">="
                            },
                            {
                                "desc":"player needs to not own a Leprechaun Hat in bank, inv, or loadout",
                                "type":"playerownsitem",
                                "itemid":295,
                                "amount":0,
                                "isiou":false,
                                "operator":"==="
                            },
                            {
                                "desc":"player needs to have some space in their inventory",
                                "type":"availableinventoryspace",
                                "itemid":295,
                                "isiou":false,
                                "availableslotsneeded":1,
                                "operator":">="
                            }
                        ],
                        "text":"Can I have another Leprechaun Hat?",
                        "nextDialogueId":10
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"You came to rescue me!%%But you don't have me lucky Leprechaun Flute?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Who cares? Just follow me out of this place!",
                        "nextDialogueId":2
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Oops I forgot it",
                        "nextDialogueId":3
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Its too risky, there be far too many gnomes around here, we'll get caught for sure!%%Please come back and bring me lucky Leprechaun Flute!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"Please go back and get it! Otherwise, escapin' from here is a too risky for me liking",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":4,
                "npcText":"You're here! And you brought me lucky Leprechaun Flute with ya!%%Hand it over to me, and I'll be able to teleport out of here!",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Here you go!",
                        "nextDialogueId":5
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"No way, this flute belongs to me",
                        "nextDialogueId":6
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":5,
                "npcText":"Thank you!",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"AdvanceQuest",
                        "description":"Leprechaun Flute",
                        "questid":1,
                        "checkpoint":10,
                        "requirements":null
                    },
                    {
                        "desc":"player gives leprechaun flute",
                        "type":"PlayerGiveItems",
                        "playerGiveItems":[
                            {
                                "id":297,
                                "isIOU":false,
                                "amt":1
                            }
                        ]
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":6,
                "npcText":"You big greedy human! Let me have it!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":7,
                "npcText":"Don't you worry, I'll be leaving here shortly",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":8,
                "npcText":"Why certainly, just go back to that ol' house and feel free to take one!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":9,
                "npcText":"Alright, but be a bit more careful with it next time%%Oops, looks like your inventory is full",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":10,
                "npcText":"Alright, but be a bit more careful with it next time",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "desc":"Player receives leprechaun hat",
                        "type":"PlayerReceiveItems",
                        "playerReceiveItems":[
                            {
                                "id":295,
                                "isIOU":false,
                                "amt":1
                            }
                        ]
                    }
                ],
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":57,
        "description":"convo with McGoldy",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":null,
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":2,
                                "booleanoperator":null,
                                "operator":"<="
                            }
                        ],
                        "text":"Whatcha doin?",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":1,
                                "booleanoperator":null,
                                "operator":"<="
                            }
                        ],
                        "text":"Can I go in your house",
                        "fullText":"Hey can I go in your house?",
                        "nextDialogueId":2
                    },
                    {
                        "id":2,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":2,
                                "booleanoperator":null,
                                "operator":"==="
                            }
                        ],
                        "text":"Can I go in your house",
                        "fullText":"Hey can I go in your house?",
                        "nextDialogueId":3
                    },
                    {
                        "id":3,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":3,
                                "booleanoperator":null,
                                "operator":"==="
                            }
                        ],
                        "text":"You sure you aren't a leprechaun?",
                        "fullText":"Are you sure you aren't a leprechaun? You look just like one",
                        "nextDialogueId":7
                    },
                    {
                        "id":4,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":3,
                                "booleanoperator":null,
                                "operator":">="
                            },
                            {
                                "desc":"player needs to NOT have leprechaun hat equipped",
                                "type":"equippeditem",
                                "equipmenttype":"helmet",
                                "itemids":[
                                    295
                                ],
                                "isequipped":false
                            }
                        ],
                        "text":"Hello",
                        "nextDialogueId":8
                    },
                    {
                        "id":5,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":4,
                                "booleanoperator":null,
                                "operator":"==="
                            },
                            {
                                "desc":"player needs to have leprechaun hat equipped",
                                "type":"equippeditem",
                                "equipmenttype":"helmet",
                                "itemids":[
                                    295
                                ],
                                "isequipped":true
                            }
                        ],
                        "text":"Hello",
                        "nextDialogueId":9
                    },
                    {
                        "id":6,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":5,
                                "booleanoperator":null,
                                "operator":"==="
                            },
                            {
                                "desc":"player needs to have leprechaun hat equipped",
                                "type":"equippeditem",
                                "equipmenttype":"helmet",
                                "itemids":[
                                    295
                                ],
                                "isequipped":true
                            },
                            {
                                "desc":"player needs to not own a Leprechaun Flute in bank, inv, or loadout",
                                "type":"playerownsitem",
                                "itemid":297,
                                "amount":0,
                                "isiou":false,
                                "operator":"==="
                            }
                        ],
                        "text":"Where is the Leprechaun Flute?",
                        "nextDialogueId":18
                    },
                    {
                        "id":7,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":5,
                                "booleanoperator":null,
                                "operator":"==="
                            },
                            {
                                "desc":"player needs to have leprechaun hat equipped",
                                "type":"equippeditem",
                                "equipmenttype":"helmet",
                                "itemids":[
                                    295
                                ],
                                "isequipped":true
                            },
                            {
                                "desc":"player needs to own a Leprechaun Flute in bank, inv, or loadout",
                                "type":"playerownsitem",
                                "itemid":297,
                                "amount":1,
                                "isiou":false,
                                "operator":">="
                            }
                        ],
                        "text":"I found the Leprechaun Flute!",
                        "nextDialogueId":19
                    },
                    {
                        "id":8,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":6,
                                "booleanoperator":null,
                                "operator":">="
                            },
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":10,
                                "booleanoperator":null,
                                "operator":"<="
                            },
                            {
                                "desc":"player needs to have leprechaun hat equipped",
                                "type":"equippeditem",
                                "equipmenttype":"helmet",
                                "itemids":[
                                    295
                                ],
                                "isequipped":true
                            }
                        ],
                        "text":"Hello",
                        "nextDialogueId":20
                    },
                    {
                        "id":9,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":6,
                                "booleanoperator":null,
                                "operator":"==="
                            },
                            {
                                "desc":"player needs to have leprechaun hat equipped",
                                "type":"equippeditem",
                                "equipmenttype":"helmet",
                                "itemids":[
                                    295
                                ],
                                "isequipped":true
                            }
                        ],
                        "text":"The gnomes got O'Shammy",
                        "fullText":"Bad news, the gnomes got O'Shammy",
                        "nextDialogueId":21
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"Just be standin' here, mindin' me own business, now you mind yours!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"No now beat it",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"No now beat it",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Beat what?",
                        "nextDialogueId":4
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"O'Shammy sent me",
                        "nextDialogueId":5
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":4,
                "npcText":"It%%Just beat it",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":5,
                "npcText":"O'Shammy?%%I mean, I uh%%I don't knows anyone named O'Shammy, now beat it",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Oh my mistake",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Hes a leprechaun just like you",
                        "fullText":"You know, your ol' buddy O'Shammy, hes a leprechaun just like you",
                        "nextDialogueId":6
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":6,
                "npcText":"Who you's be callin' a leprechaun?%%I ain't no leprechaun, and I don't knows any leprechauns either%%Now leave me be, ya hear?",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"AdvanceQuest",
                        "description":"Leprechaun Flute",
                        "questid":1,
                        "checkpoint":3,
                        "requirements":null
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":7,
                "npcText":"Of course I'm sure%%Why wouldn't I be sure%%I ain't a leprechaun, no you go 'n move along now",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":8,
                "npcText":"Are you deaf? I said get lost!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":9,
                "npcText":"Hello there%%Say I don't recognize you%%Aren't you a little tall for a leprechaun?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Aren't YOU a little short for a leprechaun?",
                        "nextDialogueId":10
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"I'm half giant, half leprechaun",
                        "fullText":"My mom's a giant, but my dad's a leprechaun. He always had a thing for taller ladies",
                        "nextDialogueId":11
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"No you're just short",
                        "nextDialogueId":12
                    },
                    {
                        "id":3,
                        "requirements":null,
                        "text":"A witch cast a growing spell on me",
                        "fullText":"A witch cast a growing spell on me a few nights ago, now I can't stop growing",
                        "nextDialogueId":13
                    },
                    {
                        "id":4,
                        "requirements":null,
                        "text":"I'm actually a human disguised as a leprechaun",
                        "nextDialogueId":17
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":10,
                "npcText":"Why no%%I reckon I be normal height for a leprechaun",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":11,
                "npcText":"Impossible!%%Giants cannot mate with us leprechauns",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":12,
                "npcText":"Actually I'm quite normal height",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":13,
                "npcText":"Oh I hears ya%%Them witches be crazy",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Just kidding, I'm a human",
                        "fullText":"Just kidding, I'm a human!",
                        "nextDialogueId":14
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"So wheres the pot of gold at?",
                        "nextDialogueId":15
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"O'Shammy is in trouble",
                        "fullText":"O'Shammy is in trouble, he said he needs his Leprechaun Flute",
                        "nextDialogueId":16
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":14,
                "npcText":"What?!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":15,
                "npcText":"Me gold be at the end of a rainbow of course",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":16,
                "npcText":"Aye, ye don't say!%%That O'Shammy always be getting himself into trouble%%Alright, go on in the house, you'll find a Leprechaun Flute inside",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"AdvanceQuest",
                        "description":"Leprechaun Flute",
                        "questid":1,
                        "checkpoint":5,
                        "requirements":null
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":17,
                "npcText":"Nonsense, no human could ever get a hold of a leprechaun hat like that",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":18,
                "npcText":"Just inside this here house, there be a little green chest. The flute be in there!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":19,
                "npcText":"Good! Now go give it to O'Shammy!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":20,
                "npcText":"Hello again me friend%%Feel free to use this safehouse as ye wish",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":21,
                "npcText":"Aye that be bad news indeed",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Any idea where he might be?",
                        "nextDialogueId":22
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"What do you think they'll do to him",
                        "nextDialogueId":23
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":22,
                "npcText":"I haven't a clue my friend%%Just try searchin' around the area for him",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":23,
                "npcText":"Oh I dare not think of what gnomes may do to a leprechaun",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Why do gnomes want to capture leprechauns",
                        "fullText":"Why do gnomes want to capture leprechauns anyways?",
                        "nextDialogueId":24
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"So are you going to help find him?",
                        "nextDialogueId":25
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":24,
                "npcText":"I reckon they be a bit jealous of our tall stature%%Relatively speaking, mind you",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":25,
                "npcText":"Heavens no%%When gnomes are involved, it be every leprechaun for himself",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":58,
        "description":"conversation with McBoozy",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":null,
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Howdy friend",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":6,
                                "booleanoperator":null,
                                "operator":"==="
                            }
                        ],
                        "text":"Whats are you doing here?",
                        "fullText":"Whats a leprechaun like you doing here?",
                        "nextDialogueId":2
                    },
                    {
                        "id":2,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":7,
                                "booleanoperator":null,
                                "operator":"==="
                            },
                            {
                                "desc":"player needs to have 0 half beers in their inventory",
                                "type":"inventoryitem",
                                "itemid":160,
                                "isiou":false,
                                "amount":0,
                                "operator":"==="
                            },
                            {
                                "desc":"player needs to have 0 beers in their inventory",
                                "type":"inventoryitem",
                                "itemid":159,
                                "isiou":false,
                                "amount":0,
                                "operator":"==="
                            }
                        ],
                        "text":"What'd you want me to do again?",
                        "nextDialogueId":8
                    },
                    {
                        "id":3,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":7,
                                "booleanoperator":null,
                                "operator":"==="
                            },
                            {
                                "desc":"player needs to have 1 or more half beers in their inventory",
                                "type":"inventoryitem",
                                "itemid":160,
                                "isiou":false,
                                "amount":1,
                                "operator":">="
                            },
                            {
                                "desc":"player needs to have 0 beers in their inventory",
                                "type":"inventoryitem",
                                "itemid":159,
                                "isiou":false,
                                "amount":0,
                                "operator":"==="
                            }
                        ],
                        "text":"Got your beer right here!",
                        "nextDialogueId":9
                    },
                    {
                        "id":4,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":7,
                                "booleanoperator":null,
                                "operator":"==="
                            },
                            {
                                "desc":"player needs to have 1 or more beers in their inventory",
                                "type":"inventoryitem",
                                "itemid":159,
                                "isiou":false,
                                "amount":1,
                                "operator":">="
                            }
                        ],
                        "text":"Heres your beer",
                        "nextDialogueId":10
                    },
                    {
                        "id":5,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":8,
                                "booleanoperator":null,
                                "operator":"==="
                            }
                        ],
                        "text":"So what are you up to down here",
                        "nextDialogueId":11
                    },
                    {
                        "id":6,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":9,
                                "booleanoperator":null,
                                "operator":"==="
                            },
                            {
                                "desc":"player needs to have 0 gnome jail key in their inventory",
                                "type":"inventoryitem",
                                "itemid":296,
                                "isiou":false,
                                "amount":0,
                                "operator":"==="
                            }
                        ],
                        "text":"Jail key?",
                        "nextDialogueId":14
                    },
                    {
                        "id":7,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":9,
                                "booleanoperator":null,
                                "operator":"==="
                            },
                            {
                                "desc":"player needs to have 1 or more gnome jail key in their inventory",
                                "type":"inventoryitem",
                                "itemid":296,
                                "isiou":false,
                                "amount":1,
                                "operator":">="
                            }
                        ],
                        "text":"I found the jail key",
                        "nextDialogueId":15
                    },
                    {
                        "id":8,
                        "requirements":[
                            {
                                "desc":"Leprechaun Flute",
                                "type":"quest",
                                "questid":1,
                                "checkpoint":10,
                                "booleanoperator":null,
                                "operator":">="
                            }
                        ],
                        "text":"O'Shammy is free now!",
                        "nextDialogueId":18
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"*Hick*%%Howdy partner",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"*Hick*%%Who are you's callin' a leprechaun",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"You",
                        "nextDialogueId":3
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Sorry I thought you were a leprechaun",
                        "nextDialogueId":7
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"Why, I am no leprechaun...%%*Hick*",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"But you look just like one",
                        "nextDialogueId":4
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Are you drunk?",
                        "nextDialogueId":5
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"So what are you doing here",
                        "nextDialogueId":6
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":4,
                "npcText":"Oh yeah%%*Hick*%%So you just be goin' around callin' every short, orange haired man with a green hat a leprechaun eh?%%*Hick*%%You go on and get outta here, ya hear? Else there be trouble comin' your way!%%*Hick*",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":5,
                "npcText":"*Hick*%%Drunk?%%Of course me isn't drunk%%*Hick*%%Why I's only had three or four pints",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":6,
                "npcText":"Why, I be uh%%*Hick*%%You knows what%%Go 'n bring me a tall glass of beer%%*Hick*%%Then I tells ya what I be doin' here",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"AdvanceQuest",
                        "description":"Leprechaun Flute",
                        "questid":1,
                        "checkpoint":7,
                        "requirements":null
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":7,
                "npcText":"Well then%%*Hick*%%Apology accepted%%*Hick*",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":8,
                "npcText":"Go 'n bring me a nice tall glass o' beer%%*Hick*",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":9,
                "npcText":"*Hick*%%Hand it over 'ere%%Aye, whats this? I said a tall glass o' beer, what you tryin' to pull on me?",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":10,
                "npcText":"*Hick*%%Hand 'er over to me%%*Hick*",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"AdvanceQuest",
                        "description":"Leprechaun Flute",
                        "questid":1,
                        "checkpoint":8,
                        "requirements":null
                    },
                    {
                        "desc":"player gives one beer",
                        "type":"PlayerGiveItems",
                        "playerGiveItems":[
                            {
                                "id":159,
                                "isIOU":false,
                                "amt":1
                            }
                        ]
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":11,
                "npcText":"*Hick*%%Earlier, I was outside, searchin' for me friend O'Shammy%%*Hick*%%'n I saw some gnomes gone up a tree 'n captured him%%*Hick*%%Took him down under this here hill%%Afterwards, I o'erheard some gnomes talkin' about a jail key in this here storage area%%*Hick*%%Well I get to searchin' these crates, 'n low and behold I go 'n stumble upon a crate filled with beer%%*Hick*%%'nforunately, I drank all the beer%%*Hick*",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Jail key?",
                        "nextDialogueId":12
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"So you'd rather drink that help get your friend out of jail?",
                        "nextDialogueId":13
                    }
                ],
                "playerEventActions":[
                    {
                        "type":"AdvanceQuest",
                        "description":"Leprechaun Flute",
                        "questid":1,
                        "checkpoint":9,
                        "requirements":null
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":12,
                "npcText":"Yep, gotta get that key to free me ol' friend!%%*Hick*",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":13,
                "npcText":"*Hick*%%Who says I can't do both%%*Hick*",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":14,
                "npcText":"Yep, gotta get that key to free me ol' friend!%%Its hidden in one of these here crates%%*Hick*",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":15,
                "npcText":"Great!%%*Hick*%%Say, you mind goin' 'n gettin' me friend outta jail?%%*Hick*%%I think me's had a bit too much to drink%%*Hick*",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Fine, I'll do it myself",
                        "nextDialogueId":16
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Wheres the jail at exactly?",
                        "nextDialogueId":17
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":16,
                "npcText":"*Hick*%%Thanks ol' buddy!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":17,
                "npcText":"I reckon it be down here%%*Hick*%%I saw a big ol' rock blocking a passage way though, so ye gonna need to figure out how to get past that%%*Hick*",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":18,
                "npcText":"Why that's great news!%%Oh, I's be havin' quite the headache now...%%I'm just gonna lay down here for a bit to rest...",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":59,
        "description":"convo with conrad",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Hey, want to buy some corn?%%I got fresh corn and grilled corn, take your pick!",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Sure I'll buy some corn",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Can I sell you my corn instead?",
                        "nextDialogueId":2
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"Got anything other than corn?",
                        "nextDialogueId":3
                    },
                    {
                        "id":3,
                        "requirements":null,
                        "text":"I'm not interested in your corn",
                        "nextDialogueId":6
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":15
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Of course!%%I just love corn",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":15
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"Nope, just corn!",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Ok let's trade",
                        "nextDialogueId":4
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"No thanks then",
                        "nextDialogueId":5
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":4,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":15
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":5,
                "npcText":"Alright, but if you ever want some corn, you know where to find me!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":6,
                "npcText":"I see%%Well if you change your mind, you'll know where to find me!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":60,
        "description":"convo with porter",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Hi there, come check out my potatoes!",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Alright",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"No thanks",
                        "nextDialogueId":2
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":16
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Well, goodbye then",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":61,
        "description":"convo with fishmonger",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Hello, I specialize in buying and selling fish. Want to trade?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Ok",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"No thanks",
                        "nextDialogueId":null
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":17
                    }
                ],
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":62,
        "description":"convo with celadon general store owner",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Welcome to my shop%%Is there anything you're looking to buy or sell?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Show me what you're selling",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Yep I got some stuff I want to sell",
                        "nextDialogueId":2
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"Sorry I'm not interested in trading right now",
                        "nextDialogueId":3
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":18
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":18
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"Alright",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":63,
        "description":"conversation with Gallagher",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Hello fellow warrior, may I interest you in my bronze weaponry?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Let's see what you got",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"No thanks",
                        "nextDialogueId":2
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"I'm not a warrior",
                        "nextDialogueId":3
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":19
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"In that case, have a good day",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"Oh, I understand%%However, I do have pickaxes and gloves for sale, and I also buy bronze weaponry from smiths who make them",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"In that case let's trade",
                        "nextDialogueId":4
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Still not interested",
                        "nextDialogueId":5
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":4,
                "npcText":"Great",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":19
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":5,
                "npcText":"I understand, goodbye then",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":64,
        "description":"convo with ictirine general store owner",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Welcome to my shop%%Is there anything you're looking to buy or sell?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Show me what you're selling",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Yep I got some stuff I want to sell",
                        "nextDialogueId":2
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"Sorry I'm not interested in trading right now",
                        "nextDialogueId":3
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":20
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":20
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"Alright",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":65,
        "description":"convo with elder knight in wilderness",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Careful going in there my friend, dark evil awaits",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"I'm not afraid of anything",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Thanks for the heads up sir",
                        "nextDialogueId":2
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"Very well",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"There is no need to thank me",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":66,
        "description":"maid (anglam castle bedroom) convo",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Waltzing into someone else's bedroom is a bit rude, don't you think?",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":67,
        "description":"maid (anglam castle lobby) convo",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Hello, may I help you?%%Wait a minute, you're not a member of royalty%%I only serve the royal family, go away",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":68,
        "description":"maid (anglam castle hall) convo",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Sorry, I'm very busy right now",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":69,
        "description":"convo with prince louis",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Ah, a commoner%%Hello my lowly peasent, what brings you into my father's castle?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Who are you calling a peasent",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Just exploring",
                        "nextDialogueId":2
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"I've come to slay the king",
                        "nextDialogueId":3
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"Why, you of course",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Well, I suppose I can allow a peasent like you to explore the castle grounds%%But if you are caught stealing anything, it'll be off with your head",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"Ahahaha%%Normally I'd have you beheaded for such a statement...%%but my father is the greatest warrior in all of HighSpell, a lowly peasent like you would stand no chance%%In any event, he is not here right now%%Now run along you silly little fool",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":70,
        "description":"knight (anglam castle hall)",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"It is my duty to protect Prince Louis with my life%%You know, he will be the king someday",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":71,
        "description":"convo with peer",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":null,
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Who are you",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"These castle grounds sure are lovely",
                        "nextDialogueId":4
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"Why, my name is Peer",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"So what are you doing around here Peer",
                        "nextDialogueId":2
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Well nice to meet you Peer",
                        "nextDialogueId":3
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"To be honest, a whole lot of nothing",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"It was nice meeting you too",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":4,
                "npcText":"Yes, its quite nice around here",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":72,
        "description":"convo with chef",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Hello there%%Feel free to use my stove%%By the way, did you know that you'll be less likely to burn food on a stove than an open fire?%%With a stove, its much more easy to control the level of heat, that's why!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":73,
        "description":"dwarven banker convo",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Welcome to the Dwarven Bank of HighSpell",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"What do you do here?",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Can you protect my items?",
                        "nextDialogueId":3
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"Can I get a loan",
                        "nextDialogueId":4
                    },
                    {
                        "id":3,
                        "requirements":null,
                        "text":"Dwarven Bank?",
                        "nextDialogueId":7
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"I help look after customers' belongings",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Oh ok",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"So you can keep my items safe?",
                        "nextDialogueId":2
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Certainly!%%Just store your items in that bank chest over there, and you will be able to retrieve them later from any other bank branch",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"Certainly!%%Just store your items in that bank chest over there, and you will be able to retrieve them later from any other bank branch",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":4,
                "npcText":"How much do you need?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"2 coins",
                        "nextDialogueId":5
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Ten million oughta do it",
                        "nextDialogueId":6
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":5,
                "npcText":"Er, you gotta be joking...",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":6,
                "npcText":"Not in ten million years pal",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":7,
                "npcText":"Thats right%%Don't worry, we share the same banking system with the rest of the banks in HighSpell",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":74,
        "description":"convo with dwarven guard (underground)",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":null,
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Whats beyond that door?",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":[
                            {
                                "desc":"player mining skill >= 65",
                                "type":"skill",
                                "skill":"mining",
                                "level":65,
                                "operator":">="
                            }
                        ],
                        "text":"Let me in!",
                        "nextDialogueId":2
                    },
                    {
                        "id":2,
                        "requirements":[
                            {
                                "desc":"player mining skill < 65",
                                "type":"skill",
                                "skill":"mining",
                                "level":65,
                                "operator":"<"
                            }
                        ],
                        "text":"Let me in!",
                        "nextDialogueId":3
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"The Dwarven Mines of course",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Why of course%%Although you aren't a dwarf, you are quite the skilled miner%%Go on in",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"Dwarves only!",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Oh ok",
                        "fullText":"Oh ok, bye",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"That's discrimination",
                        "nextDialogueId":4
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":4,
                "npcText":"Hmm I suppose it is%%Tell you what, seeing as we dwarves are expert miners...%%If you too become an expert miner, I'll consider you one of us and let you in%%But until then, go away!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":75,
        "description":"convo with dwarven guard (above ground)",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":null,
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"What's in there?",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Aren't you bored",
                        "fullText":"Aren't you bored just standing around here?",
                        "nextDialogueId":4
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"It's the entrance to the Dwarven Mines",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Got it",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":[
                            {
                                "desc":"player mining skill >= 65",
                                "type":"skill",
                                "skill":"mining",
                                "level":65,
                                "operator":">="
                            }
                        ],
                        "text":"Can I go in?",
                        "nextDialogueId":2
                    },
                    {
                        "id":2,
                        "requirements":[
                            {
                                "desc":"player mining skill < 65",
                                "type":"skill",
                                "skill":"mining",
                                "level":65,
                                "operator":"<"
                            }
                        ],
                        "text":"Can I go in?",
                        "nextDialogueId":3
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Sure, you seem worthy enough to enter our mines",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"Sorry, only Dwarves and expert miners are allowed down there",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":4,
                "npcText":"Yes",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":76,
        "description":"convo with emeril",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Care to check out my mining supplies?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Sure",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"No thanks",
                        "nextDialogueId":null
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":22
                    }
                ],
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":77,
        "description":"convo with thadric",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Hi friend, why not check out some amazing pickaxes?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Because I'm not interested",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Sure why not",
                        "nextDialogueId":1
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":23
                    }
                ],
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":78,
        "description":"convo with orlando",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"You look like a world-class archer! Interested in trading some bows or arrows?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"I'm interested",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"I'm not into archery",
                        "nextDialogueId":2
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":24
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Alright, suit yourself",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":79,
        "description":"convo with gerrick",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Hello friend!%%Why, you look like quite the adventurer, care to trade?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Let's trade",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"I don't want to trade with you",
                        "nextDialogueId":2
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"I'm not an adventurer",
                        "nextDialogueId":3
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":25
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Ok then",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"Well then, feel free to come back when you're feeling adventurous",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":80,
        "description":"convo with gambler in celadon",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Hey, feeling lucky?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"As a matter of fact I am",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"No",
                        "nextDialogueId":27
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"Great! I'll flip a coin%%You select heads or tails%%If you win, then I'll quadruple any money you wager!%%What do you say?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Let's play",
                        "nextDialogueId":2
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"No thanks gambling is dangerous",
                        "nextDialogueId":26
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Great! First of all, how much money do you wager?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":[
                            {
                                "desc":"player needs to have 1 or more coins in inventory",
                                "type":"inventoryitem",
                                "itemid":6,
                                "isiou":false,
                                "amount":1,
                                "operator":">="
                            }
                        ],
                        "text":"One coin",
                        "nextDialogueId":3
                    },
                    {
                        "id":1,
                        "requirements":[
                            {
                                "desc":"player needs to have 2 or more coins in inventory",
                                "type":"inventoryitem",
                                "itemid":6,
                                "isiou":false,
                                "amount":2,
                                "operator":">="
                            }
                        ],
                        "text":"Two coins",
                        "nextDialogueId":10
                    },
                    {
                        "id":2,
                        "requirements":[
                            {
                                "desc":"player needs to have 5 or more coins in inventory",
                                "type":"inventoryitem",
                                "itemid":6,
                                "isiou":false,
                                "amount":5,
                                "operator":">="
                            }
                        ],
                        "text":"Five coins",
                        "nextDialogueId":17
                    },
                    {
                        "id":3,
                        "requirements":[
                            {
                                "desc":"player needs to have no coins in inventory",
                                "type":"inventoryitem",
                                "itemid":6,
                                "isiou":false,
                                "amount":0,
                                "operator":"==="
                            }
                        ],
                        "text":"Actually I don't have any money on me",
                        "nextDialogueId":24
                    },
                    {
                        "id":4,
                        "requirements":null,
                        "text":"On second thought I change my mind",
                        "fullText":"On second though, I change my mind. I'm out",
                        "nextDialogueId":25
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"Only one?%%Alright, time for the coin flip!%%Heads or tails?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Heads",
                        "nextDialogueId":4
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Tails",
                        "nextDialogueId":7
                    }
                ],
                "playerEventActions":[
                    {
                        "desc":"player gives 1 coin",
                        "type":"PlayerGiveItems",
                        "playerGiveItems":[
                            {
                                "id":6,
                                "isIOU":false,
                                "amt":1
                            }
                        ]
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":4,
                "npcText":"Alright, heads I win, tails you lose!%%...(the gambler flips the coin)...%%Its heads, I win! Better luck next time",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Darn it!",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Cheater!",
                        "nextDialogueId":5
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":5,
                "npcText":"Hey, you lost fair and square",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Fine, you win",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"How about I just kill you and get my money back",
                        "nextDialogueId":6
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":6,
                "npcText":"Woah woah woah%%Theres no need for violence%%Fine, take back your measly little coin",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "desc":"Player receives 1 coin",
                        "type":"PlayerReceiveItems",
                        "playerReceiveItems":[
                            {
                                "id":6,
                                "isIOU":false,
                                "amt":1
                            }
                        ]
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":7,
                "npcText":"Alright, heads I win, tails you lose!%%...(the gambler flips the coin)...%%Its heads, I win! Better luck next time",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Darn it!",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Cheater!",
                        "nextDialogueId":8
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":8,
                "npcText":"Hey, you lost fair and square",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Fine, you win",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"How about I just kill you and get my money back",
                        "nextDialogueId":9
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":9,
                "npcText":"Woah woah woah%%Theres no need for violence%%Fine, take back your measly little coin",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "desc":"Player receives 1 coin",
                        "type":"PlayerReceiveItems",
                        "playerReceiveItems":[
                            {
                                "id":6,
                                "isIOU":false,
                                "amt":1
                            }
                        ]
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":10,
                "npcText":"Just two?%%Alright, time for the coin flip!%%Heads or tails?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Heads",
                        "nextDialogueId":11
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Tails",
                        "nextDialogueId":14
                    }
                ],
                "playerEventActions":[
                    {
                        "desc":"player gives 2 coins",
                        "type":"PlayerGiveItems",
                        "playerGiveItems":[
                            {
                                "id":6,
                                "isIOU":false,
                                "amt":2
                            }
                        ]
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":11,
                "npcText":"Alright, heads I win, tails you lose!%%...(the gambler flips the coin)...%%Its heads, I win! Better luck next time",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Darn it!",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Cheater!",
                        "nextDialogueId":12
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":12,
                "npcText":"Hey, you lost fair and square",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Fine, you win",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"How about I just kill you and get my money back",
                        "nextDialogueId":13
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":13,
                "npcText":"Woah woah woah%%Theres no need for violence%%Fine, take back your two measly little coins",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "desc":"Player receives 2 coins",
                        "type":"PlayerReceiveItems",
                        "playerReceiveItems":[
                            {
                                "id":6,
                                "isIOU":false,
                                "amt":2
                            }
                        ]
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":14,
                "npcText":"Alright, heads I win, tails you lose!%%...(the gambler flips the coin)...%%Its heads, I win! Better luck next time",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Darn it!",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Cheater!",
                        "nextDialogueId":15
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":15,
                "npcText":"Hey, you lost fair and square",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Fine, you win",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"How about I just kill you and get my money back",
                        "nextDialogueId":16
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":16,
                "npcText":"Woah woah woah%%Theres no need for violence%%Fine, take back your two measly little coins",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "desc":"Player receives 2 coins",
                        "type":"PlayerReceiveItems",
                        "playerReceiveItems":[
                            {
                                "id":6,
                                "isIOU":false,
                                "amt":2
                            }
                        ]
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":17,
                "npcText":"Five coins eh?%%...(the gambler flips the coin)...%%Alright, time for the coin flip!%%Heads or tails?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Heads",
                        "nextDialogueId":18
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Tails",
                        "nextDialogueId":21
                    }
                ],
                "playerEventActions":[
                    {
                        "desc":"player gives 3 coins",
                        "type":"PlayerGiveItems",
                        "playerGiveItems":[
                            {
                                "id":6,
                                "isIOU":false,
                                "amt":3
                            }
                        ]
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":18,
                "npcText":"Alright, heads I win, tails you lose!%%...(the gambler flips the coin)...%%Its heads, I win! Better luck next time",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Darn it!",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Cheater!",
                        "nextDialogueId":19
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":19,
                "npcText":"Hey, you lost fair and square",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Fine, you win",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"How about I just kill you and get my money back",
                        "nextDialogueId":20
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":20,
                "npcText":"Woah woah woah%%Theres no need for violence%%Fine, take back your measly little coins",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "desc":"Player receives 5 coins",
                        "type":"PlayerReceiveItems",
                        "playerReceiveItems":[
                            {
                                "id":6,
                                "isIOU":false,
                                "amt":5
                            }
                        ]
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":21,
                "npcText":"Alright, heads I win, tails you lose!%%...(the gambler flips the coin)...%%Its heads, I win! Better luck next time",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Darn it!",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Cheater!",
                        "nextDialogueId":22
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":22,
                "npcText":"Hey, you lost fair and square",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Fine, you win",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"How about I just kill you and get my money back",
                        "nextDialogueId":23
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":23,
                "npcText":"Woah woah woah%%Theres no need for violence%%Fine, take back your measly little coins",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "desc":"Player receives 5 coins",
                        "type":"PlayerReceiveItems",
                        "playerReceiveItems":[
                            {
                                "id":6,
                                "isIOU":false,
                                "amt":5
                            }
                        ]
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":24,
                "npcText":"Well then, run along to the bank and go get some!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":25,
                "npcText":"What a scaredy cat!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":26,
                "npcText":"What a little chicken!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":27,
                "npcText":"Then get lost",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":81,
        "description":"convo with celadon gatekeeper",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Sorry, no commoners allowed through these gates",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Oh ok",
                        "fullText":"Oh ok, in the future I will make sure to learn my place in society",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"What if I give you 1000 coins",
                        "nextDialogueId":1
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"And what if I have you beheaded for bribing an official?",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":82,
        "description":"convo with stan",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Oh dear, it looks like some goblins have raided my farm again",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":83,
        "description":"convo with wandering monk",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Careful heading out west, you'll find many aggressive monsters%%Goblins in particular, they tend to run around in packs",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Thanks for the heads up",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"I'm not afraid of a couple of goblins",
                        "nextDialogueId":null
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":84,
        "description":"convo with wandering monk",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Greetings%%Are you new around these parts?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Yep I'm fresh of the boat",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"No I've been here for ages",
                        "nextDialogueId":7
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"Boat? What boat?%%Anyways, since you're new, how about I offer you some advice",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Sure I could use some advice",
                        "nextDialogueId":2
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Not interested old man",
                        "nextDialogueId":6
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Great%%Well then, if you're looking to make some money, I recommend picking up a pickaxe and mining some copper and tin ore%%Then you can smelt them into bronze bars, which in turn can be smithed into a variety of items%%Afterwards, you can sell them to shops or other players",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Thanks for the advice!",
                        "nextDialogueId":3
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Thanks, got any more advice?",
                        "nextDialogueId":4
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"My pleasure",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":4,
                "npcText":"Let's see...%%Oh, you can also find a sword and start killing some cows or chickens%%But as a pacific monk, I advise against that",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Cool thanks",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"If you advise against it why'd you give me that advice",
                        "nextDialogueId":5
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":5,
                "npcText":"Good question",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":6,
                "npcText":"Very well",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":7,
                "npcText":"Ah, I see%%Well then, have a good day",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":85,
        "description":"conversation with gatekeeper in skeleton dungeon",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"It's too dangerous to venture deeper into these caves, I'm afraid I can't let you pass",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":86,
        "description":"convo with wandering monk",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"You know how to create scrolls, right?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Yep I already know",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"No",
                        "nextDialogueId":2
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"Don't you just carve them out of logs using a chisel?%%Then you can use them on a magical obelisk to enchant them!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Why, you just carve them out of logs using a chisel%%Then you can use them on a magical obelisk to enchant them!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":87,
        "description":"conversation with elder knight by ice mountain",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Careful venturing any further, things get a bit dangerous beyond this point",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":88,
        "description":"conversation with man in celadon hotel",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Huh? I never called for room service",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":89,
        "description":"conversation with Bartender (dragon slayer's inn)",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Welcome to Beer Belly's Tavern%%Thirsty?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"You bet I am",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Sorry I'm trying to stay sober",
                        "nextDialogueId":2
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":26
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Alright",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":90,
        "description":"conversation with chef in beer belly's tavern second floor",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Hey how'd you get back here? This area is for employees only",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":91,
        "description":"convo with greg",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Care to check out my legwear?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Lets see what you got",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"No",
                        "nextDialogueId":null
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":27
                    }
                ],
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":92,
        "description":"convo with guv",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Your fingers look like they could use some better protection%%Interested in buying or selling some gloves",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Sure lets trade",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Not interested",
                        "nextDialogueId":null
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":28
                    }
                ],
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":93,
        "description":"convo with nate",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"I sell the best platebodies in all of HighSpell, want to trade?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Sure lets trade",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"I doubt yours are the best",
                        "fullText":"I doubt your platebodies are truly the best",
                        "nextDialogueId":2
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"No thanks",
                        "nextDialogueId":3
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":29
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Why don't you see for yourself then",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":29
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"Well then have a good day",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":94,
        "description":"convo with raab",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Crabs!%%Get your crabs!",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"I'll buy some crabs",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Will you buy mine instead",
                        "nextDialogueId":2
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"Sorry I don't like crabs",
                        "nextDialogueId":null
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":30
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Of course%%I just love crabs",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":30
                    }
                ],
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":95,
        "description":"convo with rod",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"You look like someone whose interested in high quality fishing rods",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"I sure am",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Wrong",
                        "fullText":"Wrong I'm not interested",
                        "nextDialogueId":2
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"Great, let's trade",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":31
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Very well then",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":96,
        "description":"convo with jack",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"You look like a fellow lumberjack%%Interested in buying some hatchets?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Yep",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"No chopping down trees is terrible",
                        "nextDialogueId":2
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"Great",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":32
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Then get out of my shop",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":97,
        "description":"convo with arthur",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Welcome to my store, care to browse my weaponry?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Show me what you got",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"No thanks",
                        "nextDialogueId":2
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"Sure thing",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":33
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Well then come back any time",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":98,
        "description":"convo with priest south of goblins",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Welcome to this house of worship%%I am currently not giving a sermon right now, please come back later",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":99,
        "description":"convo with priest in celadon",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Welcome to this house of worship%%I am currently not giving a sermon right now, please come back later",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":100,
        "description":"convo with link",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Make sure you wear protection, that's what I always say%%Speaking of protection, would you like to trade some chainmail bodies?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Sure I'd like to buy some",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Can you buy mine?",
                        "nextDialogueId":2
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"No thanks",
                        "nextDialogueId":3
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":34
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Of course",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":34
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"Take care then",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":101,
        "description":"convo with cindy",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Hello%%Are you interested in buying or selling crafting supplies?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Yeah let's trade",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Nope",
                        "nextDialogueId":2
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":35
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Goodbye then",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":102,
        "description":"convo with master fisherman",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Care to take a look at my wares?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Sure let's see what you got",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"No thanks",
                        "nextDialogueId":2
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":36
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Goodbye then",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":103,
        "description":"convo with captain henry (land)",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":null,
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Nice boat",
                        "fullText":"Thats a nice boat you've got there",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Can I go on a cruise",
                        "nextDialogueId":2
                    },
                    {
                        "id":2,
                        "requirements":[
                            {
                                "desc":"player fishing skill >= 64",
                                "type":"skill",
                                "skill":"fishing",
                                "level":64,
                                "operator":">="
                            }
                        ],
                        "text":"Where you headed?",
                        "nextDialogueId":3
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"Yep shes a beauty",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Nope",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"I'm about to set sail for Driftwood Isle",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Good luck",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Can I come along?",
                        "nextDialogueId":4
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":4,
                "npcText":"Hmm...%%I suppose there's room for one more",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Great, let's go",
                        "nextDialogueId":5
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"On second thought I'll stay here on land",
                        "nextDialogueId":6
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":5,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "desc":"player teleports to Driftwood Isle",
                        "type":"TeleportTo",
                        "location":{
                            "x":-167,
                            "y":-474,
                            "lvl":1
                        }
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":6,
                "npcText":"Suit yourself",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":104,
        "description":"convo with captain henry (driftwood isle)",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Ready to head back to land?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Yes I'm ready to go back",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Not yet",
                        "nextDialogueId":2
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "desc":"player teleports to back to land",
                        "type":"TeleportTo",
                        "location":{
                            "x":-266,
                            "y":-406,
                            "lvl":1
                        }
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Very well",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":105,
        "description":"convo with traveling merchant",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Care to trade?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Ok",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Not interested",
                        "nextDialogueId":null
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":37
                    }
                ],
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":106,
        "description":"convo with undercroft wondering monk",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Are you here to make your way through the Undercroft passages?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Yes",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"No",
                        "nextDialogueId":null
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"Undercroft?",
                        "nextDialogueId":6
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"I wish you a safe passage",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Thanks",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Why? Is it dangerous in here?",
                        "nextDialogueId":2
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Don't you know?%%There are dangerous creatures lurking in here, and the only way to continue on deeper is to defeat them%%There are escape passages scattered about, as well as undtold treasures to be found...",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Sounds like my kind of adventure",
                        "nextDialogueId":3
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"I'll be very careful",
                        "nextDialogueId":4
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"Dangerous creatures?",
                        "nextDialogueId":5
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"However I must warn you%%Once you enter, you may not be able to escape alive...",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":4,
                "npcText":"Very well...",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":5,
                "npcText":"Yes, and some are said to be quite strong...%%Or so the rumours go",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":6,
                "npcText":"Yes, you are at the entrance of the Undercroft%%There are dangerous creatures lurking in here, and the only way to continue on deeper is to defeat them%%There are escape passages scattered about, as well as undtold treasures to be found...",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Oh I like treasure",
                        "nextDialogueId":7
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"I'll be very careful",
                        "nextDialogueId":8
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"Dangerous creatures?",
                        "nextDialogueId":9
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":7,
                "npcText":"Of course...%%And it is said, the deeper you venture, the better the reward...",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":8,
                "npcText":"Very well...",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":9,
                "npcText":"Yes, and some are said to be quite strong...%%Or so the rumours go",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":107,
        "description":"Martial Artist (non-aggressive)",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":[
                    {
                        "desc":"player needs to be at checkpoint 11 of Sato's Trial quest",
                        "type":"quest",
                        "questid":2,
                        "checkpoint":11,
                        "booleanoperator":null,
                        "operator":"==="
                    }
                ]
            },
            {
                "id":1,
                "requirements":[
                    {
                        "desc":"player needs to be at checkpoint 12 of Sato's Trial quest",
                        "type":"quest",
                        "questid":2,
                        "checkpoint":12,
                        "booleanoperator":null,
                        "operator":"==="
                    }
                ]
            },
            {
                "id":2,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"That was an impressive display of skill during the trials",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"Hello there my friend",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Hello",
                        "fullText":"Hello to you too",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Goodbye",
                        "nextDialogueId":null
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"...",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":108,
        "description":"Conversation with Sato (downstairs)",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":[
                    {
                        "desc":"player needs to have not yet started Sato's Trials quest",
                        "type":"quest",
                        "questid":2,
                        "checkpoint":0,
                        "booleanoperator":null,
                        "operator":"==="
                    }
                ]
            },
            {
                "id":17,
                "requirements":[
                    {
                        "desc":"player needs to have started Sato's Trials quest",
                        "type":"quest",
                        "questid":2,
                        "checkpoint":1,
                        "booleanoperator":null,
                        "operator":"==="
                    }
                ]
            },
            {
                "id":19,
                "requirements":[
                    {
                        "desc":"player needs to be at least at checkpoint 2 of Sato's Trials quest",
                        "type":"quest",
                        "questid":2,
                        "checkpoint":2,
                        "booleanoperator":null,
                        "operator":">="
                    },
                    {
                        "desc":"player needs not have yet completed checkpoint 11 of Sato's Trials quest",
                        "type":"quest",
                        "questid":2,
                        "checkpoint":11,
                        "booleanoperator":null,
                        "operator":"<"
                    }
                ]
            },
            {
                "id":20,
                "requirements":[
                    {
                        "desc":"player needs to be at checkpoint 11 of Sato's Trials quest",
                        "type":"quest",
                        "questid":2,
                        "checkpoint":11,
                        "booleanoperator":null,
                        "operator":"==="
                    }
                ]
            },
            {
                "id":22,
                "requirements":[
                    {
                        "desc":"player needs to have completed Sato's Trials quest",
                        "type":"quest",
                        "questid":2,
                        "checkpoint":12,
                        "booleanoperator":null,
                        "operator":">="
                    }
                ]
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Hello there, welcome to my dojo",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Who are you",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"So what's there to do around here",
                        "nextDialogueId":2
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"Dojo?",
                        "nextDialogueId":15
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"I am Sato, master of this dojo",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Never heard of you",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Can I join your dojo",
                        "nextDialogueId":4
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"Dojo?",
                        "nextDialogueId":15
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Most people may find there is not much to do around here%%Though for those who are a member of this dojo, we train to hone our skills in traditional martial arts",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Sounds boring",
                        "nextDialogueId":3
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Can I join your dojo",
                        "nextDialogueId":4
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"Martial arts?",
                        "nextDialogueId":5
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"You are more than welcome to leave",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"See ya",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Actually I'm interested in joining your dojo",
                        "nextDialogueId":4
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":4,
                "npcText":"Ha%%One cannot merely join this dojo without first passing the trials",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Oh nevermind then",
                        "nextDialogueId":6
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Trials?",
                        "nextDialogueId":7
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"I'm ready for the trials",
                        "nextDialogueId":8
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":5,
                "npcText":"It is the practice of self defense, without the assistance of any weaponry or armour, using only your mind and body",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":[
                            {
                                "desc":"player needs to have any weapon equipped",
                                "type":"equippeditem",
                                "equipmenttype":"weapon",
                                "itemids":[],
                                "isequipped":false
                            }
                        ],
                        "text":"There's no way im giving up my weapons",
                        "nextDialogueId":9
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Sounds interesting",
                        "fullText":"Sounds interesting, can I join you guys?",
                        "nextDialogueId":4
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"Sounds too difficult for me",
                        "nextDialogueId":11
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":6,
                "npcText":"Hmph",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":7,
                "npcText":"The trials will test your defensive combat skills, using only your mind and body",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Only my mind and body?",
                        "fullText":"Only my mind and body? What does that mean?",
                        "nextDialogueId":10
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"I'm ready for the trials",
                        "nextDialogueId":8
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":8,
                "npcText":"I admire your determination%%Very well, but I must first lay out the ground rules",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":[
                    {
                        "requirements":null,
                        "nextDialogueId":16
                    }
                ]
            },
            {
                "id":9,
                "npcText":"Then this is not the place for you",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":10,
                "npcText":"Specifically, you are allowed no outside equipment%%No armour, no weapons",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":[
                            {
                                "desc":"player needs to have any weapon equipped",
                                "type":"equippeditem",
                                "equipmenttype":"weapon",
                                "itemids":[],
                                "isequipped":false
                            }
                        ],
                        "text":"There's no way im giving up my weapons",
                        "nextDialogueId":9
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"I think I'm ready for the trials",
                        "fullText":"In that case, I think I'm ready for the trials",
                        "nextDialogueId":8
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"Sounds too difficult for me",
                        "nextDialogueId":11
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":11,
                "npcText":"If that is your attitude, then this place is not for you",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":12,
                "npcText":"You must first remove all equipped items, and put away all your inventory items%%Only then may you begin the trials",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Ok, I will return when I'm ready",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Can I use those bank chests over there?",
                        "nextDialogueId":14
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":13,
                "npcText":"Very well, but if you feel you are ready at a later time, come speak to me again...",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":14,
                "npcText":"I'm afraid I can't allow you to do that at this time",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":15,
                "npcText":"It is a place where we train to hone our skills in traditional martial arts",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Sounds boring",
                        "nextDialogueId":3
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Can I join your dojo",
                        "nextDialogueId":4
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"Martial arts?",
                        "nextDialogueId":5
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":16,
                "npcText":"You are allowed no outside items, no food, no potions, no weapons, no armour, no magical scrolls, nothing%%Once you have removed all worldly possessions from your body and inventory, you may enter through the door in the corner%%There you will find a ladder leading upstairs, where I will be waiting for you",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":[
                    {
                        "requirements":null,
                        "nextDialogueId":17
                    }
                ]
            },
            {
                "id":17,
                "npcText":"So are you ready to begin the trials?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":[
                            {
                                "desc":"player needs to have any item equipped",
                                "type":"equippeditem",
                                "equipmenttype":null,
                                "itemids":null,
                                "isequipped":null,
                                "anyitemequipped":true
                            },
                            {
                                "desc":"player needs to have at least one item in their inventory",
                                "type":"availableinventoryspace",
                                "itemid":null,
                                "isiou":null,
                                "availableslotsneeded":28,
                                "operator":"<"
                            }
                        ],
                        "text":"I'm ready to begin",
                        "nextDialogueId":12
                    },
                    {
                        "id":1,
                        "requirements":[
                            {
                                "desc":"player needs to have any item equipped",
                                "type":"equippeditem",
                                "equipmenttype":null,
                                "itemids":null,
                                "isequipped":null,
                                "anyitemequipped":true
                            },
                            {
                                "desc":"player needs to have an empty inventory",
                                "type":"availableinventoryspace",
                                "itemid":null,
                                "isiou":null,
                                "availableslotsneeded":28,
                                "operator":"==="
                            }
                        ],
                        "text":"I'm ready to begin",
                        "nextDialogueId":12
                    },
                    {
                        "id":2,
                        "requirements":[
                            {
                                "desc":"player needs to have no items equipped",
                                "type":"equippeditem",
                                "equipmenttype":null,
                                "itemids":null,
                                "isequipped":null,
                                "noitemsequipped":true
                            },
                            {
                                "desc":"player needs to have at least one item in their inventory",
                                "type":"availableinventoryspace",
                                "itemid":null,
                                "isiou":null,
                                "availableslotsneeded":28,
                                "operator":"<"
                            }
                        ],
                        "text":"I'm ready to begin",
                        "nextDialogueId":12
                    },
                    {
                        "id":3,
                        "requirements":[
                            {
                                "desc":"player needs to have no items equipped",
                                "type":"equippeditem",
                                "equipmenttype":null,
                                "itemids":null,
                                "isequipped":null,
                                "noitemsequipped":true
                            },
                            {
                                "desc":"player needs to have an empty inventory",
                                "type":"availableinventoryspace",
                                "itemid":null,
                                "isiou":null,
                                "availableslotsneeded":28,
                                "operator":"==="
                            }
                        ],
                        "text":"I'm ready to begin",
                        "nextDialogueId":18
                    },
                    {
                        "id":4,
                        "requirements":null,
                        "text":"Actually I'm not quite ready yet",
                        "nextDialogueId":13
                    },
                    {
                        "id":5,
                        "requirements":null,
                        "text":"Explain the trials one more time",
                        "fullText":"Can you explain the trials one more time?",
                        "nextDialogueId":16
                    }
                ],
                "playerEventActions":[
                    {
                        "type":"AdvanceQuest",
                        "description":"Sato's Trials",
                        "questid":2,
                        "checkpoint":1,
                        "requirements":null
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":18,
                "npcText":"Very well, I will be waiting for you upstairs...",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":19,
                "npcText":"I'm afraid you failed to pass the trials during your last attempt%%However, you may attempt the trials again, starting from the beginning",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":[
                    {
                        "requirements":null,
                        "nextDialogueId":17
                    }
                ]
            },
            {
                "id":20,
                "npcText":"Congratulations, you have proven your worth by passing the trials%%Meet me upstairs for your reward ceremony%%But remember, you are not allowed to bring any outside items or equipment with you",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Okay",
                        "fullText":"Okay, I will meet you upstairs",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Why can't we have the ceremony down here",
                        "nextDialogueId":21
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":21,
                "npcText":"Because we always hold our ceremonies upstairs",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":22,
                "npcText":"I am proud to have you as a member of this dojo%%Feel free to use the bank chests over there anytime",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Thanks",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Any more trials to complete?",
                        "nextDialogueId":23
                    },
                    {
                        "id":2,
                        "requirements":[
                            {
                                "desc":"player needs to own an uncharged celadon orb",
                                "type":"playerownsitem",
                                "itemid":413,
                                "amount":1,
                                "isiou":false,
                                "operator":">="
                            }
                        ],
                        "text":"What does that orb you gave me do?",
                        "nextDialogueId":24
                    },
                    {
                        "id":3,
                        "requirements":[
                            {
                                "desc":"player needs to not own a celadon orb",
                                "type":"playerownsitem",
                                "itemid":408,
                                "amount":0,
                                "isiou":false,
                                "operator":"==="
                            },
                            {
                                "desc":"player needs to not own a celadon orb",
                                "type":"playerownsitem",
                                "itemid":409,
                                "amount":0,
                                "isiou":false,
                                "operator":"==="
                            },
                            {
                                "desc":"player needs to not own a celadon orb",
                                "type":"playerownsitem",
                                "itemid":410,
                                "amount":0,
                                "isiou":false,
                                "operator":"==="
                            },
                            {
                                "desc":"player needs to not own a celadon orb",
                                "type":"playerownsitem",
                                "itemid":411,
                                "amount":0,
                                "isiou":false,
                                "operator":"==="
                            },
                            {
                                "desc":"player needs to not own a celadon orb",
                                "type":"playerownsitem",
                                "itemid":412,
                                "amount":0,
                                "isiou":false,
                                "operator":"==="
                            },
                            {
                                "desc":"player needs to not own a celadon orb",
                                "type":"playerownsitem",
                                "itemid":413,
                                "amount":0,
                                "isiou":false,
                                "operator":"==="
                            }
                        ],
                        "text":"I lost that orb you gave me...",
                        "nextDialogueId":25
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":23,
                "npcText":"Not at the moment I'm afraid",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":24,
                "npcText":"Legend says that they who rub the orb will be imbued with vitality%%What that means exactly, I'm not too sure%%It can apparently be recharged, but again I don't know how exactly%%Although the legend says when it is charged, it glows a bright Celadon hue...%%I wonder if that means anything significant.",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":25,
                "npcText":"Lucky for you, someone found it and returned it to our dojo%%Here, please be more careful with it next time...",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "desc":"Player receives sato's orb",
                        "type":"PlayerReceiveItems",
                        "playerReceiveItems":[
                            {
                                "id":413,
                                "isIOU":false,
                                "amt":1
                            }
                        ]
                    }
                ],
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":109,
        "description":"Sato (upstairs)",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":[
                    {
                        "desc":"player needs to be at checkpoint 1 of Sato's Trial quest",
                        "type":"quest",
                        "questid":2,
                        "checkpoint":1,
                        "booleanoperator":null,
                        "operator":"==="
                    }
                ]
            },
            {
                "id":5,
                "requirements":[
                    {
                        "desc":"player needs to be at checkpoint 2, 4, 6, 8, or 10 of Sato's Trial quest",
                        "type":"quest",
                        "questid":2,
                        "checkpoint":[2,4,6,8,10],
                        "booleanoperator":"or",
                        "operator":"==="
                    },
                    {
                        "desc":"player needs to not have any instanced npcs spawned in",
                        "type":"currentlyspawnedinstancednpc",
                        "instancednpcids":[],
                        "booleanoperator":null,
                        "operator":null
                    }
                ]
            },
            {
                "id":6,
                "requirements":[
                    {
                        "desc":"player needs to be at checkpoint 3, 5, 7, or 9 of Sato's Trial quest",
                        "type":"quest",
                        "questid":2,
                        "checkpoint":[3,5,7,9],
                        "booleanoperator":"or",
                        "operator":"==="
                    }
                ]
            },
            {
                "id":13,
                "requirements":[
                    {
                        "desc":"player needs to be at checkpoint 11 of Sato's Trial quest",
                        "type":"quest",
                        "questid":2,
                        "checkpoint":11,
                        "booleanoperator":null,
                        "operator":"==="
                    }
                ]
            },
            {
                "id":15,
                "requirements":[
                    {
                        "desc":"player needs to have completed Sato's Trial quest",
                        "type":"quest",
                        "questid":2,
                        "checkpoint":12,
                        "booleanoperator":null,
                        "operator":">="
                    }
                ]
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Before we begin the trials, I should explain what you must do%%You will face an onslaught of enemies, with each round getting progressively more difficult%%If you are defeated, or if you leave, you must start over from the beginning%%After each round, I will restore your health, as to not give your opponents an unfair advantage%%So, are you ready? Shall we begin the trials?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Lets do it",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"On second thought...",
                        "fullText":"On second thought, that sounds a bit too difficult for me at the moment",
                        "nextDialogueId":2
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"How'd you get up here so fast?",
                        "nextDialogueId":3
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"Let the trials begin...",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":[
                    {
                        "requirements":null,
                        "nextDialogueId":8
                    }
                ]
            },
            {
                "id":2,
                "npcText":"Hmph%%If your mind is not yet ready, then your body most certainly is not ready either%%Very well, come back when you feel you are ready",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"I am very agile%%Anyways...",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":[
                    {
                        "requirements":null,
                        "nextDialogueId":4
                    }
                ]
            },
            {
                "id":4,
                "npcText":"Shall we begin the trials?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Lets do it",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"On second thought...",
                        "fullText":"On second thought, that sounds a bit too difficult for me at the moment",
                        "nextDialogueId":2
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":5,
                "npcText":"I'm afraid you have abandoned the trials, and must restart from the very beginning%%But if you wish to leave, you may do so. Otherwise...",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"AdvanceQuest",
                        "description":"Sato's Trials",
                        "questid":2,
                        "checkpoint":1,
                        "requirements":[
                            {
                                "desc":"player needs to not be at checkpoint 1 of Sato's Trial quest",
                                "type":"quest",
                                "questid":2,
                                "checkpoint":1,
                                "booleanoperator":null,
                                "operator":"!=="
                            }
                        ]
                    }
                ],
                "continuanceDialogues":[
                    {
                        "requirements":null,
                        "nextDialogueId":4
                    }
                ]
            },
            {
                "id":6,
                "npcText":"Congratulations, you have passed this round. Are you ready for the next round?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"I'm ready",
                        "nextDialogueId":7
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"I'm not ready yet",
                        "nextDialogueId":null
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":7,
                "npcText":"Then let the next round of the trials begin...",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":[
                    {
                        "requirements":[
                            {
                                "desc":"player needs to be at checkpoint 3 of Sato's Trial quest",
                                "type":"quest",
                                "questid":2,
                                "checkpoint":3,
                                "booleanoperator":null,
                                "operator":"==="
                            }
                        ],
                        "nextDialogueId":9
                    },
                    {
                        "requirements":[
                            {
                                "desc":"player needs to be at checkpoint 5 of Sato's Trial quest",
                                "type":"quest",
                                "questid":2,
                                "checkpoint":5,
                                "booleanoperator":null,
                                "operator":"==="
                            }
                        ],
                        "nextDialogueId":10
                    },
                    {
                        "requirements":[
                            {
                                "desc":"player needs to be at checkpoint 7 of Sato's Trial quest",
                                "type":"quest",
                                "questid":2,
                                "checkpoint":7,
                                "booleanoperator":null,
                                "operator":"==="
                            }
                        ],
                        "nextDialogueId":11
                    },
                    {
                        "requirements":[
                            {
                                "desc":"player needs to be at checkpoint 9 of Sato's Trial quest",
                                "type":"quest",
                                "questid":2,
                                "checkpoint":9,
                                "booleanoperator":null,
                                "operator":"==="
                            }
                        ],
                        "nextDialogueId":12
                    }
                ]
            },
            {
                "id":8,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type" : "SkillCurrentLevelChanged",
                        "skill" : "hitpoints",
                        "amount" : 100,
                        "canincreasepastactuallevel" : false
                    },
                    {
                        "type":"AdvanceQuest",
                        "description":"Sato's Trials",
                        "questid":2,
                        "checkpoint":2,
                        "requirements":null
                    },
                    {
                        "type":"SpawnInstancedNPC",
                        "id":[25,26,27],
                        "spawnOnDoorSide":null,
                        "requirements":null
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":9,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type" : "SkillCurrentLevelChanged",
                        "skill" : "hitpoints",
                        "amount" : 100,
                        "canincreasepastactuallevel" : false
                    },
                    {
                        "type":"AdvanceQuest",
                        "description":"Sato's Trials",
                        "questid":2,
                        "checkpoint":4,
                        "requirements":null
                    },
                    {
                        "type":"SpawnInstancedNPC",
                        "id":[28,29,30,31,32],
                        "spawnOnDoorSide":null,
                        "requirements":null
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":10,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type" : "SkillCurrentLevelChanged",
                        "skill" : "hitpoints",
                        "amount" : 100,
                        "canincreasepastactuallevel" : false
                    },
                    {
                        "type":"AdvanceQuest",
                        "description":"Sato's Trials",
                        "questid":2,
                        "checkpoint":6,
                        "requirements":null
                    },
                    {
                        "type":"SpawnInstancedNPC",
                        "id":[33,34,35,36],
                        "spawnOnDoorSide":null,
                        "requirements":null
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":11,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type" : "SkillCurrentLevelChanged",
                        "skill" : "hitpoints",
                        "amount" : 100,
                        "canincreasepastactuallevel" : false
                    },
                    {
                        "type":"AdvanceQuest",
                        "description":"Sato's Trials",
                        "questid":2,
                        "checkpoint":8,
                        "requirements":null
                    },
                    {
                        "type":"SpawnInstancedNPC",
                        "id":[37,38,39,40,41],
                        "spawnOnDoorSide":null,
                        "requirements":null
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":12,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type" : "SkillCurrentLevelChanged",
                        "skill" : "hitpoints",
                        "amount" : 100,
                        "canincreasepastactuallevel" : false
                    },
                    {
                        "type":"AdvanceQuest",
                        "description":"Sato's Trials",
                        "questid":2,
                        "checkpoint":10,
                        "requirements":null
                    },
                    {
                        "type":"SpawnInstancedNPC",
                        "id":[42,43,44,45,46,47,48,49,50,51],
                        "spawnOnDoorSide":null,
                        "requirements":null
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":13,
                "npcText":"My friend, you have shown that you are one with your body and mind%%You've truly proven your worth to become a member of this dojo%%You are more than welcome to use the bank chests on the ground floor as a reward.%%Also, please take these gifts as a symbol of your achivement. Congratulations!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":[
                    {
                        "requirements":null,
                        "nextDialogueId":14
                    }
                ]
            },
            {
                "id":14,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type" : "SkillCurrentLevelChanged",
                        "skill" : "hitpoints",
                        "amount" : 100,
                        "canincreasepastactuallevel" : false
                    },
                    {
                        "type":"AdvanceQuest",
                        "description":"Sato's Trials",
                        "questid":2,
                        "checkpoint":12,
                        "requirements":null
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":15,
                "npcText":"I am proud to have you as a member of this dojo%%Feel free to use the bank chests downstairs anytime",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Thanks",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Any more trials to complete?",
                        "nextDialogueId":16
                    },
                    {
                        "id":2,
                        "requirements":[
                            {
                                "desc":"player needs to own an uncharged celadon orb",
                                "type":"playerownsitem",
                                "itemid":413,
                                "amount":1,
                                "isiou":false,
                                "operator":">="
                            }
                        ],
                        "text":"What does that orb you gave me do?",
                        "nextDialogueId":17
                    },
                    {
                        "id":3,
                        "requirements":[
                            {
                                "desc":"player needs to not own a celadon orb",
                                "type":"playerownsitem",
                                "itemid":408,
                                "amount":0,
                                "isiou":false,
                                "operator":"==="
                            },
                            {
                                "desc":"player needs to not own a celadon orb",
                                "type":"playerownsitem",
                                "itemid":409,
                                "amount":0,
                                "isiou":false,
                                "operator":"==="
                            },
                            {
                                "desc":"player needs to not own a celadon orb",
                                "type":"playerownsitem",
                                "itemid":410,
                                "amount":0,
                                "isiou":false,
                                "operator":"==="
                            },
                            {
                                "desc":"player needs to not own a celadon orb",
                                "type":"playerownsitem",
                                "itemid":411,
                                "amount":0,
                                "isiou":false,
                                "operator":"==="
                            },
                            {
                                "desc":"player needs to not own a celadon orb",
                                "type":"playerownsitem",
                                "itemid":412,
                                "amount":0,
                                "isiou":false,
                                "operator":"==="
                            },
                            {
                                "desc":"player needs to not own a celadon orb",
                                "type":"playerownsitem",
                                "itemid":413,
                                "amount":0,
                                "isiou":false,
                                "operator":"==="
                            }
                        ],
                        "text":"I lost that orb you gave me...",
                        "nextDialogueId":18
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":16,
                "npcText":"Not at the moment I'm afraid",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":17,
                "npcText":"Legend says that they who rub the orb will be imbued with vitality%%What that means exactly, I'm not too sure%%It can apparently be recharged, but again I don't know how exactly%%Although the legend says when it is charged, it glows a bright Celadon hue...%%I wonder if that means anything significant.",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":18,
                "npcText":"Lucky for you, someone found it and returned it to our dojo%%Here, please be more careful with it next time...",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "desc":"Player receives sato's orb",
                        "type":"PlayerReceiveItems",
                        "playerReceiveItems":[
                            {
                                "id":413,
                                "isIOU":false,
                                "amt":1
                            }
                        ]
                    }
                ],
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":110,
        "description":"conversation with Vera",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"How can I help you?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Who are you?",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"What are you selling?",
                        "nextDialogueId":2
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"What are you doing down here?",
                        "nextDialogueId":3
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"I am Vera, and I sell glassware",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Show me your wares",
                        "nextDialogueId":4
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Oh I don't need any glasswares",
                        "nextDialogueId":null
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"What kinds of glassware",
                        "nextDialogueId":2
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Vials and empty glasses",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Let's trade",
                        "nextDialogueId":4
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Oh I don't need any glasswares",
                        "nextDialogueId":null
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"Do you sell in bulk?",
                        "nextDialogueId":5
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"After the volcano erupted, I was forced to relocate my shop down here until the village is rebuilt",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"That's a shame",
                        "nextDialogueId":6
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Shop? What are you selling?",
                        "nextDialogueId":2
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":4,
                "npcText":"Certainly!",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"StartShopping",
                        "shopId":38
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":5,
                "npcText":"As a matter of fact I do!%%Although I only sell vials in bulk, and it'll cost extra%%I can sell 100 for 10 coins each, or 1,000 for 15 coins each",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":[
					{
						"requirements":null,
						"nextDialogueId":7
					}
				]
            },
            {
                "id":6,
                "npcText":"That's just how life is around here%%It wasn't the first time the volcano has erupted, and it certainly won't be the last",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
			{
				"id":7,
				"npcText":null,
				"playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"I'll buy 100",
                        "nextDialogueId":9
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"I'll buy 1,000",
                        "nextDialogueId":10
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"Those prices are ridiculous",
                        "fullText":"Those prices are ridiculous, I can get cheaper vials from Peggy in Celadon",
                        "nextDialogueId":17
                    },
                    {
                        "id":3,
                        "requirements":null,
                        "text":"Shouldn't the price per vial be cheaper when buying in bulk?",
                        "nextDialogueId":18
                    }
                ],
				"playerEventActions":null,
				"continuanceDialogues":null
			},
            {
                "id":8,
                "npcText":"Oh I see%%Well feel free to come back whenever you want to trade",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":9,
                "npcText":"That'll be 1,000 coins",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Deal",
                        "nextDialogueId":11
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Actually I changed my mind",
                        "nextDialogueId":8
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":10,
                "npcText":"That'll be 15,000 coins",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Deal",
                        "nextDialogueId":12
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Actually I changed my mind",
                        "nextDialogueId":8
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":11,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":[
                    {
						"requirements":[
							{
                                "desc":"player needs to have less than 1000 coins",
                                "type":"inventoryitem",
                                "itemid":6,
                                "isiou":false,
                                "amount":1000,
                                "operator":"<"
                            }
						],
						"nextDialogueId":13
					},
                    {
						"requirements":[
							{
                                "desc":"player needs to have 1000 coins",
                                "type":"inventoryitem",
                                "itemid":6,
                                "isiou":false,
                                "amount":1000,
                                "operator":"==="
                            }
						],
						"nextDialogueId":15
					},
                    {
						"requirements":[
							{
                                "desc":"player needs to have > 1000 coins",
                                "type":"inventoryitem",
                                "itemid":6,
                                "isiou":false,
                                "amount":1000,
                                "operator":">"
                            },
                            {
                                "desc":"player needs to have space in their inventory",
                                "type":"availableinventoryspace",
                                "itemid":259,
                                "isiou":true,
                                "availableslotsneeded":1,
                                "operator":">="
                            }
						],
						"nextDialogueId":15
					},
                    {
						"requirements":null,
						"nextDialogueId":14
					}
                ]
            },
            {
                "id":12,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":[
                    {
						"requirements":[
							{
                                "desc":"player needs to have less than 15000 coins",
                                "type":"inventoryitem",
                                "itemid":6,
                                "isiou":false,
                                "amount":15000,
                                "operator":"<"
                            }
						],
						"nextDialogueId":13
					},
                    {
						"requirements":[
							{
                                "desc":"player needs to have 15000 coins",
                                "type":"inventoryitem",
                                "itemid":6,
                                "isiou":false,
                                "amount":15000,
                                "operator":"==="
                            }
						],
						"nextDialogueId":16
					},
                    {
						"requirements":[
							{
                                "desc":"player needs to have > 15000 coins",
                                "type":"inventoryitem",
                                "itemid":6,
                                "isiou":false,
                                "amount":15000,
                                "operator":">"
                            },
                            {
                                "desc":"player needs to have space in their inventory",
                                "type":"availableinventoryspace",
                                "itemid":259,
                                "isiou":true,
                                "availableslotsneeded":1,
                                "operator":">="
                            }
						],
						"nextDialogueId":16
					},
                    {
						"requirements":null,
						"nextDialogueId":14
					}
                ]
            },
            {
                "id":13,
                "npcText":"Oh I'm sorry, it doesn't look like you have enough money",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":14,
                "npcText":"Oh it looks like you don't have enough space in your inventory",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":15,
                "npcText":"Here you are!",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "desc":"player gives 1000 coins and receives 100 IOU vials",
                        "type":"PlayerExchangeItems",
                        "playerGiveItems":[
                            {
                                "id":6,
                                "isIOU":false,
                                "amt":1000
                            }
                        ],
                        "playerReceiveItems":[
                            {
                                "id":259,
                                "isIOU":true,
                                "amt":100
                            }
                        ]
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":16,
                "npcText":"Here you are!",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "desc":"player gives 15000 coins and receives 1000 IOU vials",
                        "type":"PlayerExchangeItems",
                        "playerGiveItems":[
                            {
                                "id":6,
                                "isIOU":false,
                                "amt":15000
                            }
                        ],
                        "playerReceiveItems":[
                            {
                                "id":259,
                                "isIOU":true,
                                "amt":1000
                            }
                        ]
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":17,
                "npcText":"Peggy, that old witch?%%Ha, she is selling second-hand vials%%My vials a brand new and premium quality, made using the sand right from these islands",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":18,
                "npcText":"In theory yes, but people are willing to pay more, so I let the market set the prices%%So would you like like to purchase in bulk?",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":[
                    {
						"requirements":null,
						"nextDialogueId":7
					}
                ]
            }
        ]
    },
    {
        "_id":111,
        "description":"banker convo (Dragonsmoke Island)",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Welcome to the Bank of HighSpell%%Please accept our apologies, the bank branch on Dragonsmoke Island was destroyed by the volcano, so we've temporarily relocated here",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"What do you do here?",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Can you protect my items?",
                        "nextDialogueId":3
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"Can I get a loan",
                        "nextDialogueId":4
                    },
                    {
                        "id":3,
                        "requirements":null,
                        "text":"Did the volcano destroy anyone's valuables?",
                        "nextDialogueId":7
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"I help look after customers' belongings",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Oh ok",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"So you can keep my items safe?",
                        "nextDialogueId":2
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Certainly!%%Just store your items in that bank chest over there, and you will be able to retrieve them later from any other bank branch",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"Certainly!%%Just store your items in that bank chest over there, and you will be able to retrieve them later from any other bank branch",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":4,
                "npcText":"How much are you looking for",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"2 coins",
                        "nextDialogueId":5
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Ten million oughta do it",
                        "nextDialogueId":6
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":5,
                "npcText":"Sorry, we don't provide loans that small",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":6,
                "npcText":"No way",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":7,
                "npcText":"Nope! Thankfully our bank chests are not only fireproof, but lavaproof as well",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":112,
        "description":"convo with nigel (beach)",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Oh I'll never make it back alive past those bandits...",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":113,
        "description":"convo with nigel (home)",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Oh I'll never make it back alive past those bandits...",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":114,
        "description":"convo with lydia",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":null
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Oh I'll never make it back alive past those bandits...",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":115,
        "description":"convo with blackbeard",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":[
                    {
                        "desc":"player needs to have not yet started Dragonsmoke Island quest",
                        "type":"quest",
                        "questid":3,
                        "checkpoint":0,
                        "booleanoperator":null,
                        "operator":"==="
                    }
                ]
            },
            {
                "id":12,
                "requirements":[
                    {
                        "desc":"player needs to be before checkpoint 5 of Dragonsmoke Island quest",
                        "type":"quest",
                        "questid":3,
                        "checkpoint":5,
                        "booleanoperator":null,
                        "operator":"<"
                    }
                ]
            },
            {
                "id":14,
                "requirements":[
                    {
                        "desc":"player needs to be at checkpoint 5 of Dragonsmoke Island quest",
                        "type":"quest",
                        "questid":3,
                        "checkpoint":5,
                        "booleanoperator":null,
                        "operator":"==="
                    }
                ]
            },
            {
                "id":15,
                "requirements":[
                    {
                        "desc":"player needs to be at checkpoint 6 or 7 or 8 of Dragonsmoke Island quest",
                        "type":"quest",
                        "questid":3,
                        "checkpoint":[6,7,8],
                        "booleanoperator":"or",
                        "operator":"==="
                    }
                ]
            },
            {
                "id":20,
                "requirements":[
                    {
                        "desc":"player needs to be at checkpoint 9 or 10 of Dragonsmoke Island quest",
                        "type":"quest",
                        "questid":3,
                        "checkpoint":[9,10],
                        "booleanoperator":"or",
                        "operator":"==="
                    }
                ]
            },
            {
                "id":22,
                "requirements":[
                    {
                        "desc":"player needs to be at checkpoint 11, 12, or 13 of Dragonsmoke Island quest",
                        "type":"quest",
                        "questid":3,
                        "checkpoint":[11,12,13],
                        "booleanoperator":"or",
                        "operator":"==="
                    }
                ]
            },
            {
                "id":24,
                "requirements":[
                    {
                        "desc":"player needs to be at checkpoint 14 of Dragonsmoke Island quest",
                        "type":"quest",
                        "questid":3,
                        "checkpoint":14,
                        "booleanoperator":null,
                        "operator":"==="
                    }
                ]
            },
            {
                "id":26,
                "requirements":[
                    {
                        "desc":"player needs to have completed Dragonsmoke Island quest",
                        "type":"quest",
                        "questid":3,
                        "checkpoint":15,
                        "booleanoperator":null,
                        "operator":"==="
                    }
                ]
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":null,
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Who are you",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"What happened to your ship",
                        "nextDialogueId":2
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"Arr, just look at my beard and you should know%%I am Blackbeard, the most feared pirate of the seven seas",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Arr, we ran aground during a wicked storm and have been stranded here for weeks",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Well good luck fixing it",
                        "nextDialogueId":3
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Where did you and your crew sail in from",
                        "nextDialogueId":4
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"Arr...",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":4,
                "npcText":"Arr, we sailed over from Dragonsmoke Island",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Never heard of that place",
                        "nextDialogueId":5
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Dragonsmoke Island?",
                        "nextDialogueId":5
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":5,
                "npcText":"Dragonsmoke Island, it be an island far south of here, a place many a pirate calls home",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Oh that place sounds dangerous",
                        "nextDialogueId":6
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Can I go there",
                        "nextDialogueId":7
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":6,
                "npcText":"Arr, indeed it be quite dangerous",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":7,
                "npcText":"Arr, only pirates are allowed there",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"I'm a pirate",
                        "nextDialogueId":8
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Oh nevermind then",
                        "nextDialogueId":3
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"Can I become a pirate",
                        "fullText":"Can I become a pirate? I can join your crew",
                        "nextDialogueId":9
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":8,
                "npcText":"Arr, you don't even have a pirate shirt%%How can you possibly be a pirate without the proper shirt?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Oh you're right, how silly of me",
                        "nextDialogueId":3
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"How do I get a pirate shirt",
                        "nextDialogueId":11
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":9,
                "npcText":"Arr, so you want to join my crew and become a pirate, do ye?%%Well first you need to look the part%%And by that, I mean ye be needing a pirate shirt",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Sorry I like my current attire",
                        "nextDialogueId":10
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"How do I get a pirate shirt",
                        "nextDialogueId":11
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":10,
                "npcText":"Arr, then you won't be joining any crew of mine",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":11,
                "npcText":"Arr, I suggest ye try asking around to see if anyone will lend ye one%%But I wouldn't be getting me hopes up",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"AdvanceQuest",
                        "description":"Dragonsmoke Island",
                        "questid":3,
                        "checkpoint":1,
                        "requirements":[
                            {
                                "desc":"player needs to have not yet started Dragonsmoke Island quest",
                                "type":"quest",
                                "questid":3,
                                "checkpoint":0,
                                "booleanoperator":null,
                                "operator":"==="
                            }
                        ]
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":12,
                "npcText":"Arr, what do you want",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":[
                            {
                                "desc":"player needs to not have pirates shirt on",
                                "type":"playerappearance",
                                "appearancetype":"Shirt",
                                "appearanceids":[ 28, 29 ],
                                "booleanoperator":"and",
                                "operator":"!=="
                            }
                        ],
                        "text":"How do I get a pirate shirt again?",
                        "nextDialogueId":11
                    },
                    {
                        "id":1,
                        "requirements":[
                            {
                                "desc":"player needs to have pirates shirt on",
                                "type":"playerappearance",
                                "appearancetype":"Shirt",
                                "appearanceids":[ 28, 29 ],
                                "booleanoperator":"or",
                                "operator":"==="
                            }
                        ],
                        "text":"I got a pirate shirt",
                        "nextDialogueId":13
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":13,
                "npcText":"Arr, then welcome to me crew, matey!",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"AdvanceQuest",
                        "description":"Dragonsmoke Island",
                        "questid":3,
                        "checkpoint":5,
                        "requirements":null
                    }
                ],
                "continuanceDialogues":[
                    {
                        "requirements":null,
                        "nextDialogueId":14
                    }
                ]
            },
            {
                "id":14,
                "npcText":"Say, if you want to go to Dragonsmoke Island, you can talk to Smee at the docks over there%%He be planning on sailing there in his little ol' boat",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":15,
                "npcText":"Arr, did ye sail to Dragonsmoke Island yet?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"The volcano there erupted",
                        "fullText":"Yes, but the volcano there erupted",
                        "nextDialogueId":16
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":16,
                "npcText":"Arr, ye don't say!%%How strange, I could'a sworn that volcano be dormant%%Could ye head back there and look around for any survivors? Maybe they will tell us what happened",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":[
                            {
                                "desc":"player needs to be before checkpoint 8 of Dragonsmoke Island quest",
                                "type":"quest",
                                "questid":3,
                                "checkpoint":8,
                                "booleanoperator":null,
                                "operator":"<"
                            }
                        ],
                        "text":"Ok, I'll look around",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":[
                            {
                                "desc":"player needs to be at checkpoint 8 of Dragonsmoke Island quest",
                                "type":"quest",
                                "questid":3,
                                "checkpoint":8,
                                "booleanoperator":null,
                                "operator":"==="
                            }
                        ],
                        "text":"I found a survivor",
                        "fullText":"I found a survivor named benson, but he won't let me near the volcano",
                        "nextDialogueId":17
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"I saw some undead pirates",
                        "fullText":"There are undead pirates near the volcano",
                        "nextDialogueId":21
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":17,
                "npcText":"Arr, that scallywagger Benson%%You tell him that Blackbeard said to let you explore the volcano%%And if he still refuses, tell him I'll let everyone know that little secret of his",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Ok I'll tell him",
                        "nextDialogueId":18
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"What little secret?",
                        "nextDialogueId":19
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":18,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"AdvanceQuest",
                        "description":"Dragonsmoke Island",
                        "questid":3,
                        "checkpoint":9,
                        "requirements":null
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":19,
                "npcText":"Don't you worry about that%%Afterall, blackmail isn't useful if other people know about it",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":[
                    {
                        "requirements":null,
                        "nextDialogueId":18
                    }
                ]
            },
            {
                "id":20,
                "npcText":"So, did ye find anything interesting around the volcano yet?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Not yet",
                        "nextDialogueId":3
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Just a bunch of undead pirates",
                        "nextDialogueId":21
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":21,
                "npcText":"Undead pirates you say? Arr, that be strange indeed...%%You need to find out what is really going on there",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":22,
                "npcText":null,
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"I found a mad wizard named Isradore",
                        "fullText":"I found a mad wizard named Isradore inside the volcano, he caused the eruption!",
                        "nextDialogueId":23
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":23,
                "npcText":"Isradore?%%So the legends be true...%%Arr, you need to deal with him and save our island!%%I will reward you nicely",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":24,
                "npcText":"Did you defeat Isradore?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Yep",
                        "fullText":"Yep, he shouldn't be causing any more trouble now",
                        "nextDialogueId":25
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":25,
                "npcText":"Arr, thank you matey! Have this reward",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"AdvanceQuest",
                        "description":"Dragonsmoke Island",
                        "questid":3,
                        "checkpoint":15,
                        "requirements":null
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":26,
                "npcText":"Thank you again for defeating Isradore",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"No problem",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"When are you planning on sailing back to Dragonsmoke Island",
                        "nextDialogueId":27
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":27,
                "npcText":"Arr, it'll take a while to get our ship repaired%%Until then, we'll be stuck here for the time being",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Good luck",
                        "fullText":"Well good luck with your ship",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"What about Smee's boat",
                        "nextDialogueId":28
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":28,
                "npcText":"Arr, that little boat%%I'm afraid to admit, but small boats like that make me a bit seasick",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":116,
        "description":"convo with smee (Pirate's Bay)",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":[
                    {
                        "desc":"player needs to be before checkpoint 1 of Dragonsmoke Island quest",
                        "type":"quest",
                        "questid":3,
                        "checkpoint":1,
                        "booleanoperator":null,
                        "operator":"==="
                    }
                ]
            },
            {
                "id":7,
                "requirements":[
                    {
                        "desc":"player needs to be at checkpoint 2 or 3 of Dragonsmoke Island quest",
                        "type":"quest",
                        "questid":3,
                        "checkpoint":[2,3],
                        "booleanoperator":"or",
                        "operator":"==="
                    }
                ]
            },
            {
                "id":9,
                "requirements":[
                    {
                        "desc":"player needs to be at checkpoint 4 of Dragonsmoke Island quest",
                        "type":"quest",
                        "questid":3,
                        "checkpoint":4,
                        "booleanoperator":null,
                        "operator":"==="
                    }
                ]
            },
            {
                "id":12,
                "requirements":[
                    {
                        "desc":"player needs to be at checkpoint 5 of Dragonsmoke Island quest",
                        "type":"quest",
                        "questid":3,
                        "checkpoint":5,
                        "booleanoperator":null,
                        "operator":"==="
                    },
                    {
                        "desc":"player needs to have pirates shirt on",
                        "type":"playerappearance",
                        "appearancetype":"Shirt",
                        "appearanceids":[ 28, 29 ],
                        "booleanoperator":"or",
                        "operator":"==="
                    }
                ]
            },
            {
                "id":13,
                "requirements":[
                    {
                        "desc":"player needs to be past checkpoint 4 of Dragonsmoke Island quest",
                        "type":"quest",
                        "questid":3,
                        "checkpoint":5,
                        "booleanoperator":null,
                        "operator":">="
                    },
                    {
                        "desc":"player needs to not have pirates shirt on",
                        "type":"playerappearance",
                        "appearancetype":"Shirt",
                        "appearanceids":[ 28, 29 ],
                        "booleanoperator":"and",
                        "operator":"!=="
                    }
                ]
            },
            {
                "id":16,
                "requirements":[
                    {
                        "desc":"player needs to be past checkpoint 5 of Dragonsmoke Island quest",
                        "type":"quest",
                        "questid":3,
                        "checkpoint":6,
                        "booleanoperator":null,
                        "operator":">="
                    },
                    {
                        "desc":"player needs to have pirates shirt on",
                        "type":"playerappearance",
                        "appearancetype":"Shirt",
                        "appearanceids":[ 28, 29 ],
                        "booleanoperator":"or",
                        "operator":"==="
                    }
                ]
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Get lost landlubber, I've no time for you",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":[
                            {
                                "desc":"player needs to be at checkpoint 1 of Dragonsmoke Island quest",
                                "type":"quest",
                                "questid":3,
                                "checkpoint":1,
                                "booleanoperator":null,
                                "operator":"==="
                            }
                        ],
                        "text":"I need a pirate shirt",
                        "fullText":"I need a pirate shirt so I can become a pirate",
                        "nextDialogueId":1
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"Aye, is that so? And you think a pirate will just lend you the shirt off his salty back, do ye?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Thats what I was hoping yes",
                        "nextDialogueId":2
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"I'm willing to pay",
                        "nextDialogueId":3
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"Salty back? Nevermind then",
                        "nextDialogueId":null
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Well don't be getting yer hopes up matey",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":[
                    {
                        "requirements":null,
						"nextDialogueId":4
                    }
                ]
            },
            {
                "id":3,
                "npcText":"Arr, this shirt be the only one I got",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":[
                    {
                        "requirements":null,
						"nextDialogueId":4
                    }
                ]
            },
            {
                "id":4,
                "npcText":"Why are ye needing a pirate shirt anyhow?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"I want to be a pirate",
                        "nextDialogueId":5
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"I just really like your style",
                        "nextDialogueId":6
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":5,
                "npcText":"Is that so?%%Well if you really want a pirate shirt, I might know a man who can give one to ye%%An ol' ex-pirate buddy o' mine, Roger%%He's given up a life on the sea, and last I heard hes been living somewhere in Celadon City%%Oh and if you find him, tell him Smee sent ye",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"AdvanceQuest",
                        "description":"Dragonsmoke Island",
                        "questid":3,
                        "checkpoint":2,
                        "requirements":null
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":6,
                "npcText":"Blimey...",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":7,
                "npcText":null,
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Where did you say Roger is?",
                        "nextDialogueId":8
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":8,
                "npcText":"Last I heard that ol' landlubber is living somewhere in Celadon City%%If you find him, tell him Smee sent ye",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":9,
                "npcText":"So did ye find ol' Roger?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Yep, he's doing well",
                        "nextDialogueId":10
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Yea, but he needs to lay off the rum",
                        "nextDialogueId":11
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":10,
                "npcText":"Aye, glad to hear it!",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":11,
                "npcText":"Aye, don't we all",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":12,
                "npcText":"Why look at that, ye got yerself a pirate shirt",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Yep, it feels good to be a pirate",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Blackbeard said you can take me to Dragonsmoke Island",
                        "nextDialogueId":15
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":13,
                "npcText":null,
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Can you take me to Dragonsmoke Island",
                        "nextDialogueId":14
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":14,
                "npcText":"Arr, ye need to be wearing a pirate shirt for me to take ye there",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":15,
                "npcText":"Oh did he now?",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":[
                    {
                        "requirements":null,
                        "nextDialogueId":17
                    }
                ]
            },
            {
                "id":16,
                "npcText":null,
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Let's go back to Dragonsmoke Island",
                        "nextDialogueId":17
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":17,
                "npcText":"Very well, let us depart",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":[
                    {
                        "requirements":null,
                        "nextDialogueId":18
                    }
                ]
            },
            {
                "id":18,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"AdvanceQuest",
                        "description":"Dragonsmoke Island",
                        "questid":3,
                        "checkpoint":6,
                        "requirements":[
                            {
                                "desc":"player needs to be at checkpoint 5 of Dragonsmoke Island quest",
                                "type":"quest",
                                "questid":3,
                                "checkpoint":5,
                                "booleanoperator":null,
                                "operator":"==="
                            }
                        ]
                    },
                    {
                        "desc":"player teleports to Dragonsmoke Island docks near Smee",
                        "type":"TeleportTo",
                        "location":{
                            "x":-404,
                            "y":-419,
                            "lvl":1
                        }
                    }
                ],
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":117,
        "description":"convo with smee (Dragonsmoke Island)",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":[
                    {
                        "desc":"player needs to be at checkpoint 6 or 7 of Dragonsmoke Island quest",
                        "type":"quest",
                        "questid":3,
                        "checkpoint":8,
                        "booleanoperator":null,
                        "operator":"<="
                    }
                ]
            },
            {
                "id":2,
                "requirements":[
                    {
                        "desc":"player needs to be past checkpoint 8 of Dragonsmoke Island quest",
                        "type":"quest",
                        "questid":3,
                        "checkpoint":8,
                        "booleanoperator":null,
                        "operator":">"
                    }
                ]
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Blimey, it looks like the volcano erupted and destroyed the town!%%Can ye search around and see if ye can find any suvivors? I'll stay back and watch the boat",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":[
                            {
                                "desc":"player needs to be at checkpoint 8 of Dragonsmoke Island quest",
                                "type":"quest",
                                "questid":3,
                                "checkpoint":8,
                                "booleanoperator":null,
                                "operator":"==="
                            }
                        ],
                        "text":"I found a pirate named Benson",
                        "fullText":"I found a pirate named Benson, but he won't let me continue exploring the volcano",
                        "nextDialogueId":1
                    }
                ],
                "playerEventActions":[
                    {
                        "type":"AdvanceQuest",
                        "description":"Dragonsmoke Island",
                        "questid":3,
                        "checkpoint":7,
                        "requirements":[
                            {
                                "desc":"player needs to be at checkpoint 6 of Dragonsmoke Island quest",
                                "type":"quest",
                                "questid":3,
                                "checkpoint":6,
                                "booleanoperator":null,
                                "operator":"==="
                            }
                        ]
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"Aye, we should head back to Blackbeard then and inform him of the situation",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":[
                    {
                        "requirements":null,
                        "nextDialogueId":2
                    }
                ]
            },
            {
                "id":2,
                "npcText":"Shall we set sail?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Yes",
                        "nextDialogueId":3
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Not yet",
                        "nextDialogueId":4
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"Let us depart",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":[
                    {
                        "requirements":null,
                        "nextDialogueId":5
                    }
                ]
            },
            {
                "id":4,
                "npcText":"Very well",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":5,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "desc":"player teleports to Pirate's Bay Dock near Smee",
                        "type":"TeleportTo",
                        "location":{
                            "x":-348,
                            "y":-291,
                            "lvl":1
                        }
                    }
                ],
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":118,
        "description":"convo with benson",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":[
                    {
                        "desc":"player needs to be at checkpoint 6 or 7 of Dragonsmoke Island quest",
                        "type":"quest",
                        "questid":3,
                        "checkpoint":[6,7,8],
                        "booleanoperator":"or",
                        "operator":"==="
                    }
                ]
            },
            {
                "id":1,
                "requirements":[
                    {
                        "desc":"player needs to be at checkpoint 9 of Dragonsmoke Island quest",
                        "type":"quest",
                        "questid":3,
                        "checkpoint":9,
                        "booleanoperator":null,
                        "operator":"==="
                    }
                ]
            },
            {
                "id":6,
                "requirements":[
                    {
                        "desc":"player needs to be at or past checkpoint 10 of Dragonsmoke Island quest",
                        "type":"quest",
                        "questid":3,
                        "checkpoint":10,
                        "booleanoperator":null,
                        "operator":">="
                    }
                ]
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Sorry matey, can't let you any closer to the volcano, its too dangerous",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"AdvanceQuest",
                        "description":"Dragonsmoke Island",
                        "questid":3,
                        "checkpoint":8,
                        "requirements":[
                            {
                                "desc":"player needs to be at checkpoint 6 or 7 of Dragonsmoke Island quest",
                                "type":"quest",
                                "questid":3,
                                "checkpoint":[6,7],
                                "booleanoperator":"or",
                                "operator":"==="
                            }
                        ]
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"I thought I already told you, I can't let you any closer to the volcano, its too dangerous",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Oh my mistake",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Blackbeard said to let me through, or else",
                        "nextDialogueId":2
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Did he now? Or else what",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"He'll make you walk to the plank",
                        "nextDialogueId":3
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"It'll be off with your head",
                        "nextDialogueId":4
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"He'll tell everyone your dirty little secret",
                        "nextDialogueId":5
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"What plank? We aren't even on a ship",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":4,
                "npcText":"Is that so?%%I haven't even seen that ol' pirate in months, as far as I'm concerned he's marooned on some deserted island%%So I'll believe that threat when he says it to me face to face",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":5,
                "npcText":"My what?%%How'd you-%%He said he wouldn't ever tell anyone%%Err, I mean you said you wanted through to the volcano, yea? Help yourself!",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"AdvanceQuest",
                        "description":"Dragonsmoke Island",
                        "questid":3,
                        "checkpoint":10,
                        "requirements":null
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":6,
                "npcText":"Go on through the gate matey!%%Oh, and don't mention anyone about any secret I may or may not have, savvy?",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":119,
        "description":"convo with roger",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":[
                    {
                        "desc":"player needs to be before checkpoint 3 of Dragonsmoke Island quest",
                        "type":"quest",
                        "questid":3,
                        "checkpoint":2,
                        "booleanoperator":null,
                        "operator":"<="
                    }
                ]
            },
            {
                "id":4,
                "requirements":[
                    {
                        "desc":"player needs to be at or past checkpoint 3 of Dragonsmoke Island quest",
                        "type":"quest",
                        "questid":3,
                        "checkpoint":3,
                        "booleanoperator":null,
                        "operator":">="
                    }
                ]
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Arr, get outta my house, would ye?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Sorry",
                        "fullText":"Sorry, I'm on my way out",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":[
                            {
                                "desc":"player needs to be at checkpoint 2 of Dragonsmoke Island quest",
                                "type":"quest",
                                "questid":3,
                                "checkpoint":2,
                                "booleanoperator":null,
                                "operator":"==="
                            }
                        ],
                        "text":"Smee sent me",
                        "nextDialogueId":1
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"Smee?%%Haven't heard that name in a while%%Whats he been up to?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Still being a pirate",
                        "fullText":"Oh still being a pirate. He said you can give me a pirate shirt wear, by the way",
                        "nextDialogueId":2
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"I don't have time for small talk",
                        "fullText":"I don't have time for small talk, Smee said you could give me a pirate shirt to wear",
                        "nextDialogueId":2
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":2,
                "npcText":"Oh really%%Well I'm not just going to give away any of my old pirate shirts%%Lets make a deal, you give me a bottle of rum, I give you a pirate shirt",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Deal",
                        "nextDialogueId":null
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Where can I get a bottle of rum from?",
                        "nextDialogueId":3
                    }
                ],
                "playerEventActions":[
                    {
                        "type":"AdvanceQuest",
                        "description":"Dragonsmoke Island",
                        "questid":3,
                        "checkpoint":3,
                        "requirements":null
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":3,
                "npcText":"Well we always had rum on pirate ships%%Or maybe a bar nearby is selling some",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":4,
                "npcText":"If you want a pirate shirt, just give me some rum",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":[
                            {
                                "desc":"player needs to have 0 bottles of rum in their inventory to view this option",
                                "type":"inventoryitem",
                                "itemid":424,
                                "isiou":false,
                                "amount":0,
                                "operator":"==="
                            }
                        ],
                        "text":"I don't have any rum",
                        "nextDialogueId":5
                    },
                    {
                        "id":1,
                        "requirements":[
                            {
                                "desc":"player needs to have 1 or more bottles of rum in their inventory to view this option",
                                "type":"inventoryitem",
                                "itemid":424,
                                "isiou":false,
                                "amount":1,
                                "operator":">="
                            }
                        ],
                        "text":"Here's your rum",
                        "nextDialogueId":6
                    },
                    {
                        "id":2,
                        "requirements":[
                            {
                                "desc":"player needs to have 1 or more bottles of rum in their inventory to view this option",
                                "type":"inventoryitem",
                                "itemid":424,
                                "isiou":false,
                                "amount":1,
                                "operator":">="
                            }
                        ],
                        "text":"I think I'll keep my rum actually",
                        "nextDialogueId":5
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":5,
                "npcText":"No rum, no shirt",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":6,
                "npcText":"Well hand it over",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Here you go",
                        "nextDialogueId":7
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Actually I changed my mind",
                        "fullText":"Actually I changed my mind, I'm keeping the rum",
                        "nextDialogueId":null
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":7,
                "npcText":"Ahh, lovely rum",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":[
                    {
                        "requirements":null,
                        "nextDialogueId":8
                    }
                ]
            },
            {
                "id":8,
                "npcText":"Oh yes, and what kind of pirate shirt do you want?",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":[
                            {
                                "desc":"player needs to not have a male pirate shirt on",
                                "type":"playerappearance",
                                "appearancetype":"Shirt",
                                "appearanceids":28,
                                "booleanoperator":null,
                                "operator":"!=="
                            }
                        ],
                        "text":"Guys shirt",
                        "nextDialogueId":9
                    },
                    {
                        "id":1,
                        "requirements":[
                            {
                                "desc":"player needs to not have a female pirate shirt on",
                                "type":"playerappearance",
                                "appearancetype":"Shirt",
                                "appearanceids":29,
                                "booleanoperator":null,
                                "operator":"!=="
                            }
                        ],
                        "text":"Gals shirt",
                        "nextDialogueId":10
                    },
                    {
                        "id":2,
                        "requirements":null,
                        "text":"Nevermind",
                        "nextDialogueId":null
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":9,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "desc":"player gives a bottle of rum",
                        "type":"PlayerGiveItems",
                        "playerGiveItems":[
                            {
                                "id":424,
                                "isIOU":false,
                                "amt":1
                            }
                        ]
                    },
                    {
                        "desc":"changes into pirate shirt",
                        "type":"ForceChangeAppearance",
                        "beard":null,
                        "hair":null,
                        "shirt":28,
                        "pants":null,
                        "body":null,
                        "requirements":null
                    },
                    {
                        "type":"AdvanceQuest",
                        "description":"Dragonsmoke Island",
                        "questid":3,
                        "checkpoint":4,
                        "requirements":[
                            {
                                "desc":"player needs to be at checkpoint 3 of Dragonsmoke Island quest",
                                "type":"quest",
                                "questid":3,
                                "checkpoint":3,
                                "booleanoperator":null,
                                "operator":"==="
                            }
                        ]
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":10,
                "npcText":null,
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "desc":"player gives a bottle of rum",
                        "type":"PlayerGiveItems",
                        "playerGiveItems":[
                            {
                                "id":424,
                                "isIOU":false,
                                "amt":1
                            }
                        ]
                    },
                    {
                        "desc":"changes into pirate shirt",
                        "type":"ForceChangeAppearance",
                        "beard":null,
                        "hair":null,
                        "shirt":29,
                        "pants":null,
                        "body":null,
                        "requirements":null
                    },
                    {
                        "type":"AdvanceQuest",
                        "description":"Dragonsmoke Island",
                        "questid":3,
                        "checkpoint":4,
                        "requirements":[
                            {
                                "desc":"player needs to be at checkpoint 3 of Dragonsmoke Island quest",
                                "type":"quest",
                                "questid":3,
                                "checkpoint":3,
                                "booleanoperator":null,
                                "operator":"==="
                            }
                        ]
                    }
                ],
                "continuanceDialogues":null
            }
        ]
    },
    {
        "_id":120,
        "description":"convo with isradore",
        "initialConversationDialogues":[
            {
                "id":0,
                "requirements":[
                    {
                        "desc":"player needs to be at checkpoint 10 of Dragonsmoke Island quest",
                        "type":"quest",
                        "questid":3,
                        "checkpoint":10,
                        "booleanoperator":null,
                        "operator":"==="
                    }
                ]
            },
            {
                "id":3,
                "requirements":[
                    {
                        "desc":"player needs to be at checkpoint 11 of Dragonsmoke Island quest",
                        "type":"quest",
                        "questid":3,
                        "checkpoint":11,
                        "booleanoperator":null,
                        "operator":"==="
                    }
                ]
            },
            {
                "id":4,
                "requirements":[
                    {
                        "desc":"player needs to be at checkpoint 12 of Dragonsmoke Island quest",
                        "type":"quest",
                        "questid":3,
                        "checkpoint":12,
                        "booleanoperator":null,
                        "operator":"==="
                    }
                ]
            },
            {
                "id":5,
                "requirements":[
                    {
                        "desc":"player needs to be at checkpoint 13 of Dragonsmoke Island quest",
                        "type":"quest",
                        "questid":3,
                        "checkpoint":13,
                        "booleanoperator":null,
                        "operator":"==="
                    }
                ]
            },
            {
                "id":6,
                "requirements":[
                    {
                        "desc":"player needs to be at checkpoint 14 or 15 of Dragonsmoke Island quest",
                        "type":"quest",
                        "questid":3,
                        "checkpoint":[14,15],
                        "booleanoperator":"or",
                        "operator":"==="
                    }
                ]
            }
        ],
        "conversationDialogues":[
            {
                "id":0,
                "npcText":"Let me guess, investigating the volcanic eruption, are we?%%I'll save you some time - It was I, Master Isradore, the greatest wizard to ever live, who caused the eruption!",
                "playerConversationOptions":[
                    {
                        "id":0,
                        "requirements":null,
                        "text":"Greatest wizard to ever live?",
                        "fullText":"Greatest wizard to ever live? I've never even heard of you",
                        "nextDialogueId":1
                    },
                    {
                        "id":1,
                        "requirements":null,
                        "text":"Wow you are powerful",
                        "nextDialogueId":2
                    }
                ],
                "playerEventActions":null,
                "continuanceDialogues":null
            },
            {
                "id":1,
                "npcText":"No matter, as you will soon be dead",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":[
                    {
                        "requirements":null,
                        "nextDialogueId":3
                    }
                ]
            },
            {
                "id":2,
                "npcText":"Indeed I am%%No matter, I'm afraid your words of flattery cannot save you from certain death",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":[
                    {
                        "requirements":null,
                        "nextDialogueId":3
                    }
                ]
            },
            {
                "id":3,
                "npcText":"Behold, my pet chicken! You will stand no chance against him",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"AdvanceQuest",
                        "description":"Dragonsmoke Island",
                        "questid":3,
                        "checkpoint":11,
                        "requirements":[
                            {
                                "desc":"player needs to be at checkpoint 10 of Dragonsmoke Island quest",
                                "type":"quest",
                                "questid":3,
                                "checkpoint":10,
                                "booleanoperator":null,
                                "operator":"==="
                            }
                        ]
                    },
                    {
                        "type":"SpawnInstancedNPC",
                        "id":52,
                        "spawnOnDoorSide":null,
                        "requirements":null
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":4,
                "npcText":"Aagh! You may have killed my chicken, but you'll be no match for my rat!",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"AdvanceQuest",
                        "description":"Dragonsmoke Island",
                        "questid":3,
                        "checkpoint":12,
                        "requirements":[
                            {
                                "desc":"player needs to be at checkpoint 11 of Dragonsmoke Island quest",
                                "type":"quest",
                                "questid":3,
                                "checkpoint":11,
                                "booleanoperator":null,
                                "operator":"==="
                            }
                        ]
                    },
                    {
                        "type":"SpawnInstancedNPC",
                        "id":53,
                        "spawnOnDoorSide":null,
                        "requirements":null
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":5,
                "npcText":"You have defeated my chicken and my rat, but alas, now you will truly meet your match%%Behold, my dragon!",
                "playerConversationOptions":null,
                "playerEventActions":[
                    {
                        "type":"AdvanceQuest",
                        "description":"Dragonsmoke Island",
                        "questid":3,
                        "checkpoint":13,
                        "requirements":[
                            {
                                "desc":"player needs to be at checkpoint 12 of Dragonsmoke Island quest",
                                "type":"quest",
                                "questid":3,
                                "checkpoint":12,
                                "booleanoperator":null,
                                "operator":"==="
                            }
                        ]
                    },
                    {
                        "type":"SpawnInstancedNPC",
                        "id":54,
                        "spawnOnDoorSide":null,
                        "requirements":null
                    }
                ],
                "continuanceDialogues":null
            },
            {
                "id":6,
                "npcText":"You have defeated all of my pets%%It is I who has met his match...%%Very well, I will forever resign myself from using dark magic to cause pain and destruction...",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":[
                    {
                        "requirements":[
                            {
                                "desc":"player needs to have completed Dragonsmoke Island quest",
                                "type":"quest",
                                "questid":3,
                                "checkpoint":15,
                                "booleanoperator":null,
                                "operator":"==="
                            }
                        ],
                        "nextDialogueId":7
                    }
                ]
            },
            {
                "id":7,
                "npcText":"As you have proven your worth, I will let you enter the Dragon's Den%%But beware, it isn't for the faint of heart",
                "playerConversationOptions":null,
                "playerEventActions":null,
                "continuanceDialogues":null
            }
        ]
    }
]