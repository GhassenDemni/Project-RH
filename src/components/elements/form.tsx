'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { Button } from '@/components';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

type Field = {
  name: string;
  description?: string;
  label?: string;
  placeholder?: string;
  type?: string; // Add more types as needed
  options?: { value: string; label: string }[]; // Only needed for select and radio types
};

type FormProps = {
  fields: Field[];
  schema?: any;
  defaultValues?: Record<Field['name'], any>;
  as?: 'form' | 'modal';
  method?: string;
  endpoint: string;
  redirect?: string;
  split?: number;
  onAction?: Function;
  actions?: ButtonProps | UnionButtonActions[];
};

type UnionButtonActions = 'cancel' | 'reset' | 'submit' | 'open' | 'close';

type ButtonProps = {
  name: UnionButtonActions; // Action name (e.g., "cancel", "reset", "submit")
  text: string; // Button text
  type?: 'button' | 'reset' | 'submit'; // Button type attribute
  variant?: string; // Button variant (e.g., "outline", "default")
  value?: string; // Button value attribute
  onClick?: () => void; // Click handler function (optional)
};

const BUTTONS: ButtonProps[] = [
  {
    name: 'reset',
    type: 'reset',
    variant: 'outline',
    text: 'Clear',
  },
  {
    name: 'cancel',
    type: 'button',
    variant: 'outline',
    text: 'Cancel',
  },
  {
    name: 'submit',
    type: 'submit',
    text: 'Submit',
  },
];

export default function PoliForm({
  fields,
  data: staticData,
  schema,
  actions = ['cancel', 'submit'],
  defaultValues,
  onAction,
  method = 'POST',
  endpoint,
  redirect,
  split,
  as = 'form',
}: any) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const form = useForm({
    resolver: schema && zodResolver(schema),
    defaultValues,
  });

  // const {
  //   isSubmitted,
  //   isSubmitSuccessful,
  //   isSubmitting,
  //   isLoading,
  //   isValidating,
  // } = form.formState

  const onSubmit = async (data: any) => {
    try {
      if (endpoint) {
        setIsLoading(true);
        const response = await api[method.toLowerCase()](endpoint, {
          ...data,
          ...staticData,
        });
        toast({
          title: response.data?.message || 'Request successful!',
        });
        redirect && router.push(redirect);
        router.refresh();
        form.reset();
      }
    } catch (error: any) {
      toast({
        title: error.response.data?.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterButtons = (buttons: any, btns: any) => {
    return buttons.reduce((result, button) => {
      const matchedBtn = btns.find(btn =>
        typeof btn === 'string' ? btn === button.name : btn.name === button.name
      );
      if (matchedBtn) {
        result.push({
          ...button,
          ...(typeof matchedBtn === 'string' ? {} : matchedBtn),
        });
      }
      return result;
    }, []);
  };

  const a = 'grid-cols-1';
  const b = 'grid-cols-2';
  const c = 'grid-cols-3';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <article className={`grid grid-cols-${split} gap-4`}>
          {fields?.map(
            ({
              name,
              label,
              type,
              options,
              placeholder,
              description,
              defaultValue,
              ...reset
            }: any) => {
              return (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem>
                      {label && <FormLabel>{label}</FormLabel>}
                      {type === 'select' ? (
                        as === 'modal' ? (
                          <div className="relative">
                            <FormControl>
                              <select
                                className={cn(
                                  buttonVariants({ variant: 'outline' }),
                                  'w-full appearance-none bg-transparent font-normal'
                                )}
                                {...field}
                              >
                                {placeholder && <option>{placeholder}</option>}
                                {options?.map((opt: { label: string; value: string }) => (
                                  <option
                                    key={opt.value}
                                    value={opt.value}
                                    selected={defaultValue === opt.value}
                                  >
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            </FormControl>
                            <ChevronDownIcon className="absolute right-3 top-2.5 h-4 w-4 opacity-50" />
                          </div>
                        ) : (
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={defaultValue}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={placeholder} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {options.map((opt: any, i: number) => (
                                <SelectItem key={i} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )
                      ) : type === 'radio' ? (
                        <FormItem className="space-y-3">
                          <FormLabel>{placeholder}</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              {options?.map((opt: { value: string; label: string }) => {
                                return (
                                  <FormItem
                                    key={opt.value}
                                    className="flex items-center space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <RadioGroupItem value={opt.value} />
                                    </FormControl>
                                    <FormLabel className="font-normal">{opt.label}</FormLabel>
                                  </FormItem>
                                );
                              })}
                            </RadioGroup>
                          </FormControl>
                        </FormItem>
                      ) : type === 'textarea' ? (
                        <FormControl>
                          <Textarea placeholder={placeholder} {...field} />
                        </FormControl>
                      ) : (
                        <FormControl>
                          <Input
                            placeholder={placeholder}
                            type={type || 'text'}
                            {...field}
                            {...reset}
                          />
                        </FormControl>
                      )}
                      <FormDescription>{description}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            }
          )}
        </article>
        {Array.isArray(actions) && actions.length ? (
          <footer
            className={`mt-4 flex ${
              as === 'form' ? 'justify-start' : 'justify-end'
            } gap-2 self-end`}
          >
            {filterButtons(BUTTONS, actions).map(({ name, text, value, ...btnProps }: any) => {
              return (
                <Button
                  key={value}
                  name={name}
                  value={value || name}
                  isLoading={name === 'submit' && isLoading}
                  disabled={isLoading}
                  {...btnProps}
                >
                  {name === 'submit' && !fields?.length && !text ? 'Confirm' : text}
                </Button>
              );
            })}
          </footer>
        ) : null}
      </form>
    </Form>
  );
}
