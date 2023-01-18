import type { Contract as StarknetContract } from "starknet";
import type { Contract as EthersContract } from "ethers";
import { get, writable } from "svelte/store";
import type { Writable } from "svelte/store";
import accountStore from "./accountStore";
import _baseStore from "./_baseStore";

// Store of all contract stores. Subscribes to account changes

export type Contract = StarknetContract;

type ContractsStoreType = Record<string, Writable<Contract>>;

export const store = writable<ContractsStoreType>({});

const contractsStore = _baseStore(store, ({ _set, subscribe }) => {
  function addContract(name: string, contract: Writable<Contract>) {
    if (!get(store)[name]) {
      _set({
        [name]: contract
      });
    }
  }

  return {
    subscribe,
    addContract,
    get
  };
});

export default contractsStore;

accountStore.subscribe(({ account }) => {
  Object.entries(get(contractsStore)).forEach(([_, contract]) => {
    get(contract).connect(account as any);
  });
});
