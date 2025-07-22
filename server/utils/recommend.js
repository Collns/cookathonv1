// utils/recommend.js
import Recipe from '../models/Recipe.js'
import { Op } from 'sequelize'

export const recommendRecipes = async (ingredientString) => {
  const ingredients = ingredientString
    .split(',')
    .map(i => i.trim().toLowerCase())
    .filter(i => i.length > 0)

  const recipes = await Recipe.findAll({
    where: {
      ingredients: {
        [Op.iLike]: {
          [Op.any]: ingredients.map(ing => `%${ing}%`)
        }
      }
    },
    order: [['likeCount', 'DESC']]
  })

  return recipes
}
