import { Box, Container, Heading, Stack, HStack } from "@chakra-ui/react"
import Head from "next/head"
import Account from "components/web3Connection/Account"

type Props = {
  title: string
  bg?: string
  children: JSX.Element
}

const Layout = ({ title, bg = "white", children }: Props): JSX.Element => (
  <>
    <Head>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      {/* <link rel="icon" href="/favicon.ico" /> */}
    </Head>
    <Box bg={bg} minHeight="100vh">
      <Container maxW="container.lg" py={{ base: 4, sm: 12, md: 24 }}>
        <Stack
          direction={{ base: "column-reverse", md: "row" }}
          spacing={8}
          justify="space-between"
          pb={{ base: 8, md: 16 }}
        >
          <Heading
            px={{ base: 4, sm: 0 }}
            fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
            fontFamily="display"
            textAlign="left"
          >
            {title}
          </Heading>
          <HStack>
            <Account />
          </HStack>
        </Stack>
        {children}
      </Container>
    </Box>
  </>
)

export default Layout
