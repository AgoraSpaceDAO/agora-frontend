import { Stack, Text } from "@chakra-ui/react"
import { Lock, LockOpen, LockSimpleOpen, Tag, Users } from "phosphor-react"
import type { AccessRequirement, Icon as IconType } from "temporaryData/types"
import msToReadableFormat from "utils/msToReadableFormat"

type Props = {
  data: AccessRequirement
  membersCount: number
  tokenSymbol: string
}

const accessRequirementIcons = {
  open: LockSimpleOpen,
  hold: LockOpen,
  stake: Lock,
}

type ChildProps = {
  icon: IconType
  label: string
}

const InfoTag = ({ icon: Icon, label }: ChildProps): JSX.Element => (
  <Stack direction="row" spacing="2" textColor="gray.450" alignItems="center">
    <Icon size="1.3em" />
    <Text fontWeight="medium">{label}</Text>
  </Stack>
)

const InfoTags = ({ data, membersCount, tokenSymbol }: Props): JSX.Element => (
  <Stack direction="row" spacing="8">
    <InfoTag
      icon={accessRequirementIcons[data.type]}
      label={`${data.type} ${
        data.type === "stake" ? `for ${msToReadableFormat(data.timelockMs)}` : ``
      }`}
    />
    {data.type !== "open" && (
      <InfoTag icon={Tag} label={`${data.amount} ${tokenSymbol}`} />
    )}
    <InfoTag icon={Users} label={`${membersCount} members`} />
  </Stack>
)

export default InfoTags
