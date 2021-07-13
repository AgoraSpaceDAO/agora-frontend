/* eslint-disable react/jsx-props-no-spreading */
import type { ExternalProvider, JsonRpcFetchFunc } from "@ethersproject/providers"
import { Web3Provider } from "@ethersproject/providers"
import { Web3ReactProvider } from "@web3-react/core"
import type { AppProps } from "next/app"
import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react"
import "focus-visible/dist/focus-visible"
import theme from "theme"
import { Web3ConnectionManager } from "components/web3Connection/Web3ConnectionManager"
import { IconContext } from "phosphor-react"

const getLibrary = (provider: ExternalProvider | JsonRpcFetchFunc) =>
  new Web3Provider(provider)

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeProvider options={{}}>
        <IconContext.Provider
          value={{
            color: "currentColor",
            size: "1em",
            weight: "bold",
            mirrored: false,
          }}
        >
          <Web3ReactProvider getLibrary={getLibrary}>
            <Web3ConnectionManager>
              <Component {...pageProps} />
            </Web3ConnectionManager>
          </Web3ReactProvider>
        </IconContext.Provider>
      </ColorModeProvider>
    </ChakraProvider>
  )
}

export default App
