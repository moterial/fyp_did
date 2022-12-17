import {Flex,Box, Text,Image, Stack, Link} from "@chakra-ui/react"
import React from "react"

export default function Header(){
  const [isOpen, setIsOpen] = React.useState(false)

  const toggle = () => setIsOpen(!isOpen)

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
      mb={8}
      px={8}    
      py={4}
      bg='teal'
    >
        <Box>
            <Text fontSize="md" fontWeight="bold" color='white'>
                <Image src='/assets/metaverse.png'
                boxSize='70px'/>
                IDENTITY
            </Text>
        </Box>

        <Stack
            spacing={8}
            align="center"
            justify={["center", "space-between", "flex-end", "flex-end"]}
            direction={["column", "row", "row", "row"]}
            pt={[4, 4, 0, 0]}
        >
            <Link >
                <Text display="block" fontSize="lg" fontWeight="bold" color='white'>
                   Menu1
                </Text>
            </Link>

            <Link >
                <Text display="block" fontSize="lg" fontWeight="bold" color='white'>
                   Menu2
                </Text>
            </Link>

            <Link >
                <Text display="block" fontSize="lg" fontWeight="bold" color='white'>
                   Menu3
                </Text>
            </Link>


        </Stack>
    </Flex>
  )
}