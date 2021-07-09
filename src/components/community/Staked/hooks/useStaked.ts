import { Contract } from "@ethersproject/contracts"
import { formatEther } from "@ethersproject/units"
import { useWeb3React } from "@web3-react/core"
import { useCommunity } from "components/community/Context"
import AGORA_SPACE_ABI from "constants/agoraSpaceABI.json"
import useContract from "hooks/useContract"
import useKeepSWRDataLiveAsBlocksArrive from "hooks/useKeepSWRDataLiveAsBlocksArrive"
import useSWR from "swr"

type StakedType = {
  unlockedAmount: number
  locked: Array<{
    amount: number
    expires: Date
    id: number
  }>
}

const getTimelocks = async (
  _: string,
  contract: Contract,
  account: string
): Promise<StakedType> => {
  const getStaked = async (
    i: number,
    { unlockedAmount, locked }: StakedType
  ): Promise<StakedType> => {
    try {
      const { amount, expires } = await contract.timelocks(account, i)
      const expiresNumber = expires.toNumber() * 1000
      if (expiresNumber < Date.now()) {
        return await getStaked(i + 1, {
          unlockedAmount: unlockedAmount + +formatEther(amount),
          locked,
        })
      }
      return await getStaked(i + 1, {
        unlockedAmount,
        locked: [
          ...locked,
          {
            amount: +formatEther(amount),
            expires: new Date(expiresNumber),
            id: i,
          },
        ],
      })
    } catch (_) {
      return { unlockedAmount, locked }
    }
  }

  const staked = await getStaked(0, {
    unlockedAmount: 0,
    locked: [],
  })

  console.log(staked)

  return staked
}

const useStaked = (): StakedType => {
  const {
    chainData: {
      contract: { address },
    },
  } = useCommunity()
  const contract = useContract(address, AGORA_SPACE_ABI, true)
  const { account } = useWeb3React()

  const { data, mutate } = useSWR(
    address ? ["staked", contract, account] : null,
    getTimelocks,
    {
      initialData: {
        unlockedAmount: 0,
        locked: [],
      },
    }
  )

  useKeepSWRDataLiveAsBlocksArrive(mutate)

  return data
}

export default useStaked
