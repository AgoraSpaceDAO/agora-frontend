import { Box, Button, Fade, Spinner, Stack, Tooltip, VStack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import NotConnectedError from "components/admin/common/NotConnectedError"
import Levels from "components/admin/community/Levels"
import Platforms from "components/admin/community/Platforms"
import useCommunityData from "components/admin/hooks/useCommunityData"
import useSpaceFactory from "components/admin/hooks/useSpaceFactory"
import useSubmitLevelsData from "components/admin/hooks/useSubmitLevelsData"
import useSubmitPlatformsData from "components/admin/hooks/useSubmitPlatformsData"
import convertMsToMonths from "components/admin/utils/convertMsToMonths"
import Layout from "components/common/Layout"
import LinkButton from "components/common/LinkButton"
import Pagination from "components/[community]/common/Pagination"
import DeploySpace from "components/[community]/common/Pagination/components/DeploySpace"
import useColorPalette from "components/[community]/hooks/useColorPalette"
import { Chains, SpaceFactory } from "connectors"
import useWarnIfUnsavedChanges from "hooks/useWarnIfUnsavedChanges"
import { useRouter } from "next/router"
import { useEffect, useMemo } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { RequirementType } from "temporaryData/types"

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

export type Level = {
  id: number
  dbId: number
  name: string
  image: string
  description: string
  requirementType: RequirementType
  requirement: number
  stakeTimelockMs: string | number
  telegramGroupId: string
  tokenSymbol?: string
}

export type FormData = {
  tokenSymbol: string
  isTGEnabled: boolean
  stakeToken: string
  isDCEnabled: boolean
  discordServerId: string
  inviteChannel: string
  levels: Level[]
}

const AdminCommunityPage = (): JSX.Element => {
  const router = useRouter()
  const { chainId, account } = useWeb3React()
  const { communityData } = useCommunityData()
  const generatedColors = useColorPalette(
    "chakra-colors-primary",
    communityData?.themeColor || "#71717a"
  )
  /* const isOwner = useRedirectIfNotOwner(
    communityData?.owner?.address,
    `/${communityData?.urlName}`
  ) */
  const isOwner = true
  const methods = useForm({ mode: "all" })

  const { contractAddress } = useSpaceFactory(communityData?.chainData.token.address)
  const hasContract =
    typeof contractAddress === "string" && contractAddress !== ZERO_ADDRESS
  const factoryAvailable = typeof SpaceFactory[Chains[chainId]] === "string"
  const [, , ...currentPath] = router.asPath.split("/")
  const isCommunityAdminPage =
    currentPath.includes("admin") && currentPath.includes("community")
  const levels = useWatch({
    name: "levels",
    defaultValue: [],
    control: methods.control,
  })
  const hasStakingLevel = useMemo(
    () =>
      levels.length > 0 && levels.some((level) => level.requirementType === "STAKE"),
    [levels]
  )

  const [discordDirty, telegramDirty, levelsDirty] = useMemo(
    () => [
      ["isDCEnabled", "discordServerId", "inviteChannel"].some(
        (field) => typeof methods.formState.dirtyFields[field] !== "undefined"
      ),
      typeof methods.formState.dirtyFields.isTGEnabled !== "undefined",
      typeof methods.formState.dirtyFields.levels !== "undefined",
    ],
    [methods.formState]
  )

  const redirectToCommunityPage = () => {
    fetch(`/api/preview?urlName=${communityData?.urlName}`)
      .then((res) => res.json())
      .then((cookies: string[]) => {
        cookies.forEach((cookie: string) => {
          document.cookie = cookie
        })

        router.push(`/${communityData?.urlName}/community`)
      })
  }

  const HTTPMethod = communityData?.levels?.length > 0 ? "PATCH" : "POST"

  const { loading: levelsLoading, onSubmit: onLevelsSubmit } =
    useSubmitLevelsData(HTTPMethod)
  const { loading: platformsLoading, onSubmit: onPlatformsSubmit } =
    useSubmitPlatformsData(
      telegramDirty,
      discordDirty,
      levelsDirty ? methods.handleSubmit(onLevelsSubmit) : redirectToCommunityPage
    )

  // Set up the default form field values if we have the necessary data
  useEffect(() => {
    if (communityData) {
      const discordServer = communityData.communityPlatforms.find(
        (platform) => platform.active && platform.name === "DISCORD"
      )

      // Reset the form state so we can watch the "isDirty" prop
      methods.reset({
        tokenSymbol: communityData.chainData?.token.symbol,
        isTGEnabled: !!communityData.communityPlatforms
          .filter((platform) => platform.active)
          .find((platform) => platform.name === "TELEGRAM"),
        stakeToken: communityData.chainData.stakeToken,
        isDCEnabled: !!discordServer,
        discordServerId: discordServer?.platformId || undefined,
        inviteChannel: discordServer?.inviteChannel || undefined,
        levels: communityData.levels.map((level) => ({
          id: level.id,
          dbId: level.id, // Needed for proper form management
          name: level.name || undefined,
          image: level.imageUrl || undefined,
          description: level.description || undefined,
          requirementType: level.requirementType,
          requirement: level.requirement || undefined,
          stakeTimelockMs: convertMsToMonths(level.stakeTimelockMs),
          telegramGroupId: level.telegramGroupId || undefined,
        })),
      })
    }
  }, [communityData])

  useWarnIfUnsavedChanges(
    methods.formState?.isDirty && !methods.formState.isSubmitted
  )

  // If the user isn't logged in, display an error message
  if (!chainId) {
    return (
      <NotConnectedError
        title={communityData ? `${communityData.name} - Settings` : "Loading..."}
      />
    )
  }

  // If we haven't fetched the community data / form data yet, display a spinner
  if (!communityData || !methods)
    return (
      <Box sx={generatedColors}>
        <VStack pt={16} justifyItems="center">
          <Spinner size="xl" />
        </VStack>
      </Box>
    )

  // Otherwise render the admin page
  return (
    <Fade in={!!communityData}>
      <FormProvider {...methods}>
        <Box sx={generatedColors}>
          <Layout
            title={`${communityData.name} - Settings`}
            imageUrl={communityData.imageUrl}
          >
            {account && isOwner && (
              <Stack spacing={{ base: 7, xl: 9 }}>
                <Pagination isAdminPage>
                  {factoryAvailable &&
                    // !hasContract &&
                    isCommunityAdminPage &&
                    hasStakingLevel && <DeploySpace />}
                  <Tooltip
                    label={
                      !factoryAvailable && hasStakingLevel
                        ? "Staking levels are not supported on this network"
                        : "First you have to deploy a contract for the staking level(s)"
                    }
                    isDisabled={
                      (factoryAvailable || !hasStakingLevel) &&
                      (!factoryAvailable || !hasStakingLevel || hasContract)
                    }
                  >
                    {discordDirty || telegramDirty || levelsDirty ? (
                      <Button
                        isLoading={levelsLoading || platformsLoading}
                        colorScheme="primary"
                        onClick={methods.handleSubmit(
                          discordDirty || telegramDirty
                            ? onPlatformsSubmit
                            : onLevelsSubmit
                        )}
                        isDisabled={
                          (!factoryAvailable && hasStakingLevel) ||
                          (factoryAvailable && hasStakingLevel && !hasContract)
                        }
                      >
                        Save
                      </Button>
                    ) : (
                      <LinkButton
                        variant="solid"
                        href={`/${communityData.urlName}/community`}
                      >
                        Done
                      </LinkButton>
                    )}
                  </Tooltip>
                </Pagination>
                <VStack pb={{ base: 16, xl: 0 }} spacing={12}>
                  <Platforms />
                  <Levels />
                </VStack>
              </Stack>
            )}
          </Layout>
        </Box>
      </FormProvider>
    </Fade>
  )
}

export default AdminCommunityPage
