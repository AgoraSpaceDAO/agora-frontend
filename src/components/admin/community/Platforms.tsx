import {
  Badge,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Spinner,
  Stack,
  Switch,
  Text,
  useColorMode,
  VStack,
} from "@chakra-ui/react"
import Section from "components/admin/common/Section"
import Link from "components/common/Link"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"
import { Platform } from "temporaryData/types"

type Props = {
  activePlatforms?: Platform[]
  comingSoon?: boolean
}

type DiscordError = {
  message: string
  type: "server" | "channels"
  showAuthBtn?: boolean
}

type DiscordChannel = {
  id: string
  name: string
  category: string
}

const Platforms = ({
  activePlatforms = [],
  comingSoon = false,
}: Props): JSX.Element => {
  const {
    watch,
    register,
    getValues,
    formState: { errors },
  } = useFormContext()

  const { colorMode } = useColorMode()

  const [discordError, setDiscordError] = useState<DiscordError | null>(null)
  const [channelSelectLoading, setChannelSelectLoading] = useState(false)
  const [discordChannels, setDiscordChannels] = useState<DiscordChannel[] | null>(
    null
  )

  const discordServerIdChange = watch("discordServerId")

  const onServerIdChange = (serverId) => {
    if (errors.discordServerId || discordError?.type === "server") return

    setChannelSelectLoading(true)
    fetch(`${process.env.NEXT_PUBLIC_API}/community/discordChannels/${serverId}`)
      .then((response) => {
        if (response.status !== 200) {
          setChannelSelectLoading(false)
          setDiscordError({
            message: "Couldn't fetch channels list from your Discord server",
            type: "channels",
          })
          setDiscordChannels(null)
          return
        }

        return response.json()
      })
      .then((data) => {
        setDiscordChannels(data)
        setChannelSelectLoading(false)

        if (!Array.isArray(data) || data.length === 0) {
          setDiscordError({
            message:
              "It seems like you haven't invited Medousa to your Discord server yet.",
            type: "channels",
          })
          return
        }

        setDiscordError(null)
      })
      .catch(console.error) // TODO?...
  }

  // Fetch channels on server ID change. I've used a useEffect here, so it'll run on the admin page too, when we fill the form data with the data which we fetch from the API
  useEffect(() => {
    if (discordServerIdChange) {
      onServerIdChange(getValues("discordServerId"))
    }
  }, [discordServerIdChange])

  return (
    <Section
      title="Platforms"
      description="Chat platforms your community will be available on"
      cardType
    >
      <VStack>
        <Grid
          width="full"
          templateColumns={{ base: "100%", md: "20% auto" }}
          gap={{ base: 8, md: 12 }}
        >
          {comingSoon && (
            <GridItem colSpan={{ base: 1, md: 2 }} mb={-8}>
              <Badge>Coming soon</Badge>
            </GridItem>
          )}

          <GridItem>
            <FormControl
              display="flex"
              height="full"
              alignItems="center"
              isDisabled={comingSoon}
            >
              <Switch
                colorScheme="primary"
                mr={4}
                {...register("isDCEnabled")}
                defaultChecked={
                  !!activePlatforms.find((platform) => platform.name === "DISCORD")
                }
                isDisabled={comingSoon}
              />
              <FormLabel margin={0}>Discord</FormLabel>
            </FormControl>
          </GridItem>

          <GridItem>
            {watch("isDCEnabled") ? (
              <VStack spacing={4} alignItems="start">
                <FormControl isDisabled={comingSoon}>
                  <InputGroup>
                    <InputLeftAddon>Server ID</InputLeftAddon>
                    <Input
                      width={64}
                      {...register("discordServerId", {
                        required: watch("isDCEnabled"),
                        minLength: 17,
                      })}
                      isInvalid={errors.discordServerId}
                    />
                  </InputGroup>
                </FormControl>
                {discordError && discordError.type === "server" && (
                  <HStack spacing={4} justifyItems="center">
                    <Text
                      color={colorMode === "light" ? "red.500" : "red.400"}
                      fontSize="sm"
                      mt={2}
                      height={8}
                    >
                      {discordError.message}
                    </Text>
                    {false && discordError.showAuthBtn && (
                      <Button
                        ml={4}
                        size="sm"
                        colorScheme="DISCORD"
                        isDisabled={!watch("isDCEnabled")}
                      >
                        Authenticate
                      </Button>
                    )}
                  </HStack>
                )}

                {channelSelectLoading && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.75 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.75 }}
                    >
                      <Spinner />
                    </motion.div>
                  </AnimatePresence>
                )}
                {discordError && discordError.type === "channels" && (
                  <Stack
                    direction={{ base: "column", lg: "row" }}
                    spacing={2}
                    justifyContent="center"
                  >
                    <Text
                      color={colorMode === "light" ? "red.500" : "red.400"}
                      fontSize="sm"
                      mt={2}
                      height={{ base: "auto", lg: 4 }}
                    >
                      {discordError.message}
                    </Text>
                    <Link
                      href="https://discord.com/api/oauth2/authorize?client_id=868172385000509460&permissions=8&scope=bot%20applications.commands"
                      target="_blank"
                      _hover={{ textDecoration: "none" }}
                    >
                      <Button size="sm" colorScheme="DISCORD" width="max-content">
                        Invite now
                      </Button>
                    </Link>
                  </Stack>
                )}
                {discordChannels?.length > 0 && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.75 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.75 }}
                    >
                      <FormControl isDisabled={comingSoon}>
                        <FormLabel>Invite channel</FormLabel>

                        <Select
                          width={64}
                          placeholder="Select one"
                          {...register("inviteChannel", {
                            required: watch("isDCEnabled"),
                          })}
                          isInvalid={errors.inviteChannel}
                        >
                          {discordChannels.map((channel) => (
                            <option key={channel.id} value={channel.id}>
                              {`#${channel.name} (${channel.category})`}
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                    </motion.div>
                  </AnimatePresence>
                )}
              </VStack>
            ) : (
              <Text colorScheme="gray">
                Medousa will generate roles on your Discord server for every level
              </Text>
            )}
          </GridItem>

          <GridItem>
            <FormControl
              display="flex"
              height="full"
              alignItems="center"
              isDisabled={comingSoon}
            >
              <Switch
                colorScheme="primary"
                mr={4}
                {...register("isTGEnabled")}
                defaultChecked={
                  !!activePlatforms.find((platform) => platform.name === "TELEGRAM")
                }
                isDisabled={comingSoon}
              />
              <FormLabel margin={0}>Telegram</FormLabel>
            </FormControl>
          </GridItem>

          <GridItem>
            <Text colorScheme="gray">
              You'll need a group for each level, with{" "}
              <Link
                href="https://t.me/agoraspacebot"
                target="_blank"
                color="telegram.500"
              >
                @agoraspacebot
              </Link>{" "}
              being added to them (
              <Link
                href="https://agora-space.gitbook.io/agoraspace/tools/role-management-bot/telegram#2-invite-medousa"
                target="_blank"
                color="telegram.500"
              >
                help
              </Link>
              ). You'll have to set the belonging group for each level below.
            </Text>
          </GridItem>

          <GridItem colSpan={{ base: 1, md: 2 }}>
            <Divider />
          </GridItem>

          <GridItem colSpan={{ base: 1, md: 2 }} mb={-8}>
            <Badge>Coming soon</Badge>
          </GridItem>

          <GridItem>
            <FormControl display="flex" height="full" alignItems="center" isDisabled>
              <Switch colorScheme="primary" mr={4} isDisabled />
              <FormLabel width="max-content" margin={0}>
                Bridge platforms
              </FormLabel>
            </FormControl>
          </GridItem>
          <GridItem>
            <Text colorScheme="gray">
              All messages will be forwarded to every platform, so the community is
              unified
            </Text>
          </GridItem>
        </Grid>
      </VStack>
    </Section>
  )
}

export default Platforms
