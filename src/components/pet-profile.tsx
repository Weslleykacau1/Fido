"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LineChart, User, Weight, History } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const weightFormSchema = z.object({
  weight: z.coerce.number().positive("O peso deve ser um número positivo.").max(150, "O peso parece muito alto para um cão."),
});

type WeightFormValues = z.infer<typeof weightFormSchema>;

type WeightEntry = {
  weight: number;
  date: string;
};

export function PetProfile() {
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);

  const form = useForm<WeightFormValues>({
    resolver: zodResolver(weightFormSchema),
    defaultValues: {
      weight: undefined,
    },
  });

  function onSubmit(values: WeightFormValues) {
    const newEntry: WeightEntry = {
      weight: values.weight,
      date: new Date().toLocaleDateString('pt-BR'),
    };
    setWeightHistory(prev => [newEntry, ...prev]);
    form.reset();
  }

  return (
    <Card className="w-full max-w-md bg-card/80 backdrop-blur-lg shadow-2xl shadow-primary/10 rounded-2xl border-primary/20">
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
          <User className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="font-headline text-3xl font-bold tracking-tight text-foreground">Perfil do Pet</CardTitle>
        <CardDescription className="font-body text-lg pt-1 text-muted-foreground">Acompanhe o peso do seu amigo</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Card className="bg-background/50">
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2"><Weight className="h-5 w-5" /> Atualizar Peso</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
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
                    Salvar Novo Peso
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card className="bg-background/50">
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2"><History className="h-5 w-5" /> Histórico de Peso</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-40 w-full pr-4">
                <AnimatePresence>
                  {weightHistory.length > 0 ? (
                    <ul className="space-y-2">
                      {weightHistory.map((entry, index) => (
                        <motion.li
                          key={index}
                          layout
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.3 }}
                          className="flex justify-between items-center p-2 rounded-md bg-muted/50"
                        >
                          <span className="font-body font-semibold">{entry.weight} kg</span>
                          <span className="font-body text-sm text-muted-foreground">{entry.date}</span>
                        </motion.li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center text-muted-foreground font-body py-8">
                      <LineChart className="mx-auto h-8 w-8 mb-2" />
                      Nenhum registro de peso ainda.
                    </div>
                  )}
                </AnimatePresence>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
