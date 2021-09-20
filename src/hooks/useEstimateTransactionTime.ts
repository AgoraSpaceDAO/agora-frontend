import { BigNumber } from "@ethersproject/bignumber"
import { TransactionRequest, Web3Provider } from "@ethersproject/providers"
import { parseUnits } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import { useCommunity } from "components/[community]/common/Context"
import useSWR from "swr"

const getEthereumEstimatedTransactionTime = async (
  gasPrice: BigNumber,
  network: "ETHEREUM" | "GOERLI"
): Promise<number> =>
  fetch("/api/etherscan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: `https://api${
        network === "ETHEREUM" ? "" : `-${network.toLowerCase()}`
      }.etherscan.io/api?module=gastracker&action=gasestimate&gasprice=${gasPrice}`,
    }),
  })
    .then((response) => response.json())
    .then((body) => +body.result * 1000)

const getEstimatedTransactionTime = async (
  _: string,
  transaction: TransactionRequest,
  network: "ETHEREUM" | "GOERLI" | "POLYGON" | "BSC",
  library: Web3Provider
) => {
  if (network === "ETHEREUM" || network === "GOERLI") {
    const gasPrice = await library.estimateGas(transaction)
    const weiGasPrice = parseUnits(gasPrice.toString(), "gwei")
    const time = await getEthereumEstimatedTransactionTime(weiGasPrice, network)
    return time
  }
  if (network === "POLYGON") return 5000
  if (network === "BSC") return 10000
  return 30000
}

const useEstimateTransactionTime = (transaction: TransactionRequest): number => {
  const {
    chainData: { name },
  } = useCommunity()
  const { library } = useWeb3React()

  const shouldFetch = !!transaction && !!library

  const { data } = useSWR(
    shouldFetch ? ["estimatedTransactionTime", transaction, name, library] : null,
    getEstimatedTransactionTime,
    { revalidateOnFocus: false }
  )

  return data
}

export default useEstimateTransactionTime
