import { Heading, Icon, Portal, Stack, useColorMode } from "@chakra-ui/react"
import Card from "components/common/Card"
import Link from "components/common/Link"
import { Plus } from "phosphor-react"
import { MutableRefObject } from "react"

type Props = {
  refAccess: MutableRefObject<HTMLDivElement>
}

const IntegrateCommunityCard = ({ refAccess }: Props): JSX.Element => {
  const { colorMode } = useColorMode()

  return (
    <Portal containerRef={refAccess}>
      <Link
        href="/register"
        _hover={{ textDecor: "none" }}
        borderRadius="2xl"
        w="full"
        h="full"
      >
        <Card
          role="group"
          justifyContent="center"
          px={{ base: 5, sm: 7 }}
          py="7"
          w="full"
          h="full"
          bg="transparent"
          boxShadow="none"
          borderWidth={2}
          borderColor={colorMode === "light" ? "gray.200" : "gray.600"}
        >
          <Stack
            position="relative"
            direction="row"
            spacing={{ base: 5, sm: 10 }}
            alignItems="center"
          >
            <Icon
              as={Plus}
              boxSize={8}
              color={colorMode === "light" ? "gray.300" : "gray.500"}
            />
            <Stack spacing="3">
              <Heading as="h3" size="sm" color="gray.400">
                Integrate your token
              </Heading>
            </Stack>
          </Stack>
        </Card>
      </Link>
    </Portal>
  )
}

export default IntegrateCommunityCard
