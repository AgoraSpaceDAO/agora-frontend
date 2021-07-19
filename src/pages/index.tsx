import { Stack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import CategorySection from "components/allCommunities/CategorySection"
import CommunityCard from "components/allCommunities/CommunityCard"
import getJoinedCommunities from "components/allCommunities/utils/getJoinedCommunities"
import { CommunityProvider } from "components/community/Context"
import Layout from "components/Layout"
import { GetStaticProps } from "next"
import { useEffect, useMemo, useRef, useState } from "react"
import useSWR from "swr"
import type { Community } from "temporaryData/communities"
import { communities as communitiesJSON } from "temporaryData/communities"

type Props = {
  communities: Community[]
}

const AllCommunities = ({ communities }: Props): JSX.Element => {
  const { account, library } = useWeb3React()
  const refYours = useRef<HTMLDivElement>(null)
  const refAccess = useRef<HTMLDivElement>(null)
  const refOther = useRef<HTMLDivElement>(null)
  const [showYoursPlaceholder, setShowYoursPlaceholder] = useState<boolean>(true)
  const [showAccessPlaceholder, setShowAccessPlaceholder] = useState<boolean>(true)
  const [showOtherPlaceholder, setShowOtherPlaceholder] = useState<boolean>(true)
  const defaultPlaceholder = !account && !library ? "Wallet not connected" : null

  const hideYoursPlaceholder = () => setShowYoursPlaceholder(false)
  const hideAccessPlaceholder = () => setShowAccessPlaceholder(false)
  const hideOtherPlaceholder = () => setShowOtherPlaceholder(false)

  return (
    <Layout
      title="All communities on Agora"
      bg="linear-gradient(white 0px, var(--chakra-colors-gray-100) 700px)"
    >
      <>
        <Stack spacing={8}>
          <CategorySection
            title="Your communities"
            showPlaceholder={showYoursPlaceholder}
            placeholder={
              defaultPlaceholder ?? "You're not part of any communities yet"
            }
            ref={refYours}
          />
          <CategorySection
            title="Communities you have access to"
            showPlaceholder={showAccessPlaceholder}
            placeholder={
              defaultPlaceholder ?? "You don't have access to any communities"
            }
            ref={refAccess}
          />
          <CategorySection
            title="Other communities"
            showPlaceholder={showOtherPlaceholder}
            placeholder={defaultPlaceholder ?? "There aren't any other communities"}
            ref={refOther}
          />
        </Stack>
        {communities.map((community) => (
          <CommunityProvider data={community} key={community.id}>
            <CommunityCard
              {...{
                refYours,
                refOther,
                refAccess,
                hideYoursPlaceholder,
                hideAccessPlaceholder,
                hideOtherPlaceholder,
              }}
            />
          </CommunityProvider>
        ))}
      </>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => ({
  props: { communities: communitiesJSON },
})

export default AllCommunities
