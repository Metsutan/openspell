[
    {
        "_id" : 1,
        "description" : "conversation with Hank",
        "result" : {
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Hello",
                    "result" : {
                        "npcText" : "Hi",
                        "options" : [
                            {
                                "requirements" : null,
                                "text" : "Who are you?",
                                "result" : {
                                    "npcText" : "Hank",
                                    "options" : [
                                        {
                                            "requirements" : null,
                                            "text" : "Oh, nice name",
                                            "result" : {
                                                "endConversation" : true
                                            }
                                        },
                                        {
                                            "requirements" : null,
                                            "text" : "So what do you do Hank",
                                            "result" : {
                                                "npcText" : "I sell helmets, want to buy some?",
                                                "options" : [
                                                    {
                                                        "requirements" : null,
                                                        "text" : "Sure",
                                                        "result" : {
                                                            "playerEventAction" : {
                                                                "type" : "StartShopping",
                                                                "shopId" : 1
                                                            },
                                                            "endConversation" : true
                                                        }
                                                    },
                                                    {
                                                        "requirements" : null,
                                                        "text" : "No",
                                                        "result" : {
                                                            "endConversation" : true
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                "requirements" : null,
                                "text" : "Nice weather we're having",
                                "result" : {
                                    "npcText" : "Sure is",
                                    "endConversation" : true
                                }
                            }
                        ]
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Can I buy some helmets?",
                    "result" : {
                        "npcText" : "Sure!",
                        "playerEventAction" : {
                            "type" : "StartShopping",
                            "shopId" : 1
                        },
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 2,
        "description" : "Conversation with Frans, the makeover man",
        "result" : {
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Hello",
                    "result" : {
                        "npcText" : "Hey cutie, want to change your look? I can make you look fabulous",
                        "options" : [
                            {
                                "requirements" : null,
                                "text" : "How can you change my look?",
                                "result" : {
                                    "npcText" : "Oh you know, maybe a suntan, a little dye here, a little snip snip there",
                                    "options" : [
                                        {
                                            "requirements" : null,
                                            "text" : "Snip snip?",
                                            "result" : {
                                                "npcText" : "Oh relax sweetie it won't hurt too much",
                                                "options" : [
                                                    {
                                                        "requirements" : null,
                                                        "text" : "Ok, I guess I'll try it out",
                                                        "result" : {
                                                            "npcText" : "Wonderful, lets get started then!",
                                                            "playerEventAction" : {
                                                                "type" : "ChangeAppearance"
                                                            },
                                                            "endConversation" : true
                                                        }
                                                    },
                                                    {
                                                        "requirements" : null,
                                                        "text" : "Uh no thanks sounds scary",
                                                        "result" : {
                                                            "npcText" : "Fine suit yourself",
                                                            "endConversation" : true
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            "requirements" : null,
                                            "text" : "Will it hurt?",
                                            "result" : {
                                                "npcText" : "Maybe",
                                                "options" : [
                                                    {
                                                        "requirements" : null,
                                                        "text" : "Ok, I guess I'll try it out",
                                                        "result" : {
                                                            "npcText" : "Wonderful, lets get started then!",
                                                            "playerEventAction" : {
                                                                "type" : "ChangeAppearance"
                                                            },
                                                            "endConversation" : true
                                                            
                                                        }
                                                    },
                                                    {
                                                        "requirements" : null,
                                                        "text" : "No thanks, sounds dangerous",
                                                        "result" : {
                                                            "npcText" : "Well, bye then!",
                                                            "endConversation" : true
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            "requirements" : null,
                                            "text" : "Sure, I'm ready for a new style",
                                            "result" : {
                                                "npcText" : "Great, lets get to it!",
                                                "playerEventAction" : {
                                                    "type" : "ChangeAppearance"
                                                },
                                                "endConversation" : true
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                "requirements" : null,
                                "text" : "I already look fabulous",
                                "result" : {
                                    "npcText" : "Oh you certainly do honey, but there is always room for improvement!",
                                    "options" : [
                                        {
                                            "requirements" : null,
                                            "text" : "Fine, improve me then",
                                            "result" : {
                                                "npcText" : "Wonderful, lets get started then!",
                                                "playerEventAction" : {
                                                    "type" : "ChangeAppearance"
                                                },
                                                "endConversation" : true
                                            }
                                        },
                                        {
                                            "requirements" : null,
                                            "text" : "No thanks, I'm happy with the way I am",
                                            "result" : {
                                                "npcText" : "Oh I just love your self confidence. Ok, bye now!",
                                                "endConversation" : true
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Who are you?",
                    "result" : {
                        "npcText" : "I'm Frans, and I can help you with your look! So what do you say, are you ready for the new you?",
                        "options" : [
                            {
                                "requirements" : null,
                                "text" : "No",
                                "result" : {
                                    "npcText" : "Ok, have a good day then!",
                                    "endConversation" : true
                                }
                            },
                            {
                                "requirements" : null,
                                "text" : "The new me?",
                                "result" : {
                                    "npcText" : "Oh yes, I can see it now, you'll be the next trend-setter!",
                                    "options" : [
                                        {
                                            "requirements" : null,
                                            "text" : "I've always wanted to set some trends",
                                            "result" : {
                                                "npcText" : "Oh how wonderful, lets get to it then!",
                                                "playerEventAction" : {
                                                    "type" : "ChangeAppearance"
                                                },
                                                "endConversation" : true
                                            }
                                        },
                                        {
                                            "requirements" : null,
                                            "text" : "Not interested",
                                            "result" : {
                                                "npcText" : "Fine, suit yourself!",
                                                "endConversation" : true
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Can you help me change my look?",
                    "result" : {
                        "npcText" : "Absolutely! It'll only be 5000 coins",
                        "options" : [
                            {
                                "requirements" : null,
                                "text" : "5000 coins?!",
                                "result" : {
                                    "npcText" : "Yep! And I guarantee you will not find a better service anywhere else",
                                    "options" : [
                                        {
                                            "requirements" : null,
                                            "text" : "Sorry, too expensive",
                                            "result" : {
                                                "npcText" : "High class fashion doesn't come cheap!",
                                                "endConversation" : true
                                            }
                                        },
                                        {
                                            "requirements" : null,
                                            "text" : "Ok, I'm ready",
                                            "result" : {
                                                "npcText" : "Great, lets get started!",
                                                "playerEventAction" : {
                                                    "type" : "ChangeAppearance"
                                                },
                                                "endConversation" : true
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                "requirements" : null,
                                "text" : "What about 500?",
                                "result" : {
                                    "npcText" : "Sorry sweetie, the price isn't negotiable!",
                                    "options" : [
                                        {
                                            "requirements" : null,
                                            "text" : "Sorry, too expensive",
                                            "result" : {
                                                "npcText" : "High class fashion doesn't come cheap!",
                                                "endConversation" : true
                                            }
                                        },
                                        {
                                            "requirements" : null,
                                            "text" : "Fine, 5000 it is",
                                            "result" : {
                                                "npcText" : "Great, lets get started!",
                                                "playerEventAction" : {
                                                    "type" : "ChangeAppearance"
                                                },
                                                "endConversation" : true
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                "requirements" : null,
                                "text" : "Ok, I'm ready",
                                "result" : {
                                    "npcText" : "Great, lets get started!",
                                    "playerEventAction" : {
                                        "type" : "ChangeAppearance"
                                    },
                                    "endConversation" : true
                                }
                            }
                        ]
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Nice hair",
                    "result" : {
                        "npcText" : "Thanks darling! What do you say, do you want to change your look?",
                        "options" : [
                            {
                                "requirements" : null,
                                "text" : "No",
                                "result" : {
                                    "npcText" : "Ok, goodbye then!",
                                    "endConversation" : true
                                }
                            },
                            {
                                "requirements" : null,
                                "text" : "How can I change my look",
                                "result" : {
                                    "npcText" : "Oh, don't you worry about that, leave it to me",
                                    "options" : [
                                        {
                                            "requirements" : null,
                                            "text" : "Ok, if you say so",
                                            "result" : {
                                                "npcText" : "Great, lets do it!",
                                                "playerEventAction" : {
                                                    "type" : "ChangeAppearance"
                                                },
                                                "endConversation" : true
                                            }
                                        },
                                        {
                                            "requirements" : null,
                                            "text" : "On second thought, no thanks",
                                            "result" : {
                                                "endConversation" : true
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
            ]
        }
    },
    {
        "_id" : 3,
        "description" : "conversation with Man with no roof",
        "result" : {
            "npcText" : "A big gust of wind came and blew the roof off my house, can you believe that?",
            "endConversation" : true
        }
    },
    {
        "_id" : 4,
        "description" : "conversation with potato farmer",
        "result" : {
            "npcText" : "Hey! Keep yer grubby hands off my potatoes!",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Yes sir",
                    "result" : {
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "My hands aren't grubby",
                    "result" : {
                        "npcText" : "Don't matter, you can't harvest 'em without a pair of gloves anyway",
                        "options" : [
                            {
                                "requirements" : null,
                                "text" : "Thanks for the tip",
                                "result" : {
                                    "endConversation" : true
                                }
                            },
                            {
                                "requirements" : null,
                                "text" : "Oh can you give me a pair of gloves then",
                                "result" : {
                                    "npcText" : "Go get yer own ya little beggar",
                                    "endConversation" : true
                                }
                            }
                        ]
                    }
                }
            ]
        }
    },
    {
        "_id" : 5,
        "description" : "conversation about stupid jokes",
        "result" : {
            "npcText" : "Hey, do you want to hear a joke?",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Yes",
                    "result" : {
                        "npcText" : "Me too! Hey, tell me a joke!",
                        "options" : [
                            {
                                "requirements" : null,
                                "text" : "No",
                                "result" : {
                                    "endConversation" : true
                                }
                            },
                            {
                                "requirements" : null,
                                "text" : "Uh ok... Why did the chicken cross the road?",
                                "result" : {
                                    "npcText" : "Hahaha! Thats hilarious!",
                                    "options" : [
                                        {
                                            "requirements" : null,
                                            "text" : "But I didn't even get to the punchline",
                                            "result" : {
                                                "npcText" : "Punchline! Hahahaha!",
                                                "options" : [
                                                    {
                                                        "requirements" : null,
                                                        "text" : "Ok...",
                                                        "result" : {
                                                            "endConversation" : true
                                                        }
                                                    },
                                                    {
                                                        "requirements" : null,
                                                        "text" : "I'll be going now...",
                                                        "result" : {
                                                            "endConversation" : true
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            "requirements" : null,
                                            "text" : "Thanks, I'll be here all week",
                                            "result" : {
                                                "npcText" : "All week? Ahahahaha!",
                                                "options" : [
                                                    {
                                                        "requirements" : null,
                                                        "text" : "Haha... yeah, bye now",
                                                        "result" : {
                                                            "npcText" : "Hahaha! Bye bye!",
                                                            "endConversation" : true
                                                        }
                                                    },
                                                    {
                                                        "requirements" : null,
                                                        "text" : "Whats so funny about that?",
                                                        "result" : {
                                                            "npcText" : "Hahaha! I can't breath!",
                                                            "options" : [
                                                                {
                                                                    "requirements" : null,
                                                                    "text" : "You sure are easily amused",
                                                                    "result" : {
                                                                        "npcText" : "Amused! Hahahaha! Hey, say the one about the chicken again!",
                                                                        "options" : [
                                                                            {
                                                                                "requirements" : null,
                                                                                "text" : "Why'd the chicken cross the road...",
                                                                                "result" : {
                                                                                    "npcText" : "Ahaha! Its even funnier the second time!",
                                                                                    "options" : [
                                                                                        {
                                                                                            "requirements" : null,
                                                                                            "text" : "Thanks... I'll be going now...",
                                                                                            "result" : {
                                                                                                "endConversation" : true
                                                                                            }
                                                                                        },
                                                                                        {
                                                                                            "requirements" : null,
                                                                                            "text" : "Yep, it sure is...",
                                                                                            "result" : {
                                                                                                "endConversation" : true
                                                                                            }
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            }
                                                                        ]
                                                                    }
                                                                },
                                                                {
                                                                    "requirements" : null,
                                                                    "text" : "Well, bye now",
                                                                    "result" : {
                                                                        "endConversation" : true
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },
                {
                    "requirements" : null,
                    "text" : "No",
                    "result" : {
                        "npcText" : "Well you're no fun!",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 6,
        "description" : "guard convo",
        "result" : {
            "npcText" : "I just enlisted, and they got me stationed way out here%%What are we supposed to be guarding out here anyways?",
            "endConversation" : true
        }
    },
    {
        "_id" : 7,
        "description" : "guard convo",
        "result" : {
            "npcText" : "Sure is boring being stationed way out here",
            "endConversation" : true
        }
    },
    {
        "_id" : 8,
        "description" : "guard convo",
        "result" : {
            "npcText" : "I sure am hungry",
            "endConversation" : true
        }
    },
    {
        "_id" : 9,
        "description" : "farmer convo about bandits salting his fields",
        "result" : {
            "npcText" : "This used to be lush farmland, but a while back some bandits came and salted these fields, now hardly anything grows around here",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Why did they do that?",
                    "result" : {
                        "npcText" : "My guess is they were bribed to do it by the Imperial Legion%%They would love nothing more than to watch our Kingdom crumble",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Salted the fields?",
                    "result" : {
                        "npcText" : "They dumped salt all over the ground, which prevents crops from growing",
                        "options" : [
                            {
                                "requirements" : null,
                                "text" : "Why did they do that?",
                                "result" : {
                                    "npcText" : "My guess is they were bribed to do it by the Imperial Legion%%They would love nothing more than to watch our Kingdom crumble",
                                    "endConversation" : true
                                }
                            },
                            {
                                "requirements" : null,
                                "text" : "You sound a bit salty",
                                "result" : {
                                    "npcText" : "Oh we have a comedian over here%%I'm sure if your source of food and income was destroyed, you'd be a bit \"salty\" too!",
                                    "endConversation" : true
                                }
                            }
                        ]
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Sounds to me like thats your problem",
                    "result" : {
                        "npcText" : "And the problem of everyone who relies on this land for their food",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 10,
        "description" : "conversation with Clyde",
        "result" : {
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Who are you",
                    "result" : {
                        "npcText" : "I'm Clyde, a cape salesman! Want to buy some capes?",
                        "options" : [
							{
								"requirements" : null,
								"text" : "Sure",
								"result" : {
									"playerEventAction" : {
										"type" : "StartShopping",
										"shopId" : 2
									},
									"endConversation" : true
								}
							},
							{
								"requirements" : null,
								"text" : "Nope",
								"result" : {
									"npcText" : "Ok, well if you change your mind later, I'll be right here!",
									"endConversation" : true
								}
							}
						]
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Whats for sale boss?",
                    "result" : {
                        "npcText" : "I'm selling capes! Interested in buying any?",
						"options" : [
							{
								"requirements" : null,
								"text" : "Sure",
								"result" : {
									"playerEventAction" : {
										"type" : "StartShopping",
										"shopId" : 2
									},
									"endConversation" : true
								}
							},
							{
								"requirements" : null,
								"text" : "Nope not interested",
								"result" : {
									"endConversation" : true
								}
							}
						]
                    }
                },
				{
					"requirements" : null,
					"text" : "Nice cape",
					"result" : {
						"npcText" : "Thanks! I'm a cape seller, interested in buying any?",
						"options" : [
							{
								"requirements" : null,
								"text" : "Sure",
								"result" : {
									"playerEventAction" : {
										"type" : "StartShopping",
										"shopId" : 2
									},
									"endConversation" : true
								}
							},
							{
								"requirements" : null,
								"text" : "Nope not interested",
								"result" : {
									"endConversation" : true
								}
							}
						]
					}
                },
                {
					"requirements" : null,
					"text" : "What you got in the chest over there",
					"result" : {
						"npcText" : "Thats where I store my products%%I'm a cape seller, interested in buying any?",
						"options" : [
							{
								"requirements" : null,
								"text" : "Sure",
								"result" : {
									"playerEventAction" : {
										"type" : "StartShopping",
										"shopId" : 2
									},
									"endConversation" : true
								}
							},
							{
								"requirements" : null,
								"text" : "Nope not interested",
								"result" : {
									"endConversation" : true
								}
							}
						]
					}
				}
            ]
        }
    },
    {
        "_id" : 11,
        "description" : "conversation with Tenny (giant milk tavern)",
        "result" : {
			"npcText" : "Welcome to Tenny's Giant's Milk Tavern! Freshly squeezed straight from Grompy over there",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Giant's milk?",
                    "result" : {
                        "npcText" : "Yep! Wanna buy some?",
                        "options" : [
							{
								"requirements" : null,
								"text" : "I guess",
								"result" : {
									"playerEventAction" : {
										"type" : "StartShopping",
										"shopId" : 3
									},
									"endConversation" : true
								}
							},
							{
								"requirements" : null,
								"text" : "No that sounds gross",
								"result" : {
									"npcText" : "Yes I will admit its an acquired taste",
									"endConversation" : true
								}
							}
						]
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Why is your tavern hidden underground?",
                    "result" : {
                        "npcText" : "Lets just say milking giants might not be completely legal%%So, what do you say? Wanna buy some giant's milk?",
						"options" : [
							{
								"requirements" : null,
								"text" : "Yes",
								"result" : {
									"playerEventAction" : {
										"type" : "StartShopping",
										"shopId" : 3
									},
									"endConversation" : true
								}
							},
							{
								"requirements" : null,
								"text" : "No thank you",
								"result" : {
									"endConversation" : true
								}
							}
						]
                    }
                },
				{
					"requirements" : null,
					"text" : "Can I milk Grompy?",
					"result" : {
						"npcText" : "No he only lets me milk him",
						"options" : [
							{
								"requirements" : null,
								"text" : "Please",
								"result" : {
									"npcText" : "Nope we don't want to be held liable if he crushes you into a pulp",
									"endConversation" : true
								}
							},
							{
								"requirements" : null,
								"text" : "Oh I understand",
								"result" : {
									"endConversation" : true
								}
							}
						]
					}
				},
				{
                    "requirements" : null,
                    "text" : "Isn't Grompy a male giant?",
                    "result" : {
                        "npcText" : "Sure is",
                        "options" : [
                            {
                                "requirements" : null,
                                "text" : "Oh I didn't know male giants could be milked",
                                "result" : {
                                    "npcText" : "Yep, you just gotta squeeze real hard",
                                    "endConversation" : true
                                }
                            },
                            {
                                "requirements" : null,
                                "text" : "I think I'm gonna be sick",
                                "result" : {
                                    "endConversation" : true
                                }
                            }
                        ]
                    }
                }
            ]
        }
    },
    {
        "_id" : 12,
        "description" : "conversation with Bartender (dragon slayer's inn)",
        "result" : {
            "npcText" : "Welcome to The Dragon Slayer's Inn! Care for a drink?",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Sure",
                    "result" : {
                        "playerEventAction" : {
                            "type" : "StartShopping",
                            "shopId" : 4
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Maybe another time",
                    "result" : {
                        "npcText" : "Alright",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 13,
        "description" : "banker convo",
        "result" : {
            "npcText" : "Welcome to the Bank of HighSpell",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "What do you do here?",
                    "result" : {
                        "npcText" : "I help look after customers' belongings",
                        "options" : [
							{
                                "requirements" : null,
                                "text" : "Oh ok",
                                "result" : {
                                    "endConversation" : true
                                }
                            },
                            {
                                "requirements" : null,
                                "text" : "So you can keep my items safe?",
                                "result" : {
                                    "npcText" : "Certainly!%%Just store your items in that bank chest over there, and you will be able to retrieve them later from any other bank branch",
                                    "endConversation" : true
                                }
                            }
                        ]
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Can you protect my items?",
                    "result" : {
                        "npcText" : "Certainly!%%Just store your items in that bank chest over there, and you will be able to retrieve them later from any other bank branch",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Can I get a loan",
                    "result" : {
                        "npcText" : "How much are you looking for",
                        "options" : [
							{
                                "requirements" : null,
                                "text" : "2 coins",
                                "result" : {
									"npcText" : "Sorry, we don't provide loans that small",
                                    "endConversation" : true
                                }
                            },
                            {
                                "requirements" : null,
                                "text" : "Ten million oughta do it",
                                "result" : {
                                    "npcText" : "No way",
                                    "endConversation" : true
                                }
                            }
                        ]
                    }
                }
            ]
        }
    },
    {
        "_id" : 14,
        "description" : "shadow banker convo",
        "result" : {
            "npcText" : "Welcome to the Bank of HighSpell",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "This doesn't look like a bank",
                    "result" : {
                        "npcText" : "Oh, well uh, thats because we're currently under construction",
                        "options" : [
							{
                                "requirements" : null,
                                "text" : "Oh ok",
                                "result" : {
                                    "endConversation" : true
                                }
                            },
                            {
                                "requirements" : null,
                                "text" : "Is this really a bank, or is it a scam operation",
                                "result" : {
                                    "npcText" : "Yes",
                                    "endConversation" : true
                                }
                            }
                        ]
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Can you protect my items?",
                    "result" : {
                        "npcText" : "Sure!%%Just store your items in that trustworthy-looking chest over there, hehehe...",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 15,
        "description" : "man convo about furnace",
        "result" : {
            "npcText" : "People smelt all sorts of ores in that furnace over there%%The public is free to use it!",
            "endConversation" : true
        }
    },
    {
        "_id" : 16,
        "description" : "conversation with corn farmer",
        "result" : {
            "npcText" : "What do you call the corner of a cornfield?",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "I don't know",
                    "result" : {
                        "npcText" : "A corner",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "What",
                    "result" : {
                        "npcText" : "A corner",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 17,
        "description" : "conversation with lumberjack about money tree",
        "result" : {
            "npcText" : "Rumor has it there are trees that grow money!",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Really? Where can I find one?",
                    "result" : {
                        "npcText" : "Not sure, haven't found one myself...%%But I haven't given up just yet!",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Sounds like you'll believe anything",
                    "result" : {
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 18,
        "description" : "convo about old mans aching bones",
        "result" : {
            "npcText" : "My bones are aching, a storm must being coming%%Then again, maybe its because I'm too old to be hiking up this mountain...",
            "endConversation" : true
        }
    },
    {
        "_id" : 19,
        "description" : "convo with mountain sage",
        "result" : {
            "npcText" : "If one is consistent in their practice, they can achieve perfection sooner than they realize",
            "endConversation" : true
        }
    },
    {
        "_id" : 20,
        "description" : "convo with wizard at lightning obelisk",
        "result" : {
            "npcText" : "When used upon this obelisk, a scroll carved from a log may be enchanted with the power of lightning",
            "endConversation" : true
        }
    },
    {
        "_id" : 21,
        "description" : "convo with elder knight in caves",
        "result" : {
            "npcText" : "There is great evil deep within these caves, and it is my duty to make sure it stays down here%%I recommend turning back my friend",
            "endConversation" : true
        }
    },
    {
        "_id" : 22,
        "description" : "convo with ictirine general store owner",
        "result" : {
            "npcText" : "Welcome to my shop%%Is there anything you're looking to buy or sell?",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Show me what you're selling",
                    "result" : {
                        "playerEventAction" : {
                            "type" : "StartShopping",
                            "shopId" : 5
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Yep I got some stuff I want to sell",
                    "result" : {
                        "playerEventAction" : {
                            "type" : "StartShopping",
                            "shopId" : 5
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Sorry I'm not interested in trading right now",
                    "result" : {
                        "npcText" : "Alright",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 23,
        "description" : "convo with spawn general store owner",
        "result" : {
            "npcText" : "Welcome to my shop%%Is there anything you're looking to buy or sell?",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Show me what you're selling",
                    "result" : {
                        "playerEventAction" : {
                            "type" : "StartShopping",
                            "shopId" : 6
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Yep I got some stuff I want to sell",
                    "result" : {
                        "playerEventAction" : {
                            "type" : "StartShopping",
                            "shopId" : 6
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Sorry I'm not interested in trading right now",
                    "result" : {
                        "npcText" : "Alright",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 24,
        "description" : "convo with old man in jail",
        "result" : {
            "npcText" : "I didn't do it! I'm innocent, I swear! Hey, how'd you get in here anyways?%%What? The doors been unlocked this whole time?",
            "endConversation" : true
        }
    },
    {
        "_id" : 25,
        "description" : "convo with gnome in jail",
        "result" : {
            "npcText" : "So what are you in for?",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Littering",
                    "result" : {
                        "npcText" : "Oh, yeah they like to keep this city nice and clean",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "I'm a gnome serial killer",
                    "result" : {
                        "npcText" : "What?%%Hey, stay away from me!",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Oh actually I'm not a criminal, I'm just visiting",
                    "result" : {
                        "npcText" : "Haha yeah me too%%Hey guards I'm not a criminal either, let me out!",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 26,
        "description" : "convo with lumberjack in jail",
        "result" : {
            "npcText" : "This is my first time in jail",
            "endConversation" : true
        }
    },
    {
        "_id" : 27,
        "description" : "convo with man in jail",
        "result" : {
            "npcText" : "I got caught pickpocketing...%%Will this go on my criminal record?",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Yep",
                    "result" : {
                        "npcText" : "Oh no...",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "No don't worry they're just gonna execute you",
                    "result" : {
                        "npcText" : "What? But I only stole a couple of coins!",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 28,
        "description" : "convo with old man about water obelisk",
        "result" : {
            "npcText" : "Earlier I saw someone enchanting a scroll on that tall blue rock right there!",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "What were they doing that for?",
                    "result" : {
                        "npcText" : "Actually I'm not sure, I didn't ask them",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Scroll?",
                    "result" : {
                        "npcText" : "Yeah! You can make scrolls by using a chisel on some logs",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 29,
        "description" : "conversation with Bar tender (the lazy warthog)",
        "result" : {
            "npcText" : "Welcome to The Lazy Warthog! Thirsty?",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Show me the beer",
                    "result" : {
                        "playerEventAction" : {
                            "type" : "StartShopping",
                            "shopId" : 7
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "No thanks",
                    "result" : {
                        "npcText" : "Alright, come back when you want something to drink",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 30,
        "description" : "convo with Indigo general store owner",
        "result" : {
            "npcText" : "Welcome to my shop%%Is there anything you're looking to buy or sell?",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Show me what you're selling",
                    "result" : {
                        "playerEventAction" : {
                            "type" : "StartShopping",
                            "shopId" : 8
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Yep I got some stuff I want to sell",
                    "result" : {
                        "playerEventAction" : {
                            "type" : "StartShopping",
                            "shopId" : 8
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Sorry I'm not interested in trading right now",
                    "result" : {
                        "npcText" : "Alright",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 31,
        "description" : "convo with fisherman at ictirine docks",
        "result" : {
            "npcText" : "I once caught a ten foot snapping turtle right here in this lake, but no one believes me%%You believe me right?",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Sure I believe you",
                    "result" : {
                        "npcText" : "Finally someone who believes me!",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Ten feet long or ten feet wide?",
                    "result" : {
                        "npcText" : "Ten feet wide",
                        "options" : [
                            {
                                "requirements" : null,
                                "text" : "Oh then no I don't believe you",
                                "result" : {
                                    "npcText" : "Its true, I swear!",
                                    "endConversation" : true
                                }
                            },
                            {
                                "requirements" : null,
                                "text" : "Thats nothing I once caught an eleven footer",
                                "result" : {
                                    "npcText" : "I don't believe you%%Hey now you know how I feel!",
                                    "endConversation" : true
                                }
                            }
                        ]
                    }
                },
                {
                    "requirements" : null,
                    "text" : "How big is that in meters?",
                    "result" : {
                        "npcText" : "Actually I don't know",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "I thought turtles only had four feet",
                    "result" : {
                        "npcText" : "...",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 32,
        "description" : "old man tells a dumb secret about not brushing his teeth",
        "result" : {
            "npcText" : "Hey I'll tell you a secret for 3 coins",
            "options" : [
                {
                    "requirements" : [
                        {
                            "desc" : "player needs to have 3 or more coins in their inventory to view this option",
                            "type" : "inventoryitem",
                            "itemid" : 6,
                            "isiou" : false,
                            "amount" : 3,
                            "operator" : ">="
                        }
                    ],
                    "text" : "Ok heres 3 coins",
                    "result" : {
                        "npcText" : "Great, thanks",
                        "playerEventAction" : {
                            "desc" : "player gives 3 coins",
                            "type" : "PlayerGiveItems",
                            "playerGiveItems" : [
                                { "id" : 6, "isIOU" : false, "amt" : 3 }
                            ]
                        },
                        "options" : [
                            {
                                "requirements" : null,
                                "text" : "Well whats the secret?",
                                "result" : {
                                    "npcText" : "Oh right%%This morning, I didn't brush my teeth",
                                    "options" : [
                                        {
                                            "requirements" : null,
                                            "text" : "Thats the secret?",
                                            "result" : {
                                                "npcText" : "Yep, don't tell anyone else",
                                                "endConversation" : true
                                            }
                                        },
                                        {
                                            "requirements" : null,
                                            "text" : "Thats not a secret I smelt you before I even saw you",
                                            "result" : {
                                                "npcText" : "Hehe well either way I'm 3 coins richer now!",
                                                "endConversation" : true
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Not worth it",
                    "result" : {
                        "npcText" : "Your loss",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "How about I just kill you if you don't tell me",
                    "result" : {
                        "npcText" : "You wouldn't really kill an old man would you?",
                        "options" : [
                            {
                                "requirements" : null,
                                "text" : "Let's find out",
                                "result" : {
                                    "endConversation" : true
                                }
                            },
                            {
                                "requirements" : null,
                                "text" : "Yeah you're right I'm not that cruel",
                                "result" : {
                                    "endConversation" : true
                                }
                            }
                        ]
                    }
                }
            ]
        }
    },
    {
        "_id" : 33,
        "description" : "convo with sewer guard",
        "result" : {
            "npcText" : "I am tasked with guarding the sewers",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Cool",
                    "result" : {
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Well that stinks",
                    "result" : {
                        "npcText" : "Yes, it isn't a very glamorous job but someone has to do it",
                        "options" : [
                            {
                                "requirements" : null,
                                "text" : "Thanks for your service",
                                "result" : {
                                    "endConversation" : true
                                }
                            },
                            {
                                "requirements" : null,
                                "text" : "Why does someone need to guard the sewers?",
                                "result" : {
                                    "npcText" : "You know, I actually never asked that question myself",
                                    "endConversation" : true
                                }
                            }
                        ]
                    }
                }
            ]
        }
    },
    {
        "_id" : 34,
        "description" : "sewer guard",
        "result" : {
            "npcText" : "Please ignore the stench, thats just from the sewers%%...%%Seriously it wasn't me",
            "endConversation" : true
        }
    },
    {
        "_id" : 35,
        "description" : "man by sheas shields",
        "result" : {
            "npcText" : "I saw the coins on the ground, and traveled through the sewers for ages to get here%%Turns out there were only 5 coins, what a joke!",
            "endConversation" : true
        }
    },
    {
        "_id" : 36,
        "description" : "Ronald",
        "result" : {
            "options" : [
                {
                    "requirements" : [
                        {
                            "desc" : "player needs to have not yet started Ronald's Trumpet quest",
                            "type" : "quest",
                            "questid" : 0,
                            "checkpoint" : 0,
                            "operator" : "==="
                        }
                    ],
                    "text" : "Hello there",
                    "result" : {
                        "npcText" : "Wahhh...%%Wahhh!%%WAHHH!!!",
                        "questAdvancement" : {
                            "desc" : "Ronald's Trumpet",
                            "questid" : 0,
                            "checkpoint" : 1
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "player needs to have not yet started Ronald's Trumpet quest",
                            "type" : "quest",
                            "questid" : 0,
                            "checkpoint" : 0,
                            "operator" : "==="
                        }
                    ],
                    "text" : "You look a bit sad, whats wrong?",
                    "result" : {
                        "npcText" : "Wahhh...%%Wahhh!%%WAHHH!!!",
                        "questAdvancement" : {
                            "desc" : "Ronald's Trumpet",
                            "questid" : 0,
                            "checkpoint" : 1
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Ronald's Trumpet",
                            "type" : "quest",
                            "questid" : 0,
                            "checkpoint" : 1,
                            "operator" : "==="
                        }
                    ],
                    "text" : "Why are you crying?",
                    "result" : {
                        "npcText" : "Wahhh...%%Wahhh!%%WAHHH!!!",
                        "options" : [
                            {
                                "text" : "So are you going to tell me or not?",
                                "result" : {
                                    "npcText" : "WAHHH!!!",
                                    "options" : [
                                        {
                                            "text" : "Well have fun crying",
                                            "result" : {
                                                "npcText" : "WAHHH!!!",
                                                "endConversation" : true
                                            }
                                        },
                                        {
                                            "text" : "Fine I guess I won't help you",
                                            "result": {
                                                "npcText" : "WAHHH!!!%%Wait!%%...sniff...%%You said you want to help me?",
                                                "options" : [
                                                    {
                                                        "text" : "Actually I changed my mind",
                                                        "result" : {
                                                            "npcText" : "WAHHH!!!",
                                                            "endConversation" : true
                                                        }
                                                    },
                                                    {
                                                        "text" : "Sure, but only if you give me one million coins",
                                                        "result" : {
                                                            "npcText" : "WAHHH!!!",
                                                            "endConversation" : true
                                                        }
                                                    },
                                                    {
                                                        "text" : "I guess",
                                                        "fullText" : "I guess, just tell me whats wrong",
                                                        "result" : {
                                                            "npcText" : "...sniff...%%I lost my trumpet",
                                                            "questAdvancement" : {
                                                                "desc" : "Ronald's Trumpet",
                                                                "questid" : 0,
                                                                "checkpoint" : 2
                                                            },
                                                            "options" : [
                                                                {
                                                                    "text" : "Oh thats good to hear, I hate trumpets",
                                                                    "result" : {
                                                                        "npcText" : "WAHHH!!!",
                                                                        "endConversation" : true
                                                                    }
                                                                },
                                                                {
                                                                    "text" : "Where'd you lose it at?",
                                                                    "result" : {
                                                                        "npcText" : "Actually its in my house right here%%...sniff...%%But I locked myself out!%%WAHHH!!!",
                                                                        "options" : [
                                                                            {
                                                                                "text" : "Well that was pretty stupid of you",
                                                                                "result" : {
                                                                                    "npcText" : "WAHHH!!!",
                                                                                    "endConversation" : true
                                                                                }
                                                                            },
                                                                            {
                                                                                "text" : "Is there any other way to get into your house?",
                                                                                "result" : {
                                                                                    "npcText" : "...sniff...%%Yeah...%%There is a secret entrance underground",
                                                                                    "questAdvancement" : {
                                                                                        "desc" : "Ronald's Trumpet",
                                                                                        "questid" : 0,
                                                                                        "checkpoint" : 3
                                                                                    },
                                                                                    "options" : [
                                                                                        {
                                                                                            "text" : "Alright",
                                                                                            "fullText" : "Alright, I'll go find the secret entrance, and get your trumpet back!",
                                                                                            "result" : {
                                                                                                "npcText" : "Yay, thanks!",
                                                                                                "endConversation" : true
                                                                                            }
                                                                                        },
                                                                                        {
                                                                                            "text" : "How exactly do I get underground?",
                                                                                            "result" : {
                                                                                                "npcText" : "Head west of here and you'll find the entrance of the Ictirine Sewers%%The secret entrance is somewhere down there",
                                                                                                "endConversation" : true
                                                                                            }
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            }
                                                                        ]
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                "text" : "I don't have time to deal with kids like you right now",
                                "result" : {
                                    "npcText" : "WAHHH!!!",
                                    "endConversation" : true
                                }
                            },
                            {
                                "text" : "If you don't shut up, I'll shut you up myself",
                                "result" : {
                                    "npcText" : "WAHHH!!!",
                                    "endConversation" : true
                                }
                            }
                        ]
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Ronald's Trumpet",
                            "type" : "quest",
                            "questid" : 0,
                            "checkpoint" : 1,
                            "operator" : "==="
                        }
                    ],
                    "text" : "Quit your crying kid",
                    "result" : {
                        "npcText" : "WAHHH!!!",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Ronald's Trumpet",
                            "type" : "quest",
                            "questid" : 0,
                            "checkpoint" : 2,
                            "operator" : "==="
                        }
                    ],
                    "text" : "I hope you never find your trumpet again",
                    "result" : {
                        "npcText" : "WAHHH!!!",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Ronald's Trumpet",
                            "type" : "quest",
                            "questid" : 0,
                            "checkpoint" : 2,
                            "operator" : "==="
                        }
                    ],
                    "text" : "So where'd you last see your trumpet?",
                    "result" : {
                        "npcText" : "Actually its in my house right here%%...sniff...%%But I locked myself out!%%WAHHH!!!",
                        "options" : [
                            {
                                "text" : "Well that was pretty stupid of you",
                                "result" : {
                                    "npcText" : "WAHHH!!!",
                                    "endConversation" : true
                                }
                            },
                            {
                                "text" : "Is there any other way to get into your house?",
                                "result" : {
                                    "npcText" : "...sniff...%%Yeah...%%There is a secret entrance underground",
                                    "questAdvancement" : {
                                        "desc" : "Ronald's Trumpet",
                                        "questid" : 0,
                                        "checkpoint" : 3
                                    },
                                    "options" : [
                                        {
                                            "text" : "Alright",
                                            "fullText" : "Alright, I'll go find the secret entrance, and get your trumpet back!",
                                            "result" : {
                                                "npcText" : "Yay, thanks!",
                                                "endConversation" : true
                                            }
                                        },
                                        {
                                            "text" : "How exactly do I get underground?",
                                            "result" : {
                                                "npcText" : "Head west of here and you'll find the entrance of the Ictirine Sewers%%The secret entrance is somewhere down there",
                                                "endConversation" : true
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Ronald's Trumpet",
                            "type" : "quest",
                            "questid" : 0,
                            "checkpoint" : 3,
                            "operator" : "==="
                        }
                    ],
                    "text" : "How exactly do I get underground?",
                    "result" : {
                        "npcText" : "Head west of here and you'll find the entrance of the Ictirine Sewers%%The secret entrance is somewhere down there",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Ronald's Trumpet",
                            "type" : "quest",
                            "questid" : 0,
                            "checkpoint" : 3,
                            "operator" : "==="
                        }
                    ],
                    "text" : "Why don't you go to this \"secret entrance\" yourself?",
                    "result" : {
                        "npcText" : "Because there's scary monsters down there!",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Ronald's Trumpet",
                            "type" : "quest",
                            "questid" : 0,
                            "checkpoint" : 4,
                            "operator" : "==="
                        }
                    ],
                    "text" : "I found the secret entrance",
                    "fullText" : "I found the secret entrance, but apparently I need a password to get in",
                    "result" : {
                        "npcText" : "Oh, yep you'll need the password",
                        "options" : [
                            {
                                "text" : "Why didn't you tell me I needed a password?",
                                "result" : {
                                    "npcText" : "You didn't ask",
                                    "options" : [
                                        {
                                            "text" : "You sure aren't making this easy",
                                            "result" : {
                                                "npcText" : "Well anyways, the password is \"password\"",
                                                "questAdvancement" : {
                                                    "desc" : "Ronald's Trumpet",
                                                    "questid" : 0,
                                                    "checkpoint" : 5
                                                },
                                                "options" : [
                                                    {
                                                        "text" : "Seriously?",
                                                        "result" : {
                                                            "npcText" : "Yep, I thought of it myself",
                                                            "endConversation" : true
                                                        }
                                                    },
                                                    {
                                                        "text" : "Thats the dumbest thing I've ever heard",
                                                        "result" : {
                                                            "endConversation" : true
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            "text" : "So whats the password",
                                            "result" : {
                                                "npcText" : "Its easy%%The password is \"password\"",
                                                "questAdvancement" : {
                                                    "desc" : "Ronald's Trumpet",
                                                    "questid" : 0,
                                                    "checkpoint" : 5
                                                },
                                                "options" : [
                                                    {
                                                        "text" : "Seriously?",
                                                        "result" : {
                                                            "npcText" : "Yep, I thought of it myself",
                                                            "endConversation" : true
                                                        }
                                                    },
                                                    {
                                                        "text" : "Thats the dumbest thing I've ever heard",
                                                        "result" : {
                                                            "endConversation" : true
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                "text" : "So whats the password",
                                "result" : {
                                    "npcText" : "Its easy%%The password is \"password\"",
                                    "questAdvancement" : {
                                        "desc" : "Ronald's Trumpet",
                                        "questid" : 0,
                                        "checkpoint" : 5
                                    },
                                    "options" : [
                                        {
                                            "text" : "Seriously?",
                                            "result" : {
                                                "npcText" : "Yep, I thought of it myself",
                                                "endConversation" : true
                                            }
                                        },
                                        {
                                            "text" : "Thats the dumbest thing I've ever heard",
                                            "result" : {
                                                "endConversation" : true
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Ronald's Trumpet",
                            "type" : "quest",
                            "questid" : 0,
                            "checkpoint" : 5,
                            "operator" : "==="
                        }
                    ],
                    "text" : "What was the password again?",
                    "result" : {
                        "npcText" : "Password",
                        "options" : [
                            {
                                "text" : "Oh right",
                                "fullText" : "Oh right how'd I forget...",
                                "result" : {
                                    "endConversation" : true
                                }
                            },
                            {
                                "text" : "Thats the dumbest thing I've ever heard",
                                "result" : {
                                    "endConversation" : true
                                }
                            }
                        ]
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Ronald's Trumpet",
                            "type" : "quest",
                            "questid" : 0,
                            "checkpoint" : 5,
                            "operator" : "==="
                        }
                    ],
                    "text" : "I give up",
                    "fullText" : "You know what, I give up. You can go get your trumpet yourself",
                    "result" : {
                        "npcText" : "No, please! Please help me get my trumpet!",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Ronald's Trumpet",
                            "type" : "quest",
                            "questid" : 0,
                            "checkpoint" : 6,
                            "operator" : "==="
                        },
                        {
                            "desc" : "Needs to not have a Trumpet in inventory",
                            "type" : "inventoryitem",
                            "itemid" : 230,
                            "isiou" : false,
                            "amount" : 0,
                            "operator" : "<="
                        }
                    ],
                    "text" : "Hello",
                    "result" : {
                        "npcText" : "Hey wheres my trumpet?%%Hurry and find my trumpet!",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Ronald's Trumpet",
                            "type" : "quest",
                            "questid" : 0,
                            "checkpoint" : 6,
                            "operator" : "==="
                        },
                        {
                            "desc" : "Needs to not have a Trumpet in inventory",
                            "type" : "inventoryitem",
                            "itemid" : 230,
                            "isiou" : false,
                            "amount" : 0,
                            "operator" : "<="
                        }
                    ],
                    "text" : "Where is your trumpet again?",
                    "result" : {
                        "npcText" : "Its in a chest in my house right here%%Please hurry up and get it!",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Ronald's Trumpet",
                            "type" : "quest",
                            "questid" : 0,
                            "checkpoint" : 6,
                            "operator" : "==="
                        },
                        {
                            "desc" : "Needs to not have a Trumpet in inventory",
                            "type" : "inventoryitem",
                            "itemid" : 230,
                            "isiou" : false,
                            "amount" : 1,
                            "operator" : ">="
                        }
                    ],
                    "text" : "I finally found your trumpet!",
                    "fullText" : "I did it, I finally found your trumpet!",
                    "result" : {
                        "npcText" : "Oh yay, thanks!",
                        "questAdvancement" : {
                            "desc" : "Ronald's Trumpet",
                            "questid" : 0,
                            "checkpoint" : 7
                        },
                        "playerEventAction" : {
                            "desc" : "player gives Ronald his Trumpet",
                            "type" : "PlayerGiveItems",
                            "playerGiveItems" : [
                                { "id" : 230, "isIOU" : false, "amt" : 1 }
                            ]
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Ronald's Trumpet",
                            "type" : "quest",
                            "questid" : 0,
                            "checkpoint" : 6,
                            "operator" : "==="
                        },
                        {
                            "desc" : "Needs to not have a Trumpet in inventory",
                            "type" : "inventoryitem",
                            "itemid" : 230,
                            "isiou" : false,
                            "amount" : 1,
                            "operator" : ">="
                        }
                    ],
                    "text" : "Heres your stupid trumpet",
                    "result" : {
                        "npcText" : "Oh yay, thanks!",
                        "questAdvancement" : {
                            "desc" : "Ronald's Trumpet",
                            "questid" : 0,
                            "checkpoint" : 7
                        },
                        "playerEventAction" : {
                            "desc" : "player gives Ronald his Trumpet",
                            "type" : "PlayerGiveItems",
                            "playerGiveItems" : [
                                { "id" : 230, "isIOU" : false, "amt" : 1 }
                            ]
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Ronald's Trumpet",
                            "type" : "quest",
                            "questid" : 0,
                            "checkpoint" : 7,
                            "operator" : "==="
                        }
                    ],
                    "text" : "How goes the trumpet playing",
                    "result" : {
                        "npcText" : "Actually I'm bored of playing the trumpet now",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 37,
        "description" : "Ronald's doorman",
        "result" : {
            "npcText" : "Hello there",
            "options" : [
                {
                    "text" : "Who are you?",
                    "result" : {
                        "npcText" : "I'm the doorman",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Ronald's Trumpet",
                            "type" : "quest",
                            "questid" : 0,
                            "checkpoint" : 3,
                            "operator" : "==="
                        }
                    ],
                    "text" : "Open the door",
                    "result" : {
                        "npcText" : "Whats the password",
                        "questAdvancement" : {
                            "desc" : "Ronald's Trumpet",
                            "questid" : 0,
                            "checkpoint" : 4
                        },
                        "options" : [
                            {
                                "text" : "Banana",
                                "result" : {
                                    "npcText" : "Incorrect",
                                    "endConversation" : true
                                }
                            },
                            {
                                "text" : "Trumpet",
                                "result" : {
                                    "npcText" : "Incorrect",
                                    "endConversation" : true
                                }
                            },
                            {
                                "text" : "Qwertyuiop",
                                "result" : {
                                    "npcText" : "Incorrect",
                                    "endConversation" : true
                                }
                            },
                            {
                                "text" : "There's a password?",
                                "result" : {
                                    "npcText" : "Why of course there is%%So please give the password and I'll be able to let you in",
                                    "options" : [
                                        {
                                            "text" : "Banana",
                                            "result" : {
                                                "npcText" : "Incorrect",
                                                "endConversation" : true
                                            }
                                        },
                                        {
                                            "text" : "Trumpet",
                                            "result" : {
                                                "npcText" : "Incorrect",
                                                "endConversation" : true
                                            }
                                        },
                                        {
                                            "text" : "Qwertyuiop",
                                            "result" : {
                                                "npcText" : "Incorrect",
                                                "endConversation" : true
                                            }
                                        },
                                        {
                                            "text" : "Ronald sent me",
                                            "fullText" : "Look Ronald sent me on an urgent mission, I need to get in there",
                                            "result" : {
                                                "npcText" : "Oh I see%%But I still need the password",
                                                "endConversation" : true
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Ronald's Trumpet",
                            "type" : "quest",
                            "questid" : 0,
                            "checkpoint" : 4,
                            "operator" : ">="
                        },
                        {
                            "desc" : "Ronald's Trumpet",
                            "type" : "quest",
                            "questid" : 0,
                            "checkpoint" : 5,
                            "operator" : "<="
                        }
                    ],
                    "text" : "Open the door",
                    "result" : {
                        "npcText" : "Whats the password",
                        "options" : [
                            {
                                "text" : "Banana",
                                "result" : {
                                    "npcText" : "Incorrect",
                                    "endConversation" : true
                                }
                            },
                            {
                                "text" : "Trumpet",
                                "result" : {
                                    "npcText" : "Incorrect",
                                    "endConversation" : true
                                }
                            },
                            {
                                "text" : "Qwertyuiop",
                                "result" : {
                                    "npcText" : "Incorrect",
                                    "endConversation" : true
                                }
                            },
                            {
                                "requirements" : [
                                    {
                                        "desc" : "Ronald's Trumpet",
                                        "type" : "quest",
                                        "questid" : 0,
                                        "checkpoint" : 4,
                                        "operator" : "==="
                                    }
                                ],
                                "text" : "Ronald sent me",
                                "fullText" : "Look Ronald sent me on an urgent mission, I need to get in there",
                                "result" : {
                                    "npcText" : "Oh I see%%But I still need the password",
                                    "endConversation" : true
                                }
                            },
                            {
                                "requirements" : [
                                    {
                                        "desc" : "Ronald's Trumpet",
                                        "type" : "quest",
                                        "questid" : 0,
                                        "checkpoint" : 5,
                                        "operator" : "==="
                                    }
                                ],
                                "text" : "Password",
                                "result" : {
                                    "npcText" : "Yes, I need the password",
                                    "options" : [
                                        {
                                            "text" : "Lemon",
                                            "result" : {
                                                "npcText" : "Incorrect",
                                                "endConversation" : true
                                            }
                                        },
                                        {
                                            "text" : "Ronald",
                                            "result" : {
                                                "npcText" : "Incorrect",
                                                "endConversation" : true
                                            }
                                        },
                                        {
                                            "text" : "12345678",
                                            "result" : {
                                                "npcText" : "Incorrect",
                                                "endConversation" : true
                                            }
                                        },
                                        {
                                            "text" : "Password",
                                            "result" : {
                                                "npcText" : "Yes, like I said, please tell me the password",
                                                "options" : [
                                                    {
                                                        "text" : "Pumpkin",
                                                        "result" : {
                                                            "npcText" : "Incorrect",
                                                            "endConversation" : true
                                                        }
                                                    },
                                                    {
                                                        "text" : "Open Sesame",
                                                        "result" : {
                                                            "npcText" : "Incorrect",
                                                            "endConversation" : true
                                                        }
                                                    },
                                                    {
                                                        "text" : "1234567890",
                                                        "result" : {
                                                            "npcText" : "Incorrect",
                                                            "endConversation" : true
                                                        }
                                                    },
                                                    {
                                                        "text" : "Password!",
                                                        "result" : {
                                                            "npcText" : "For the third time yes, please tell me the password%%And there's no need to yell",
                                                            "options" : [
                                                                {
                                                                    "text" : "Oh I guess I still don't know the password",
                                                                    "result" : {
                                                                        "endConversation" : true
                                                                    }
                                                                },
                                                                {
                                                                    "text" : "I'm telling you the password is password!",
                                                                    "result" : {
                                                                        "npcText" : "Oh%%That's correct%%You may now enter as freely as you'd like",
                                                                        "questAdvancement" : {
                                                                            "desc" : "Ronald's Trumpet",
                                                                            "questid" : 0,
                                                                            "checkpoint" : 6
                                                                        },
                                                                        "endConversation" : true
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Ronald's Trumpet",
                            "type" : "quest",
                            "questid" : 0,
                            "checkpoint" : 6,
                            "operator" : "==="
                        }
                    ],
                    "text" : "Can I go in there?",
                    "result" : {
                        "npcText" : "Sure, go on in",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Ronald's Trumpet",
                            "type" : "quest",
                            "questid" : 0,
                            "checkpoint" : 7,
                            "operator" : "==="
                        }
                    ],
                    "text" : "Can I go in there?",
                    "result" : {
                        "npcText" : "Yes, I recognize you from earlier%%Go on in",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 38,
        "description" : "conversation with knight near giants",
        "result" : {
            "npcText" : "Careful of those giants my friend, their behavior can be unpredictable",
            "endConversation" : true
        }
    },
    {
        "_id" : 39,
        "description" : "conversation with knight near giants by ictirine",
        "result" : {
            "npcText" : "Giants are dangerous beings, you should be careful around them",
            "endConversation" : true
        }
    },
    {
        "_id" : 40,
        "description" : "convo with bethany",
        "result" : {
            "npcText" : "Interested in battleaxes?",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Oh yeah",
                    "result" : {
                        "playerEventAction" : {
                            "type" : "StartShopping",
                            "shopId" : 10
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "No thanks sound too dangerous",
                    "result" : {
                        "npcText" : "Ha, well I suppose battleaxes aren't for the weak",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 41,
        "description" : "convo with shea",
        "result" : {
            "npcText" : "Want to buy or sell some shields?",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Sure",
                    "result" : {
                        "playerEventAction" : {
                            "type" : "StartShopping",
                            "shopId" : 9
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "No",
                    "result" : {
                        "npcText" : "Alright then",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 42,
        "description" : "convo with pradmore",
        "result" : {
            "npcText" : "Hello my friend%%Can I interest you in some scrolls?",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Yes",
                    "result" : {
                        "playerEventAction" : {
                            "type" : "StartShopping",
                            "shopId" : 11
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "No",
                    "result" : {
                        "npcText" : "Alright then",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Scrolls?",
                    "result" : {
                        "npcText" : "Yes, magical scrolls used for casting spells",
                        "options" : [
                            {
                                "requirements" : null,
                                "text" : "Oh, sure I'm interested",
                                "result" : {
                                    "playerEventAction" : {
                                        "type" : "StartShopping",
                                        "shopId" : 11
                                    },
                                    "endConversation" : true
                                }
                            },
                            {
                                "requirements" : null,
                                "text" : "No thanks I don't believe in magic",
                                "result" : {
                                    "npcText" : "Oh, well I'm sorry to hear that",
                                    "endConversation" : true
                                }
                            }
                        ]
                    }
                }
            ]
        }
    },
    {
        "_id" : 43,
        "description" : "convo with arnold",
        "result" : {
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Want to trade?",
                    "result" : {
                        "npcText" : "Why I'd love to",
                        "playerEventAction" : {
                            "type" : "StartShopping",
                            "shopId" : 12
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Can I use your anvil",
                    "result" : {
                        "npcText" : "Help yourself",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "What happened to your shirt",
                    "result" : {
                        "npcText" : "I don't need a shirt",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 44,
        "description" : "convo with generic man",
        "result" : {
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Hello",
                    "result" : {
                        "npcText" : "Hi there",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Weather sure is nice today",
                    "result" : {
                        "npcText" : "Yep its not too bad",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Can you give me some money",
                    "result" : {
                        "npcText" : "No",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 45,
        "description" : "convo with joe",
        "result" : {
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Hello",
                    "result" : {
                        "npcText" : "Howdy partner, any seafood you'd like to buy or sell?",
                        "options" : [
                            {
                                "requirements" : null,
                                "text" : "Absolutely",
                                "result" : {
                                    "playerEventAction" : {
                                        "type" : "StartShopping",
                                        "shopId" : 13
                                    },
                                    "endConversation" : true
                                }
                            },
                            {
                                "requirements" : null,
                                "text" : "No",
                                "result" : {
                                    "npcText" : "Alright, well come back any time you'd like to trade!",
                                    "endConversation" : true
                                }
                            }
                        ]
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Let's trade",
                    "result" : {
                        "npcText" : "Let's!",
                        "playerEventAction" : {
                            "type" : "StartShopping",
                            "shopId" : 13
                        },
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 46,
        "description" : "convo with peggy",
        "result" : {
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Anything for sale?",
                    "result" : {
                        "npcText" : "Yes my specialty products are potions and magic supplies",
                        "options" : [
                            {
                                "requirements" : null,
                                "text" : "Let's see them",
                                "result" : {
                                    "playerEventAction" : {
                                        "type" : "StartShopping",
                                        "shopId" : 14
                                    },
                                    "endConversation" : true
                                }
                            },
                            {
                                "requirements" : null,
                                "text" : "Not interested",
                                "result" : {
                                    "npcText" : "Then go away",
                                    "endConversation" : true
                                }
                            }
                        ]
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "player potionmaking skill less than 50",
                            "type" : "skill",
                            "skill" : "potionmaking",
                            "level" : 50,
                            "operator" : "<"
                        }
                    ],
                    "text" : "Whats in the room back there?",
                    "result" : {
                        "npcText" : "None of your business",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "player potionmaking skill >= 50",
                            "type" : "skill",
                            "skill" : "potionmaking",
                            "level" : 50,
                            "operator" : ">="
                        }
                    ],
                    "text" : "Whats in the room back there?",
                    "result" : {
                        "npcText" : "Go see for yourself",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 47,
        "description" : "conversation with lumberjack near giant squirrel",
        "result" : {
            "npcText" : "I think I accidentally chopped down that big squirrel's home...",
            "endConversation" : true
        }
    },
    {
        "_id" : 48,
        "description" : "conversation with ned",
        "result" : {
            "npcText" : "Howdy there%%I'm Ned, and this is my squirrel ranch. I raise squirrels for their pelts%%Do you have any squirrel pelts? I'll buy five of them for 10 coins each",
            "options" : [
                {
                    "requirements" : [
                        {
                            "desc" : "player needs to have 5 or more squirrel pelts in their inventory to view this option",
                            "type" : "inventoryitem",
                            "itemid" : 236,
                            "isiou" : false,
                            "amount" : 5,
                            "operator" : ">="
                        }
                    ],
                    "text" : "Sure, I'll sell some squirrel pelts",
                    "result" : {
                        "npcText" : "Great, here's your money!",
                        "playerEventAction" : {
                            "desc" : "player gives 5 squirrel pelts and receives 10 coins",
                            "type" : "PlayerExchangeItems",
                            "playerGiveItems" : [
                                { "id" : 236, "isIOU" : false, "amt" : 5 }
                            ],
                            "playerReceiveItems" : [
                                { "id" : 6, "isIOU" : false, "amt" : 50 }
                            ]
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "player needs to have 5 or more squirrel pelts in their inventory to view this option",
                            "type" : "inventoryitem",
                            "itemid" : 236,
                            "isiou" : false,
                            "amount" : 5,
                            "operator" : ">="
                        }
                    ],
                    "text" : "Sorry these pelts are mine",
                    "result" : {
                        "npcText" : "Well, if you change your mind please come back",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "player needs to have less than 5 squirrel pelts in their inventory to view this option",
                            "type" : "inventoryitem",
                            "itemid" : 236,
                            "isiou" : false,
                            "amount" : 5,
                            "operator" : "<"
                        }
                    ],
                    "text" : "Sorry I don't have that many squirrel pelts",
                    "result" : {
                        "npcText" : "Please come back when you do!",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "player needs to no squirrel pelts in their inventory to view this option",
                            "type" : "inventoryitem",
                            "itemid" : 236,
                            "isiou" : false,
                            "amount" : 0,
                            "operator" : "<="
                        }
                    ],
                    "text" : "How do I get squirrel pelts?",
                    "result" : {
                        "npcText" : "From squirrels of course",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 49,
        "description" : "convo with farmer guarding cows",
        "result" : {
            "npcText" : "Hello there%%I'm standing guard to make sure the cows don't get out",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Cool",
                    "result" : {
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Why don't you just put in a gate",
                    "result" : {
                        "npcText" : "Oh%%Guess I never thought of that",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 50,
        "description" : "convo leprechaun-searching gnome",
        "result" : {
            "options" : [
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 4,
                            "operator" : "<="
                        }
                    ],
                    "text" : "Hey whatcha up to?",
                    "result" : {
                        "npcText" : "We lookin' for a leprechaun, hes up there in that tree!%%I want the gold, gimme the gold!",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 5,
                            "operator" : ">="
                        },
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 7,
                            "operator" : "<="
                        }
                    ],
                    "text" : "Hey whatcha up to?",
                    "result" : {
                        "npcText" : "We did it! We done caught the leprechaun!",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 10,
                            "operator" : ">="
                        }
                    ],
                    "text" : "So you caught the leprechaun huh?",
                    "result" : {
                        "npcText" : "Yup, we got him locked away!",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 51,
        "description" : "convo leprechaun-searching gnome",
        "result" : {
            "options" : [
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 4,
                            "operator" : "<="
                        }
                    ],
                    "text" : "Hey whats up",
                    "result" : {
                        "npcText" : "Careful! Theres a magical leprechaun up in the tree!",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 5,
                            "operator" : ">="
                        },
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 7,
                            "operator" : "<="
                        }
                    ],
                    "text" : "Hey whats up",
                    "result" : {
                        "npcText" : "I'll tell you whats NOT up%%The leprechaun! He ain't up in the tree anymore, we finally caught him!",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 10,
                            "operator" : ">="
                        }
                    ],
                    "text" : "So wheres that leprechaun at now?",
                    "result" : {
                        "npcText" : "Locked up in jail where he belongs!",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 52,
        "description" : "convo leprechaun-searching gnome",
        "result" : {
            "options" : [
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 4,
                            "operator" : "<="
                        }
                    ],
                    "text" : "What are you guys doing here",
                    "result" : {
                        "npcText" : "Trying to get the leprechaun up in that tree!",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 5,
                            "operator" : ">="
                        },
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 7,
                            "operator" : "<="
                        }
                    ],
                    "text" : "What are you guys doing here",
                    "result" : {
                        "npcText" : "We're catching leprechauns, and we just caught one!",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 10,
                            "operator" : ">="
                        }
                    ],
                    "text" : "So wheres that leprechaun you caught?",
                    "result" : {
                        "npcText" : "We got him locked up in jail!",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 53,
        "description" : "convo leprechaun-searching gnome",
        "result" : {
            "options" : [
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 0,
                            "operator" : "==="
                        }
                    ],
                    "text" : "Whats everyone doing here",
                    "result" : {
                        "npcText" : "Searching for a leprechaun!",
                        "options" : [
                            {
                                "requirements" : null,
                                "text" : "A leprechaun huh?",
                                "result" : {
                                    "npcText" : "Yup!%%And we're after his gold!",
                                    "options" : [
                                        {
                                            "requirements" : null,
                                            "text" : "How do you know he has any gold?",
                                            "result" : {
                                                "npcText" : "All leprechauns have gold, don't you know anything?",
                                                "options" : [
                                                    {
                                                        "requirements" : null,
                                                        "text" : "Well good luck finding his gold then",
                                                        "result" : {
                                                            "endConversation" : true
                                                        }
                                                    },
                                                    {
                                                        "requirements" : [
                                                            {
                                                                "desc" : "player needs to have space in their inventory",
                                                                "type" : "availableinventoryspace",
                                                                "itemid" : 231,
                                                                "isiou" : false,
                                                                "availableslotsneeded" : 1
                                                            }
                                                        ],
                                                        "text" : "I see, maybe I can help you find him",
                                                        "result" : {
                                                            "npcText" : "Alright, we could use the extra hands%%Here take this sketch I drew of the leprechaun",
                                                            "playerEventAction" : {
                                                                "desc" : "Player receives leprechaun sketch",
                                                                "type" : "PlayerReceiveItems",
                                                                "playerReceiveItems" : [
                                                                    { "id" : 231, "isIOU" : false, "amt" : 1 }
                                                                ]
                                                            },
                                                            "questAdvancement" : {
                                                                "desc" : "Leprechaun Flute",
                                                                "questid" : 1,
                                                                "checkpoint" : 1
                                                            },
                                                            "endConversation" : true
                                                        }
                                                    },
                                                    {
                                                        "requirements" : [
                                                            {
                                                                "desc" : "player needs to have no space in their inventory",
                                                                "type" : "availableinventoryspace",
                                                                "itemid" : 231,
                                                                "isiou" : false,
                                                                "availableslotsneeded" : 0
                                                            }
                                                        ],
                                                        "text" : "I see, maybe I can help you find him",
                                                        "result" : {
                                                            "npcText" : "Alright, we could use the extra hands%%Here take this sketch I drew of the leprechaun%%Oh, looks like you have no space for this right now",
                                                            "endConversation" : true
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            "requirements" : [
                                                {
                                                    "desc" : "player needs to have space in their inventory",
                                                    "type" : "availableinventoryspace",
                                                    "itemid" : 231,
                                                    "isiou" : false,
                                                    "availableslotsneeded" : 1
                                                }
                                            ],
                                            "text" : "Can I help you find him?",
                                            "result" : {
                                                "npcText" : "Sure, we could use some extra help%%Here take this sketch I drew of the leprechaun",
                                                "playerEventAction" : {
                                                    "desc" : "Player receives leprechaun sketch",
                                                    "type" : "PlayerReceiveItems",
                                                    "playerReceiveItems" : [
                                                        { "id" : 231, "isIOU" : false, "amt" : 1 }
                                                    ]
                                                },
                                                "questAdvancement" : {
                                                    "desc" : "Leprechaun Flute",
                                                    "questid" : 1,
                                                    "checkpoint" : 1
                                                },
                                                "endConversation" : true
                                            }
                                        },
                                        {
                                            "requirements" : [
                                                {
                                                    "desc" : "player needs to have no space in their inventory",
                                                    "type" : "availableinventoryspace",
                                                    "itemid" : 231,
                                                    "isiou" : false,
                                                    "availableslotsneeded" : 0
                                                }
                                            ],
                                            "text" : "Can I help you find him?",
                                            "result" : {
                                                "npcText" : "Sure, we could use some extra help%%Here take this sketch I drew of the leprechaun%%Oh, looks like you have no space for this right now",
                                                "endConversation" : true
                                            }
                                        },
                                        {
                                            "requirements" : null,
                                            "text" : "Well good luck with your search",
                                            "result" : {
                                                "endConversation" : true
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                "requirements" : null,
                                "text" : "Maybe its just someone dressed up as a leprechaun",
                                "result" : {
                                    "npcText" : "Yeah, its a leprechaun dressed up as a leprechaun dummy!",
                                    "endConversation" : true
                                }
                            },
                            {
                                "requirements" : null,
                                "text" : "Leprechauns don't exist",
                                "result" : {
                                    "npcText" : "Of course they do!%%All you gotta do is look up there in that tree!%%Who else seen the leprechaun say YEAH!",
                                    "endConversation" : true
                                }
                            }
                        ]
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 1,
                            "operator" : ">="
                        },
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 5,
                            "operator" : "<="
                        }
                    ],
                    "text" : "Have you caught the leprechaun yet?",
                    "result" : {
                        "npcText" : "Not yet, but my buddies think they saw him up there in that tree!%%Maybe you can go check it out for us",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 1,
                            "operator" : "==="
                        },
                        {
                            "desc" : "player needs to not own a Leprechaun Sketch in bank, inv, or loadout",
                            "type" : "playerownsitem",
                            "itemid" : 231,
                            "amount" : 0,
                            "isiou" : false,
                            "operator" : "==="
                        },
                        {
                            "desc" : "player needs to have space in their inventory",
                            "type" : "availableinventoryspace",
                            "itemid" : 231,
                            "isiou" : false,
                            "availableslotsneeded" : 1
                        }
                    ],
                    "text" : "I lost that leprechaun sketch, can you give me another?",
                    "result" : {
                        "npcText" : "Yeah heres another",
                        "playerEventAction" : {
                            "desc" : "Player receives leprechaun sketch",
                            "type" : "PlayerReceiveItems",
                            "playerReceiveItems" : [
                                { "id" : 231, "isIOU" : false, "amt" : 1 }
                            ]
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 1,
                            "operator" : "==="
                        },
                        {
                            "desc" : "player needs to not own a Leprechaun Sketch in bank, inv, or loadout",
                            "type" : "playerownsitem",
                            "itemid" : 231,
                            "amount" : 0,
                            "isiou" : false,
                            "operator" : "==="
                        },
                        {
                            "desc" : "player needs to have no space in their inventory",
                            "type" : "availableinventoryspace",
                            "itemid" : 231,
                            "isiou" : false,
                            "availableslotsneeded" : 0
                        }
                    ],
                    "text" : "I lost that leprechaun sketch, can you give me another?",
                    "result" : {
                        "npcText" : "Yeah heres another%%Oh it seems your inventory is full right now",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 54,
        "description" : "convo with leprechaun searching gnome (tree)",
        "result" : {
            "npcText" : "We finally caught the leprechaun!",
            "options" : [
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 5,
                            "operator" : "==="
                        }
                    ],
                    "text" : "Congratulations!",
                    "result" : {
                        "questAdvancement" : {
                            "desc" : "Leprechaun Flute",
                            "questid" : 1,
                            "checkpoint" : 6
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 5,
                            "operator" : "==="
                        }
                    ],
                    "text" : "Where did you take him?",
                    "result" : {
                        "npcText" : "Now don't you worry about that",
                        "questAdvancement" : {
                            "desc" : "Leprechaun Flute",
                            "questid" : 1,
                            "checkpoint" : 6
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 6,
                            "operator" : ">="
                        }
                    ],
                    "text" : "Congratulations!",
                    "result" : {
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 6,
                            "operator" : ">="
                        }
                    ],
                    "text" : "Where did you take him?",
                    "result" : {
                        "npcText" : "Now don't you worry about that",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 55,
        "description" : "conversation with O'Shammy (tree)",
        "result" : {
            "options" : [
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 1,
                            "operator" : "==="
                        }
                    ],
                    "text" : "What are you doing up here",
                    "fullText" : "Hey what are you doing up here?",
                    "result" : {
                        "npcText" : "Why I's just be enjoying the view up here",
                        "options" : [
                            {
                                "requirements" : null,
                                "text" : "Oh, yep its a nice view from up here",
                                "result" : {
                                    "endConversation" : true
                                }
                            },
                            {
                                "requirements" : null,
                                "text" : "I'm looking for a leprechaun",
                                "result" : {
                                    "npcText" : "Oh well good luck",
                                    "options" : [
                                        {
                                            "requirements" : null,
                                            "text" : "Thanks",
                                            "result" : {
                                                "endConversation" : true
                                            }
                                        },
                                        {
                                            "requirements" : null,
                                            "text" : "You kind of look like a leprechaun",
                                            "result" : {
                                                "npcText" : "Why, you's be mistaken my friend%%Now go 'n run along now, ya hear?",
                                                "endConversation" : true
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 1,
                            "operator" : "==="
                        },
                        {
                            "desc" : "player needs to have no leprechaun sketch in inventory",
                            "type" : "inventoryitem",
                            "itemid" : 231,
                            "isiou" : false,
                            "amount" : 0,
                            "operator" : "==="
                        }
                    ],
                    "text" : "Are you a leprechaun?",
                    "result" : {
                        "npcText" : "Of course I's not a leprechaun, why you's be askin' that?",
                        "options" : [
                            {
                                "requirements" : null,
                                "text" : "Short, orange hair, green clothes...",
                                "result" : {
                                    "npcText" : "Oh so you's be stereotypin' me, eh?%%I's not no leprechaun, now you's leave me be!",
                                    "endConversation" : true
                                }
                            },
                            {
                                "requirements" : null,
                                "text" : "You're right, I have no reason to ask that",
                                "result" : {
                                    "endConversation" : true
                                }
                            }
                        ]
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 1,
                            "operator" : "==="
                        },
                        {
                            "desc" : "player needs to have a leprechaun sketch in inventory",
                            "type" : "inventoryitem",
                            "itemid" : 231,
                            "isiou" : false,
                            "amount" : 1,
                            "operator" : ">="
                        }
                    ],
                    "text" : "Are you a leprechaun?",
                    "result" : {
                        "npcText" : "Of course I's not a leprechaun, why you's be sayin' that?",
                        "options" : [
                            {
                                "requirements" : null,
                                "text" : "Short, orange hair, green clothes...",
                                "result" : {
                                    "npcText" : "Oh so you's be stereotypin' me, eh?%%I's not no leprechaun, now you's leave me be!",
                                    "endConversation" : true
                                }
                            },
                            {
                                "requirements" : null,
                                "text" : "Some gnomes gave me this sketch, looks just like you",
                                "result" : {
                                    "npcText" : "What sketch?%%Lemme take a look at that...%%...%%Why this be lookin' nothin' like me!",
                                    "options" : [
                                        {
                                            "requirements" : null,
                                            "text" : "Looks just like you",
                                            "fullText" : "Looks just like you, the similarity is uncanny",
                                            "result" : {
                                                "npcText" : "So some gnomes gave this to ya?%%Are you one of them?",
                                                "options" : [
                                                    {
                                                        "requirements" : null,
                                                        "text" : "Do I look like a gnome to you?",
                                                        "result" : {
                                                            "npcText" : "Well are ye workin' together with them gnomes?",
                                                            "options" : [
                                                                {
                                                                    "requirements" : null,
                                                                    "text" : "Nope, they seem a bit fishy",
                                                                    "result" : {
                                                                        "npcText" : "In that case, ye gotta help me!%%Them gnomes be after me gold!%%If I come down from this tree, they'll catch me for sure!%%If only I had me lucky Leprechaun Flute...",
                                                                        "options" : [
                                                                            {
                                                                                "requirements" : null,
                                                                                "text" : "Lucky Leprechaun Flute?",
                                                                                "result" : {
                                                                                    "npcText" : "Yeah, it'll let me teleport far away from here!%%Say, you wouldn't mind goin' and gettin' it for me, would ya?",
                                                                                    "options" : [
                                                                                        {
                                                                                            "requirements" : null,
                                                                                            "text" : "Sure I'll go get it",
                                                                                            "result" : {
                                                                                                "npcText" : "Great!%%There be an old lookin hut to the East, a buddy o' mine who lives there'll give it to ya!%%Just tell him O'Shammy sent ya!",
                                                                                                "questAdvancement" : {
                                                                                                    "desc" : "Leprechaun Flute",
                                                                                                    "questid" : 1,
                                                                                                    "checkpoint" : 2
                                                                                                },
                                                                                                "endConversation" : true
                                                                                            }
                                                                                        },
                                                                                        {
                                                                                            "requirements" : null,
                                                                                            "text" : "Sorry you're on your own pal",
                                                                                            "result" : {
                                                                                                "endConversation": true
                                                                                            }
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            },
                                                                            {
                                                                                "requirements" : null,
                                                                                "text" : "Well good luck getting down from here",
                                                                                "result" : {
                                                                                    "endConversation" : true
                                                                                }
                                                                            }
                                                                        ]
                                                                    }
                                                                },
                                                                {
                                                                    "requirements" : null,
                                                                    "text" : "Yeah we're working together to find the leprechaun",
                                                                    "result" : {
                                                                        "npcText" : "Well good luck findin' him",
                                                                        "endConversation" : true
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        "requirements" : null,
                                                        "text" : "Yeah I'm just a tall gnome",
                                                        "result" : {
                                                            "npcText" : "Oh%%Well like I told ye earlier, I's not a leprechaun",
                                                            "endConversation" : true
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            "requirements" : null,
                                            "text" : "You're right this sketch is terrible",
                                            "result" : {
                                                "endConversation" : true
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 2,
                            "operator" : "==="
                        }
                    ],
                    "text" : "What am I supposed to be doing again?",
                    "result" : {
                        "npcText" : "I needs you to get me lucky Leprechaun flute%%An old buddy o' mine lives in a hut to the East of here, he'll give it to ya!",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 3,
                            "operator" : "==="
                        },
                        {
                            "desc" : "player needs to have no space in their inventory",
                            "type" : "availableinventoryspace",
                            "itemid" : 295,
                            "isiou" : false,
                            "availableslotsneeded" : 0
                        }
                    ],
                    "text" : "I found your buddy",
                    "fullText" : "I found your buddy, but hes saying he isn't a leprechaun",
                    "result" : {
                        "npcText" : "Oh, yea we leprechauns gotta lay low%%Lots of folks always be comin' after our gold%%Can't trust anyone%%Alright, I got an idea%%Take this here Leprechaun Hat, then maybe McGoldy'll think you are a leprechaun%%Might be willin' to help you out then%%Oops, looks like your inventory is too full to hold my Leprechaun Hat right now",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 3,
                            "operator" : "==="
                        },
                        {
                            "desc" : "player needs to have space in their inventory",
                            "type" : "availableinventoryspace",
                            "itemid" : 295,
                            "isiou" : false,
                            "availableslotsneeded" : 1
                        }
                    ],
                    "text" : "I found your buddy",
                    "fullText" : "I found your buddy, but hes saying he isn't a leprechaun",
                    "result" : {
                        "npcText" : "Oh, yea we leprechauns gotta lay low%%Lots of folks always be comin' after our gold%%Can't trust anyone%%Alright, I got an idea%%Take this here Leprechaun Hat, then maybe McGoldy'll think you are a leprechaun%%Might be willin' to help you out then",
                        "questAdvancement" : {
                            "desc" : "Leprechaun Flute",
                            "questid" : 1,
                            "checkpoint" : 4
                        },
                        "playerEventAction" : {
                            "desc" : "Player receives leprechaun hat",
                            "type" : "PlayerReceiveItems",
                            "playerReceiveItems" : [
                                { "id" : 295, "isIOU" : false, "amt" : 1 }
                            ]
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 4,
                            "operator" : "==="
                        }
                    ],
                    "text" : "What am I supposed to do again?",
                    "result" : {
                        "npcText" : "Go 'n talk to McGoldy while wearin' that Leprechaun Hat I gave ya%%Otherwise, he won't be trustin' ya too well",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 4,
                            "operator" : "==="
                        },
                        {
                            "desc" : "player needs to not own a Leprechaun Sketch in bank, inv, or loadout",
                            "type" : "playerownsitem",
                            "itemid" : 295,
                            "amount" : 0,
                            "isiou" : false,
                            "operator" : "==="
                        },
                        {
                            "desc" : "player needs to have no space in their inventory",
                            "type" : "availableinventoryspace",
                            "itemid" : 295,
                            "isiou" : false,
                            "availableslotsneeded" : 0
                        }
                    ],
                    "text" : "Can I have another Leprechaun Hat? I lost mine",
                    "result" : {
                        "npcText" : "You think Leprechaun Hats just grow on trees or somethin'?%%Lucky for you, with a little bit o' Leprechaun Magic, I actually can make a new one grow on this here tree%%Now be a bit more careful next time, ya hear?%%Aye, your inventory be too full for me to give you a new Leprechaun Hat right now",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 4,
                            "operator" : "==="
                        },
                        {
                            "desc" : "player needs to not own a Leprechaun Sketch in bank, inv, or loadout",
                            "type" : "playerownsitem",
                            "itemid" : 295,
                            "amount" : 0,
                            "isiou" : false,
                            "operator" : "==="
                        },
                        {
                            "desc" : "player needs to have no space in their inventory",
                            "type" : "availableinventoryspace",
                            "itemid" : 295,
                            "isiou" : false,
                            "availableslotsneeded" : 1
                        }
                    ],
                    "text" : "Can I have another Leprechaun Hat? I lost mine",
                    "result" : {
                        "npcText" : "You think Leprechaun Hats just grow on trees or somethin'?%%Lucky for you, with a little bit o' Leprechaun Magic, I actually can make a new one grow on this here tree%%Now be a bit more careful next time, ya hear?",
                        "playerEventAction" : {
                            "desc" : "Player receives leprechaun hat",
                            "type" : "PlayerReceiveItems",
                            "playerReceiveItems" : [
                                { "id" : 295, "isIOU" : false, "amt" : 1 }
                            ]
                        },
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 56,
        "description" : "conversation with O'Shammy (jail)",
        "result" : {
            "options" : [
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 9,
                            "operator" : "==="
                        },
                        {
                            "desc" : "player needs to have 0 Leprechaun Flute in their inventory",
                            "type" : "inventoryitem",
                            "itemid" : 297,
                            "isiou" : false,
                            "amount" : 0,
                            "operator" : "==="
                        }
                    ],
                    "text" : "Let's get you out of here!",
                    "result" : {
                        "npcText" : "You came to rescue me!%%But you don't have me lucky Leprechaun Flute?",
                        "options" : [
                            {
                                "requirements" : null,
                                "text" : "Who cares? Just follow me out of this place!",
                                "result" : {
                                    "npcText" : "Its too risky, there be far too many gnomes around here, we'll get caught for sure!%%Please come back and bring me lucky Leprechaun Flute!",
                                    "endConversation" : true
                                }
                            },
                            {
                                "requirements" : null,
                                "text" : "Oops I forgot it",
                                "result" : {
                                    "npcText" : "Please go back and get it! Otherwise, escapin' from here is a too risky for me liking",
                                    "endConversation" : true
                                }
                            }
                        ]
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 9,
                            "operator" : "==="
                        },
                        {
                            "desc" : "player needs to have 1 or more Leprechaun Flute in their inventory",
                            "type" : "inventoryitem",
                            "itemid" : 297,
                            "isiou" : false,
                            "amount" : 1,
                            "operator" : ">="
                        }
                    ],
                    "text" : "Let's get you out of here!",
                    "result" : {
                        "npcText" : "You're here! And you brought me lucky Leprechaun Flute with ya!%%Hand it over to me, and I'll be able to teleport out of here!",
                        "options" : [
                            {
                                "requirements" : null,
                                "text" : "Here you go!",
                                "result" : {
                                    "npcText" : "Thank you!",
                                    "questAdvancement" : {
                                        "desc" : "Leprechaun Flute",
                                        "questid" : 1,
                                        "checkpoint" : 10
                                    },
                                    "playerEventAction" : {
                                        "desc" : "player gives leprechaun flute",
                                        "type" : "PlayerGiveItems",
                                        "playerGiveItems" : [
                                            { "id" : 297, "isIOU" : false, "amt" : 1 }
                                        ]
                                    },
                                    "endConversation" : true
                                }
                            },
                            {
                                "requirements" : null,
                                "text" : "No way, this flute belongs to me",
                                "result" : {
                                    "npcText" : "You big greedy human! Let me have it!",
                                    "endConversation" : true
                                }
                            }
                        ]
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 10,
                            "operator" : ">="
                        }
                    ],
                    "text" : "Why are you still here?",
                    "result" : {
                        "npcText" : "Don't you worry, I'll be leaving here shortly",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 10,
                            "operator" : ">="
                        }
                    ],
                    "text" : "Can I get a Leprechaun Flute for myself?",
                    "result" : {
                        "npcText" : "Why certainly, just go back to that ol' house and feel free to take one!",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 10,
                            "operator" : ">="
                        },
                        {
                            "desc" : "player needs to not own a Leprechaun Hat in bank, inv, or loadout",
                            "type" : "playerownsitem",
                            "itemid" : 295,
                            "amount" : 0,
                            "isiou" : false,
                            "operator" : "==="
                        },
                        {
                            "desc" : "player needs to have no space in their inventory",
                            "type" : "availableinventoryspace",
                            "itemid" : 295,
                            "isiou" : false,
                            "availableslotsneeded" : 0
                        }
                    ],
                    "text" : "Can I have another Leprechaun Hat?",
                    "result" : {
                        "npcText" : "Alright, but be a bit more careful with it next time%%Oops, looks like your inventory is full",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 10,
                            "operator" : ">="
                        },
                        {
                            "desc" : "player needs to not own a Leprechaun Hat in bank, inv, or loadout",
                            "type" : "playerownsitem",
                            "itemid" : 295,
                            "amount" : 0,
                            "isiou" : false,
                            "operator" : "==="
                        },
                        {
                            "desc" : "player needs to have some space in their inventory",
                            "type" : "availableinventoryspace",
                            "itemid" : 295,
                            "isiou" : false,
                            "availableslotsneeded" : 1
                        }
                    ],
                    "text" : "Can I have another Leprechaun Hat?",
                    "result" : {
                        "npcText" : "Alright, but be a bit more careful with it next time",
                        "playerEventAction" : {
                            "desc" : "Player receives leprechaun hat",
                            "type" : "PlayerReceiveItems",
                            "playerReceiveItems" : [
                                { "id" : 295, "isIOU" : false, "amt" : 1 }
                            ]
                        },
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 57,
        "description" : "convo with McGoldy",
        "result" : {
            "options" : [
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 2,
                            "operator" : "<="
                        }
                    ],
                    "text" : "Whatcha doin?",
                    "result" : {
                        "npcText" : "Just be standin' here, mindin' me own business, now you mind yours!",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 1,
                            "operator" : "<="
                        }
                    ],
                    "text" : "Can I go in your house",
                    "fullText" : "Hey can I go in your house?",
                    "result" : {
                        "npcText" : "No now beat it",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 2,
                            "operator" : "==="
                        }
                    ],
                    "text" : "Can I go in your house",
                    "fullText" : "Hey can I go in your house?",
                    "result" : {
                        "npcText" : "No now beat it",
                        "options" : [
                            {
                                "requirements" : null,
                                "text" : "Beat what?",
                                "result" : {
                                    "npcText" : "It%%Just beat it",
                                    "endConversation" : true
                                }
                            },
                            {
                                "requirements" : null,
                                "text" : "O'Shammy sent me",
                                "result" : {
                                    "npcText" : "O'Shammy?%%I mean, I uh%%I don't knows anyone named O'Shammy, now beat it",
                                    "options" : [
                                        {
                                            "requirements" : null,
                                            "text" : "Oh my mistake",
                                            "result" : {
                                                "endConversation" : true
                                            }
                                        },
                                        {
                                            "requirements" : null,
                                            "text" : "Hes a leprechaun just like you",
                                            "fullText" : "You know, your ol' buddy O'Shammy, hes a leprechaun just like you",
                                            "result" : {
                                                "npcText" : "Who you's be callin' a leprechaun?%%I ain't no leprechaun, and I don't knows any leprechauns either%%Now leave me be, ya hear?",
                                                "questAdvancement" : {
                                                    "desc" : "Leprechaun Flute",
                                                    "questid" : 1,
                                                    "checkpoint" : 3
                                                },
                                                "endConversation" : true
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 3,
                            "operator" : "==="
                        }
                    ],
                    "text" : "You sure you aren't a leprechaun?",
                    "fullText" : "Are you sure you aren't a leprechaun? You look just like one",
                    "result" : {
                        "npcText" : "Of course I'm sure%%Why wouldn't I be sure%%I ain't a leprechaun, no you go 'n move along now",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 3,
                            "operator" : ">="
                        },
                        {
                            "desc" : "player needs to NOT have leprechaun hat equipped",
                            "type" : "equippeditem",
                            "equipmenttype" : "helmet",
                            "itemids" : [ 295 ],
                            "isequipped" : false
                        }
                    ],
                    "text" : "Hello",
                    "result" : {
                        "npcText" : "Are you deaf? I said get lost!",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 4,
                            "operator" : "==="
                        },
                        {
                            "desc" : "player needs to have leprechaun hat equipped",
                            "type" : "equippeditem",
                            "equipmenttype" : "helmet",
                            "itemids" : [ 295 ],
                            "isequipped" : true
                        }
                    ],
                    "text" : "Hello",
                    "result" : {
                        "npcText" : "Hello there%%Say I don't recognize you%%Aren't you a little tall for a leprechaun?",
                        "options" : [
                            {
                                "requirements" : null,
                                "text" : "Aren't YOU a little short for a leprechaun?",
                                "result" : {
                                    "npcText" : "Why no%%I reckon I be normal height for a leprechaun",
                                    "endConversation" : true
                                }
                            },
                            {
                                "requirements" : null,
                                "text" : "I'm half giant, half leprechaun",
                                "fullText" : "My mom's a giant, but my dad's a leprechaun. He always had a thing for taller ladies",
                                "result" : {
                                    "npcText" : "Impossible!%%Giants cannot mate with us leprechauns",
                                    "endConversation" : true
                                }
                            },
                            {
                                "requirements" : null,
                                "text" : "No you're just short",
                                "result" : {
                                    "npcText" : "Actually I'm quite normal height",
                                    "endConversation" : true
                                }
                            },
                            {
                                "requirements" : null,
                                "text" : "A witch cast a growing spell on me",
                                "fullText" : "A witch cast a growing spell on me a few nights ago, now I can't stop growing",
                                "result" : {
                                    "npcText" : "Oh I hears ya%%Them witches be crazy",
                                    "options" : [
                                        {
                                            "requirements" : null,
                                            "text" : "Just kidding, I'm a human",
                                            "fullText" : "Just kidding, I'm a human!",
                                            "result" : {
                                                "npcText" : "What?!",
                                                "endConversation" : true
                                            }
                                        },
                                        {
                                            "requirements" : null,
                                            "text" : "So wheres the pot of gold at?",
                                            "result" : {
                                                "npcText" : "Me gold be at the end of a rainbow of course",
                                                "endConversation" : true
                                            }
                                        },
                                        {
                                            "requirements" : null,
                                            "text" : "O'Shammy is in trouble",
                                            "fullText" : "O'Shammy is in trouble, he said he needs his Leprechaun Flute",
                                            "result" : {
                                                "npcText" : "Aye, ye don't say!%%That O'Shammy always be getting himself into trouble%%Alright, go on in the house, you'll find a Leprechaun Flute inside",
                                                "questAdvancement" : {
                                                    "desc" : "Leprechaun Flute",
                                                    "questid" : 1,
                                                    "checkpoint" : 5
                                                },
                                                "endConversation" : true
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                "requirements" : null,
                                "text" : "I'm actually a human disguised as a leprechaun",
                                "result" : {
                                    "npcText" : "Nonsense, no human could ever get a hold of a leprechaun hat like that",
                                    "endConversation" : true
                                }
                            }
                        ]
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 5,
                            "operator" : "==="
                        },
                        {
                            "desc" : "player needs to have leprechaun hat equipped",
                            "type" : "equippeditem",
                            "equipmenttype" : "helmet",
                            "itemids" : [ 295 ],
                            "isequipped" : true
                        },
                        {
                            "desc" : "player needs to not own a Leprechaun Flute in bank, inv, or loadout",
                            "type" : "playerownsitem",
                            "itemid" : 297,
                            "amount" : 0,
                            "isiou" : false,
                            "operator" : "==="
                        }
                    ],
                    "text" : "Where is the Leprechaun Flute?",
                    "result" : {
                        "npcText" : "Just inside this here house, there be a little green chest. The flute be in there!",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 5,
                            "operator" : "==="
                        },
                        {
                            "desc" : "player needs to have leprechaun hat equipped",
                            "type" : "equippeditem",
                            "equipmenttype" : "helmet",
                            "itemids" : [ 295 ],
                            "isequipped" : true
                        },
                        {
                            "desc" : "player needs to own a Leprechaun Flute in bank, inv, or loadout",
                            "type" : "playerownsitem",
                            "itemid" : 297,
                            "amount" : 1,
                            "isiou" : false,
                            "operator" : ">="
                        }
                    ],
                    "text" : "I found the Leprechaun Flute!",
                    "result" : {
                        "npcText" : "Good! Now go give it to O'Shammy!",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 6,
                            "operator" : ">="
                        },
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 10,
                            "operator" : "<="
                        },
                        {
                            "desc" : "player needs to have leprechaun hat equipped",
                            "type" : "equippeditem",
                            "equipmenttype" : "helmet",
                            "itemids" : [ 295 ],
                            "isequipped" : true
                        }
                    ],
                    "text" : "Hello",
                    "result" : {
                        "npcText" : "Hello again me friend%%Feel free to use this safehouse as ye wish",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 6,
                            "operator" : "==="
                        },
                        {
                            "desc" : "player needs to have leprechaun hat equipped",
                            "type" : "equippeditem",
                            "equipmenttype" : "helmet",
                            "itemids" : [ 295 ],
                            "isequipped" : true
                        }
                    ],
                    "text" : "The gnomes got O'Shammy",
                    "fullText" : "Bad news, the gnomes got O'Shammy",
                    "result" : {
                        "npcText" : "Aye that be bad news indeed",
                        "options" : [
                            {
                                "requirements" : null,
                                "text" : "Any idea where he might be?",
                                "result" : {
                                    "npcText" : "I haven't a clue my friend%%Just try searchin' around the area for him",
                                    "endConversation" : true
                                }
                            },
                            {
                                "requirements" : null,
                                "text" : "What do you think they'll do to him",
                                "result" : {
                                    "npcText" : "Oh I dare not think of what gnomes may do to a leprechaun",
                                    "options" : [
                                        {
                                            "requirements" : null,
                                            "text" : "Why do gnomes want to capture leprechauns",
                                            "fullText" : "Why do gnomes want to capture leprechauns anyways?",
                                            "result" : {
                                                "npcText" : "I reckon they be a bit jealous of our tall stature%%Relatively speaking, mind you",
                                                "endConversation" : true
                                            }
                                        },
                                        {
                                            "requirements" : null,
                                            "text" : "So are you going to help find him?",
                                            "result" : {
                                                "npcText" : "Heavens no%%When gnomes are involved, it be every leprechaun for himself",
                                                "endConversation" : true
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
            ]
        }
    },
    {
        "_id" : 58,
        "description" : "conversation with McBoozy",
        "result" : {
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Howdy friend",
                    "result" : {
                        "npcText" : "*Hick*%%Howdy partner",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 6,
                            "operator" : "==="
                        }
                    ],
                    "text" : "Whats are you doing here?",
                    "fullText" : "Whats a leprechaun like you doing here?",
                    "result" : {
                        "npcText" : "*Hick*%%Who are you's callin' a leprechaun",
                        "options" : [
                            {
                                "requirements" : null,
                                "text" : "You",
                                "result" : {
                                    "npcText" : "Why, I am no leprechaun...%%*Hick*",
                                    "options" : [
                                        {
                                            "requirements" : null,
                                            "text" : "But you look just like one",
                                            "result" : {
                                                "npcText" : "Oh yeah%%*Hick*%%So you just be goin' around callin' every short, orange haired man with a green hat a leprechaun eh?%%*Hick*%%You go on and get outta here, ya hear? Else there be trouble comin' your way!%%*Hick*",
                                                "endConversation" : true
                                            }
                                        },
                                        {
                                            "requirements" : null,
                                            "text" : "Are you drunk?",
                                            "result" : {
                                                "npcText" : "*Hick*%%Drunk?%%Of course me isn't drunk%%*Hick*%%Why I's only had three or four pints",
                                                "endConversation" : true
                                            }
                                        },
                                        {
                                            "requirements" : null,
                                            "text" : "So what are you doing here",
                                            "result" : {
                                                "npcText" : "Why, I be uh%%*Hick*%%You knows what%%Go 'n bring me a tall glass of beer%%*Hick*%%Then I tells ya what I be doin' here",
                                                "questAdvancement" : {
                                                    "desc" : "Leprechaun Flute",
                                                    "questid" : 1,
                                                    "checkpoint" : 7
                                                },
                                                "endConversation" : true
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                "requirements" : null,
                                "text" : "Sorry I thought you were a leprechaun",
                                "result" : {
                                    "npcText" : "Well then%%*Hick*%%Apology accepted%%*Hick*",
                                    "endConversation" : true
                                }
                            }
                        ]
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 7,
                            "operator" : "==="
                        },
                        {
                            "desc" : "player needs to have 0 half beers in their inventory",
                            "type" : "inventoryitem",
                            "itemid" : 160,
                            "isiou" : false,
                            "amount" : 0,
                            "operator" : "==="
                        },
                        {
                            "desc" : "player needs to have 0 beers in their inventory",
                            "type" : "inventoryitem",
                            "itemid" : 159,
                            "isiou" : false,
                            "amount" : 0,
                            "operator" : "==="
                        }
                    ],
                    "text" : "What'd you want me to do again?",
                    "result" : {
                        "npcText" : "Go 'n bring me a nice tall glass o' beer%%*Hick*",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 7,
                            "operator" : "==="
                        },
                        {
                            "desc" : "player needs to have 1 or more half beers in their inventory",
                            "type" : "inventoryitem",
                            "itemid" : 160,
                            "isiou" : false,
                            "amount" : 1,
                            "operator" : ">="
                        },
                        {
                            "desc" : "player needs to have 0 beers in their inventory",
                            "type" : "inventoryitem",
                            "itemid" : 159,
                            "isiou" : false,
                            "amount" : 0,
                            "operator" : "==="
                        }
                    ],
                    "text" : "Got your beer right here!",
                    "result" : {
                        "npcText" : "*Hick*%%Hand it over 'ere%%Aye, whats this? I said a tall glass o' beer, what you tryin' to pull on me?",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 7,
                            "operator" : "==="
                        },
                        {
                            "desc" : "player needs to have 1 or more beers in their inventory",
                            "type" : "inventoryitem",
                            "itemid" : 159,
                            "isiou" : false,
                            "amount" : 1,
                            "operator" : ">="
                        }
                    ],
                    "text" : "Heres your beer",
                    "result" : {
                        "npcText" : "*Hick*%%Hand 'er over to me%%*Hick*",
                        "playerEventAction" : {
                            "desc" : "player gives one beer",
                            "type" : "PlayerGiveItems",
                            "playerGiveItems" : [
                                { "id" : 159, "isIOU" : false, "amt" : 1 }
                            ]
                        },
                        "questAdvancement" : {
                            "desc" : "Leprechaun Flute",
                            "questid" : 1,
                            "checkpoint" : 8
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 8,
                            "operator" : "==="
                        }
                    ],
                    "text" : "So what are you up to down here",
                    "result" : {
                        "npcText" : "*Hick*%%Earlier, I was outside, searchin' for me friend O'Shammy%%*Hick*%%'n I saw some gnomes gone up a tree 'n captured him%%*Hick*%%Took him down under this here hill%%Afterwards, I o'erheard some gnomes talkin' about a jail key in this here storage area%%*Hick*%%Well I get to searchin' these crates, 'n low and behold I go 'n stumble upon a crate filled with beer%%*Hick*%%'nforunately, I drank all the beer%%*Hick*",
                        "questAdvancement" : {
                            "desc" : "Leprechaun Flute",
                            "questid" : 1,
                            "checkpoint" : 9
                        },
                        "options" : [
                            {
                                "requirements" : null,
                                "text" : "Jail key?",
                                "result" : {
                                    "npcText" : "Yep, gotta get that key to free me ol' friend!%%*Hick*",
                                    "endConversation" : true
                                }
                            },
                            {
                                "requirements" : null,
                                "text" : "So you'd rather drink that help get your friend out of jail?",
                                "result" : {
                                    "npcText" : "*Hick*%%Who says I can't do both%%*Hick*",
                                    "endConversation" : true
                                }
                            }
                        ]
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 9,
                            "operator" : "==="
                        },
                        {
                            "desc" : "player needs to have 0 gnome jail key in their inventory",
                            "type" : "inventoryitem",
                            "itemid" : 296,
                            "isiou" : false,
                            "amount" : 0,
                            "operator" : "==="
                        }
                    ],
                    "text" : "Jail key?",
                    "result" : {
                        "npcText" : "Yep, gotta get that key to free me ol' friend!%%Its hidden in one of these here crates%%*Hick*",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 9,
                            "operator" : "==="
                        },
                        {
                            "desc" : "player needs to have 1 or more gnome jail key in their inventory",
                            "type" : "inventoryitem",
                            "itemid" : 296,
                            "isiou" : false,
                            "amount" : 1,
                            "operator" : ">="
                        }
                    ],
                    "text" : "I found the jail key",
                    "result" : {
                        "npcText" : "Great!%%*Hick*%%Say, you mind goin' 'n gettin' me friend outta jail?%%*Hick*%%I think me's had a bit too much to drink%%*Hick*",
                        "options" : [
                            {
                                "requirements" : null,
                                "text" : "Fine, I'll do it myself",
                                "result" : {
                                    "npcText" : "*Hick*%%Thanks ol' buddy!",
                                    "endConversation" : true
                                }
                            },
                            {
                                "requirements" : null,
                                "text" : "Wheres the jail at exactly?",
                                "result" : {
                                    "npcText" : "I reckon it be down here%%*Hick*%%I saw a big ol' rock blocking a passage way though, so ye gonna need to figure out how to get past that%%*Hick*",
                                    "endConversation" : true
                                }
                            }
                        ]
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "Leprechaun Flute",
                            "type" : "quest",
                            "questid" : 1,
                            "checkpoint" : 10,
                            "operator" : ">="
                        }
                    ],
                    "text" : "O'Shammy is free now!",
                    "result" : {
                        "npcText" : "Why that's great news!%%Oh, I's be havin' quite the headache now...%%I'm just gonna lay down here for a bit to rest...",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 59,
        "description" : "convo with conrad",
        "result" : {
            "npcText" : "Hey, want to buy some corn?%%I got fresh corn and grilled corn, take your pick!",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Sure I'll buy some corn",
                    "result" : {
                        "playerEventAction" : {
                            "type" : "StartShopping",
                            "shopId" : 15
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Can I sell you my corn instead?",
                    "result" : {
                        "npcText" : "Of course!%%I just love corn",
                        "playerEventAction" : {
                            "type" : "StartShopping",
                            "shopId" : 15
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Got anything other than corn?",
                    "result" : {
                        "npcText" : "Nope, just corn!",
                        "options" : [
                            {
                                "requirements" : null,
                                "text" : "Ok let's trade",
                                "result" : {
                                    "playerEventAction" : {
                                        "type" : "StartShopping",
                                        "shopId" : 15
                                    },
                                    "endConversation" : true
                                }
                            },
                            {
                                "requirements" : null,
                                "text" : "No thanks then",
                                "result" : {
                                    "npcText" : "Alright, but if you ever want some corn, you know where to find me!",
                                    "endConversation" : true
                                }
                            }
                        ]
                    }
                },
                {
                    "requirements" : null,
                    "text" : "I'm not interested in your corn",
                    "result" : {
                        "npcText" : "I see%%Well if you change your mind, you'll know where to find me!",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 60,
        "description" : "convo with porter",
        "result" : {
            "npcText" : "Hi there, come check out my potatoes!",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Alright",
                    "result" : {
                        "playerEventAction" : {
                            "type" : "StartShopping",
                            "shopId" : 16
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "No thanks",
                    "result" : {
                        "npcText" : "Well, goodbye then",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 61,
        "description" : "convo with fishmonger",
        "result" : {
            "npcText" : "Hello, I specialize in buying and selling fish. Want to trade?",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Ok",
                    "result" : {
                        "playerEventAction" : {
                            "type" : "StartShopping",
                            "shopId" : 17
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "No thanks",
                    "result" : {
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 62,
        "description" : "convo with celadon general store owner",
        "result" : {
            "npcText" : "Welcome to my shop%%Is there anything you're looking to buy or sell?",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Show me what you're selling",
                    "result" : {
                        "playerEventAction" : {
                            "type" : "StartShopping",
                            "shopId" : 18
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Yep I got some stuff I want to sell",
                    "result" : {
                        "playerEventAction" : {
                            "type" : "StartShopping",
                            "shopId" : 18
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Sorry I'm not interested in trading right now",
                    "result" : {
                        "npcText" : "Alright",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 63,
        "description" : "conversation with Gallagher",
        "result" : {
            "npcText" : "Hello fellow warrior, may I interest you in my bronze weaponry?",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Let's see what you got",
                    "result" : {
                        "playerEventAction" : {
                            "type" : "StartShopping",
                            "shopId" : 19
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "No thanks",
                    "result" : {
                        "npcText" : "In that case, have a good day",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "I'm not a warrior",
                    "result" : {
                        "npcText" : "Oh, I understand%%However, I do have pickaxes and gloves for sale, and I also buy bronze weaponry from smiths who make them",
                        "options" : [
                            {
                                "requirements" : null,
                                "text" : "In that case let's trade",
                                "result" : {
                                    "npcText" : "Great",
                                    "playerEventAction" : {
                                        "type" : "StartShopping",
                                        "shopId" : 19
                                    },
                                    "endConversation" : true
                                }
                            },
                            {
                                "requirements" : null,
                                "text" : "Still not interested",
                                "result" : {
                                    "npcText" : "I understand, goodbye then",
                                    "endConversation" : true
                                }
                            }
                        ]
                    }
                }
            ]
        }
    },
    {
        "_id" : 64,
        "description" : "convo with ictirine general store owner",
        "result" : {
            "npcText" : "Welcome to my shop%%Is there anything you're looking to buy or sell?",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Show me what you're selling",
                    "result" : {
                        "playerEventAction" : {
                            "type" : "StartShopping",
                            "shopId" : 20
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Yep I got some stuff I want to sell",
                    "result" : {
                        "playerEventAction" : {
                            "type" : "StartShopping",
                            "shopId" : 20
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Sorry I'm not interested in trading right now",
                    "result" : {
                        "npcText" : "Alright",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 65,
        "description" : "convo with elder knight in wilderness",
        "result" : {
            "npcText" : "Careful going in there my friend, dark evil awaits",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "I'm not afraid of anything",
                    "result" : {
                        "npcText" : "Very well",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Thanks for the heads up sir",
                    "result" : {
                        "npcText" : "There is no need to thank me",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 66,
        "description" : "maid (anglam castle bedroom) convo",
        "result" : {
            "npcText" : "Waltzing into someone else's bedroom is a bit rude, don't you think?",
            "endConversation" : true
        }
    },
    {
        "_id" : 67,
        "description" : "maid (anglam castle lobby) convo",
        "result" : {
            "npcText" : "Hello, may I help you?%%Wait a minute, you're not a member of royalty%%I only serve the royal family, go away",
            "endConversation" : true
        }
    },
    {
        "_id" : 68,
        "description" : "maid (anglam castle hall) convo",
        "result" : {
            "npcText" : "Sorry, I'm very busy right now",
            "endConversation" : true
        }
    },
    {
        "_id" : 69,
        "description" : "convo with prince louis",
        "result" : {
            "npcText" : "Ah, a commoner%%Hello my lowly peasent, what brings you into my father's castle?",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Who are you calling a peasent",
                    "result" : {
                        "npcText" : "Why, you of course",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Just exploring",
                    "result" : {
                        "npcText" : "Well, I suppose I can allow a peasent like you to explore the castle grounds%%But if you are caught stealing anything, it'll be off with your head",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "I've come to slay the king",
                    "result" : {
                        "npcText" : "Ahahaha%%Normally I'd have you beheaded for such a statement...%%but my father is the greatest warrior in all of HighSpell, a lowly peasent like you would stand no chance%%In any event, he is not here right now%%Now run along you silly little fool",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 70,
        "description" : "knight (anglam castle hall)",
        "result" : {
            "npcText" : "It is my duty to protect Prince Louis with my life%%You know, he will be the king someday",
            "endConversation" : true
        }
    },
    {
        "_id" : 71,
        "description" : "convo with peer",
        "result" : {
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Who are you",
                    "result" : {
                        "npcText" : "Why, my name is Peer",
                        "options" : [
                            {
                                "requirements" : null,
                                "text" : "So what are you doing around here Peer",
                                "result" : {
                                    "npcText" : "To be honest, a whole lot of nothing",
                                    "endConversation" : true
                                }
                            },
                            {
                                "requirements" : null,
                                "text" : "Well nice to meet you Peer",
                                "result" : {
                                    "npcText" : "It was nice meeting you too",
                                    "endConversation" : true
                                }
                            }
                        ]
                    }
                },
                {
                    "requirements" : null,
                    "text" : "These castle grounds sure are lovely",
                    "result" : {
                        "npcText" : "Yes, its quite nice around here",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 72,
        "description" : "convo with chef",
        "result" : {
            "npcText" : "Hello there%%Feel free to use my stove%%By the way, did you know that you'll be less likely to burn food on a stove than an open fire?%%With a stove, its much more easy to control the level of heat, that's why!",
            "endConversation" : true
        }
    },
    {
        "_id" : 73,
        "description" : "dwarven banker convo",
        "result" : {
            "npcText" : "Welcome to the Dwarven Bank of HighSpell",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "What do you do here?",
                    "result" : {
                        "npcText" : "I help look after customers' belongings",
                        "options" : [
							{
                                "requirements" : null,
                                "text" : "Oh ok",
                                "result" : {
                                    "endConversation" : true
                                }
                            },
                            {
                                "requirements" : null,
                                "text" : "So you can keep my items safe?",
                                "result" : {
                                    "npcText" : "Certainly!%%Just store your items in that bank chest over there, and you will be able to retrieve them later from any other bank branch",
                                    "endConversation" : true
                                }
                            }
                        ]
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Can you protect my items?",
                    "result" : {
                        "npcText" : "Certainly!%%Just store your items in that bank chest over there, and you will be able to retrieve them later from any other bank branch",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Can I get a loan",
                    "result" : {
                        "npcText" : "How much do you need?",
                        "options" : [
							{
                                "requirements" : null,
                                "text" : "2 coins",
                                "result" : {
									"npcText" : "Er, you gotta be joking...",
                                    "endConversation" : true
                                }
                            },
                            {
                                "requirements" : null,
                                "text" : "Ten million oughta do it",
                                "result" : {
                                    "npcText" : "Not in ten million years pal",
                                    "endConversation" : true
                                }
                            }
                        ]
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Dwarven Bank?",
                    "result" : {
                        "npcText" : "Thats right%%Don't worry, we share the same banking system with the rest of the banks in HighSpell",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 74,
        "description" : "convo with dwarven guard (underground)",
        "result" : {
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Whats beyond that door?",
                    "result" : {
                        "npcText" : "The Dwarven Mines of course",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "player mining skill >= 65",
                            "type" : "skill",
                            "skill" : "mining",
                            "level" : 65,
                            "operator" : ">="
                        }
                    ],
                    "text" : "Let me in!",
                    "result" : {
                        "npcText" : "Why of course%%Although you aren't a dwarf, you are quite the skilled miner%%Go on in",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "player mining skill < 65",
                            "type" : "skill",
                            "skill" : "mining",
                            "level" : 65,
                            "operator" : "<"
                        }
                    ],
                    "text" : "Let me in!",
                    "result" : {
                        "npcText" : "Dwarves only!",
                        "options" : [
                            {
                                "requirements" : null,
                                "text" : "Oh ok",
                                "fullText" : "Oh ok, bye",
                                "result" : {
                                    "endConversation" : true
                                }
                            },
                            {
                                "requirements" : null,
                                "text" : "That's discrimination",
                                "result" : {
                                    "npcText" : "Hmm I suppose it is%%Tell you what, seeing as we dwarves are expert miners...%%If you too become an expert miner, I'll consider you one of us and let you in%%But until then, go away!",
                                    "endConversation" : true
                                }
                            }
                        ]
                    }
                }
            ]
        }
    },
    {
        "_id" : 75,
        "description" : "convo with dwarven guard (above ground)",
        "result" : {
            "options" : [
                {
                    "requirements" : null,
                    "text" : "What's in there?",
                    "result" : {
                        "npcText" : "It's the entrance to the Dwarven Mines",
                        "options" : [
                            {
                                "requirements" : null,
                                "text" : "Got it",
                                "result" : {
                                    "endConversation" : true
                                }
                            },
                            {
                                "requirements" : [
                                    {
                                        "desc" : "player mining skill >= 65",
                                        "type" : "skill",
                                        "skill" : "mining",
                                        "level" : 65,
                                        "operator" : ">="
                                    }
                                ],
                                "text" : "Can I go in?",
                                "result" : {
                                    "npcText" : "Sure, you seem worthy enough to enter our mines",
                                    "endConversation" : true
                                }
                            },
                            {
                                "requirements" : [
                                    {
                                        "desc" : "player mining skill < 65",
                                        "type" : "skill",
                                        "skill" : "mining",
                                        "level" : 65,
                                        "operator" : "<"
                                    }
                                ],
                                "text" : "Can I go in?",
                                "result" : {
                                    "npcText" : "Sorry, only Dwarves and expert miners are allowed down there",
                                    "endConversation" : true
                                }
                            }
                        ]
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Aren't you bored",
                    "fullText" : "Aren't you bored just standing around here?",
                    "result" : {
                        "npcText" : "Yes",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 76,
        "description" : "convo with emeril",
        "result" : {
            "npcText" : "Care to check out my mining supplies?",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Sure",
                    "result" : {
                        "playerEventAction" : {
                            "type" : "StartShopping",
                            "shopId" : 22
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "No thanks",
                    "result" : {
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 77,
        "description" : "convo with thadric",
        "result" : {
            "npcText" : "Hi friend, why not check out some amazing pickaxes?",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Because I'm not interested",
                    "result" : {
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Sure why not",
                    "result" : {
                        "playerEventAction" : {
                            "type" : "StartShopping",
                            "shopId" : 23
                        },
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 78,
        "description" : "convo with orlando",
        "result" : {
            "npcText" : "You look like a world-class archer! Interested in trading some bows or arrows?",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "I'm interested",
                    "result" : {
                        "playerEventAction" : {
                            "type" : "StartShopping",
                            "shopId" : 24
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "I'm not into archery",
                    "result" : {
                        "npcText": "Alright, suit yourself",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 79,
        "description" : "convo with gerrick",
        "result" : {
            "npcText" : "Hello friend!%%Why, you look like quite the adventurer, care to trade?",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Let's trade",
                    "result" : {
                        "playerEventAction" : {
                            "type" : "StartShopping",
                            "shopId" : 25
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "I don't want to trade with you",
                    "result" : {
                        "npcText": "Ok then",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "I'm not an adventurer",
                    "result" : {
                        "npcText": "Well then, feel free to come back when you're feeling adventurous",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 80,
        "description" : "convo with gambler in celadon",
        "result" : {
            "npcText" : "Hey, feeling lucky?",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "As a matter of fact I am",
                    "result" : {
                        "npcText" : "Great! I'll flip a coin%%You select heads or tails%%If you win, then I'll quadruple any money you wager!%%What do you say?",
                        "options" : [
                            {
                                "requirements" : null,
                                "text" : "Let's play",
                                "result" : {
                                    "npcText" : "Great! First of all, how much money do you wager?",
                                    "options" : [
                                        {
                                            "requirements" : [
                                                {
                                                    "desc" : "player needs to have 1 or more coins in inventory",
                                                    "type" : "inventoryitem",
                                                    "itemid" : 6,
                                                    "isiou" : false,
                                                    "amount" : 1,
                                                    "operator" : ">="
                                                }
                                            ],
                                            "text" : "One coin",
                                            "result" : {
                                                "npcText" : "Only one?%%Alright, time for the coin flip!%%Heads or tails?",
                                                "playerEventAction" : {
                                                    "desc" : "player gives 1 coin",
                                                    "type" : "PlayerGiveItems",
                                                    "playerGiveItems" : [
                                                        { "id" : 6, "isIOU" : false, "amt" : 1 }
                                                    ]
                                                },
                                                "options" : [
                                                    {
                                                        "requirements" : null,
                                                        "text" : "Heads",
                                                        "result" : {
                                                            "npcText" : "Alright, heads I win, tails you lose!%%...(the gambler flips the coin)...%%Its heads, I win! Better luck next time",
                                                            "options" : [
                                                                {
                                                                    "requirements" : null,
                                                                    "text" : "Darn it!",
                                                                    "result" : {
                                                                        "endConversation" : true
                                                                    }
                                                                },
                                                                {
                                                                    "requirements" : null,
                                                                    "text" : "Cheater!",
                                                                    "result" : {
                                                                        "npcText" : "Hey, you lost fair and square",
                                                                        "options" : [
                                                                            {
                                                                                "requirements" : null,
                                                                                "text" : "Fine, you win",
                                                                                "result" : {
                                                                                    "endConversation" : true
                                                                                }
                                                                            },
                                                                            {
                                                                                "requirements" : null,
                                                                                "text" : "How about I just kill you and get my money back",
                                                                                "result" : {
                                                                                    "npcText" : "Woah woah woah%%Theres no need for violence%%Fine, take back your measly little coin",
                                                                                    "playerEventAction" : {
                                                                                        "desc" : "Player receives 1 coin",
                                                                                        "type" : "PlayerReceiveItems",
                                                                                        "playerReceiveItems" : [
                                                                                            { "id" : 6, "isIOU" : false, "amt" : 1 }
                                                                                        ]
                                                                                    },
                                                                                    "endConversation" : true
                                                                                }
                                                                            }
                                                                        ]
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        "requirements" : null,
                                                        "text" : "Tails",
                                                        "result" : {
                                                            "npcText" : "Alright, heads I win, tails you lose!%%...(the gambler flips the coin)...%%Its heads, I win! Better luck next time",
                                                            "options" : [
                                                                {
                                                                    "requirements" : null,
                                                                    "text" : "Darn it!",
                                                                    "result" : {
                                                                        "endConversation" : true
                                                                    }
                                                                },
                                                                {
                                                                    "requirements" : null,
                                                                    "text" : "Cheater!",
                                                                    "result" : {
                                                                        "npcText" : "Hey, you lost fair and square",
                                                                        "options" : [
                                                                            {
                                                                                "requirements" : null,
                                                                                "text" : "Fine, you win",
                                                                                "result" : {
                                                                                    "endConversation" : true
                                                                                }
                                                                            },
                                                                            {
                                                                                "requirements" : null,
                                                                                "text" : "How about I just kill you and get my money back",
                                                                                "result" : {
                                                                                    "npcText" : "Woah woah woah%%Theres no need for violence%%Fine, take back your measly little coin",
                                                                                    "playerEventAction" : {
                                                                                        "desc" : "Player receives 1 coin",
                                                                                        "type" : "PlayerReceiveItems",
                                                                                        "playerReceiveItems" : [
                                                                                            { "id" : 6, "isIOU" : false, "amt" : 1 }
                                                                                        ]
                                                                                    },
                                                                                    "endConversation" : true
                                                                                }
                                                                            }
                                                                        ]
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            "requirements" : [
                                                {
                                                    "desc" : "player needs to have 2 or more coins in inventory",
                                                    "type" : "inventoryitem",
                                                    "itemid" : 6,
                                                    "isiou" : false,
                                                    "amount" : 2,
                                                    "operator" : ">="
                                                }
                                            ],
                                            "text" : "Two coins",
                                            "result" : {
                                                "npcText" : "Just two?%%Alright, time for the coin flip!%%Heads or tails?",
                                                "playerEventAction" : {
                                                    "desc" : "player gives 2 coins",
                                                    "type" : "PlayerGiveItems",
                                                    "playerGiveItems" : [
                                                        { "id" : 6, "isIOU" : false, "amt" : 2 }
                                                    ]
                                                },
                                                "options" : [
                                                    {
                                                        "requirements" : null,
                                                        "text" : "Heads",
                                                        "result" : {
                                                            "npcText" : "Alright, heads I win, tails you lose!%%...(the gambler flips the coin)...%%Its heads, I win! Better luck next time",
                                                            "options" : [
                                                                {
                                                                    "requirements" : null,
                                                                    "text" : "Darn it!",
                                                                    "result" : {
                                                                        "endConversation" : true
                                                                    }
                                                                },
                                                                {
                                                                    "requirements" : null,
                                                                    "text" : "Cheater!",
                                                                    "result" : {
                                                                        "npcText" : "Hey, you lost fair and square",
                                                                        "options" : [
                                                                            {
                                                                                "requirements" : null,
                                                                                "text" : "Fine, you win",
                                                                                "result" : {
                                                                                    "endConversation" : true
                                                                                }
                                                                            },
                                                                            {
                                                                                "requirements" : null,
                                                                                "text" : "How about I just kill you and get my money back",
                                                                                "result" : {
                                                                                    "npcText" : "Woah woah woah%%Theres no need for violence%%Fine, take back your two measly little coins",
                                                                                    "playerEventAction" : {
                                                                                        "desc" : "Player receives 2 coins",
                                                                                        "type" : "PlayerReceiveItems",
                                                                                        "playerReceiveItems" : [
                                                                                            { "id" : 6, "isIOU" : false, "amt" : 2 }
                                                                                        ]
                                                                                    },
                                                                                    "endConversation" : true
                                                                                }
                                                                            }
                                                                        ]
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        "requirements" : null,
                                                        "text" : "Tails",
                                                        "result" : {
                                                            "npcText" : "Alright, heads I win, tails you lose!%%...(the gambler flips the coin)...%%Its heads, I win! Better luck next time",
                                                            "options" : [
                                                                {
                                                                    "requirements" : null,
                                                                    "text" : "Darn it!",
                                                                    "result" : {
                                                                        "endConversation" : true
                                                                    }
                                                                },
                                                                {
                                                                    "requirements" : null,
                                                                    "text" : "Cheater!",
                                                                    "result" : {
                                                                        "npcText" : "Hey, you lost fair and square",
                                                                        "options" : [
                                                                            {
                                                                                "requirements" : null,
                                                                                "text" : "Fine, you win",
                                                                                "result" : {
                                                                                    "endConversation" : true
                                                                                }
                                                                            },
                                                                            {
                                                                                "requirements" : null,
                                                                                "text" : "How about I just kill you and get my money back",
                                                                                "result" : {
                                                                                    "npcText" : "Woah woah woah%%Theres no need for violence%%Fine, take back your two measly little coins",
                                                                                    "playerEventAction" : {
                                                                                        "desc" : "Player receives 2 coins",
                                                                                        "type" : "PlayerReceiveItems",
                                                                                        "playerReceiveItems" : [
                                                                                            { "id" : 6, "isIOU" : false, "amt" : 2 }
                                                                                        ]
                                                                                    },
                                                                                    "endConversation" : true
                                                                                }
                                                                            }
                                                                        ]
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            "requirements" : [
                                                {
                                                    "desc" : "player needs to have 5 or more coins in inventory",
                                                    "type" : "inventoryitem",
                                                    "itemid" : 6,
                                                    "isiou" : false,
                                                    "amount" : 5,
                                                    "operator" : ">="
                                                }
                                            ],
                                            "text" : "Five coins",
                                            "result" : {
                                                "npcText" : "Five coins eh?%%...(the gambler flips the coin)...%%Alright, time for the coin flip!%%Heads or tails?",
                                                "playerEventAction" : {
                                                    "desc" : "player gives 3 coins",
                                                    "type" : "PlayerGiveItems",
                                                    "playerGiveItems" : [
                                                        { "id" : 6, "isIOU" : false, "amt" : 3 }
                                                    ]
                                                },
                                                "options" : [
                                                    {
                                                        "requirements" : null,
                                                        "text" : "Heads",
                                                        "result" : {
                                                            "npcText" : "Alright, heads I win, tails you lose!%%...(the gambler flips the coin)...%%Its heads, I win! Better luck next time",
                                                            "options" : [
                                                                {
                                                                    "requirements" : null,
                                                                    "text" : "Darn it!",
                                                                    "result" : {
                                                                        "endConversation" : true
                                                                    }
                                                                },
                                                                {
                                                                    "requirements" : null,
                                                                    "text" : "Cheater!",
                                                                    "result" : {
                                                                        "npcText" : "Hey, you lost fair and square",
                                                                        "options" : [
                                                                            {
                                                                                "requirements" : null,
                                                                                "text" : "Fine, you win",
                                                                                "result" : {
                                                                                    "endConversation" : true
                                                                                }
                                                                            },
                                                                            {
                                                                                "requirements" : null,
                                                                                "text" : "How about I just kill you and get my money back",
                                                                                "result" : {
                                                                                    "npcText" : "Woah woah woah%%Theres no need for violence%%Fine, take back your measly little coins",
                                                                                    "playerEventAction" : {
                                                                                        "desc" : "Player receives 5 coins",
                                                                                        "type" : "PlayerReceiveItems",
                                                                                        "playerReceiveItems" : [
                                                                                            { "id" : 6, "isIOU" : false, "amt" : 5 }
                                                                                        ]
                                                                                    },
                                                                                    "endConversation" : true
                                                                                }
                                                                            }
                                                                        ]
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        "requirements" : null,
                                                        "text" : "Tails",
                                                        "result" : {
                                                            "npcText" : "Alright, heads I win, tails you lose!%%...(the gambler flips the coin)...%%Its heads, I win! Better luck next time",
                                                            "options" : [
                                                                {
                                                                    "requirements" : null,
                                                                    "text" : "Darn it!",
                                                                    "result" : {
                                                                        "endConversation" : true
                                                                    }
                                                                },
                                                                {
                                                                    "requirements" : null,
                                                                    "text" : "Cheater!",
                                                                    "result" : {
                                                                        "npcText" : "Hey, you lost fair and square",
                                                                        "options" : [
                                                                            {
                                                                                "requirements" : null,
                                                                                "text" : "Fine, you win",
                                                                                "result" : {
                                                                                    "endConversation" : true
                                                                                }
                                                                            },
                                                                            {
                                                                                "requirements" : null,
                                                                                "text" : "How about I just kill you and get my money back",
                                                                                "result" : {
                                                                                    "npcText" : "Woah woah woah%%Theres no need for violence%%Fine, take back your measly little coins",
                                                                                    "playerEventAction" : {
                                                                                        "desc" : "Player receives 5 coins",
                                                                                        "type" : "PlayerReceiveItems",
                                                                                        "playerReceiveItems" : [
                                                                                            { "id" : 6, "isIOU" : false, "amt" : 5 }
                                                                                        ]
                                                                                    },
                                                                                    "endConversation" : true
                                                                                }
                                                                            }
                                                                        ]
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            "requirements" : [
                                                {
                                                    "desc" : "player needs to have no coins in inventory",
                                                    "type" : "inventoryitem",
                                                    "itemid" : 6,
                                                    "isiou" : false,
                                                    "amount" : 0,
                                                    "operator" : "==="
                                                }
                                            ],
                                            "text" : "Actually I don't have any money on me",
                                            "result" : {
                                                "npcText" : "Well then, run along to the bank and go get some!",
                                                "endConversation" : true
                                            }
                                        },
                                        {
                                            "requirements" : null,
                                            "text" : "On second thought I change my mind",
                                            "fullText" : "On second though, I change my mind. I'm out",
                                            "result" : {
                                                "npcText" : "What a scaredy cat!",
                                                "endConversation" : true
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                "requirements" : null,
                                "text" : "No thanks gambling is dangerous",
                                "result" : {
                                    "npcText" : "What a little chicken!",
                                    "endConversation" : true
                                }
                            }
                        ]
                    }
                },
                {
                    "requirements" : null,
                    "text" : "No",
                    "result" : {
                        "npcText" : "Then get lost",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 81,
        "description" : "convo with celadon gatekeeper",
        "result" : {
            "npcText" : "Sorry, no commoners allowed through these gates",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Oh ok",
                    "fullText" : "Oh ok, in the future I will make sure to learn my place in society",
                    "result" : {
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "What if I give you 1000 coins",
                    "result" : {
                        "npcText" : "And what if I have you beheaded for bribing an official?",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 82,
        "description" : "convo with stan",
        "result" : {
            "npcText" : "Oh dear, it looks like some goblins have raided my farm again",
            "endConversation" : true
        }
    },
    {
        "_id" : 83,
        "description" : "convo with wandering monk",
        "result" : {
            "npcText" : "Careful heading out west, you'll find many aggressive monsters%%Goblins in particular, they tend to run around in packs",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Thanks for the heads up",
                    "result" : {
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "I'm not afraid of a couple of goblins",
                    "result" : {
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 84,
        "description" : "convo with wandering monk",
        "result" : {
            "npcText" : "Greetings%%Are you new around these parts?",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Yep I'm fresh of the boat",
                    "result" : {
                        "npcText" : "Boat? What boat?%%Anyways, since you're new, how about I offer you some advice",
                        "options" : [
                            {
                                "requirements": null,
                                "text": "Sure I could use some advice",
                                "result": {
                                    "npcText": "Great%%Well then, if you're looking to make some money, I recommend picking up a pickaxe and mining some copper and tin ore%%Then you can smelt them into bronze bars, which in turn can be smithed into a variety of items%%Afterwards, you can sell them to shops or other players",
                                    "options": [
                                        {
                                            "text": "Thanks for the advice!",
                                            "result": {
                                                "npcText": "My pleasure",
                                                "endConversation": true
                                            }
                                        },
                                        {
                                            "text": "Thanks, got any more advice?",
                                            "result": {
                                                "npcText": "Let's see...%%Oh, you can also find a sword and start killing some cows or chickens%%But as a pacific monk, I advise against that",
                                                "options": [
                                                    {
                                                        "text": "Cool thanks",
                                                        "result": {
                                                            "endConversation": true
                                                        }
                                                    },
                                                    {
                                                        "text": "If you advise against it why'd you give me that advice",
                                                        "result": {
                                                            "npcText": "Good question",
                                                            "endConversation": true
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                "requirements": null,
                                "text": "Not interested old man",
                                "result": {
                                    "npcText": "Very well",
                                    "endConversation": true
                                }
                            }
                        ]
                    }
                },
                {
                    "requirements" : null,
                    "text" : "No I've been here for ages",
                    "result" : {
                        "npcText" : "Ah, I see%%Well then, have a good day",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 85,
        "description" : "conversation with gatekeeper in skeleton dungeon",
        "result" : {
            "npcText" : "It's too dangerous to venture deeper into these caves, I'm afraid I can't let you pass",
            "endConversation" : true
        }
    },
    {
        "_id" : 86,
        "description" : "convo with wandering monk",
        "result" : {
            "npcText" : "You know how to create scrolls, right?",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Yep I already know",
                    "result" : {
                        "npcText" : "Don't you just carve them out of logs using a chisel?%%Then you can use them on a magical obelisk to enchant them!",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "No",
                    "result" : {
                        "npcText" : "Why, you just carve them out of logs using a chisel%%Then you can use them on a magical obelisk to enchant them!",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 87,
        "description" : "conversation with elder knight by ice mountain",
        "result" : {
            "npcText" : "Careful venturing any further, things get a bit dangerous beyond this point",
            "endConversation" : true
        }
    },
    {
        "_id" : 88,
        "description" : "conversation with man in celadon hotel",
        "result" : {
            "npcText" : "Huh? I never called for room service",
            "endConversation" : true
        }
    },
    {
        "_id" : 89,
        "description" : "conversation with Bartender (dragon slayer's inn)",
        "result" : {
            "npcText" : "Welcome to Beer Belly's Tavern%%Thirsty?",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "You bet I am",
                    "result" : {
                        "playerEventAction" : {
                            "type" : "StartShopping",
                            "shopId" : 26
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Sorry I'm trying to stay sober",
                    "result" : {
                        "npcText" : "Alright",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 90,
        "description" : "conversation with chef in beer belly's tavern second floor",
        "result" : {
            "npcText" : "Hey how'd you get back here? This area is for employees only",
            "endConversation" : true
        }
    },
    {
        "_id" : 91,
        "description" : "convo with greg",
        "result" : {
            "npcText" : "Care to check out my legwear?",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Lets see what you got",
                    "result" : {
                        "playerEventAction" : {
                            "type" : "StartShopping",
                            "shopId" : 27
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "No",
                    "result" : {
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 92,
        "description" : "convo with guv",
        "result" : {
            "npcText" : "Your fingers look like they could use some better protection%%Interested in buying or selling some gloves",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Sure lets trade",
                    "result" : {
                        "playerEventAction" : {
                            "type" : "StartShopping",
                            "shopId" : 28
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Not interested",
                    "result" : {
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 93,
        "description" : "convo with nate",
        "result" : {
            "npcText" : "I sell the best platebodies in all of HighSpell, want to trade?",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Sure lets trade",
                    "result" : {
                        "playerEventAction" : {
                            "type" : "StartShopping",
                            "shopId" : 29
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "I doubt yours are the best",
                    "fullText" : "I doubt your platebodies are truly the best",
                    "result" : {
                        "npcText" : "Why don't you see for yourself then",
                        "playerEventAction" : {
                            "type" : "StartShopping",
                            "shopId" : 29
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "No thanks",
                    "result" : {
                        "npcText" : "Well then have a good day",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 94,
        "description" : "convo with raab",
        "result" : {
            "npcText" : "Crabs!%%Get your crabs!",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "I'll buy some crabs",
                    "result" : {
                        "playerEventAction" : {
                            "type" : "StartShopping",
                            "shopId" : 30
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Will you buy mine instead",
                    "result" : {
                        "npcText" : "Of course%%I just love crabs",
                        "playerEventAction" : {
                            "type" : "StartShopping",
                            "shopId" : 30
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Sorry I don't like crabs",
                    "result" : {
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 95,
        "description" : "convo with rod",
        "result" : {
            "npcText" : "You look like someone whose interested in high quality fishing rods",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "I sure am",
                    "result" : {
                        "npcText" : "Great, let's trade",
                        "playerEventAction" : {
                            "type" : "StartShopping",
                            "shopId" : 31
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Wrong",
                    "fullText" : "Wrong I'm not interested",
                    "result" : {
                        "npcText" : "Very well then",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 96,
        "description" : "convo with jack",
        "result" : {
            "npcText" : "You look like a fellow lumberjack%%Interested in buying some hatchets?",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Yep",
                    "result" : {
                        "npcText" : "Great",
                        "playerEventAction" : {
                            "type" : "StartShopping",
                            "shopId" : 32
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "No chopping down trees is terrible",
                    "result" : {
                        "npcText" : "Then get out of my shop",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 97,
        "description" : "convo with arthur",
        "result" : {
            "npcText" : "Welcome to my store, care to browse my weaponry?",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Show me what you got",
                    "result" : {
                        "npcText" : "Sure thing",
                        "playerEventAction" : {
                            "type" : "StartShopping",
                            "shopId" : 33
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "No thanks",
                    "result" : {
                        "npcText" : "Well then come back any time",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 98,
        "description" : "convo with priest south of goblins",
        "result" : {
            "npcText" : "Welcome to this house of worship%%I am currently not giving a sermon right now, please come back later",
            "endConversation" : true
        }
    },
    {
        "_id" : 99,
        "description" : "convo with priest in celadon",
        "result" : {
            "npcText" : "Welcome to this house of worship%%I am currently not giving a sermon right now, please come back later",
            "endConversation" : true
        }
    },
    {
        "_id" : 100,
        "description" : "convo with link",
        "result" : {
            "npcText" : "Make sure you wear protection, that's what I always say%%Speaking of protection, would you like to trade some chainmail bodies?",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Sure I'd like to buy some",
                    "result" : {
                        "playerEventAction" : {
                            "type" : "StartShopping",
                            "shopId" : 34
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Can you buy mine?",
                    "result" : {
                        "npcText" : "Of course",
                        "playerEventAction" : {
                            "type" : "StartShopping",
                            "shopId" : 34
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "No thanks",
                    "result" : {
                        "npcText" : "Take care then",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 101,
        "description" : "convo with cindy",
        "result" : {
            "npcText" : "Hello%%Are you interested in buying or selling crafting supplies?",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Yeah let's trade",
                    "result" : {
                        "playerEventAction" : {
                            "type" : "StartShopping",
                            "shopId" : 35
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Nope",
                    "result" : {
                        "npcText" : "Goodbye then",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 102,
        "description" : "convo with master fisherman",
        "result" : {
            "npcText" : "Care to take a look at my wares?",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Sure let's see what you got",
                    "result" : {
                        "playerEventAction" : {
                            "type" : "StartShopping",
                            "shopId" : 36
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "No thanks",
                    "result" : {
                        "npcText" : "Goodbye then",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 103,
        "description" : "convo with captain henry (land)",
        "result" : {
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Nice boat",
                    "fullText" : "Thats a nice boat you've got there",
                    "result" : {
                        "npcText" : "Yep shes a beauty",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Can I go on a cruise",
                    "result" : {
                        "npcText" : "Nope",
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : [
                        {
                            "desc" : "player fishing skill >= 64",
                            "type" : "skill",
                            "skill" : "fishing",
                            "level" : 64,
                            "operator" : ">="
                        }
                    ],
                    "text" : "Where you headed?",
                    "result" : {
                        "npcText" : "I'm about to set sail for Driftwood Isle",
                        "options" : [
                            {
                                "requirements" : null,
                                "text" : "Good luck",
                                "result" : {
                                    "endConversation" : true
                                }
                            },
                            {
                                "requirements" : null,
                                "text" : "Can I come along?",
                                "result" : {
                                    "npcText" : "Hmm...%%I suppose there's room for one more",
                                    "options" : [
                                        {
                                            "requirements" : null,
                                            "text" : "Great, let's go",
                                            "result" : {
                                                "playerEventAction" : {
                                                    "desc" : "player teleports to Driftwood Isle",
                                                    "type" : "TeleportTo",
                                                    "location" : { "x" : -167, "y" : -474, "lvl" : 1 }
                                                },
                                                "endConversation" : true
                                            }
                                        },
                                        {
                                            "requirements" : null,
                                            "text" : "On second thought I'll stay here on land",
                                            "result" : {
                                                "npcText" : "Suit yourself",
                                                "endConversation" : true
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
            ]
        }
    },
    {
        "_id" : 104,
        "description" : "convo with captain henry (driftwood isle)",
        "result" : {
            "npcText" : "Ready to head back to land?",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Yes I'm ready to go back",
                    "result" : {
                        "playerEventAction" : {
                            "desc" : "player teleports to back to land",
                            "type" : "TeleportTo",
                            "location" : { "x" : -266, "y" : -406, "lvl" : 1 }
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Not yet",
                    "result" : {
                        "npcText" : "Very well",
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 105,
        "description" : "convo with traveling merchant",
        "result" : {
            "npcText" : "Care to trade?",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Ok",
                    "result" : {
                        "playerEventAction" : {
                            "type" : "StartShopping",
                            "shopId" : 37
                        },
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Not interested",
                    "result" : {
                        "endConversation" : true
                    }
                }
            ]
        }
    },
    {
        "_id" : 106,
        "description" : "convo with undercroft wondering monk",
        "result" : {
            "npcText" : "Are you here to make your way through the Undercroft passages?",
            "options" : [
                {
                    "requirements" : null,
                    "text" : "Yes",
                    "result" : {
                        "npcText" : "I wish you a safe passage",
                        "options": [
                            {
                                "requirements" : null,
                                "text" : "Thanks",
                                "result" : {
                                    "endConversation" : true
                                }
                            },
                            {
                                "requirements" : null,
                                "text" : "Why? Is it dangerous in here?",
                                "result" : {
                                    "npcText" : "Don't you know?%%There are dangerous creatures lurking in here, and the only way to continue on deeper is to defeat them%%There are escape passages scattered about, as well as undtold treasures to be found...",
                                    "options": [
                                        {
                                            "requirements" : null,
                                            "text" : "Sounds like my kind of adventure",
                                            "result" : {
                                                "npcText" : "However I must warn you%%Once you enter, you may not be able to escape alive...",
                                                "endConversation" : true
                                            }
                                        },
                                        {
                                            "requirements" : null,
                                            "text" : "I'll be very careful",
                                            "result" : {
                                                "npcText" : "Very well...",
                                                "endConversation" : true
                                            }
                                        },
                                        {
                                            "requirements" : null,
                                            "text" : "Dangerous creatures?",
                                            "result" : {
                                                "npcText" : "Yes, and some are said to be quite strong...%%Or so the rumours go", 
                                                "endConversation" : true
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                },
                {
                    "requirements" : null,
                    "text" : "No",
                    "result" : {
                        "endConversation" : true
                    }
                },
                {
                    "requirements" : null,
                    "text" : "Undercroft?",
                    "result" : {
                        "npcText" : "Yes, you are at the entrance of the Undercroft%%There are dangerous creatures lurking in here, and the only way to continue on deeper is to defeat them%%There are escape passages scattered about, as well as undtold treasures to be found...",
                        "options" : [
                            {
                                "requirements" : null,
                                "text" : "Oh I like treasure",
                                "result" : {
                                    "npcText" : "Of course...%%And it is said, the deeper you venture, the better the reward...",
                                    "endConversation" : true
                                }
                            },
                            {
                                "requirements" : null,
                                "text" : "I'll be very careful",
                                "result" : {
                                    "npcText" : "Very well...",
                                    "endConversation" : true
                                }
                            },
                            {
                                "requirements" : null,
                                "text" : "Dangerous creatures?",
                                "result" : {
                                    "npcText" : "Yes, and some are said to be quite strong...%%Or so the rumours go", 
                                    "endConversation" : true
                                }
                            }
                        ]
                    }
                }
            ]
        }
    },
    {
        "_id" : 107,
        "description" : "Martial Artist (non-aggressive)",
        "result" : {
            "npcText" : "...",
            "endConversation" : true
        }
    }
]