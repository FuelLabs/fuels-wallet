import {
  Image,
  Stack,
  Flex,
  Button,
  Form,
  Checkbox,
  InputPassword,
} from "@fuel-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import { Header } from "../Header";

const schema = yup
  .object({
    password: yup.string().min(8).required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match"),
    accepted: yup.bool().required(),
  })
  .required();

export type CreatePasswordValues = {
  password: string;
  confirmPassword: string;
  accepted: boolean;
};

export type CreatePasswordProps = {
  isLoading?: boolean;
  onSubmit: (data: CreatePasswordValues) => void;
  onCancel: () => void;
};

export function CreatePassword({
  isLoading = false,
  onCancel,
  onSubmit,
}: CreatePasswordProps) {
  const form = useForm<CreatePasswordValues>({
    resolver: yupResolver(schema),
    reValidateMode: "onChange",
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
      accepted: false,
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap="$6" align="center">
        <Image src="/signup-illustration-2.svg" />
        <Header
          title="Create your password"
          subtitle="Add a safe password for access your wallet"
        />
        <Stack css={{ width: "100%" }} gap="$4">
          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <Form.Control isInvalid={Boolean(fieldState.error)}>
                <Form.Label htmlFor="password">Password</Form.Label>
                <InputPassword
                  {...field}
                  id="password"
                  placeholder="Type your password"
                />
                {fieldState.error?.message && (
                  <Form.ErrorMessage>
                    {fieldState.error?.message as string}
                  </Form.ErrorMessage>
                )}
              </Form.Control>
            )}
          />
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field, fieldState }) => (
              <Form.Control isInvalid={Boolean(fieldState.error)}>
                <Form.Label htmlFor="confirmPassword">
                  Confirm password
                </Form.Label>
                <InputPassword
                  {...field}
                  id="confirmPassword"
                  placeholder="Confirm your password"
                />
                {fieldState.error?.message && (
                  <Form.ErrorMessage aria-label="Error message">
                    {fieldState.error?.message as string}
                  </Form.ErrorMessage>
                )}
              </Form.Control>
            )}
          />
        </Stack>
        <Controller
          name="accepted"
          control={control}
          render={({ field: { value: _value, ...field } }) => (
            <Form.Control css={{ flexDirection: "row" }}>
              <Checkbox
                {...field}
                checked={form.watch("accepted")}
                id="acceptTerms"
                aria-label="Accept terms"
                onCheckedChange={(checked) => {
                  form.setValue("accepted", Boolean(checked), {
                    shouldValidate: true,
                    shouldTouch: true,
                  });
                }}
              />
              <Form.Label htmlFor="acceptTerms">
                I agree with terms and services
              </Form.Label>
            </Form.Control>
          )}
        />
        <Flex gap="$4">
          <Button
            size="sm"
            color="gray"
            variant="ghost"
            css={{ width: 130 }}
            onPress={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            color="accent"
            css={{ width: 130 }}
            isDisabled={!isValid}
            isLoading={isLoading}
          >
            Next
          </Button>
        </Flex>
      </Stack>
    </form>
  );
}
