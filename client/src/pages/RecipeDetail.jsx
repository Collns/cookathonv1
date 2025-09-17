import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getRecipe } from '../lib/api'             // <— changed from "@/lib/api"
import RecipeCard from '../components/RecipeCard'  // <— changed from "@/components/…"

export default function RecipeDetail() {
  const { id } = useParams()
  const [recipe, setRecipe] = useState(null)

  useEffect(() => { if (id) getRecipe(id).then(setRecipe) }, [id])

  if (!recipe) return <div className="p-4">Loading…</div>
  return <div className="p-3"><RecipeCard recipe={recipe} detailed /></div>
}
