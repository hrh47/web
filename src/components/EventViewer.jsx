import React, { useEffect, useState, useRef } from "react";
import { format, parseISO } from "date-fns";

import { useActions, useSelectors } from "../redux";
import { getUser, getMessagesByThreadId } from "../selectors";
import * as unboundActions from "../actions/messages";
import Markdown from "./Markdown";
import Map from "./Map";
import Composer from "./Composer";
import RsvpPanel from "./RsvpPanel";
import Message from "./Message";
import { FloatingPill, Text, Heading, Icon, Box, Ripple } from "./styles";

export default function EventViewer({ event }) {
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { createEventMessage, fetchEventMessages } = useActions(unboundActions);
  const fetched = useRef({});

  const { id } = event;

  const [user, messages] = useSelectors(getUser, getMessagesByThreadId(id));
  const hasMessages = messages.length > 0;

  useEffect(() => {
    async function handleFetchMessages() {
      setIsLoading(true);
      try {
        await fetchEventMessages(id);
      } catch (e) {}
      setIsLoading(false);
    }

    if (id && !isLoading && !hasMessages && !fetched.current[id]) {
      fetched.current[id] = true;
      handleFetchMessages();
    }
  }, [id, fetchEventMessages, isLoading, hasMessages, fetched]);

  async function handleSend(body, clearBody) {
    setIsDisabled(true);

    try {
      await createEventMessage(id, { body });
    } catch (e) {
      setIsDisabled(false);
      return;
    }

    setIsDisabled(false);
    clearBody();
  }

  return (
    <Box>
      <FloatingPill>
        <Heading mb={3} fontSize={4} fontWeight="semiBold">
          {event.name}
        </Heading>

        <Box mb={3}>
          <Box flexDirection="row" alignItems="center" mb={2}>
            <Icon name="schedule" fontSize={3} mr={2} />
            <Text>{format(parseISO(event.timestamp), "MMMM do @ h:mm a")}</Text>
          </Box>
          <Box flexDirection="row" alignItems="center" mb={2}>
            <Icon name="public" fontSize={3} mr={2} />
            <Text>{event.address}</Text>
          </Box>
          <Box flexDirection="row" alignItems="center" mb={2}>
            <Icon name="group" fontSize={3} mr={2} />
            <Text>{event.users.length} people were invited</Text>
          </Box>
        </Box>

        <RsvpPanel event={event} />

        <Map placeId={event.placeID} />

        <Box mt="2.4rem" mb={2}>
          <Markdown
            text={
              event.description || "This event did not include a description."
            }
          />
        </Box>

        <Composer
          height="6rem"
          backgroundColor="gray"
          placeholder="Send a message to the guests..."
          onClick={handleSend}
          isDisabled={isDisabled}
        />
      </FloatingPill>
      {isLoading && <Ripple />}
      {messages.map(message => (
        <Message
          key={message.id}
          message={message}
          isAuthor={user.id === message.user.id}
        />
      ))}
    </Box>
  );
}
