import React, { useEffect, useState } from "react";
import { Box, Button, Heading, Text } from "@chakra-ui/react";
import URLSConfig from "../configs/urlConfig.json";
import { get } from "@shiksha/common-lib";

function Channel() {
  const [frameWork, setFrameWork] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getFrameWork();
  }, []);

  async function getFrameWork(hashTagId) {
    try {
      setIsLoading(true);
      const url =
        "http://localhost:3000/api/" +
        URLSConfig.URLS.CHANNEL.READ +
        "/" +
        `${hashTagId}`;

      const response = await get(url);
      setFrameWork(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching framework:", error);
      setError(error.message); // Set error state with error message
      setIsLoading(false);
    }
  }

  return (
    <Box textAlign="center" padding="10">
      <Heading as="h1" size="2xl" marginBottom="4">
        Welcome to Our Learning Portal Content
      </Heading>
      <Text fontSize="xl" marginBottom="8">
        Enhance your knowledge and skills with our diverse range of courses and
        content.
      </Text>
      <Button colorScheme="blue" size="lg">
        Explore Courses
      </Button>

      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {frameWork && (
        <div>
          <p>FrameWork: {JSON.stringify(frameWork)}</p>
        </div>
      )}
    </Box>
  );
}

export default Channel;
