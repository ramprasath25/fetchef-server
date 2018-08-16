
var request = require('request');
var async = require('async');
const config = require('../config');
const user_settingsColl = config.db.collection('user_settings');
const user_inventoryColl = config.db.collection('user_inventory');

exports.getRecipeList = function (userId, callback) {
    let requestURI = '';
    let response = '';
    /* let data = {} */
    let data = {
        "results": [
            {
                "id": 199004,
                "title": "Curd Rice (Indian Rice with Yogurt)",
                "readyInMinutes": 30,
                "servings": 4,
                "image": "Curd-Rice-(Indian-Rice-with-Yogurt)-199004.jpg",
                "imageUrls": [
                    "Curd-Rice-(Indian-Rice-with-Yogurt)-199004.jpg"
                ]
            },
            {
                "id": 199004,
                "title": "Curd Rice (Indian Rice with Yogurt)",
                "readyInMinutes": 30,
                "servings": 4,
                "image": "Curd-Rice-(Indian-Rice-with-Yogurt)-199004.jpg",
                "imageUrls": [
                    "Curd-Rice-(Indian-Rice-with-Yogurt)-199004.jpg"
                ]
            }
        ],
        "baseUri": "https://spoonacular.com/recipeImages/",
        "offset": 0,
        "number": 10,
        "totalResults": 1231,
        "processingTimeMs": 386,
        "expires": 1533844239225,
        "isStale": false
    }
    async.series([
        function (callback) {
            getCusine(userId, (data) => {
                requestURI += `cuisine=${data}&`
                callback(false);
            })
        },
        function (callback) {
            getExclude(userId, (data) => {
                requestURI += `excludeIngredients=${data}&`
                callback(false);
            })
        },
        function (callback) {
            getIntolerances(userId, (data) => {
                requestURI += `intolerances=${data}&`
                callback(false);
            })
        },
        function (callback) {
            getDiet(userId, (data) => {
                requestURI += `diet=${data}&`
                callback(false);
            })
        },
        function (callback) {
            getIngredients(userId, (data) => {
                requestURI += `includeIngredients=${data}&`
                callback(false);
            })
        },
        function (callback) {
            let url = `https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/search?`
            url += requestURI;
            url += `&limitLicense=false&offset=0&number=10&offset=0&type=main+course&includeNutrition=true`;

            const option = {
                method: 'GET',
                url: url,
                headers: {
                    // WHrGmjkdcGmshWqr2S8I1SjPSHvXp1rBNqrjsnI3EnRNE0EENx
                    'X-Mashape-Key': 'xxxx',
                    'Accept': 'application/json'
                }
            }
            request(option, (error, response, body) => {
                if (error)
                    callback(true);
                else
                    response = data;
                callback(false)
            });
        }
    ], (err) => {
        if (err)
            callback(true, 'Error please try later');
        else
            callback(false, data);
    });
}
const getCusine = function (userId, callback) {
    user_settingsColl.findOne({ userId: userId, type: 'Cusine' }, { _id: 0, data: 1 }, (err, result) => {
        callback(Object.keys(result.data).toString());
    });
}
const getExclude = function (userId, callback) {
    user_settingsColl.findOne({ userId: userId, type: 'Exclude' }, { _id: 0, data: 1 }, (err, result) => {
        let exclude = [];
        result.data.map((item) => {
            exclude.push(item.value)
        });
        // Convert Array into string and encode into URI
        callback(encodeURIComponent(exclude.toString()));
    });
}
const getIntolerances = function (userId, callback) {
    user_settingsColl.findOne({ userId: userId, type: 'Intolerance' }, { _id: 0, data: 1 }, (err, result) => {
        callback(Object.keys(result.data).toString());
    });
}
const getDiet = function (userId, callback) {
    user_settingsColl.findOne({ userId: userId, type: 'Diet' }, { _id: 0, data: 1 }, (err, result) => {
        callback(encodeURIComponent(result.data.diet.replace('_', ' ')));
    });
}
/* Getting User Inventory List */
const getIngredients = function (userId, callback) {
    user_inventoryColl.find({ userId: userId }, { _id: 0, inventoryName: 1 }, (err, result) => {
        let ingredients = [];
        result.map((item) => {
            ingredients.push(item.inventoryName)
        });
        // Convert Array into string and encode into URI
        callback(encodeURIComponent(ingredients.toString()));
    });
}
/* Get Recipe Details */
exports.getRecipeDetails = function (recipeId, callback) {
    let data = {
        "vegetarian": true,
        "vegan": false,
        "glutenFree": true,
        "dairyFree": false,
        "veryHealthy": false,
        "cheap": false,
        "veryPopular": false,
        "sustainable": false,
        "weightWatcherSmartPoints": 22,
        "gaps": "no",
        "lowFodmap": false,
        "ketogenic": false,
        "whole30": false,
        "sourceUrl": "http://www.seriouseats.com/recipes/2010/12/curd-rice-indian-rice-with-yogurt.html",
        "spoonacularSourceUrl": "https://spoonacular.com/curd-rice-indian-rice-with-yogurt-199004",
        "aggregateLikes": 2,
        "spoonacularScore": 71.0,
        "healthScore": 26.0,
        "creditText": "SeriousEats",
        "sourceName": "Serious Eats",
        "pricePerServing": 285.02,
        "extendedIngredients": [
            {
                "id": 1032035,
                "aisle": "Spices and Seasonings",
                "image": "curry-powder.jpg",
                "consitency": "solid",
                "name": "asafoetida",
                "original": "1/2 teaspoon asafoetida (start with 1/4 teaspoon if you're less of a fan)",
                "originalString": "1/2 teaspoon asafoetida (start with 1/4 teaspoon if you're less of a fan)",
                "originalName": null,
                "amount": 0.5,
                "unit": "teaspoon",
                "meta": [
                    "with 1/4 teaspoon if you're less of a fan)"
                ],
                "metaInformation": [
                    "with 1/4 teaspoon if you're less of a fan)"
                ],
                "measures": {
                    "us": {
                        "amount": 0.5,
                        "unitShort": "tsps",
                        "unitLong": "teaspoons"
                    },
                    "metric": {
                        "amount": 0.5,
                        "unitShort": "tsps",
                        "unitLong": "teaspoons"
                    }
                }
            },
            {
                "id": 11819,
                "aisle": "Produce",
                "image": "red-chili.jpg",
                "consitency": "solid",
                "name": "chiles",
                "original": "10 curd chiles",
                "originalString": "10 curd chiles",
                "originalName": null,
                "amount": 10.0,
                "unit": "",
                "meta": [

                ],
                "metaInformation": [

                ],
                "measures": {
                    "us": {
                        "amount": 10.0,
                        "unitShort": "",
                        "unitLong": ""
                    },
                    "metric": {
                        "amount": 10.0,
                        "unitShort": "",
                        "unitLong": ""
                    }
                }
            },
            {
                "id": 11165,
                "aisle": "Produce",
                "image": "cilantro.png",
                "consitency": "solid",
                "name": "cilantro",
                "original": "Cilantro, for garnish",
                "originalString": "Cilantro, for garnish",
                "originalName": null,
                "amount": 4.0,
                "unit": "servings",
                "meta": [
                    "for garnish"
                ],
                "metaInformation": [
                    "for garnish"
                ],
                "measures": {
                    "us": {
                        "amount": 4.0,
                        "unitShort": "servings",
                        "unitLong": "servings"
                    },
                    "metric": {
                        "amount": 4.0,
                        "unitShort": "servings",
                        "unitLong": "servings"
                    }
                }
            },
            {
                "id": 2014,
                "aisle": "Spices and Seasonings",
                "image": "ground-cumin.jpg",
                "consitency": "solid",
                "name": "cumin seed",
                "original": "1 teaspoon whole cumin seed",
                "originalString": "1 teaspoon whole cumin seed",
                "originalName": null,
                "amount": 1.0,
                "unit": "teaspoon",
                "meta": [
                    "whole"
                ],
                "metaInformation": [
                    "whole"
                ],
                "measures": {
                    "us": {
                        "amount": 1.0,
                        "unitShort": "tsp",
                        "unitLong": "teaspoon"
                    },
                    "metric": {
                        "amount": 1.0,
                        "unitShort": "tsp",
                        "unitLong": "teaspoon"
                    }
                }
            },
            {
                "id": 93604,
                "aisle": "Ethnic Foods",
                "image": "curry-leaves.jpg",
                "consitency": "solid",
                "name": "curry leaves",
                "original": "8 curry leaves",
                "originalString": "8 curry leaves",
                "originalName": null,
                "amount": 8.0,
                "unit": "",
                "meta": [

                ],
                "metaInformation": [

                ],
                "measures": {
                    "us": {
                        "amount": 8.0,
                        "unitShort": "",
                        "unitLong": ""
                    },
                    "metric": {
                        "amount": 8.0,
                        "unitShort": "",
                        "unitLong": ""
                    }
                }
            },
            {
                "id": 10220444,
                "aisle": "Pasta and Rice",
                "image": "rice-white-long-grain-or-basmatii-cooked.jpg",
                "consitency": "solid",
                "name": "long grain rice",
                "original": "1 1/2 cups long grain rice",
                "originalString": "1 1/2 cups long grain rice",
                "originalName": null,
                "amount": 1.5,
                "unit": "cups",
                "meta": [
                    "long grain"
                ],
                "metaInformation": [
                    "long grain"
                ],
                "measures": {
                    "us": {
                        "amount": 1.5,
                        "unitShort": "cups",
                        "unitLong": "cups"
                    },
                    "metric": {
                        "amount": 354.882,
                        "unitShort": "g",
                        "unitLong": "grams"
                    }
                }
            },
            {
                "id": 2024,
                "aisle": "Spices and Seasonings",
                "image": "mustard-seeds.jpg",
                "consitency": "solid",
                "name": "mustard seed",
                "original": "1 tablespoon whole mustard seed",
                "originalString": "1 tablespoon whole mustard seed",
                "originalName": null,
                "amount": 1.0,
                "unit": "tablespoon",
                "meta": [
                    "whole"
                ],
                "metaInformation": [
                    "whole"
                ],
                "measures": {
                    "us": {
                        "amount": 1.0,
                        "unitShort": "Tbsp",
                        "unitLong": "Tbsp"
                    },
                    "metric": {
                        "amount": 1.0,
                        "unitShort": "Tbsp",
                        "unitLong": "Tbsp"
                    }
                }
            },
            {
                "id": 9286,
                "aisle": "Produce",
                "image": "pomegranate-seeds.jpg",
                "consitency": "solid",
                "name": "pomegranate seeds",
                "original": "1 cup pomegranate seeds, fresh or dried",
                "originalString": "1 cup pomegranate seeds, fresh or dried",
                "originalName": null,
                "amount": 1.0,
                "unit": "cup",
                "meta": [
                    "fresh"
                ],
                "metaInformation": [
                    "fresh"
                ],
                "measures": {
                    "us": {
                        "amount": 1.0,
                        "unitShort": "cup",
                        "unitLong": "cup"
                    },
                    "metric": {
                        "amount": 236.588,
                        "unitShort": "g",
                        "unitLong": "grams"
                    }
                }
            },
            {
                "id": 2047,
                "aisle": "Spices and Seasonings",
                "image": "salt.jpg",
                "consitency": "solid",
                "name": "salt",
                "original": "Salt",
                "originalString": "Salt",
                "originalName": null,
                "amount": 4.0,
                "unit": "servings",
                "meta": [

                ],
                "metaInformation": [

                ],
                "measures": {
                    "us": {
                        "amount": 4.0,
                        "unitShort": "servings",
                        "unitLong": "servings"
                    },
                    "metric": {
                        "amount": 4.0,
                        "unitShort": "servings",
                        "unitLong": "servings"
                    }
                }
            },
            {
                "id": 1256,
                "aisle": "Milk, Eggs, Other Dairy",
                "image": "white-cream.jpg",
                "consitency": "liquid",
                "name": "strained yogurt",
                "original": "2 cups thick strained yogurt, preferably at room temperature",
                "originalString": "2 cups thick strained yogurt, preferably at room temperature",
                "originalName": null,
                "amount": 2.0,
                "unit": "cups",
                "meta": [
                    "thick",
                    "at room temperature"
                ],
                "metaInformation": [
                    "thick",
                    "at room temperature"
                ],
                "measures": {
                    "us": {
                        "amount": 2.0,
                        "unitShort": "cups",
                        "unitLong": "cups"
                    },
                    "metric": {
                        "amount": 473.176,
                        "unitShort": "g",
                        "unitLong": "grams"
                    }
                }
            },
            {
                "id": 1145,
                "aisle": "Milk, Eggs, Other Dairy",
                "image": "butter-sliced.jpg",
                "consitency": "solid",
                "name": "unsalted butter",
                "original": "4 tablespoons unsalted butter",
                "originalString": "4 tablespoons unsalted butter",
                "originalName": null,
                "amount": 4.0,
                "unit": "tablespoons",
                "meta": [
                    "unsalted"
                ],
                "metaInformation": [
                    "unsalted"
                ],
                "measures": {
                    "us": {
                        "amount": 4.0,
                        "unitShort": "Tbsps",
                        "unitLong": "Tbsps"
                    },
                    "metric": {
                        "amount": 4.0,
                        "unitShort": "Tbsps",
                        "unitLong": "Tbsps"
                    }
                }
            },
            {
                "id": 4513,
                "aisle": "Oil, Vinegar, Salad Dressing",
                "image": "vegetable-oil.jpg",
                "consitency": "liquid",
                "name": "vegetable oil",
                "original": "Vegetable oil",
                "originalString": "Vegetable oil",
                "originalName": null,
                "amount": 4.0,
                "unit": "servings",
                "meta": [

                ],
                "metaInformation": [

                ],
                "measures": {
                    "us": {
                        "amount": 4.0,
                        "unitShort": "servings",
                        "unitLong": "servings"
                    },
                    "metric": {
                        "amount": 4.0,
                        "unitShort": "servings",
                        "unitLong": "servings"
                    }
                }
            }
        ],
        "id": 199004,
        "title": "Curd Rice (Indian Rice with Yogurt)",
        "readyInMinutes": 30,
        "servings": 4,
        "image": "https://spoonacular.com/recipeImages/199004-556x370.jpg",
        "imageType": "jpg",
        "cuisines": [
            "asian",
            "indian"
        ],
        "dishTypes": [
            "lunch",
            "main course",
            "main dish",
            "dinner"
        ],
        "diets": [
            "gluten free",
            "lacto ovo vegetarian"
        ],
        "occasions": [

        ],
        "winePairing": {
            "pairedWines": [
                "gruener veltliner",
                "riesling",
                "sparkling rose"
            ],
            "pairingText": "Gruener Veltliner, Riesling, and Sparkling rosé are my top picks for Indian. The best wine for Indian food will depending onthe dish, of course, but these picks can be served chilled and have some sweetness to complement the spiciness and complex flavors of a wide variety of traditional dishes. You could try Laurenz V Singing Gruner Veltliner. Reviewers quite like it with a 4.4 out of 5 star rating and a price of about 16 dollars per bottle.",
            "productMatches": [
                {
                    "id": 434576,
                    "title": "Laurenz V Singing Gruner Veltliner",
                    "description": "A very attractive fruit bouquet yields apple, peach and citrus aromas along with a typical Veltliner spiciness and a touch of white pepper. The soft and juicy palate is supported by fine acidity. It sings on the palate!",
                    "price": "$16.49",
                    "imageUrl": "https://spoonacular.com/productImages/434576-312x231.jpg",
                    "averageRating": 0.8800000000000001,
                    "ratingCount": 5.0,
                    "score": 0.8175000000000001,
                    "link": "https://click.linksynergy.com/deeplink?id=*QCiIS6t4gA&mid=2025&murl=https%3A%2F%2Fwww.wine.com%2Fproduct%2Flaurenz-v-singing-gruner-veltliner-2007%2F99150"
                }
            ]
        },
        "instructions": "Procedures                                                           1                                                                            In large saucepan or rice cooker, combine rice, butter, 3 cups water, and 1 teaspoon salt. Cover and bring to boil, then reduce to a simmer and cook until rice is tender, about 20 minutes.                                                                                                              2                  While rice is cooking, heat oil over high heat in slope-sided pan (if you have a wok, use it; if not, use small saucepan), just enough to coat bottom by 1/2 inch. When oil shimmers, add curd chiles. Toss continually until golden brown, 15-30 seconds. Set aside to drain.                                                                          3                                                                            Discard all but two tablespoons oil and return to heat. When oil shimmers, add mustard seeds and stir to coat in oil. When seeds begin to pop, add asafoetida, cumin, and curry leaves. Fry until aromatic, about 10 seconds, then remove from heat.             4                                                                            If using wok, add cooked rice to spice oil and mix to combine. Otherwise pour and mix spice oil into pot of cooked rice. Stir in yogurt and add salt to taste. Serve in small bowls with pomegranate seeds, cilantro sprigs, and a couple curd chiles to garnish.",
        "analyzedInstructions": [
            {
                "name": "",
                "steps": [
                    {
                        "number": 1,
                        "step": "1",
                        "ingredients": [

                        ],
                        "equipment": [

                        ]
                    },
                    {
                        "number": 2,
                        "step": "In large saucepan or rice cooker, combine rice, butter, 3 cups water, and 1 teaspoon salt. Cover and bring to boil, then reduce to a simmer and cook until rice is tender, about 20 minutes.",
                        "ingredients": [
                            {
                                "id": 20444,
                                "name": "rice",
                                "image": "rice-white-uncooked.jpg"
                            },
                            {
                                "id": 2047,
                                "name": "salt",
                                "image": "salt.jpg"
                            }
                        ],
                        "equipment": [
                            {
                                "id": 404662,
                                "name": "rice cooker",
                                "image": "rice-cooker.jpg"
                            },
                            {
                                "id": 404669,
                                "name": "sauce pan",
                                "image": "sauce-pan.jpg"
                            }
                        ],
                        "length": {
                            "number": 20,
                            "unit": "minutes"
                        }
                    },
                    {
                        "number": 3,
                        "step": "2",
                        "ingredients": [

                        ],
                        "equipment": [

                        ]
                    },
                    {
                        "number": 4,
                        "step": "While rice is cooking, heat oil over high heat in slope-sided pan (if you have a wok, use it; if not, use small saucepan), just enough to coat bottom by1/2 inch. When oil shimmers, add curd chiles. Toss continually until golden brown, 15-30 seconds. Set aside to drain.",
                        "ingredients": [
                            {
                                "id": 11819,
                                "name": "chili pepper",
                                "image": "red-chili.jpg"
                            },
                            {
                                "id": 20444,
                                "name": "rice",
                                "image": "rice-white-uncooked.jpg"
                            }
                        ],
                        "equipment": [
                            {
                                "id": 404669,
                                "name": "sauce pan",
                                "image": "sauce-pan.jpg"
                            },
                            {
                                "id": 404645,
                                "name": "frying pan",
                                "image": "pan.png"
                            },
                            {
                                "id": 404666,
                                "name": "wok",
                                "image": "wok.png"
                            }
                        ]
                    },
                    {
                        "number": 5,
                        "step": "3",
                        "ingredients": [

                        ],
                        "equipment": [

                        ]
                    },
                    {
                        "number": 6,
                        "step": "Discard all but two tablespoons oil and return to heat. When oil shimmers, add mustard seeds and stir to coat in oil. When seeds begin to pop, add asafoetida, cumin, and curryleaves. Fry until aromatic, about 10 seconds, then remove from heat.",
                        "ingredients": [
                            {
                                "id": 2024,
                                "name": "mustard seeds",
                                "image": "mustard-seeds.jpg"
                            },
                            {
                                "id": 93604,
                                "name": "curry leaves",
                                "image": "curry-leaves.jpg"
                            },
                            {
                                "id": 1032035,
                                "name": "asafoetida",
                                "image": "curry-powder.jpg"
                            },
                            {
                                "id": 1002014,
                                "name": "cumin",
                                "image": "ground-cumin.jpg"
                            }
                        ],
                        "equipment": [

                        ]
                    },
                    {
                        "number": 7,
                        "step": "4",
                        "ingredients": [

                        ],
                        "equipment": [

                        ]
                    },
                    {
                        "number": 8,
                        "step": "If using wok, add cooked rice to spice oil and mix to combine. Otherwise pour and mix spice oil into pot of cooked rice. Stir in yogurt and add salt to taste.",
                        "ingredients": [
                            {
                                "id": 2047,
                                "name": "salt",
                                "image": "salt.jpg"
                            }
                        ],
                        "equipment": [
                            {
                                "id": 404752,
                                "name": "pot",
                                "image": "stock-pot.jpg"
                            },
                            {
                                "id": 404666,
                                "name": "wok",
                                "image": "wok.png"
                            }
                        ]
                    },
                    {
                        "number": 9,
                        "step": "Serve in small bowls with pomegranate seeds, cilantro sprigs, and a couple curd chiles to garnish.",
                        "ingredients": [
                            {
                                "id": 9286,
                                "name": "pomegranate seeds",
                                "image": "pomegranate-seeds.jpg"
                            },
                            {
                                "id": 11165,
                                "name": "cilantro",
                                "image": "cilantro.png"
                            },
                            {
                                "id": 11819,
                                "name": "chili pepper",
                                "image": "red-chili.jpg"
                            }
                        ],
                        "equipment": [
                            {
                                "id": 404783,
                                "name": "bowl",
                                "image": "bowl.jpg"
                            }
                        ]
                    }
                ]
            }
        ],
        "creditsText": "Serious Eats"
    }
    let url = `https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/${recipeId}/information?includeNutrition=false`
    const option = {
        method: 'GET',
        url: url,
        headers: {
            // WHrGmjkdcGmshWqr2S8I1SjPSHvXp1rBNqrjsnI3EnRNE0EENx
            'X-Mashape-Key': 'xxxx',
            'Accept': 'application/json'
        }
    }
    request(option, (error, response, body) => {
        if (error)
            callback(true, 'Error, please try later');
        else
            callback(false, data);
    });
}