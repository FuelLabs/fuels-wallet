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
import { useForm } from "react-hook-form";
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
  isLoading,
  onCancel,
  onSubmit,
}: CreatePasswordProps) {
  const form = useForm<CreatePasswordValues>({
    resolver: yupResolver(schema),
    shouldUseNativeValidation: false,
    mode: "onBlur",
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
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
          <Form.Control isInvalid={Boolean(errors.password)}>
            <Form.Label htmlFor="password">Password</Form.Label>
            <InputPassword
              {...register("password")}
              id="password"
              name="password"
              placeholder="Type your password"
            />
            {errors.password?.message && (
              <Form.ErrorMessage>
                {errors.password?.message as string}
              </Form.ErrorMessage>
            )}
          </Form.Control>
          <Form.Control isInvalid={Boolean(errors.confirmPassword)}>
            <Form.Label htmlFor="confirmPassword">Confirm password</Form.Label>
            <InputPassword
              {...register("confirmPassword")}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
            />
            {errors.confirmPassword?.message && (
              <Form.ErrorMessage>
                {errors.confirmPassword?.message as string}
              </Form.ErrorMessage>
            )}
          </Form.Control>
        </Stack>
        <Form.Control css={{ flexDirection: "row" }}>
          <Checkbox
            id="c1"
            checked={form.watch("accepted")}
            onCheckedChange={(e) => {
              form.setValue("accepted", e as boolean, { shouldValidate: true });
            }}
          />
          <Form.Label htmlFor="c1">I agree with terms and services</Form.Label>
        </Form.Control>
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
            isDisabled={!form.formState.isValid}
            isLoading={isLoading}
          >
            Next
          </Button>
        </Flex>
      </Stack>
    </form>
  );
}
