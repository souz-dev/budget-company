import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../src/components/ui/button";
import { Input } from "../src/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../src/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../src/components/ui/card";
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../src/components/ui/form";
import { Toast } from "../src/components/ui/toast";
import AutomaticQuoteGenerator from "./automaticGemerator";
// import { useToast } from "../src/components/ui/use-toast";

const formSchema = z.object({
  tipoPeca: z.string().min(1, "Tipo de peça é obrigatório"),
  ranges: z
    .array(
      z.object({
        quantidade: z.number().min(1, "Quantidade deve ser maior que 0"),
        valor: z.number().min(0, "Valor deve ser maior ou igual a 0"),
      })
    )
    .min(1, "Adicione pelo menos um range"),
  variacoes: z.array(
    z.object({
      nome: z.string().min(1, "Nome da variação é obrigatório"),
      valor: z.number().min(0, "Valor deve ser maior ou igual a 0"),
    })
  ),
});

export type FormValues = z.infer<typeof formSchema>;

export default function CadastroPecasOrcamento() {
  const [pecasCadastradas, setPecasCadastradas] = useState<FormValues[]>([]);
  // const { toast } = Toast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipoPeca: "",
      ranges: [{ quantidade: 0, valor: 0 }],
      variacoes: [{ nome: "", valor: 0 }],
    },
  });

  const {
    fields: rangeFields,
    append: appendRange,
    remove: removeRange,
  } = useFieldArray({
    control: form.control,
    name: "ranges",
  });

  const {
    fields: variacaoFields,
    append: appendVariacao,
    remove: removeVariacao,
  } = useFieldArray({
    control: form.control,
    name: "variacoes",
  });

  const onSubmit = (data: FormValues) => {
    console.log("Formulário submetido:", data);
    setPecasCadastradas((prevPecas) => [...prevPecas, data]);
    Toast({
      title: "Peça cadastrada com sucesso!",
      // description: `Tipo: ${data.tipoPeca}`,
    });
    form.reset({
      tipoPeca: "",
      ranges: [{ quantidade: 0, valor: 0 }],
      variacoes: [{ nome: "", valor: 0 }],
    });
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Cadastro de Peças</CardTitle>
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
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Ranges de Cobrança
                </h3>
                {rangeFields.map((field, index) => (
                  <div key={field.id} className="flex space-x-4 mb-4">
                    <FormField
                      control={form.control}
                      name={`ranges.${index}.quantidade`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantidade</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`ranges.${index}.valor`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor (R$)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeRange(index)}
                    >
                      Remover
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={() => appendRange({ quantidade: 0, valor: 0 })}
                >
                  Adicionar Range
                </Button>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Variações</h3>
                {variacaoFields.map((field, index) => (
                  <div key={field.id} className="flex space-x-4 mb-4">
                    <FormField
                      control={form.control}
                      name={`variacoes.${index}.nome`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome da Variação</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`variacoes.${index}.valor`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor Adicional (R$)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeVariacao(index)}
                    >
                      Remover
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={() => appendVariacao({ nome: "", valor: 0 })}
                >
                  Adicionar Variação
                </Button>
              </div>

              <Button type="submit">Cadastrar Peça</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Peças Cadastradas e Orçamento</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo de Peça</TableHead>
                <TableHead>Ranges de Cobrança</TableHead>
                <TableHead>Variações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pecasCadastradas.map((peca, index) => (
                <TableRow key={index}>
                  <TableCell>{peca.tipoPeca}</TableCell>
                  <TableCell>
                    {peca.ranges.map((range, idx) => (
                      <div key={idx}>
                        {range.quantidade} un: R$ {range.valor.toFixed(2)}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    {peca.variacoes.map((variacao, idx) => (
                      <div key={idx}>
                        {variacao.nome}: R$ {variacao.valor.toFixed(2)}
                      </div>
                    ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AutomaticQuoteGenerator pecasCadastradas={pecasCadastradas} />
    </div>
  );
}
