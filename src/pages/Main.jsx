import React from "react";
import styled from "styled-components";
import { themeGet } from "@styled-system/theme-get";

import InboxSidebar from "../components/InboxSidebar";
import ThreadViewer from "../components/ThreadViewer";
import ThreadInfoBox from "../components/ThreadInfoBox";

const Container = styled.div`
  display: grid;
  grid-template-columns: ${themeGet("sidebarWidth")} minmax(0, 1fr) ${themeGet(
      "sidebarWidth"
    )};
  width: 100%;
  height: auto;
  min-height: calc(100vh - ${themeGet("headerHeight")});

  ${themeGet("media.tablet")} {
    grid-template-columns: ${themeGet("sidebarWidth")} minmax(0, 1fr) 0;
    & > div:nth-child(3) {
      visibility: hidden;
    }
  }

  ${themeGet("media.phone")} {
    grid-template-columns: 0 minmax(0, 1fr) 0;
    & > div:nth-child(1) {
      visibility: hidden;
    }
    & > div:nth-child(3) {
      visibility: hidden;
    }
  }
`;

export default function Main() {
  return (
    <Container>
      <InboxSidebar />
      <ThreadViewer />
      <ThreadInfoBox />
    </Container>
  );
}
