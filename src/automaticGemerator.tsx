import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./components/ui/form";
import { Toast } from "./components/ui/toast";
// import { useToast } from "./components/ui/use-toast";

// Assuming this type is imported from the original component or a shared types file
import type { FormValues as PecaCadastrada } from "./calcPage";

const quoteFormSchema = z.object({
  tipoPeca: z.string().min(1, "Selecione um tipo de peça"),
  quantidade: z.number().min(1, "Quantidade deve ser maior que 0"),
  variacoes: z.array(z.string()),
});

type QuoteFormValues = z.infer<typeof quoteFormSchema>;

interface AutomaticQuoteGeneratorProps {
  pecasCadastradas: PecaCadastrada[];
}

export default function AutomaticQuoteGenerator({
  pecasCadastradas,
}: AutomaticQuoteGeneratorProps) {
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  // const { toast } = useToast();

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      tipoPeca: "",
      quantidade: 1,
      variacoes: [],
    },
  });

  const onSubmit = (data: QuoteFormValues) => {
    const selectedPeca = pecasCadastradas.find(
      (peca) => peca.tipoPeca === data.tipoPeca
    );
    if (!selectedPeca) {
      Toast({
        title: "Erro",
        // description: "Tipo de peça não encontrado",
        variant: "destructive",
      });
      return;
    }

    let basePrice = 0;
    for (const range of selectedPeca.ranges) {
      if (data.quantidade <= range.quantidade) {
        basePrice = range.valor;
        break;
      }
    }
    if (basePrice === 0) {
      basePrice = selectedPeca.ranges[selectedPeca.ranges.length - 1].valor;
    }

    const variacoesPrice = data.variacoes.reduce((total, variacao) => {
      const selectedVariacao = selectedPeca.variacoes.find(
        (v) => v.nome === variacao
      );
      return total + (selectedVariacao ? selectedVariacao.valor : 0);
    }, 0);

    const total = (basePrice + variacoesPrice) * data.quantidade;
    setTotalPrice(total);

    Toast({
      title: "Orçamento gerado",
      // description: `Total: R$ ${total.toFixed(2)}`,
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Gerar Orçamento Automático</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="tipoPeca"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Peça</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um tipo de peça" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {pecasCadastradas.map((peca, index) => (
                        <SelectItem key={index} value={peca.tipoPeca}>
                          {peca.tipoPeca}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="variacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variações</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      {form.watch("tipoPeca") &&
                        pecasCadastradas
                          .find(
                            (peca) => peca.tipoPeca === form.watch("tipoPeca")
                          )
                          ?.variacoes.map((variacao, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                id={`variacao-${index}`}
                                value={variacao.nome}
                                onChange={(e) => {
                                  const currentVariacoes = field.value || [];
                                  if (e.target.checked) {
                                    field.onChange([
                                      ...currentVariacoes,
                                      variacao.nome,
                                    ]);
                                  } else {
                                    field.onChange(
                                      currentVariacoes.filter(
                                        (v) => v !== variacao.nome
                                      )
                                    );
                                  }
                                }}
                              />
                              <label htmlFor={`variacao-${index}`}>
                                {variacao.nome} (R$ {variacao.valor.toFixed(2)})
                              </label>
                            </div>
                          ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Gerar Orçamento</Button>
          </form>
        </Form>

        {totalPrice !== null && (
          <div className="mt-6 text-xl font-bold">
            Total: R$ {totalPrice.toFixed(2)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
