import { Contract } from "@ethersproject/contracts"
import {
  ExternalProvider,
  TransactionResponse,
  Web3Provider,
} from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { useCommunity } from "components/[community]/common/Context"
import ERC20_ABI from "constants/erc20abi.json"
import useContract from "hooks/useContract"
import useKeepSWRDataLiveAsBlocksArrive from "hooks/useKeepSWRDataLiveAsBlocksArrive"
import useSWR from "swr"
import type { Token } from "temporaryData/types"

type TokenAllowance = [boolean, () => Promise<TransactionResponse>]

const MAX_VALUE = BigInt(
  "115792089237316195423570985008687907853269984665640564039457584007913129639935"
)

const getAllowance = async (
  _: string,
  tokenAddress: string,
  account: string,
  contractAddress: string
) => {
  const library = new Web3Provider(
    (window as Window & typeof globalThis & { ethereum: ExternalProvider }).ethereum
  )
  const tokenContract = new Contract(
    tokenAddress,
    ERC20_ABI,
    library.getSigner(account).connectUnchecked()
  )

  const allowance = await tokenContract.allowance(account, contractAddress)
  return allowance >= MAX_VALUE / BigInt(4)
}

const useTokenAllowance = (token: Token): TokenAllowance => {
  const { account } = useWeb3React()
  const {
    chainData: { contractAddress },
  } = useCommunity()
  const tokenContract = useContract(token.address, ERC20_ABI, true)

  const shouldFetch = typeof account === "string" && !!tokenContract

  const { data, mutate } = useSWR(
    shouldFetch ? ["allowance", token.address, account, contractAddress] : null,
    getAllowance
  )

  useKeepSWRDataLiveAsBlocksArrive(mutate)

  const allowToken = async (): Promise<TransactionResponse> => {
    const tx: TransactionResponse = await tokenContract.approve(
      contractAddress,
      MAX_VALUE
    )
    return tx
  }

  return [data, allowToken]
}

export default useTokenAllowance
