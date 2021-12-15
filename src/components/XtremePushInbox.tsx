import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as Sentry from '@sentry/react';
import { Config, franchiseDateFormat } from '../constants';
import Dropdown from 'react-bootstrap/Dropdown';
import { Message, MessageList } from '../types/xtremePush';
import dayjs from 'dayjs';
import { replaceStringTagsReact } from '../utils/reactUtils';
import LoadingSpinner from './LoadingSpinner';
import { useI18n } from '../hooks/useI18n';
import { useConfig } from '../hooks/useConfig';
import Link from './Link';
import {
  StyledMessageList,
  OpenCircle,
  StyledContainer,
  StyledInboxHeader,
  StyledInboxMessage,
  StyledMessageContainer,
  StyledMessageContent,
  BadgeCircle,
} from './styled/StyledXtremePush';

const bellIcon =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAACXBIWXMAAAsTAAALEwEAmpwYAAAEdmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iPgogICAgICAgICA8eG1wTU06RGVyaXZlZEZyb20gcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICA8c3RSZWY6aW5zdGFuY2VJRD54bXAuaWlkOkVGRDVGRkFDMDBCN0UwMTFBNUUxQjZCRjIyRDIxMzQ5PC9zdFJlZjppbnN0YW5jZUlEPgogICAgICAgICAgICA8c3RSZWY6ZG9jdW1lbnRJRD54bXAuZGlkOjc4OTA3NjVDMzVBRUUwMTE5QjQwODczMkQ4MUM2MEY3PC9zdFJlZjpkb2N1bWVudElEPgogICAgICAgICA8L3htcE1NOkRlcml2ZWRGcm9tPgogICAgICAgICA8eG1wTU06RG9jdW1lbnRJRD54bXAuZGlkOkYyNjU0MkZEQjcwMTExRTA4MEZGOEZEOEJEMTQ4OTREPC94bXBNTTpEb2N1bWVudElE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';
const xtremePushUrl = Config.xtremepush;
interface Props {
  className?: string;
}

const insertScript = () =>
  new Promise((resolve, reject) => {
    const scriptId = 'xtremePushJs';
    if (!document.getElementById(scriptId)) {
      window.XtremePushObject = 'xtremepush';
      window.xtremepush = function () {
        (window.xtremepush.q = window.xtremepush.q || []).push();
      };
      const script = document.createElement('script');
      script.async = true;
      script.id = scriptId;
      script.src = xtremePushUrl!;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    } else {
      resolve(true);
    }
  });

interface InboxBodyProps {
  isLoading: boolean;
  messageList: Message[];
  updateBadge: (count: number) => void;
  updateMessageList: (messages: Message[]) => void;
}
const InboxBody = ({
  isLoading,
  messageList,
  updateBadge,
  updateMessageList,
}: InboxBodyProps) => {
  const { t } = useI18n();
  if (isLoading) {
    return <LoadingSpinner show className="my-3" />;
  }
  if (!messageList.length) {
    return <div className="m-2">{t('xtremepush_no_messages')}</div>;
  }

  return (
    <StyledMessageList>
      {messageList.map(msg => {
        const setAsOpened = (open: 0 | 1 = 1, click: 0 | 1 = 0) => {
          window.xtremepush(
            'inbox',
            'message.action',
            {
              id: msg.id,
              open,
              click,
            },
            (props: { badge: number }) => {
              const updatedMessages = messageList.map(message => {
                if (message.id === msg.id) {
                  return {
                    ...msg,
                    opened: open,
                    clicked: click,
                  };
                }
                return message;
              });
              updateMessageList(updatedMessages);
              updateBadge(props.badge);
            },
          );
        };
        const hasUrlLink = !!(msg.message.url || msg.message.deeplink);
        const content = (
          <StyledMessageContainer
            onClick={() => !hasUrlLink && setAsOpened(1, 1)}
          >
            {msg.message.icon && (
              <img alt="" src={msg.message.icon} width="100" />
            )}
            <StyledMessageContent>
              <div className="title">
                {replaceStringTagsReact(msg.message.title)}
              </div>
              <div>{replaceStringTagsReact(msg.message.alert)}</div>
              <div className="date-sent">
                {dayjs
                  .unix(msg.create_time)
                  .format(`${franchiseDateFormat}, hh:mm:ss A`)}
              </div>
            </StyledMessageContent>
          </StyledMessageContainer>
        );
        return (
          <StyledInboxMessage key={msg.id}>
            {hasUrlLink ? (
              <Link
                to={msg.message.url || msg.message.deeplink!}
                onClick={() => setAsOpened(1, 1)}
                {...(msg.message.url_blank
                  ? {
                      target: '_blank',
                      rel: 'noreferrer',
                    }
                  : {})}
              >
                {content}
              </Link>
            ) : (
              content
            )}

            {!msg.opened && <OpenCircle onClick={() => setAsOpened(1, 0)} />}
          </StyledInboxMessage>
        );
      })}
    </StyledMessageList>
  );
};

