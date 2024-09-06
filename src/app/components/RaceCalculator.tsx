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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const boatRatings = {
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
  const [selectedBoat, setSelectedBoat] = useState("")
  const [windStrength, setWindStrength] = useState("TAUDL")
  const [raceLength, setRaceLength] = useState("")
  const [results, setResults] = useState<{boat: string, timeDifference: number}[]>([])

  const calculateTimeDifferences = () => {
    const userBoatRating = boatRatings[windStrength][selectedBoat]
    const raceLengthNum = parseFloat(raceLength)

    if (!userBoatRating || isNaN(raceLengthNum)) {
      alert("Please select a boat, wind strength, and enter a valid race length.")
      return
    }

    const newResults = Object.entries(boatRatings[windStrength])
      .filter(([boat]) => boat !== selectedBoat)
      .map(([boat, rating]) => {
        const timeDifference = (rating - userBoatRating) * raceLengthNum
        return { boat, timeDifference }
      })
      .sort((a, b) => a.timeDifference - b.timeDifference)

    setResults(newResults)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">DH-DM 2024</CardTitle>
        <p className="text-sm text-gray-500">Race Calculator</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select onValueChange={setSelectedBoat}>
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

          <Select onValueChange={setWindStrength} defaultValue="TAUDL">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select wind strength" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TAUDL">Light Wind</SelectItem>
              <SelectItem value="TAUDM">Medium Wind</SelectItem>
              <SelectItem value="TAUDH">Strong Wind</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="number"
            placeholder="Race length (nautical miles)"
            value={raceLength}
            onChange={(e) => setRaceLength(e.target.value)}
          />

          <Button onClick={calculateTimeDifferences} className="w-full">
            Calculate
          </Button>

          {results.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Results:</h3>
              <p className="text-sm text-gray-600 mb-2">
                Negative times indicate boats faster than yours, positive times are slower.
              </p>
              <ul className="space-y-2">
                {results.map(({ boat, timeDifference }) => (
                  <li key={boat} className="flex justify-between">
                    <span>{boat}:</span>
                    <span className={timeDifference < 0 ? "text-red-500" : "text-green-500"}>
                      {formatTimeDifference(timeDifference)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}