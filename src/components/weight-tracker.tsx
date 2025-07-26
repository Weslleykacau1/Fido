
"use client"

import * as React from "react"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Pet } from "./pet-profile"
import { Weight as WeightIcon, LineChart as LineChartIcon, PlusCircle } from "lucide-react"

const weightFormSchema = z.object({
  weight: z.coerce.number().positive("O peso deve ser um número positivo.").max(150, "O peso parece muito alto para um cão."),
});
type WeightFormValues = z.infer<typeof weightFormSchema>;

interface WeightTrackerProps {
  pets: Pet[];
  setPets: React.Dispatch<React.SetStateAction<Pet[]>>;
  selectedPetId: string | null;
}

export function WeightTracker({ pets, setPets, selectedPetId }: WeightTrackerProps) {
  const selectedPet = pets.find(p => p.id === selectedPetId);
  
  const weightForm = useForm<WeightFormValues>({
    resolver: zodResolver(weightFormSchema),
    defaultValues: { weight: undefined },
  });

  function onWeightSubmit(values: WeightFormValues) {
    if (!selectedPetId) return;
    const newEntry = {
      weight: values.weight,
      date: new Date().toLocaleDateString('pt-BR'),
    };
    setPets(prev => prev.map(p =>
      p.id === selectedPetId ? { ...p, weightHistory: [newEntry, ...(p.weightHistory ?? [])] } : p
    ));
    weightForm.reset();
  }

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
    <div className="w-full max-w-md space-y-6">
        {selectedPet && (
             <Card className="w-full bg-card/80 backdrop-blur-lg shadow-2xl shadow-primary/10 rounded-2xl border-primary/20">
                <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center gap-2"><WeightIcon className="h-5 w-5" /> Adicionar Registro de Peso</CardTitle>
                <CardDescription>Registre um novo peso para {selectedPet.name}</CardDescription>
                </CardHeader>
                <CardContent>
                <Form {...weightForm}>
                    <form onSubmit={weightForm.handleSubmit(onWeightSubmit)} className="space-y-4">
                    <FormField
                        control={weightForm.control}
                        name="weight"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-headline text-md font-semibold">Novo peso (kg)</FormLabel>
                            <FormControl>
                            <Input type="number" step="0.1" placeholder="ex: 15.5" {...field} value={field.value ?? ''} className="font-body" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full font-headline font-bold">
                         <PlusCircle className="mr-2 h-5 w-5"/>
                        Adicionar Registro
                    </Button>
                    </form>
                </Form>
                </CardContent>
            </Card>
        )}

        <Card className="w-full bg-card/80 backdrop-blur-lg shadow-2xl shadow-primary/10 rounded-2xl border-primary/20">
          <CardHeader className="text-center">
             <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <LineChartIcon className="h-8 w-8 text-primary" />
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
                    <p className="text-sm mt-1">Adicione um registro de peso para começar.</p>
                </div>
            )}
          </CardContent>
        </Card>
    </div>
  )
}