const XtremePushInbox = ({ className }: Props) => {
  const { locale, domLoaded } = useConfig(
    (prev, next) =>
      prev.locale === next.locale && prev.domLoaded === next.domLoaded,
  );
  const { t } = useI18n();
  const { user } = useAuth();
  const [messageCount, setMessageCount] = useState(0);
  const [messageList, setMessageList] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [xtremePushReady, setXtremePushReady] = useState(!!window.xtremepush);
  const messagesRequested = useRef(false);
  const messageListProps = useRef({
    limit: 20,
    offset: 0,
  });

  const getMessages = () => {
    setIsLoading(true);
    if (!xtremePushReady) {
      messagesRequested.current = true;
      return;
    }
    window.xtremepush(
      'inbox',
      'message.list',
      messageListProps.current,
      (result: MessageList) => {
        setMessageCount(result.badge);
        setMessageList(result.items);
        setIsLoading(false);
        console.log(result);
      },
    );
  };

  useEffect(() => {
    if (user.logged_in && xtremePushUrl && domLoaded) {
      const init = () => {
        setXtremePushReady(true);
        window.xtremepush('set', 'external_id', user.id);
        window.xtremepush(
          'inbox',
          'badge',
          {},
          ({ badge }: { badge: number }) => {
            console.log(badge);
            setMessageCount(badge);
          },
          (err: any) => {
            console.log(err);
            Sentry.captureEvent(err);
          },
        );
        if (messagesRequested.current) getMessages();
      };
      if (window.xtremepush) {
        init();
      } else {
        insertScript()
          .then(() => {
            window.xtremepush('ready', init);
          })
          .catch(err => Sentry.captureEvent(err));
      }
    } else if (xtremePushReady) {
      setXtremePushReady(false);
    }
  }, [user.logged_in, domLoaded]);
  useEffect(() => {
    if (xtremePushReady && locale) {
      window.xtremepush('set', 'app_language', locale);
    }
  }, [locale, xtremePushReady]);

  if (!xtremePushUrl) {
    return null;
  }

  return (
    <StyledContainer
      className={className}
      onToggle={show => show && getMessages()}
    >
      <Dropdown.Toggle as="a" bsPrefix="messages-toggle">
        <img alt="bellIcon" src={bellIcon} width="25" height="25" />
        {!!messageCount && <BadgeCircle>{messageCount}</BadgeCircle>}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <div>
          <StyledInboxHeader>{t('xtremepush_header')}</StyledInboxHeader>
          <InboxBody
            isLoading={isLoading}
            messageList={messageList}
            updateBadge={badge => {
              setMessageCount(badge);
              if (badge) {
                getMessages();
              }
            }}
            updateMessageList={setMessageList}
          />
        </div>
      </Dropdown.Menu>
    </StyledContainer>
  );
};
export default XtremePushInbox;
