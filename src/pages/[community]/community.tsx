import { Icon, SimpleGrid, Stack, Text } from "@chakra-ui/react"
import Card from "components/common/Card"
import Layout from "components/common/Layout"
import { CommunityProvider } from "components/[community]/common/Context"
import Pagination from "components/[community]/common/Pagination"
import Levels from "components/[community]/community/Levels"
import Platforms from "components/[community]/community/Platforms"
import Staked from "components/[community]/community/Staked"
import { Info } from "phosphor-react"
import type { Community } from "temporaryData/communities"

type Props = {
  communityData: Community
}

const CommunityPage = ({ communityData }: Props): JSX.Element => (
  <Layout title={communityData.name} imageUrl={communityData.imageUrl}>
    <Stack spacing={{ base: 7, xl: 9 }}>
      <Pagination />
      {communityData.levels.length ? (
        <CommunityProvider data={communityData} shouldRenderWrapper={false}>
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
        </CommunityProvider>
      ) : (
        <Card p="6" isFullWidthOnMobile>
          <Text
            fontWeight="medium"
            colorScheme="gray"
            display="flex"
            alignItems="center"
          >
            <Icon as={Info} mr="2" />
            This community is not using Agora Space yet. Let them know they should!
          </Text>
        </Card>
      )}
    </Stack>
  </Layout>
)

export {
  getStaticPaths,
  getStaticProps,
} from "components/[community]/utils/dataFetching"

export default CommunityPage
