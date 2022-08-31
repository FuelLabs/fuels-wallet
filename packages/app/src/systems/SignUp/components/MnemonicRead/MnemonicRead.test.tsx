/* eslint-disable no-restricted-syntax */
import type { UserPatch } from "@fuel-ui/test-utils";
import { render, screen } from "@fuel-ui/test-utils";

import { MnemonicRead } from "./MnemonicRead";

const WORDS = [
  "strange",
  "purple",
  "adamant",
  "crayons",
  "entice",
  "fun",
  "eloquent",
  "missiles",
  "milk",
  "ice",
  "cream",
  "apple",
];

const onNextHandler = jest.fn();
const onCancelHandler = jest.fn();

describe("MnemonicRead", () => {
  let user: UserPatch;

  beforeEach(() => {
    const res = render(
      <MnemonicRead
        words={WORDS}
        onNext={onNextHandler}
        onCancel={onCancelHandler}
      />
    );

    user = res.user;
  });

  it("should have show mnemonic as words", () => {
    for (const word of WORDS) {
      expect(screen.getByText(word)).toBeInTheDocument();
    }
  });

  it("should next be disabled by default", async () => {
    const btn = screen.getByText("Next");
    expect(btn).toBeInTheDocument();
    expect(btn).toBeDisabled();
  });

  it("should next be enable when confirm checkbox", async () => {
    const checkbox = screen.getByLabelText(/Confirm saved/i);
    expect(checkbox).toBeInTheDocument();
    await user.click(checkbox);

    const btn = screen.getByText("Next");
    expect(btn).toBeEnabled();
  });
});
