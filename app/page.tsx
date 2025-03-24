'use client'
import * as React from "react"
import { useState, useEffect } from "react"
import { Brain, Shuffle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Danna from "@/public/assets/images/danna-paola.webp"
import Danny from "@/public/assets/images/danny-ocean.jpg"
import Aitana from "@/public/assets/images/aitana.jpg"
import SamS from "@/public/assets/images/sam smith.avif"
import Romeo from "@/public/assets/images/romeo santos.jpg"
import Taylor from "@/public/assets/images/taylor.jpg"
import Image, { StaticImageData } from "next/image"

const characters = [
  { id: 1, name: "Danna Paola", image: Danna },
  { id: 2, name: "Danny Ocean", image: Danny },
  { id: 3, name: "Aitana", image: Aitana },
  { id: 4, name: "Sam Smith", image: SamS },
  { id: 5, name: "Romeo Santos", image: Romeo },
  { id: 6, name: "Taylor Lautner", image: Taylor },
]

export default function MemoryGame() {
  const [cards, setCards] = useState<{ id: number; name: string; image: StaticImageData; uniqueId: number }[]>([])
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    initGame()
  }, [])

  useEffect(() => {
    if (matched.length === 12) {
      setGameComplete(true)
      setTimeout(() => {
        setDialogOpen(true)
      }, 2000)
    }
  }, [matched])

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped
      if (cards[first].name === cards[second].name) {
        setMatched((prevMatched) => [...prevMatched, first, second])
      }

      const timeout = setTimeout(() => {
        setFlipped([])
      }, 1000)

      return () => clearTimeout(timeout)
    }
  }, [flipped, cards])

  const initGame = () => {
    const duplicatedCards = [...characters, ...characters]
      .map((card, index) => ({ ...card, uniqueId: index }))
      .sort(() => Math.random() - 0.5)

    setCards(duplicatedCards)
    setFlipped([])
    setMatched([])
    setMoves(0)
    setGameComplete(false)
    setDialogOpen(false)
  }

  const handleCardClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) {
      return
    }

    setFlipped([...flipped, index])
    setMoves((prev) => prev + 1)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-blue-50 to-purple-50">
      <div className="w-full max-w-3xl">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-3xl font-bold text-center mb-2">Juego de Memoria</h1>
          <div className="flex items-center justify-between w-full mb-4">
            <div className="text-lg font-medium">Movimientos: {moves}</div>
            <Button onClick={initGame} variant="outline" className="flex items-center gap-2">
              <Shuffle className="h-4 w-4" />
              Reiniciar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3">
          {cards.map((card, index) => (
            <Card
              key={card.uniqueId}
              className={`aspect-square flex items-center justify-center p-1 cursor-pointer transition-all duration-300 transform ${flipped.includes(index) || matched.includes(index)
                ? "rotate-y-180"
                : "bg-gradient-to-br from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                } ${matched.includes(index) ? "opacity-70" : ""}`}
              onClick={() => handleCardClick(index)}
            >
              <div className={`relative w-full h-full ${flipped.includes(index) || matched.includes(index) ? "rotate-y-180" : ""}`}>
                {flipped.includes(index) || matched.includes(index) ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Image src={card.image} alt={card.name} className="w-full h-full object-cover rounded-xl" />
                    <span className="text-black text-xs lg:text-lg font-bold mt-1">{card.name}</span>
                  </div>
                ) : (
                  <Brain className="absolute inset-0 flex flex-col m-auto size-20 lg:size-32 items-center justify-center text-white" />
                )}
              </div>
            </Card>
          ))}
        </div>

        {gameComplete && (
          <div className="mt-6 p-4 bg-green-100 rounded-lg text-center">
            <h2 className="text-xl font-bold text-green-800">¡Felicidades!</h2>
            <p className="text-green-700">Has completado el juego en {moves} movimientos.</p>
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Habilidades del pensamiento que desarrolla</DialogTitle>
            </DialogHeader>
            <div className="p-2">
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-purple-500 underline">Memoria a corto plazo:</strong> Recordar la ubicación de las cartas previamente volteadas.
                </li>
                <li>
                  <strong className="text-purple-500 underline">Concentración:</strong> Mantener la atención en el juego para recordar las posiciones.
                </li>
                <li>
                  <strong className="text-purple-500 underline">Reconocimiento visual:</strong> Identificar y emparejar imágenes iguales.
                </li>
                <li>
                  <strong className="text-purple-500 underline">Asociación:</strong> Relacionar las imágenes con sus pares correspondientes.
                </li>
                <li>
                  <strong className="text-purple-500 underline">Toma de decisiones:</strong> Elegir qué cartas voltear basándose en información previa.
                </li>
                <li>
                  <strong className="text-purple-500 underline">Planificación estratégica:</strong> Desarrollar un método para completar el juego eficientemente.
                </li>
              </ul>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}