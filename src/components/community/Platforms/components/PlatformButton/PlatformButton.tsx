import { Button, useDisclosure, useColorMode } from "@chakra-ui/react"
import theme from "theme"
import { useWeb3React } from "@web3-react/core"
import platformsContent from "../../platformsContent"
import JoinModal from "../JoinModal"
import LeaveModal from "../LeaveModal"
import useIsMember from "./hooks/useIsMember"

type Props = {
  platform: string
}

const PlatformButton = ({ platform }: Props): JSX.Element => {
  const { colorMode } = useColorMode()
  const { account } = useWeb3React()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { logo: Logo } = platformsContent[platform]
  const isMember = useIsMember(platform)

  return (
    <>
      <Button
        onClick={onOpen}
        colorScheme={platform}
        color="white"
        bgColor={theme.colors[platform][400]}
        fontWeight="medium"
        leftIcon={<Logo />}
        variant={isMember ? "outline" : "solid"}
        disabled={!account}
      >
        {`${isMember ? "Leave" : "Join"} ${
          platform.charAt(0).toUpperCase() + platform.slice(1)
        }`}
      </Button>
      {isMember ? (
        <LeaveModal {...{ platform, isOpen, onClose }} />
      ) : (
        <JoinModal {...{ platform, isOpen, onClose }} />
      )}
    </>
  )
}

export default PlatformButton
