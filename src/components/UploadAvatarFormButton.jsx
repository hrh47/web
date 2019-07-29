import React, { useState } from "react";
import Modal from "styled-react-modal";
import Cropper from "react-image-crop";
import { themeGet } from "@styled-system/theme-get";

import { useActions } from "../redux";
import * as unboundActions from "../actions/user";
import { Button, Box } from "./styles";

const StyledModal = Modal.styled`
  width: 100%;
  max-width: 80rem;
  background-color: ${themeGet("colors.trueWhite")};
  border-radius: ${themeGet("radii.special")};
  box-shadow: ${themeGet("shadows.spread")};
  padding-top: ${themeGet("space.4")};
  padding-right: ${themeGet("space.4")};
  padding-left: ${themeGet("space.4")};
  padding-bottom: ${themeGet("space.2")};
  margin: ${themeGet("space.4")};
`;

export default function UploadAvatarFormButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [src, setSrc] = useState("");
  const [crop, setCrop] = useState({
    aspect: 1,
    x: 10,
    y: 10,
    width: 100,
    height: 100
  });
  const { uploadAvatar } = useActions(unboundActions);

  async function handleUpload(e) {
    e.preventDefault();

    setIsLoading(true);

    await uploadAvatar({
      blob: src.split(",").pop(),
      x: crop.x,
      y: crop.y,
      size: crop.width
    });

    setIsLoading(false);
    setIsOpen(false);
  }

  function handleFileSelection(e) {
    const [file] = e.target.files;
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      () => {
        setSrc(reader.result);
        setIsOpen(true);
      },
      false
    );
    reader.readAsDataURL(file);
  }

  function handleClick(e) {
    e.preventDefault();

    const inputEl = document.createElement("input");
    inputEl.type = "file";
    inputEl.name = "avatar";
    inputEl.accept = "image/png, image/jpeg";
    inputEl.addEventListener("change", handleFileSelection);
    inputEl.click();
  }

  return (
    <React.Fragment>
      <Button onClick={handleClick} width="min-content">
        Upload new picture
      </Button>
      <StyledModal isOpen={isOpen}>
        <Cropper
          src={src}
          crop={crop}
          onChange={setCrop}
          keepSelection
          circularCrop
        />
        <Box flexDirection="row" justifyContent="center" pt={2}>
          <Button
            variant="secondary"
            width="10rem"
            onClick={() => setIsOpen(false)}
            mr={2}
          >
            Cancel
          </Button>
          <Button onClick={handleUpload} isLoading={isLoading} width="10rem">
            Done
          </Button>
        </Box>
      </StyledModal>
    </React.Fragment>
  );
}