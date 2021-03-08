const mealsEl = document.getElementById('meals');
const favoriteContainer = document.getElementById('fav-meals');

const mealPopup = document.getElementById('meal-popup');
const mealInfoEl = document.getElementById('meal-info');
const popupCloseBtns = document.getElementById('close-popup');

const searchTerm = document.getElementById('search-term');
const searchBtn = document.getElementById('search');


getRandomMeal();
fetchFavMeals();

async function getRandomMeal() {
    const resp = await fetch(
        'https://www.themealdb.com/api/json/v1/1/random.php'
    );
    
    const respData = await resp.json();
    const randomMeal = respData.meals[0];

    addMeal(randomMeal, true);
}

async function getMealById(id) {
    const resp = await fetch(
        'https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + id
    );

    const respData = await resp.json();
    const meal = respData.meals[0];

    return meal;
}

async function getMealsBySearch(term) {
    const resp = await fetch(
        'https://www.themealdb.com/api/json/v1/1/search.php?s=' + term
    );

    const respData = await resp.json();
    const meals = respData.meals;

    return meals;
}

function addMeal(mealData, random = false) {
    const meal = document.createElement('div');
    meal.classList.add('meal');

    meal.innerHTML = `
                    <div class="meal-header openInfo">
                        ${random ? `<span class="random">Random Recipe</span>` : ''}
                        <img
                            src="${mealData.strMealThumb}"
                            alt="${mealData.strMeal}"
                        />
                    </div>
                    <div class="meal-body">
                        <h4 class="openInfo">${mealData.strMeal}</h4>
                        <button id="${mealData.idMeal}" class="fav-btn">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
    `;

    const mealsFav_Arr = JSON.parse(localStorage.mealIds);
    mealsFav_Arr === null ? [] : mealsFav_Arr;

    const mealsFavBtn = meal.querySelectorAll('.fav-btn');
    const lastFavChild = mealsFavBtn[mealsFavBtn.length-1];
    
    for (let i=0; i<mealsFav_Arr.length; i++) {
        if (mealsFav_Arr[i] === mealData.idMeal) {
            lastFavChild.classList.add('active');
        }
    }

    // toggle fav-btn
    const btn = meal.querySelector('.meal-body .fav-btn');
    btn.addEventListener('click', () => {
        if (btn.classList.contains('active')) {
            removeMealLS(mealData.idMeal);
            btn.classList.remove('active');
        } else {
            addMealLS(mealData.idMeal);
            btn.classList.add('active');
        }

        fetchFavMeals();
    });

    // showMealInfo by clicking on img or title
    const openInfo = meal.querySelectorAll('.openInfo');
    for(let i=0; i<2; i++) {
        openInfo[i].addEventListener('click', () => {
            showMealInfo(mealData);
        });
    }


    mealsEl.appendChild(meal);
}

function addMealLS(mealId) {
    const mealIds = getMealsLS();

    localStorage.setItem(
        'mealIds',
        JSON.stringify([...mealIds, mealId])
    );
}

function removeMealLS(mealId) {
    const mealIds = getMealsLS();

    localStorage.setItem(
        'mealIds',
        JSON.stringify(mealIds.filter((id) => id !== mealId))
    );
}

function getMealsLS() {
    const mealIds = JSON.parse(localStorage.getItem('mealIds'));

    return mealIds === null ? [] : mealIds;
}

async function fetchFavMeals() {
    // clean the container
    favoriteContainer.innerHTML = '';

    const mealIds = getMealsLS();

    for (let i = 0; i < mealIds.length; i++) {
        const mealId = mealIds[i];
        meal = await getMealById(mealId);

        addMealFav(meal);
    }
}

function addMealFav(mealData) {
    const favMeal = document.createElement('li');

    favMeal.innerHTML = `
        <img class="openInfo"
            src="${mealData.strMealThumb}"
            alt="${mealData.strMeal}"
        >
        <span>${mealData.strMeal}</span>
        <button id="${mealData.idMeal}" class="clear"><i class="fas fa-window-close"></i></button>
    `;

    const btn = favMeal.querySelector('.clear');
    const openInfo = favMeal.querySelector('.openInfo');

    btn.addEventListener('click', () => {
        const mealsFav_Arr = JSON.parse(localStorage.mealIds);
        mealsFav_Arr === null ? [] : mealsFav_Arr;

        const mealsFavBtn = document.querySelectorAll('.fav-btn');
        
        // remove fav.activated from search-list
        for (let i=0; i<mealsFav_Arr.length; i++) {
            for (let j=0; j<mealsFavBtn.length; j++) {
                if (mealData.idMeal === mealsFavBtn[j].getAttribute('id')) {
                    mealsFavBtn[j].classList.remove('active');
                }
            }
        }

        removeMealLS(mealData.idMeal);

        fetchFavMeals();
    });

    openInfo.addEventListener('click', () => {
        showMealInfo(mealData);
    });

    favoriteContainer.appendChild(favMeal);
}

function showMealInfo(mealData) {
    // clean it up
    mealInfoEl.innerHTML = '';

    // update the meal info
    const mealEl = document.createElement('div');

    
    const ingredients = [];
    // get ingredients and measures
    for (let i=1; i<=20; i++) {
        if(mealData['strIngredient'+i]) {
            ingredients.push(`${mealData['strIngredient'+i]} - ${mealData['strMeasure'+i]}`);
        } else {
            break;
        }
    }

    mealEl.innerHTML = `  
        <h1>${mealData.strMeal}</h1>
        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
        <p>${mealData.strInstructions}</p>
        <h3>Ingredients:</h3>
        <ul>
            ${ingredients.map(
                ing => `
            <li>${ing}</li>
            `
            )
            .join('')}
        </ul>
    `;

    mealInfoEl.appendChild(mealEl);

    // show the popup
    mealPopup.classList.remove('hidden');
}

searchBtn.addEventListener('click', async () => {
    // clean container
    mealsEl.innerHTML = '';

    const search = searchTerm.value;

    const meals = await getMealsBySearch(search);

    if (meals) {
        meals.forEach((meal) => {
            addMeal(meal);
        });
    } 
});

searchTerm.addEventListener('keyup', async (event) => {
    if (event.keyCode === 13) {
    // clean container
    mealsEl.innerHTML = '';

    const search = searchTerm.value;

    const meals = await getMealsBySearch(search);

    if (meals) {
        meals.forEach((meal) => {
            addMeal(meal);
        });
    }
    }
});

popupCloseBtns.addEventListener('click', () => {
    mealPopup.classList.add('hidden');
});
