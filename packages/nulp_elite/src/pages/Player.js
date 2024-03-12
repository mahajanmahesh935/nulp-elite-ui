import React, { useEffect, useState } from "react";
import { Box, Button, Heading, Text } from "@chakra-ui/react";
import URLSConfig from "../configs/urlConfig.json";
import APPConfig from "../configs/appConfig.json";
import { get } from "@shiksha/common-lib";

function Channel() {
  const [frameWork, setFrameWork] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    playContent();
    handleNavigation();
  }, []);

  async function playContent(content, queryParams) {
    setTimeout(() => {
      // setTimeOut is used to trigger telemetry interact event as changeDetectorRef.detectChanges() not working.
      if (
        content.mimeType === APPConfig.PLAYER_CONFIG.MIME_TYPE.collection ||
        _.get(content, "metaData.mimeType") ===
          APPConfig.PLAYER_CONFIG.MIME_TYPE.collection
      ) {
        if (!content.trackable && content.primaryCategory !== "Course") {
          this.handleNavigation(content, false, queryParams);
        } else {
          const isTrackable =
            content.trackable && content.trackable.enabled === "No"
              ? false
              : true;
          this.handleNavigation(content, isTrackable, queryParams);
        }
      } else if (
        content.mimeType === APPConfig.PLAYER_CONFIG.MIME_TYPE.ecmlContent
      ) {
        this.router.navigate(["/resources/play/content", content.identifier]);
      } else if (
        content.mimeType === APPConfig.PLAYER_CONFIG.MIME_TYPE.questionset
      ) {
        this.router.navigate([
          "/resources/play/questionset",
          content.identifier,
        ]);
      } else {
        this.router.navigate(["/resources/play/content", content.identifier]);
      }
    }, 0);
  }

  async function handleNavigation(content, isTrackable, queryParams) {
    if (!isTrackable) {
      this.router.navigate(
        ["/resources/play/collection", content.courseId || content.identifier],
        { queryParams: { contentType: content.contentType } }
      );
    } else if (content.batchId) {
      this.router.navigate(
        [
          "/learn/course",
          content.courseId || content.identifier,
          "batch",
          content.batchId,
        ],
        { queryParams }
      );
    } else {
      this.router.navigate(["/learn/course", content.identifier], {
        queryParams,
      });
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
