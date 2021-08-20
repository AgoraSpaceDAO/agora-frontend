/* eslint-disable react/destructuring-assignment */
import { Box, useColorMode, useRadio } from "@chakra-ui/react"

const RadioCard = (props) => {
  const { colorMode } = useColorMode()

  const { getInputProps, getCheckboxProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  return (
    <Box as="label" width="full">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderRadius="md"
        borderWidth={2}
        bgColor={colorMode === "light" ? "blackAlpha.100" : "whiteAlpha.100"}
        borderColor="transparent"
        fontWeight="medium"
        color={colorMode === "light" ? "gray.700" : "white"}
        _checked={{
          borderColor: colorMode === "light" ? "primary.300" : "primary.700",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        px={5}
        py={3}
      >
        {props.children}
      </Box>
    </Box>
  )
}

export default RadioCard
