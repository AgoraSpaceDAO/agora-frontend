import { Web3Provider } from "@ethersproject/providers"
import { useWeb3React } from "@web3-react/core"
import { createContext, PropsWithChildren, useContext, useRef } from "react"

type SignedMessages = Map<string, string>

const SignContext = createContext<SignedMessages>(new Map<string, string>())

const PersonalSignStore = ({
  children,
}: PropsWithChildren<unknown>): JSX.Element => {
  const signedMessages = useRef<SignedMessages>(new Map<string, string>())

  return (
    <SignContext.Provider value={signedMessages.current}>
      {children}
    </SignContext.Provider>
  )
}

const usePersonalSign = (): [
  (message: string) => Promise<string>, // sign
  (message: string) => boolean, // hasMessage
  (message: string) => string // getSign
] => {
  const signedMessages = useContext(SignContext)
  const { library, account } = useWeb3React<Web3Provider>()

  const sign = async (message: string): Promise<string> => {
    if (signedMessages.has(message)) return signedMessages.get(message)
    const signed = await library.getSigner(account).signMessage(message)
    signedMessages.set(message, signed)
    return signed
  }

  return [
    sign,
    (message: string) => signedMessages.has(message),
    (message: string) => signedMessages.get(message),
  ]
}

export { usePersonalSign, PersonalSignStore }