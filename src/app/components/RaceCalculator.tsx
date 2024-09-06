'use client'

import React, { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type WindStrength = 'TAUDL' | 'TAUDM' | 'TAUDH'
type BoatName = 'Astarte II' | 'Stony' | 'Xbox' | 'Dixi 4' | 'Esbern Snarre' | 'Intermezzo' | 'Sirena' | 'Easy Lover' | 'Al Capone 2.0' | 'Quinta Light'

type BoatRatings = {
  [key in WindStrength]: {
    [key in BoatName]: number
  }
}

const boatRatings: BoatRatings = {
  TAUDL: {
    "Astarte II": 857.2,
    "Stony": 830.6,
    "Xbox": 821.6,
    "Dixi 4": 786.2,
    "Esbern Snarre": 769.6,
    "Intermezzo": 760.4,
    "Sirena": 751.2,
    "Easy Lover": 723.8,
    "Al Capone 2.0": 717.6,
    "Quinta Light": 715.8
  },
  TAUDM: {
    "Astarte II": 666.4,
    "Stony": 652.2,
    "Xbox": 625.4,
    "Dixi 4": 624.4,
    "Esbern Snarre": 611.4,
    "Intermezzo": 604.2,
    "Sirena": 599.2,
    "Easy Lover": 589.6,
    "Quinta Light": 578.6,
    "Al Capone 2.0": 577.4
  },
  TAUDH: {
    "Astarte II": 577.6,
    "Stony": 574.0,
    "Dixi 4": 550.6,
    "Esbern Snarre": 540.2,
    "Xbox": 536.4,
    "Intermezzo": 532.8,
    "Sirena": 528.4,
    "Easy Lover": 519.8,
    "Quinta Light": 507.0,
    "Al Capone 2.0": 505.0
  }
}

function formatTimeDifference(seconds: number): string {
  const absSeconds = Math.abs(seconds)
  const minutes = Math.floor(absSeconds / 60)
  const remainingSeconds = Math.floor(absSeconds % 60)
  const sign = seconds >= 0 ? '+' : '-'
  return `${sign}${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

export default function RaceCalculator() {
  const [selectedBoat, setSelectedBoat] = useState<BoatName | ''>('')
  const [windStrength, setWindStrength] = useState<WindStrength>('TAUDL')
  const [raceLength, setRaceLength] = useState('')
  const [results, setResults] = useState<{boat: BoatName, timeDifference: number}[]>([])

  const calculateTimeDifferences = () => {
    if (!selectedBoat) {
      alert("Please select a boat.")
      return
    }

    const userBoatRating = boatRatings[windStrength][selectedBoat]
    const raceLengthNum = parseFloat(raceLength)

    if (isNaN(raceLengthNum)) {
      alert("Please enter a valid race length.")
      return
    }

    const newResults = (Object.entries(boatRatings[windStrength]) as [BoatName, number][])
      .filter(([boat]) => boat !== selectedBoat)
      .map(([boat, rating]) => {
        const timeDifference = (rating - userBoatRating) * raceLengthNum
        return { boat, timeDifference }
      })
      .sort((a, b) => a.timeDifference - b.timeDifference)

    setResults(newResults)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">DH-DM 2024</h1>
        <p className="text-xl text-gray-600 mt-2">Race Calculator</p>
      </header>

      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Boat</label>
            <Select onValueChange={(value) => setSelectedBoat(value as BoatName)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your boat" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(boatRatings.TAUDL).map((boat) => (
                  <SelectItem key={boat} value={boat}>
                    {boat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Wind Strength</label>
            <Select onValueChange={(value) => setWindStrength(value as WindStrength)} defaultValue="TAUDL">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select wind strength" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TAUDL">Light Wind</SelectItem>
                <SelectItem value="TAUDM">Medium Wind</SelectItem>
                <SelectItem value="TAUDH">Strong Wind</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mb-6">
          <label htmlFor="raceLength" className="block text-sm font-medium text-gray-700 mb-1">Race Length (nautical miles)</label>
          <Input
            id="raceLength"
            type="number"
            placeholder="Enter race length"
            value={raceLength}
            onChange={(e) => setRaceLength(e.target.value)}
          />
        </div>
        <Button onClick={calculateTimeDifferences} className="w-full mb-6">
          Calculate
        </Button>

        {results.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Results</h2>
            <p className="text-sm text-gray-600 mb-4">
              Negative times indicate boats faster than yours, positive times are slower.
            </p>
            <ul className="space-y-2">
              {results.map(({ boat, timeDifference }) => (
                <li key={boat} className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">{boat}</span>
                  <span className={`text-lg font-semibold ${timeDifference < 0 ? "text-red-500" : "text-green-500"}`}>
                    {formatTimeDifference(timeDifference)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}