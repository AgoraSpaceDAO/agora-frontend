import { Center, Flex, Image, Heading, Stack, Button, Text } from "@chakra-ui/react"
import { CommunityContext } from "components/community/Context"
import { useContext } from "react"
import type { Level as LevelType } from "temporaryData/types"
import InfoTags from "./InfoTags"

type Props = {
  data: LevelType
}

const Level = ({ data }: Props): JSX.Element => {
  const {
    chainData: {
      ropsten: { token },
    },
  } = useContext(CommunityContext)

  return (
    <Flex justifyContent="space-between">
      <Stack direction="row" spacing="6">
        <Image src={`${data.imageUrl}`} boxSize="45px" alt="Level logo" />
        <Stack>
          <Heading size="sm">{data.name}</Heading>
          <InfoTags
            data={data.accessRequirement}
            membersCount={data.membersCount}
            tokenSymbol={token.symbol}
          />
          {data.desc && <Text pt="4">{data.desc}</Text>}
        </Stack>
      </Stack>
      <Center>
        <Button colorScheme="primary" fontWeight="medium">
          Stake to join
        </Button>
      </Center>
    </Flex>
  )
}

export default Level
