const get_meal_btn = document.getElementById("get_meal");
const meal_container = document.getElementById("meal");
const ingredient_search_btn = document.getElementById("search_ingredient_btn");
const ingredient_search_input = document.getElementById("ingredient_search");
const dark_mode_toggle = document.getElementById("toggle_dark_mode");
const loading = document.getElementById("loading");

const apiUrl = "https://www.themealdb.com/api/json/v1/1";

let darkMode = false;

// Function to toggle dark mode
const toggleDarkMode = () => {
  darkMode = !darkMode;
  document.body.classList.toggle("dark-mode", darkMode);
};

// Function to display loading spinner
const showLoading = () => {
  loading.style.display = 'block';
};

// Function to hide loading spinner
const hideLoading = () => {
  loading.style.display = 'none';
};

// Function to fetch a random meal
const fetchRandomMeal = () => {
  showLoading();
  fetch(`${apiUrl}/random.php`)
    .then(res => res.json())
    .then(res => {
      hideLoading();
      createMeal(res.meals[0]);
      addToMealHistory(res.meals[0]);
    })
    .catch(e => {
      hideLoading();
      console.warn(e);
    });
};

// Function to search meals by ingredient
const searchByIngredient = () => {
  const ingredient = ingredient_search_input.value.trim();
  if (ingredient) {
    showLoading();
    fetch(`${apiUrl}/filter.php?i=${ingredient}`)
      .then(res => res.json())
      .then(res => {
        hideLoading();
        if (res.meals) {
          createMeal(res.meals[0]); // Show the first meal or handle multiple results
          addToMealHistory(res.meals[0]);
        } else {
          meal_container.innerHTML = "<p>No meals found with that ingredient.</p>";
        }
      })
      .catch(e => {
        hideLoading();
        console.warn(e);
      });
  }
};

// Function to create meal HTML
const createMeal = meal => {
  const ingredients = [];
  // Mock nutritional facts
  const nutritionalFacts = {
    calories: "500",
    protein: "25g",
    fat: "20g",
    carbs: "60g",
  };

  // Get all ingredients from the object. Up to 20
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      // Stop if no more ingredients
      break;
    }
  }

  // Adjust servings
  const servings = meal.strServings || 1;

  const newInnerHTML = `
    <div class="row">
      <div class="columns five">
        <img src="${meal.strMealThumb}" alt="Meal Image">
        ${meal.strCategory ? `<p><strong>Category:</strong> ${meal.strCategory}</p>` : ""}
        ${meal.strArea ? `<p><strong>Area:</strong> ${meal.strArea}</p>` : ""}
        ${meal.strTags ? `<p><strong>Tags:</strong> ${meal.strTags.split(",").join(", ")}</p>` : ""}
        <h5>Ingredients:</h5>
        <ul>
          ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join("")}
        </ul>
        <h5>Nutritional Facts:</h5>
        <p><strong>Calories:</strong> ${nutritionalFacts.calories}</p>
        <p><strong>Protein:</strong> ${nutritionalFacts.protein}</p>
        <p><strong>Fat:</strong> ${nutritionalFacts.fat}</p>
        <p><strong>Carbs:</strong> ${nutritionalFacts.carbs}</p>
      </div>
      <div class="columns seven">
        <h4>${meal.strMeal}</h4>
        <p>${meal.strInstructions}</p>
      </div>
    </div>
    ${meal.strYoutube ? `
    <div class="row">
      <h5>Video Recipe</h5>
      <div class="videoWrapper">
        <iframe width="420" height="315" src="https://www.youtube.com/embed/${meal.strYoutube.slice(-11)}"></iframe>
      </div>
    </div>` : ""}
  `;
  
  meal_container.innerHTML = newInnerHTML;
};

// Function to add meal to history
const addToMealHistory = meal => {
  const mealHistory = document.getElementById("meal_history");
  const listItem = document.createElement("li");
  listItem.innerHTML = `<a href="#" onclick="viewMeal('${meal.idMeal}')">${meal.strMeal}</a>`;
  mealHistory.appendChild(listItem);
};

// Function to view a meal from history
const viewMeal = idMeal => {
  showLoading();
  fetch(`${apiUrl}/lookup.php?i=${idMeal}`)
    .then(res => res.json())
    .then(res => {
      hideLoading();
      createMeal(res.meals[0]);
    })
    .catch(e => {
      hideLoading();
      console.warn(e);
    });
};

// Event listeners
get_meal_btn.addEventListener("click", fetchRandomMeal);
ingredient_search_btn.addEventListener("click", searchByIngredient);
dark_mode_toggle.addEventListener("click", toggleDarkMode);

// Initial setup
toggleDarkMode(); // Set dark mode based on preference
