import { Icon, SimpleGrid, Stack, Text } from "@chakra-ui/react"
import Card from "components/common/Card"
import Layout from "components/common/Layout"
import Link from "components/common/Link"
import LinkButton from "components/common/LinkButton"
import { CommunityProvider } from "components/[community]/common/Context"
import Pagination from "components/[community]/common/Pagination"
import Levels from "components/[community]/community/Levels"
import Platforms from "components/[community]/community/Platforms"
import Staked from "components/[community]/community/Staked"
import useIsOwner from "components/[community]/hooks/useIsOwner"
import { Info } from "phosphor-react"
import type { Community } from "temporaryData/communities"

type Props = {
  communityData: Community
}

const CommunityPage = ({ communityData }: Props): JSX.Element => {
  const isOwner = useIsOwner()

  return (
    <CommunityProvider data={communityData}>
      <Layout
        title={communityData.name}
        description={communityData.description || communityData.name}
        imageUrl={communityData.imageUrl}
      >
        <Stack spacing={{ base: 7, xl: 9 }}>
          <Pagination>
            {isOwner && (
              <LinkButton
                href={`/${communityData.urlName}/admin/community`}
                variant="solid"
              >
                Edit
              </LinkButton>
            )}
          </Pagination>
          {communityData.levels.length ? (
            <>
              <SimpleGrid
                templateColumns={{ base: "100%", md: "3fr 2fr" }}
                gap={{ base: 5, md: 7, xl: 9 }}
              >
                <Platforms />
                <Staked />
              </SimpleGrid>
              <SimpleGrid gap="4">
                {communityData.parallelLevels ? (
                  communityData.levels.map((level) => (
                    <Levels key={level.id} levels={[level]} />
                  ))
                ) : (
                  <Levels levels={communityData.levels} />
                )}
              </SimpleGrid>
            </>
          ) : (
            <Card p="6" isFullWidthOnMobile>
              <Text
                fontWeight="medium"
                colorScheme="gray"
                display="flex"
                alignItems="center"
              >
                <Icon as={Info} mr="4" />
                {communityData.owner ? (
                  <span>
                    This community is not using Agora's token-gated access tool yet.
                  </span>
                ) : (
                  <span>
                    This community is not using Agora Space yet.{" "}
                    <Link href="/register" color="indigo.500">
                      Integrate it
                    </Link>{" "}
                    if you're in charge, or tweet them to do so!
                  </span>
                )}
              </Text>
            </Card>
          )}
        </Stack>
      </Layout>
    </CommunityProvider>
  )
}

export {
  getStaticPaths,
  getStaticProps,
} from "components/[community]/utils/dataFetching"

export default CommunityPage
