import { Stack, Text, useColorMode, Wrap } from "@chakra-ui/react"
import { useCommunity } from "components/community/Context"
import { Lock, LockOpen, LockSimpleOpen, Tag, Users } from "phosphor-react"
import msToReadableFormat from "utils/msToReadableFormat"
import { useLevelData } from "./Level/Context"

const accessRequirementIcons = {
  OPEN: LockSimpleOpen,
  HOLD: LockOpen,
  STAKE: Lock,
}

type ChildProps = {
  icon: React.ElementType
  label: string
}

const InfoTag = ({ icon: Icon, label }: ChildProps): JSX.Element => {
  const { colorMode } = useColorMode()

  return (
    <Stack
      as="li"
      direction="row"
      textColor={colorMode === "light" ? "gray.450" : "gray.350"}
      alignItems="center"
      fontSize={{ base: "sm", md: "md" }}
      spacing={{ base: 1, sm: 2 }}
      pr={{ base: "2", md: "3" }}
    >
      <Icon size="1.3em" />
      <Text fontWeight="medium">{label}</Text>
    </Stack>
  )
}

const InfoTags = (): JSX.Element => {
  const { stakeTimelockMs, requirementType, requirementAmount, membersCount } =
    useLevelData()
  const {
    chainData: {
      token: { symbol: tokenSymbol },
    },
  } = useCommunity()

  return (
    <Wrap direction="row" spacing={{ base: 2, lg: 4 }}>
      <InfoTag
        icon={accessRequirementIcons[requirementType]}
        label={`${requirementType} ${
          requirementType === "STAKE"
            ? `for ${msToReadableFormat(stakeTimelockMs)}`
            : ``
        }`}
      />
      {requirementType !== "OPEN" && (
        <InfoTag icon={Tag} label={`${requirementAmount} ${tokenSymbol}`} />
      )}
      <InfoTag icon={Users} label={`${membersCount} members`} />
    </Wrap>
  )
}

export default InfoTags
