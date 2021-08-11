import {
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  InputGroup,
  InputLeftAddon,
  Textarea,
} from "@chakra-ui/react"
import Section from "components/admin/common/Section"
import { UploadSimple } from "phosphor-react"
import { Controller, useFormContext } from "react-hook-form"
import PhotoUploader from "../common/PhotoUploader"

const Details = ({ errors }): JSX.Element => {
  const { control, watch, register } = useFormContext()

  return (
    <Section
      title="Details"
      description="General information about your community"
      cardType
    >
      <Grid templateColumns={{ base: "100%", md: "repeat(2, 1fr)" }} gap={12}>
        <GridItem>
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              {...register("name", { required: true })}
              isInvalid={!!errors.name}
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl>
            <FormLabel>URL</FormLabel>
            <InputGroup>
              <InputLeftAddon>app.agora.space/</InputLeftAddon>
              <Input
                {...register("urlName")}
                isInvalid={!!errors.urlName}
                placeholder={watch("name")?.toLowerCase().replace(/ /g, "-") || ""}
              />
            </InputGroup>
          </FormControl>
        </GridItem>

        <GridItem colSpan={{ base: 1, md: 2 }}>
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              {...register("description")}
              isInvalid={!!errors.description}
            />
          </FormControl>
        </GridItem>

        <GridItem colSpan={{ base: 1, md: 2 }}>
          <FormControl>
            <FormLabel>Image</FormLabel>
            <Controller
              render={({ field, fieldState }) => (
                <PhotoUploader
                  ref={field.ref}
                  isInvalid={fieldState.invalid}
                  buttonIcon={UploadSimple}
                  buttonText="Change image"
                  onPhotoChange={(newPhoto: File) => field.onChange(newPhoto)}
                  {...field}
                />
              )}
              name="image"
              control={control}
            />
          </FormControl>
        </GridItem>
      </Grid>
    </Section>
  )
}

export default Details
