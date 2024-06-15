import { Flex, Grid, Text } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { OutletContext } from "../components/Layout";
import SaleNftCard from "../components/SaleNftCard";
import { FiXCircle } from "react-icons/fi";

const Sale: FC = () => {
  const [saleTokens, setSaleTokens] = useState<ISaleNftMetadata[]>([]);
  const { signer, saleContract } = useOutletContext<OutletContext>();

  const getOnSaleTokens = async () => {
    try {
      const response = await saleContract?.getOnSaleTokens();

      const tempSaleTokens: ISaleNftMetadata[] = response.map((v: any) => ({
        saleId: Number(v[0]),
        tokenId: Number(v[1]),
        price: v[2],
        saller: v[3],
      }));

      setSaleTokens(tempSaleTokens);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!saleContract) return;

    getOnSaleTokens();
  }, [saleContract]);

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
        flexDir="column"
      >
        {signer ? (
          <>
            <Flex
              h={20}
              borderBottom="2px solid black"
              w="100%"
              alignItems="center"
              justifyContent="center"
              gap={4}
            >
              <Text fontSize={["20", "32", "32"]} fontWeight="bold">
                판매 중인 NFT : {saleTokens.length}개
              </Text>
            </Flex>
            <Flex
              w="100%"
              h="100%"
              flexDir="column"
              alignItems="center"
              justifyContent="center"
              overflowY="auto"
            >
              <Grid
                templateColumns={[
                  "repeat(1, 1fr)",
                  "repeat(2, 1fr)",
                  "repeat(2, 1fr)",
                  "repeat(3, 1fr)",
                  "repeat(4, 1fr)",
                ]}
                justifyContent="center"
                gap={16}
                maxH={[375, 420, 520]}
                overflowY="auto"
                mt={[2, 2, 0, 0]}
              >
                {saleTokens.map((v, i) => (
                  <SaleNftCard
                    key={i}
                    tokenId={v.tokenId}
                    saleId={v.saleId}
                    price={v.price}
                  />
                ))}
              </Grid>
            </Flex>
          </>
        ) : (
          <Flex w="100%" h="100%" alignItems="center" justifyContent="center">
            <Flex
              w="2xl"
              h={40}
              rounded="2xl"
              border="2px"
              boxShadow="lg"
              alignItems="center"
              justifyContent="center"
            >
              <FiXCircle size={72} color="red" />
              <Text fontSize={48} fontWeight="bold" ml={8}>
                로그인 후 이용해 주세요!
              </Text>
            </Flex>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default Sale;
