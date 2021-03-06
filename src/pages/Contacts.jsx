import React, { useState } from "react";
import styled from "styled-components";
import { themeGet } from "@styled-system/theme-get";

import { FloatingPill, Box, Icon, Text, Paragraph } from "../components/styles";
import { ContainerSidebarRight } from "./styles";
import ContactInfoBox from "../components/ContactInfoBox";
import ContactCard from "../components/ContactCard";
import { useDebounce, useUserSearch } from "../hooks";
import { useSelectors } from "../redux";
import { getContacts } from "../selectors";

const Main = styled.div`
  display: block;
  padding-right: ${themeGet("space.5")};

  ${themeGet("media.phone")} {
    padding-right: 0;
  }
`;

const FloatingBackground = styled(FloatingPill)`
  height: calc(100% - ${themeGet("headerHeight")});
`;

const Input = styled.input`
  padding: ${themeGet("space.2")};
  margin: ${themeGet("space.1")} 0;
  border: none;
  border-radius: ${themeGet("radii.small")};
  outline: none;
  font-family: ${themeGet("fonts.sans")};
  font-size: ${themeGet("fontSizes.5")};
  width: calc(100% - ${themeGet("space.2")} * 2);
  background-color: transparent;
`;

function ContactsList({ contacts, onClick }) {
  return (
    <Box as="ul" flexDirection="row" flexWrap="wrap">
      {contacts.map(c => (
        <Box as="li" key={c.id} width={["50%", "50%", "25%"]}>
          <ContactCard contact={c} onClick={() => onClick(c)} />
        </Box>
      ))}
    </Box>
  );
}

function Heading({ children }) {
  return (
    <Text color="darkGray" fontSize={2} mb={3} pb={2} borderBottom="lightGray">
      {children}
    </Text>
  );
}

function NullState() {
  return (
    <Box justifyContent="center" alignItems="center" width="100%" height="100%">
      <Paragraph mb={5} textAlign="center" p={2} maxWidth="50rem">
        You haven't added any contacts yet. Start a convo or create an event
        with someone to add them as a contact.
      </Paragraph>
    </Box>
  );
}

function NoResults() {
  return (
    <Box justifyContent="center" alignItems="center" width="100%" height="100%">
      <Paragraph mb={5} textAlign="center" p={2} maxWidth="30rem">
        No results{" "}
        <span role="img" aria-label="sad face">
          😕
        </span>
      </Paragraph>
    </Box>
  );
}

export default function Contacts() {
  const [query, setQuery] = useState("");
  const [selectedContact, setSelectedContact] = useState({});
  const [contacts] = useSelectors(getContacts);

  function handleQueryChange(e) {
    setQuery(e.target.value);
  }

  const debouncedQuery = useDebounce(query, 300);
  const { contactsResults, networkResults, isLoading } = useUserSearch(
    debouncedQuery
  );

  return (
    <ContainerSidebarRight>
      <Main>
        <FloatingBackground>
          <Box flexDirection="row" alignItems="center" mb={4}>
            <Icon name="search" fontSize={6} mr={2} />
            <Input
              type="text"
              placeholder="Search"
              value={query}
              onChange={handleQueryChange}
            />
          </Box>
          {contactsResults.length === 0 &&
            networkResults.length === 0 &&
            contacts.length === 0 &&
            !debouncedQuery && <NullState />}

          {!isLoading &&
            contactsResults.length === 0 &&
            networkResults.length === 0 &&
            debouncedQuery &&
            query && <NoResults />}

          <Box mb={3}>
            {contactsResults.length > 0 && <Heading>My contacts</Heading>}
            <ContactsList
              contacts={query ? contactsResults : contacts}
              onClick={setSelectedContact}
            />
          </Box>

          {networkResults.length > 0 && (
            <Box mb={3}>
              <Heading>Convo network</Heading>
              <ContactsList
                contacts={networkResults}
                onClick={setSelectedContact}
              />
            </Box>
          )}
        </FloatingBackground>
      </Main>
      <ContactInfoBox contact={selectedContact} />
    </ContainerSidebarRight>
  );
}
