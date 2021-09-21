import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react"
import { Error } from "components/common/Error"
import Modal from "components/common/Modal"
import ModalButton from "components/common/ModalButton"
import { useCommunity } from "components/[community]/common/Context"
import TokenAllowance from "components/[community]/community/common/TokenAllowance"
import useTokenAllowanceMachine from "components/[community]/community/common/TokenAllowance/hooks/useTokenAllowanceMachine"
import TransactionSubmitted from "components/[community]/community/common/TransactionSubmitted"
import msToReadableFormat from "utils/msToReadableFormat"
import processWalletError from "utils/processWalletError"
import useNeededAmount from "../../hooks/useNeededAmount"
import useStakingModalMachine from "./hooks/useStakingMachine"

type Props = {
  levelName: string
  requirement: number
  stakeTimelockMs: number
  isOpen: boolean
  onClose: () => void
  levelId: number
}
const StakingModal = ({
  levelName,
  requirement,
  stakeTimelockMs,
  isOpen,
  onClose,
  levelId,
}: Props): JSX.Element => {
  const {
    chainData: { token, stakeToken },
  } = useCommunity()
  const amount = useNeededAmount(requirement, stakeToken)
  const [allowanceState, allowanceSend] = useTokenAllowanceMachine(token)
  const [stakeState, stakeSend] = useStakingModalMachine(amount, levelId)

  const closeModal = () => {
    allowanceSend("CLOSE_MODAL")
    stakeSend("CLOSE_MODAL")
    onClose()
  }

  const startStaking = () => {
    allowanceSend("HIDE_NOTIFICATION")
    stakeSend("STAKE")
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {stakeState.matches("success")
            ? `Transaction submitted`
            : `Stake to join ${levelName}`}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {stakeState.matches("success") ? (
            <>
              <TransactionSubmitted transaction={stakeState.context.transaction} />
              <Text colorScheme="gray" mt="4">
                You’ll recieve {amount} {stakeToken.symbol} in return. Those mark
                your position, so don’t sell or send them because you will lose
                access to the community level and won’t be able to get your{" "}
                {token.symbol} tokens back.
              </Text>
            </>
          ) : (
            <>
              <Error
                error={stakeState.context.error || allowanceState.context.error}
                processError={processWalletError}
              />
              <Text>
                Stake {amount} {token.symbol} to gain access to {levelName}. Your
                tokens will be locked for {msToReadableFormat(stakeTimelockMs)},
                after that you can unstake them anytime. You can always stake more to
                upgrade to higher levels.
              </Text>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          {/* margin is applied on TokenAllowance, so there's no jump when it collapses and unmounts */}
          <VStack spacing="0" alignItems="strech">
            <TokenAllowance
              state={allowanceState}
              send={allowanceSend}
              tokenSymbol={token.symbol}
              successText={`You can now stake ${token.symbol}`}
            />

            {["allowanceGranted", "successNotification"].some(
              allowanceState.matches
            ) ? (
              (() => {
                switch (stakeState.value) {
                  case "idle":
                  case "error":
                  default:
                    return (
                      <ModalButton onClick={startStaking}>Confirm stake</ModalButton>
                    )
                  case "waitingConfirmation":
                    return (
                      <ModalButton isLoading loadingText="Waiting confirmation" />
                    )
                  case "success":
                    return <ModalButton onClick={closeModal}>Close</ModalButton>
                }
              })()
            ) : (
              <ModalButton disabled colorScheme="gray">
                Confirm stake
              </ModalButton>
            )}
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default StakingModal
