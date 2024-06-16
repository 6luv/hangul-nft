import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { OutletContext } from "../components/Layout";
import { Rnd } from "react-rnd";

const Create: FC = () => {
  const [mintedList, setMintedList] = useState<number[]>([]);
  const [canvasList, setCanvasList] = useState<number[]>([]);
  const { signer, mintContract } = useOutletContext<OutletContext>();

  const getBalanceOfNfts = async () => {
    try {
      const response = await mintContract?.balanceOfNfts(signer?.address);
      const temp = response.map((v: bigint) => Number(v));
      setMintedList(temp);
    } catch (error) {
      console.error(error);
    }
  };

  const addToCanvas = (index: number) => {
    const updateMintedList = mintedList.map((v, i) => {
      if (index === i) {
        return v - 1;
      }
      return v;
    });
    setMintedList(updateMintedList);
    setCanvasList([...canvasList, index]);
  };

  const removeFromCanvas = (index: number) => {
    const removedItem = canvasList[index];
    const updatedMintedList = mintedList.map((v, i) => {
      if (i === removedItem) {
        return v + 1;
      }
      return v;
    });
    setMintedList(updatedMintedList);

    const updatedCanvasList = canvasList.filter((_, i) => i !== index);
    setCanvasList(updatedCanvasList);
  };

  useEffect(() => {
    getBalanceOfNfts();
  }, [signer, mintContract]);

  return (
    <Flex flexDir="column" w="100%">
      <Flex
        m={12}
        p={4}
        flexGrow={1}
        bgColor="white"
        rounded="lg"
        boxShadow="md"
        alignItems="center"
        justifyContent="space-between"
      >
        <Flex bgColor="green.100" w="84%" h="100%">
          {canvasList.map((v, i) => (
            <Rnd
              default={{
                x: 0,
                y: 0,
                width: 100,
                height: 100,
              }}
              disableDragging={false}
            >
              <Image
                w={28}
                h={28}
                src={`/images/nfts/${v + 1}.png`}
                alt=""
                onDragStart={() => removeFromCanvas(i)}
              />
            </Rnd>
          ))}
        </Flex>
        <Flex
          w="16%"
          bgColor="red.100"
          borderLeft="2px"
          flexDir="column"
          alignItems="center"
          overflowY="auto"
          maxH={500}
        >
          {mintedList?.map((v, i) => {
            if (v > 0) {
              return (
                <Flex flexDir="column" alignItems="center">
                  <Box pos="relative">
                    <Text
                      pos="absolute"
                      top={8}
                      right={2}
                      fontSize={20}
                      fontWeight="semibold"
                      rounded="lg"
                      px={1}
                    >
                      x{v}
                    </Text>
                    <Box mt={8} p={4} boxShadow="lg" rounded="lg">
                      <Image
                        w={28}
                        h={28}
                        src={`/images/nfts/${i + 1}.png`}
                        alt=""
                        draggable="true"
                        onClick={() => addToCanvas(i)}
                      />
                    </Box>
                  </Box>
                </Flex>
              );
            }
          })}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Create;
