import { yupResolver } from '@hookform/resolvers/yup';
import type { BN } from 'fuels';
import type { ReactNode } from 'react';
import { FormProvider as Provider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { formatGasLimit } from '~/systems/Transaction';

export type TransactionRequestFormData = {
  fees: {
    tip: {
      amount: BN;
      text: string;
    };
    gasLimit: {
      amount: BN;
      text: string;
    };
  };
};

type SchemaOptions = {
  baseFee: BN | undefined;
  maxGasLimit: BN | undefined;
};

type FormProviderProps = {
  children: ReactNode;
  testId: string;
  defaultValues?: TransactionRequestFormData;
  context: SchemaOptions;
  onSubmit: (data: TransactionRequestFormData) => void;
};

const schema = yup
  .object({
    fees: yup
      .object({
        tip: yup.object({
          amount: yup
            .mixed<BN>()
            .test('min', 'Tip must be greater than or equal to 0', (value) => {
              return value?.gte(0);
            })
            .required('Tip is required'),
          text: yup.string().required('Tip is required'),
        }),
        gasLimit: yup.object({
          amount: yup
            .mixed<BN>()
            .test({
              name: 'max',
              test: (value, ctx) => {
                const { maxGasLimit } = ctx.options.context as SchemaOptions;
                if (!maxGasLimit) return false;

                if (value?.lte(maxGasLimit)) {
                  return true;
                }

                return ctx.createError({
                  path: 'fees.gasLimit',
                  message: `Gas limit must be lower than or equal to ${formatGasLimit(
                    maxGasLimit
                  )}.`,
                });
              },
            })
            .required('Gas limit is required'),
          text: yup.string().required('Gas limit is required'),
        }),
      })
      .required('Fees are required'),
  })
  .required();

export function FormProvider({
  children,
  testId,
  defaultValues,
  context,
  onSubmit,
}: FormProviderProps) {
  const form = useForm<TransactionRequestFormData>({
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
    mode: 'onSubmit',
    defaultValues,
    context,
  });

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      data-testid={testId}
      noValidate
      autoComplete="off"
    >
      <Provider {...form}>{children}</Provider>
    </form>
  );
}
