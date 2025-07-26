
"use client"

import * as React from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Pet } from "./pet-profile"
import { Weight as WeightIcon, LineChart as LineChartIcon } from "lucide-react"

interface WeightTrackerProps {
  pets: Pet[];
  selectedPetId: string | null;
}

export function WeightTracker({ pets, selectedPetId }: WeightTrackerProps) {
  const selectedPet = pets.find(p => p.id === selectedPetId);
  const chartData = (selectedPet?.weightHistory ?? [])
    .map(entry => ({ date: entry.date, weight: entry.weight }))
    .reverse(); 

  const chartConfig = {
    weight: {
      label: "Peso (kg)",
      color: "hsl(var(--primary))",
    },
  }

  return (
    <Card className="w-full max-w-md bg-card/80 backdrop-blur-lg shadow-2xl shadow-primary/10 rounded-2xl border-primary/20">
      <CardHeader className="text-center">
         <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
            <WeightIcon className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="font-headline text-3xl font-bold tracking-tight text-foreground">Acompanhamento de Peso</CardTitle>
        <CardDescription className="font-body text-lg pt-1 text-muted-foreground">
            {selectedPet ? `Histórico de ${selectedPet.name}` : "Selecione um pet na aba 'Pets'"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 5)} 
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={['dataMin - 1', 'dataMax + 1']}
                tickFormatter={(value) => `${value}kg`}
              />
              <Tooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Line
                dataKey="weight"
                type="monotone"
                stroke="var(--color-weight)"
                strokeWidth={3}
                dot={{
                  fill: "var(--color-weight)",
                  r: 5
                }}
              />
            </LineChart>
          </ChartContainer>
        ) : (
            <div className="flex flex-col items-center justify-center h-[250px] text-center text-muted-foreground font-body">
                <LineChartIcon className="h-12 w-12 mb-4" />
                <p className="font-semibold">Nenhum dado de peso encontrado.</p>
                <p className="text-sm mt-1">Adicione o peso na aba 'Pets' para começar a acompanhar.</p>
            </div>
        )}
      </CardContent>
    </Card>
  )
}
