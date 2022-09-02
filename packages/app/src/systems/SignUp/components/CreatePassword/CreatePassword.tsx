import {
  Image,
  Stack,
  Flex,
  Button,
  Checkbox,
  InputPassword,
} from "@fuel-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { Header } from "../Header";

import { ControlledField } from "~/systems/Core";

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
          <ControlledField
            control={control}
            name="password"
            label="Password"
            render={({ field }) => (
              <InputPassword {...field} placeholder="Type your password" />
            )}
          />
          <ControlledField
            control={control}
            name="confirmPassword"
            label="Confirm password"
            render={({ field }) => (
              <InputPassword {...field} placeholder="Confirm your password" />
            )}
          />
        </Stack>
        <ControlledField
          control={control}
          name="accepted"
          label="I agree with terms and services"
          labelSide="right"
          css={{ flexDirection: "row " }}
          render={({ field: { value: _value, ...field } }) => (
            <Checkbox
              {...field}
              checked={form.watch("accepted")}
              aria-label="Accept terms"
              onCheckedChange={(checked) => {
                form.setValue("accepted", Boolean(checked), {
                  shouldValidate: true,
                  shouldTouch: true,
                });
              }}
            />
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
