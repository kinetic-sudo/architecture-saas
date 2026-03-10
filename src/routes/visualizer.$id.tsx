import { useParams } from 'react-router-dom'

export default function Visualizer() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="visualizer-page">
      <h1>Visualizer</h1>
      <p>
        Showing visualization for id: <strong>{id}</strong>
      </p>
    </div>
  )
}
