import React, { useState, useEffect } from "react";
import { Box, Heading, Text, Button } from "@chakra-ui/react";
import URLSConfig from "../configs/urlConfig.json";
import { post, get } from "@shiksha/common-lib";

const Form = () => {
  const [data, setData] = useState({});
  const [bathId, setbatchId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [organisationIds, setOrganisationIds] = useState("");
  useEffect(() => {
    getFormConfig();
  }, []);
  const headers = {
    "content-type": "Application/json",
  };
  const formInputParams = {
    formType: "user",
    formAction: "onboarding",
    contentType: "exclusion",
    component: "portal",
  };
  const getFormConfig = (hashTagId, responseKey = "data.fields") => {
    const url =
      "http://localhost:3000/api/" + URLSConfig.URLS.dataDrivenForms.READ;
    const data = {
      request: {
        type: formInputParams.formType,
        action: formInputParams.formAction,
        subType: formInputParams.contentType,
        rootOrgId: hashTagId,
        component: _.get(formInputParams, "component"),
      },
    };

    if (formInputParams.framework) {
      channelOptions.data.request.framework = formInputParams.framework;
    }

    return post(url, data).then((formConfig) => {
      const result = _.get(formConfig.result.form, responseKey);
      return result;
    });
  };

  const handleFilterChange = (field, value) => {
    // Handle filter change logic here
  };

  return (
    <Box textAlign="center" padding="10">
      <Heading as="h1" size="2xl" marginBottom="4">
        Welcome to Our Learning Portal Content
      </Heading>
      <Text fontSize="xl" marginBottom="8">
        Enhance your knowledge and skills with our diverse range of courses and
        content.
      </Text>
      <Button colorScheme="blue" size="lg" onClick={getFormConfig}>
        Get User Data
      </Button>

      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {Object.keys(data).map((key) => (
        <div key={key}>
          <p>
            {key}: {JSON.stringify(data[key])}
          </p>
        </div>
      ))}
    </Box>
  );
};

export default Form;
