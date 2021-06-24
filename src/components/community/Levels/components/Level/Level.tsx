import {
  Flex,
  Image,
  Heading,
  Stack,
  Button,
  HStack,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { useCommunity } from "components/community/Context"
import { CheckCircle } from "phosphor-react"
import type { Level as LevelType } from "temporaryData/types"
import InfoTags from "../../../../common/InfoTags"
import StakingModal from "../StakingModal"
import useLevelAccess from "./hooks/useLevelAccess"

type Props = {
  data: LevelType
}

const Level = ({ data }: Props): JSX.Element => {
  const communityData = useCommunity()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [hasAccess, noAccessMessage] = useLevelAccess(data.accessRequirement)

  return (
    <Flex justifyContent="space-between">
      <Stack direction="row" spacing="6">
        <Image src={`${data.imageUrl}`} boxSize="45px" alt="Level logo" />
        <Stack>
          <Heading size="sm">{data.name}</Heading>
          <InfoTags
            type="level"
            data={data.accessRequirement}
            membersCount={data.membersCount}
            tokenSymbol={communityData.chainData.token.symbol}
          />
          {data.desc && <Text pt="4">{data.desc}</Text>}
        </Stack>
      </Stack>
      <Stack alignItems="flex-end" justifyContent="center">
        {hasAccess && (
          <HStack spacing="3">
            <Text fontWeight="medium">You have access</Text>
            <CheckCircle
              color="var(--chakra-colors-green-500)"
              weight="fill"
              size="26"
            />
          </HStack>
        )}
        {!hasAccess && data.accessRequirement.type === "stake" && (
          <Button
            colorScheme="primary"
            fontWeight="medium"
            onClick={onOpen}
            disabled={!!noAccessMessage}
          >
            Stake to join
          </Button>
        )}
        {!hasAccess &&
          data.accessRequirement.type === "stake" &&
          !noAccessMessage && (
            <StakingModal
              name={data.name}
              accessRequirement={data.accessRequirement}
              {...{ isOpen, onClose }}
            />
          )}
        {noAccessMessage && <Text fontWeight="medium">{noAccessMessage}</Text>}
      </Stack>
    </Flex>
  )
}

export default Level
