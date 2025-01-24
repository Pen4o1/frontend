import React, { useState, useEffect } from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonItem,
  IonLabel,
  IonLoading,
  IonAccordion,
  IonAccordionGroup,
  IonFooter,
} from '@ionic/react';

interface MealPlanPopupProps {
  isOpen: boolean;
  onDismiss: () => void;
}

interface Recipe {
  recipe_name: string;
  recipe_description: string;
  recipe_ingredients: { ingredient: string[] };
  recipe_nutrition: { calories: string };
}

interface CombinedMeal {
  combined_recipes: Recipe[];
  total_calories: number;
}

type Meal = Recipe | CombinedMeal;

const MealPlanPopup: React.FC<MealPlanPopupProps> = ({ isOpen, onDismiss }) => {
  const [mealPlan, setMealPlan] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchMealPlan();
    }
  }, [isOpen]);

  const fetchMealPlan = async () => {
    const token = localStorage.getItem('jwt_token');
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const response = await fetch(
        'https://grown-evidently-chimp.ngrok-free.app/api/get/meal/plan',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch meal plan.');
      }

      const data = await response.json();
      setMealPlan(data.meal_plan);
    } catch (error) {
      console.error('Error fetching meal plan:', error);
      setErrorMessage('Unable to load your meal plan. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderMeal = (meal: Meal, index: number) => {
    if ('combined_recipes' in meal) {
      // Render combined recipes
      return (
        <IonAccordion key={index}>
          <IonItem slot="header">
            <IonLabel>Meal {index + 1}: Combined Meal</IonLabel>
          </IonItem>
          <div slot="content">
            <p>Total Calories: {meal.total_calories} kcal</p>
            {meal.combined_recipes.map((recipe, i) => (
              <div key={i} style={{ marginBottom: '10px' }}>
                <h3>
                  Recipe {i + 1}: {recipe.recipe_name}
                </h3>
                <p>{recipe.recipe_description}</p>
                <p>Calories: {recipe.recipe_nutrition.calories} kcal</p>
                <p>
                  Ingredients: {recipe.recipe_ingredients.ingredient.join(', ')}
                </p>
              </div>
            ))}
          </div>
        </IonAccordion>
      );
    } else {
      // Render single recipe
      return (
        <IonAccordion key={index}>
          <IonItem slot="header">
            <IonLabel>
              Meal {index + 1}: {meal.recipe_name}
            </IonLabel>
          </IonItem>
          <div slot="content">
            <p>{meal.recipe_description}</p>
            <p>Calories: {meal.recipe_nutrition.calories} kcal</p>
            <p>
              Ingredients: {meal.recipe_ingredients.ingredient.join(', ')}
            </p>
          </div>
        </IonAccordion>
      );
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onDismiss}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Your Meal Plan</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonLoading isOpen={isLoading} message="Loading meal plan..." />

        {!isLoading && errorMessage && (
          <p className="error-message">{errorMessage}</p>
        )}

        {!isLoading && mealPlan.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <IonAccordionGroup>
              {mealPlan.map((meal, index) => renderMeal(meal, index))}
            </IonAccordionGroup>
          </div>
        )}

        {!isLoading && mealPlan.length === 0 && !errorMessage && (
          <p>No meal plan available at the moment.</p>
        )}
      </IonContent>

      <IonFooter>
        <IonToolbar>
          <IonButton expand="full" color="primary" onClick={onDismiss}>
            Close
          </IonButton>
        </IonToolbar>
      </IonFooter>
    </IonModal>
  );
};

export default MealPlanPopup;