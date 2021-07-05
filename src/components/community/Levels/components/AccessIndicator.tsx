import { useState, useEffect } from "react"
import { motion } from "framer-motion"

type LevelData = {
  index: number
  status: "idle" | "access" | "focus"
  isDisabled: boolean
  element: HTMLElement
}

type Props = { levelsState: { [x: number]: LevelData } }

const AccessIndicator = ({ levelsState }: Props) => {
  const [accessHeight, setAccessHeight] = useState(0)
  const [focusHeight, setFocusHeight] = useState(0)
  const [focusColor, setFocusColor] = useState("var(--chakra-colors-primary-100)")

  useEffect(() => {
    const levelsArray: LevelData[] = Object.values(levelsState)

    if (levelsArray.length === 0) {
      return
    }

    // Set the height of the first indicator
    const accessedLevels = levelsArray.filter(
      (level: LevelData) => level.status === "access"
    )

    let newAccessHeight = 0
    accessedLevels.forEach((level: LevelData) => {
      newAccessHeight += level.element.getBoundingClientRect().height
    })

    setAccessHeight(newAccessHeight)

    // Set the height of the second indicator
    let focusLevel = null
    focusLevel = levelsArray.find((level: LevelData) => level.status === "focus")
    const newFocusHeight =
      focusLevel?.element.getBoundingClientRect().bottom -
        focusLevel?.element.parentElement.getBoundingClientRect().top -
        accessHeight || 0

    setFocusHeight(newFocusHeight)

    // Set the indicator color
    const disabled = levelsArray.pop().isDisabled
    setFocusColor(
      disabled ? "var(--chakra-colors-gray-200)" : "var(--chakra-colors-primary-100)"
    )
  }, [levelsState])

  return (
    <>
      <motion.div
        style={{
          position: "absolute",
          top: accessHeight,
          left: 0,
          height: 0,
          width: "6px",
        }}
        transition={{ type: "just" }}
        animate={{
          height: focusHeight,
          background: focusColor,
        }}
      />
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: 0,
          width: "6px",
          background: "var(--chakra-colors-primary-500)",
        }}
        transition={{ type: "just" }}
        animate={{
          height: accessHeight,
        }}
      />
    </>
  )
}

export default AccessIndicator
