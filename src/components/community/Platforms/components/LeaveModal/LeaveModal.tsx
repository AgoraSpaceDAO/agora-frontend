import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  VStack,
  PortalProps,
} from "@chakra-ui/react"
import { Error } from "components/common/Error"
import ModalButton from "components/common/ModalButton"
import useLeaveModalMachine from "./hooks/useLeaveModalMachine"
import platformsContent from "../../platformsContent"
import processLeavePlatformMessage from "./utils/processLeavePlatformError"

type Props = {
  portalProps: PortalProps
  platform: string
  isOpen: boolean
  onClose: () => void
}

const LeaveModal = ({
  portalProps,
  platform,
  isOpen,
  onClose,
}: Props): JSX.Element => {
  const [state, send] = useLeaveModalMachine(platform)
  const {
    leave: { title, membershipDescription, leaveDescription, buttonText },
  } = platformsContent[platform]

  const closeModal = () => {
    send("CLOSE_MODAL")
    onClose()
  }
  return (
    <Modal portalProps={portalProps} isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Error
            error={state.context.error}
            processError={processLeavePlatformMessage}
          />
          <VStack spacing={5}>
            <Text>{membershipDescription}</Text>
            <Text>{leaveDescription}</Text>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <ModalButton
            isLoading={state.value === "fetching"}
            loadingText="In progress"
            onClick={() => send("LEAVE")}
          >
            {buttonText}
          </ModalButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default LeaveModal
