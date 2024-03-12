//This is for  Tesing perpose

import React, { useState, useEffect } from "react";
import { Box, Heading, Text, Button } from "@chakra-ui/react";
import URLSConfig from "../configs/urlConfig.json";
import { userService } from "../Services/userService";

const User = () => {
  const [data, setData] = useState({});
  const [userid, setUserid] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [organisationIds, setOrganisationIds] = useState("");

  useEffect(() => {
    endSession();
    getUserData();
    updateUserData();
    getOrganizationDetails();
    registerUser();
    getAnonymousUserPreference();
    getIsUserExistsUserByKey();
    getGuestUser();
    getUserByKey();
    getFeedData();
    userMigrate();
  }, []);
  const headers = {
    "content-type": "Application/json",
  };
  const endSession = async () => {
    try {
      setIsLoading(true);
      const url = URLSConfig.URLS.USER.END_SESSION;
      const response = await userService.endSession(url);
      console.log(response.data.result);
      setData(response.data.result);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserData = async () => {
    try {
      // setIsLoading(true);
      const params = URLSConfig.params.userReadParam.fields;

      const baseUrl =
        "http://localhost:3000/learner/" + URLSConfig.URLS.USER.GET_PROFILE; // Assuming this does not contain /modules/nulp_elite
      const url = `${baseUrl}5d757783-a86a-40cd-a814-1b6a16d37cb6?fields=${params}`;
      console.log(url);
      const response = await userService.getUserData(url, headers);
      console.log(response.data.result);
      setData(response.data.result);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserData = async () => {
    try {
      const url =
        "http://localhost:3000/learner/" +
        URLSConfig.URLS.USER.UPDATE_USER_PROFILE;
      const response = await userService.updateUserData(url, data);
      console.log(response.data.result);
      setData(response.data.result);
    } catch (error) {
      setError(error.message);
    }
  };

  const getAnonymousUserPreference = async () => {
    try {
      const url =
        "http://localhost:3000/api/" + URLSConfig.URLS.OFFLINE.READ_USER;
      const response = await userService.getAnonymousUserPreference(url);
      console.log(response.data.result);
      setData(response.data.result);
    } catch (error) {
      setError(error.message);
    }
  };

  const getGuestUser = async () => {
    try {
      const url =
        "http://localhost:3000/api/" + URLSConfig.URLS.OFFLINE.READ_USER;
      const response = await userService.getGuestUser(url);
      console.log(response.data.result);
      setData(response.data.result);
    } catch (error) {
      setError(error.message);
    }
  };

  const getIsUserExistsUserByKey = async (key) => {
    try {
      const response = await userService.getIsUserExistsUserByKey(
        (url =
          "http://localhost:3000/api/" +
          URLSConfig.URLS.USER.USER_EXISTS_GET_USER_BY_KEY +
          "/" +
          key)
      );
      console.log(response.data.result);
      setData(response.data.result);
    } catch (error) {
      setError(error.message);
    }
  };

  const getUserByKey = async (key) => {
    try {
      const response = await userService.getUserByKey(
        (url =
          "http://localhost:3000/api/" +
          URLSConfig.URLS.USER.GET_USER_BY_KEY +
          "/" +
          key)
      );
      console.log(response.data.result);
      setData(response.data.result);
    } catch (error) {
      setError(error.message);
    }
  };

  const getFeedData = async () => {
    try {
      const response = await userService.getFeedData(
        (url =
          "http://localhost:3000/api/" +
          URLSConfig.URLS.USER.GET_USER_FEED +
          "/" +
          userid)
      );
      console.log(response.data.result);
      setData(response.data.result);
    } catch (error) {
      setError(error.message);
    }
  };

  const userMigrate = async () => {
    try {
      const url =
        "http://localhost:3000/learner/" + URLSConfig.URLS.USER.USER_MIGRATE;
      const response = await userService.userMigrate(url, data);
      console.log(response.data.result);
      setData(response.data.result);
    } catch (error) {
      setError(error.message);
    }
  };

  const registerUser = async () => {
    try {
      const url =
        "http://localhost:3000/learner/" +
        URLSConfig.URLS.USER.SIGN_UP_MANAGED_USER;
      const response = await userService.registerUser(url, data).pipe(
        map((resp) => {
          createManagedUser.emit(_.get(resp, "result.userId"));
          return resp;
        })
      );
      console.log(response.data.result);
      setData(response.data.result);
    } catch (error) {
      setError(error.message);
    }
  };

  const getOrganizationDetails = async () => {
    try {
      const url =
        "http://localhost:3000/api/" + URLSConfig.URLS.ADMIN.ORG_EXT_SEARCH;
      const data = {
        request: {
          filters: {
            id: organisationIds,
          },
        },
      };
      const response = await userService.getOrganizationDetails(url, data); // Call the imported function
      console.log(response.data.result);
      setData(response.data.result);
    } catch (error) {
      setError(error.message);
    }
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
      <Button colorScheme="blue" size="lg" onClick={getUserData}>
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

export default User;
