import { useWeb3React } from "@web3-react/core"
import { useMachine } from "@xstate/react"
import useCommunityData from "components/admin/hooks/useCommunityData"
import useShowErrorToast from "components/admin/hooks/useShowErrorToast"
import useSpaceFactory from "components/admin/hooks/useSpaceFactory"
import { Chains } from "connectors"
import { Machine } from "temporaryData/types"
import { createMachine } from "xstate"

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

// TODO: remove logs before merge
const factoryMachine = createMachine({
  initial: "idle",
  states: {
    idle: {
      entry: () => console.log("Entered state: idle"),
      on: {
        DEPLOY: "checkApprovement",
      },
    },
    checkApprovement: {
      entry: () => console.log("Entered state: checkApprovement"),
      invoke: {
        src: "checkApprovement",
        onDone: "createSpace",
        onError: "error",
      },
      on: {
        NO_APPROVEMENT: "setApproval",
      },
    },
    setApproval: {
      entry: () => console.log("Entered state: setApproval"),
      invoke: {
        src: "setApproval",
        onDone: "createSpace",
        onError: "error",
      },
    },
    createSpace: {
      entry: () => console.log("Entered state: createSpace"),
      invoke: {
        src: "createSpace",
        onDone: "success",
        onError: "error",
      },
    },
    error: {
      // TODO: Add error toasts
      entry: "showErrorToast",
      on: {
        DEPLOY: "createSpace",
      },
    },
    success: {
      // TODO: Add success toasts
      entry: () => console.log("Entered state: success"),
    },
  },
  on: {
    HAS_CONTRACT: "success",
    RESET: "idle",
  },
})

const useFactoryMachine = (): Machine<any> => {
  const { account, chainId } = useWeb3React()
  const { communityData } = useCommunityData()
  const showErrorToast = useShowErrorToast()
  const tokenAddress = communityData.chainData.token.address // No conditional chaining, DeploySpace only renders if this data is available
  const { createSpace, approvedAddresses, updateData } =
    useSpaceFactory(tokenAddress)

  const [state, send] = useMachine(factoryMachine, {
    services: {
      checkApprovement: async () => {
        const result = await approvedAddresses(account, tokenAddress)
        if (result) return true
        send("NO_APPROVEMENT")
      },
      setApproval: async () =>
        fetch("/api/factoryApproval", {
          headers: {
            "Content-Type": "application/json",
          },
          method: "post",
          body: JSON.stringify({
            networkName: Chains[chainId],
            tokenOwner: account,
            tokenAddress,
          }),
        }),
      createSpace: async () => {
        try {
          const tx = await createSpace(tokenAddress)
          await tx.wait()
          const updated = await updateData()
          const index = communityData.allChainData.findIndex(
            (chainData) => chainData.name === Chains[chainId]
          )
          communityData.allChainData[index].contractAddress = updated.contractAddress
          communityData.allChainData[index].stakeToken = updated.stakeToken
          /* await fetch(
          `${process.env.NEXT_PUBLIC_API}/community/${communityData?.id}`,
          {
            method: "patch",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chainData, communityData.allChainData }),
          }
        ) */
        } catch (error) {
          console.error(error)
          if (typeof error.errorName !== "string")
            throw new Error(error.message || "An unknown error occured")

          switch (error.errorName) {
            case "Unauthorized":
              throw new Error("You are not authorized to create this space")
            case "AlreadyExists":
              throw new Error("A space already exists for this token")
            default:
              throw new Error(error.message || "An unknown error occured")
          }
        }
      },
    },
    actions: {
      showErrorToast: (_context, event) => {
        console.log(event.data)
        showErrorToast(event.data.message)
      },
    },
  })

  /* useEffect(() => {
    if (typeof contractAddress === "string" && contractAddress !== ZERO_ADDRESS)
      send("HAS_CONTRACT")
    else send("RESET")
  }, [contractAddress, send]) */

  return [state, send]
}

export default useFactoryMachine
