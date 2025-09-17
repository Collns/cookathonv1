import { useState } from 'react'
import { createRecipeWithAI } from '../lib/api'

export default function CreateRecipe() {
  const [title, setTitle] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [steps, setSteps] = useState('')
  const [status, setStatus] = useState(null)      // was useState<string | null>(null)

  async function handleSubmit(e) {                 // was (e: React.FormEvent)
    e.preventDefault()
    setStatus('Submitting…')
    try {
      const res = await createRecipeWithAI({ title, ingredients, steps })
      setStatus(res.message || 'Submitted!')
      setTitle(''); setIngredients(''); setSteps('')
    } catch (err) {
      setStatus(err?.message || 'Failed to submit')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-3">
      <h1 className="text-xl font-semibold">Share a recipe</h1>

      <input className="w-full border rounded-lg p-2"
             placeholder="Title" value={title}
             onChange={e => setTitle(e.target.value)} />

      <textarea className="w-full border rounded-lg p-2" rows={5}
                placeholder="Ingredients (one per line)"
                value={ingredients} onChange={e => setIngredients(e.target.value)} />

      <textarea className="w-full border rounded-lg p-2" rows={8}
                placeholder="Steps"
                value={steps} onChange={e => setSteps(e.target.value)} />

      <button className="bg-brand-600 text-white px-4 py-2 rounded-xl">Submit</button>

      {status && <p className="text-sm text-neutral-600">{status}</p>}
    </form>
  )
}
