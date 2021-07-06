import { useWeb3React } from "@web3-react/core"
import { useCommunity } from "components/community/Context"
import useBalance from "hooks/useBalance"
import { AccessRequirements } from "temporaryData/types"

const useLevelAccess = (data: AccessRequirements): [boolean, string] => {
  const {
    chainData: { token, stakeToken },
  } = useCommunity()
  const { data: tokenBalance } = useBalance(token)
  const { data: stakeBalance } = useBalance(stakeToken)
  const amount = data.type === "stake" ? data.amount - stakeBalance : data.amount
  const { active } = useWeb3React()

  if (data.type === "open") return [true, ""]

  if (!active) return [false, "Wallet not connected"]

  if (Number.isNaN(amount)) return [false, "Loading requirement amount"]

  if (stakeBalance >= amount) return [true, ""]

  if (tokenBalance < amount) return [false, "Insufficient balance"]

  if (data.type === "hold") return [true, ""]

  if (data.type === "stake") return [false, ""]
}

export default useLevelAccess
