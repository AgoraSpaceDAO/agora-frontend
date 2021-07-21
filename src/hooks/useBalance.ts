import { BigNumber } from "@ethersproject/bignumber"
import { Contract } from "@ethersproject/contracts"
import { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import ERC20_ABI from "constants/erc20abi.json"
import useContract from "hooks/useContract"
import useKeepSWRDataLiveAsBlocksArrive from "hooks/useKeepSWRDataLiveAsBlocksArrive"
import useSWR from "swr"
import type { Token } from "temporaryData/types"
import parseBalance from "utils/parseBalance"

const getBalance = (
  _: string,
  address: string,
  tokenContract: Contract
): Promise<number> =>
  tokenContract
    .balanceOf(address)
    .then((balance: BigNumber) => parseBalance(balance))

const useBalance = (token: Token): number => {
  const { library, chainId, account } = useWeb3React<Web3Provider>()
  const tokenContract = useContract(token.address, ERC20_ABI)

  const shouldFetch = typeof account === "string" && !!library

  const { data, mutate } = useSWR(
    shouldFetch ? [`${token.name}_balance`, account, tokenContract, chainId] : null,
    getBalance
  )

  useKeepSWRDataLiveAsBlocksArrive(mutate)

  return data
}

export default useBalance
