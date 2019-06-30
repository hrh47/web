import React from "react";
import styled from "styled-components";
import { themeGet } from "@styled-system/theme-get";

import Sidebar from "../components/Sidebar";
import Viewer from "../components/Viewer";
import InfoBox from "../components/InfoBox";

const Container = styled.div`
  display: grid;
  grid-template-columns: ${themeGet("sidebarWidth")} minmax(0, 1fr) ${themeGet(
  "sidebarWidth"
)}
  width: 100%;
  height: auto;
  min-height: calc(100vh - ${themeGet("headerHeight")});
`;

export default function Main() {
  return (
    <Container>
      <Sidebar />
      <Viewer />
      <InfoBox />
    </Container>
  );
}
