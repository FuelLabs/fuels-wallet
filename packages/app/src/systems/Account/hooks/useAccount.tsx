import { atom, useAtom } from "jotai";

const currentAddress = atom(false);

export function useAccount() {
  const [address, setAddress] = useAtom(currentAddress);

  
}
