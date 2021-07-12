/* eslint-disable react/jsx-props-no-spreading */
import { Button, ButtonGroup, Divider, useDisclosure } from "@chakra-ui/react"
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core"
import Card from "components/common/Card"
import { useCommunity } from "components/community/Context"
import { Web3Connection } from "components/web3Connection/Web3ConnectionManager"
import useBalance from "hooks/useBalance"
import { LinkBreak, SignIn, Wallet } from "phosphor-react"
import { useContext } from "react"
import type { Token } from "temporaryData/types"
import shortenHex from "utils/shortenHex"
import AccountModal from "../AccountModal"
import useENSName from "./hooks/useENSName"

type Props = {
  token: Token
}

const Account = (): JSX.Element => {
  const communityData = useCommunity()
  const { error, account } = useWeb3React()
  const { openModal, triedEager } = useContext(Web3Connection)
  const ENSName = useENSName(account)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const cardStyleProps = {
    borderRadius: "2xl",
    width: "max",
    maxWidth: { base: "calc(100% - var(--chakra-space-8))", md: "max" },
    marginLeft: "auto",
  }

  if (typeof window === "undefined") {
    return (
      <Card {...cardStyleProps}>
        <Button variant="ghost" isLoading>
          Connect to a wallet
        </Button>
      </Card>
    )
  }
  if (error instanceof UnsupportedChainIdError) {
    return (
      <Card {...cardStyleProps}>
        <Button
          variant="ghost"
          onClick={openModal}
          leftIcon={<LinkBreak />}
          colorScheme="red"
        >
          Wrong Network
        </Button>
      </Card>
    )
  }
  if (typeof account !== "string") {
    return (
      <Card {...cardStyleProps}>
        <Button
          variant="ghost"
          isLoading={!triedEager}
          onClick={openModal}
          leftIcon={<SignIn />}
        >
          Connect to a wallet
        </Button>
      </Card>
    )
  }
  return (
    <>
      <Card {...cardStyleProps}>
        <ButtonGroup isAttached variant="ghost">
          {!!communityData && (
            <>
              <Balance token={communityData.chainData.token} />
              <Divider orientation="vertical" h="var(--chakra-space-11)" />
            </>
          )}
          <Button leftIcon={<Wallet />} onClick={onOpen}>
            {ENSName || `${shortenHex(account, 4)}`}
          </Button>
        </ButtonGroup>
      </Card>
      <AccountModal {...{ isOpen, onClose }} />
    </>
  )
}

const Balance = ({ token }: Props): JSX.Element => {
  const { data: balance } = useBalance(token)

  return (
    <Button mr="-px" isLoading={!balance}>
      {`${balance} ${token.name}`}
    </Button>
  )
}

export default Account
