import React from "react";
import styled from "styled-components";
import { themeGet } from "@styled-system/theme-get";

import { fetchThreads } from "../actions/threads";
import { getThreadsPageInfo } from "../selectors";
import { usePagination } from "../hooks";
import FeedViewer from "../components/FeedViewer";
import UpcomingEventsSidebar from "../components/UpcomingEventsSidebar";
import ContactsSidebar from "../components/ContactsSidebar";
import { ContainerDualSidebars } from "./styles";
import { Box } from "../components/styles";

const Container = styled.div`
  display: block;
  padding: 0 ${themeGet("space.5")};

  ${themeGet("media.tablet")} {
    padding: 0;
    max-width: 60rem;
    width: 100%;
    margin: 0 auto;
  }

  ${themeGet("media.phone")} {
    padding: 0;
    max-width: 70rem;
    width: 100%;
    margin: 0 auto;
  }
`;

export default function Feed() {
  usePagination(fetchThreads, getThreadsPageInfo, window.document);

  return (
    <ContainerDualSidebars>
      <Box>
        <Box position="fixed" width="28rem">
          <UpcomingEventsSidebar />
        </Box>
      </Box>
      <Container>
        <FeedViewer />
      </Container>
      <Box>
        <Box position="fixed" width="28rem">
          <ContactsSidebar />
        </Box>
      </Box>
    </ContainerDualSidebars>
  );
}
