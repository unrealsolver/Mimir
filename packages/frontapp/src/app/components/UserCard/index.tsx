import BackButton from '../BackButton';
import { useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import { colors, dimensions } from '@mimir/ui-kit';
import { useGetOnePersonQuery } from '@mimir/apollo-client';
import { mockData } from '../UserList/mockData';
import { t } from 'i18next';
import { IClaimHistory } from '../../models/helperFunctions/claimHistory';
import ClaimHistory from '../ClaimHistory';
import Button from '../Button';
import { ReactComponent as NotifySvg } from '../../../assets/NoNotification.svg';
import { ReactComponent as Block } from '../../../assets/Block.svg';
import ClaimTable from '../ClaimTable';
import {
  getDates,
  specialParseDate,
} from '../../models/helperFunctions/converTime';
import { OpenLink } from '../ManagerInfoCard';

const InlineWrapper = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 4px;
`;
const ColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: inherit;
`;

const CardWrapper = styled(InlineWrapper)`
  background: ${colors.bg_secondary};
  height: 250px;
  width: auto;
  box-shadow: ${colors.shadow};
  border-radius: 10px;
  padding: 32px;
`;

const Avatar = styled.img`
  display: flex;
  width: 115px;
  height: 186px;
  object-fit: cover;
`;

const DescriptionWrapper = styled(ColumnWrapper)`
  margin-left: 24px;
  font-size: ${dimensions.base};
  row-gap: 8px;
`;

interface IDescriptionProps {
  bold?: boolean;
  titlee?: boolean;
  small?: boolean;
}
const Description = styled.p<IDescriptionProps>`
  font-weight: ${({ bold, titlee }) => (bold ? (titlee ? 700 : 500) : 300)};
  font-size: ${({ titlee }) =>
    titlee ? `${dimensions.xl_2}` : `${dimensions.base}`};
  line-height: ${({ titlee }) =>
    titlee ? `${dimensions.xl_2}` : `${dimensions.xl}`};
  margin-bottom: ${({ titlee }) => (titlee ? dimensions.base : null)};
`;

const Title = styled.h1`
  font-weight: 700;
  font-size: ${dimensions.xl_2};
  margin-bottom: ${dimensions.base};
  margin-top: ${dimensions.base_2};
`;

const Subtitle = styled.h2`
  margin-top: ${dimensions.xl_2};
  margin-bottom: ${dimensions.base};
  font-weight: 600;
  font-size: ${dimensions.xl};
`;

interface INotificationsProps {
  message?: boolean;
}

const NotificationWrapper = styled.div<INotificationsProps>`
  width: 100%;
  row-gap: ${dimensions.xs_2};
  background-color: ${({ message }) => (message ? '#EFF4FF' : null)};
  padding: ${dimensions.base};
  display: flex;
  align-items: ${({ message }) => (message ? 'center' : null)};
  flex-direction: ${({ message }) => (message ? 'row' : 'column')};
  justify-content: ${({ message }) => (message ? 'space-between' : null)};
`;

const NotificationDescription = styled.p<IDescriptionProps>`
  text-align: left;
  font-weight: ${({ small, titlee }) => (titlee ? 600 : small ? 300 : 400)};
  font-size: ${({ small }) =>
    small ? `${dimensions.xs}` : `${dimensions.base}`};
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: auto;
  max-width: 276px;
  width: 100%;
  row-gap: 8px;
`;

const UserCard = () => {
  const { id } = useParams();
  const { data: OnePerson, loading } = useGetOnePersonQuery({
    variables: { id: id! },
  });
  const messages = OnePerson?.getOnePerson.messages?.map((message) => {
    return {
      type: 'message',
      created_at: message?.created_at,
      title: message?.title,
      description: message?.message,
    };
  });
  const states = OnePerson?.getOnePerson.states?.map((state) => {
    return {
      type: 'block',
      created_at: state?.created_at,
      title: state ? 'User have been ublocked' : 'User have been blocked',
      description: state?.description,
    };
  });

  const sortedNotifications = messages
    ?.concat(states!)
    ?.sort((a, b) => b?.created_at.getTime() - a?.created_at.getTime());
  const todayNotifications = sortedNotifications?.filter(
    (notification) =>
      getDates(notification.created_at).currentDate ===
      getDates(notification.created_at).startDate
  );
  const earlierNotifications = sortedNotifications?.filter(
    (notification) =>
      getDates(notification.created_at).currentDate !==
      getDates(notification.created_at).startDate
  );
  const state = OnePerson?.getOnePerson.states?.slice().pop()?.state;
  if (loading) return <h1>{t('Loading')}</h1>;

  return (
    <div style={{ marginBottom: '138px' }}>
      <BackButton />
      <CardWrapper>
        <Avatar src={OnePerson?.getOnePerson.avatar || mockData.avatar} />
        <DescriptionWrapper>
          <Description bold titlee>
            {OnePerson?.getOnePerson.username}
          </Description>
          <InlineWrapper>
            <Description bold>{t('UserCard.Position')}</Description>
            <Description>{OnePerson?.getOnePerson.position}</Description>
          </InlineWrapper>
          <InlineWrapper>
            <Description bold>E-mail:</Description>
            <Description>{OnePerson?.getOnePerson.email}</Description>
          </InlineWrapper>
          <ClaimHistory
            statuses={OnePerson?.getOnePerson.statuses as IClaimHistory[]}
          />
        </DescriptionWrapper>
        <ButtonsWrapper>
          <Button
            value={t('UserCard.CreateNotification')}
            svgComponent={<NotifySvg />}
            transparent
          ></Button>
          <Button
            value={t('UserCard.BlockUser')}
            secondary
            warning
            transparent
            svgComponent={<Block />}
          ></Button>
        </ButtonsWrapper>
      </CardWrapper>
      <Title>{t('UserCard.ClaimList')}</Title>
      <Description>{t('UserCard.ClaimListDescription')}</Description>
      <ClaimTable
        statuses={OnePerson?.getOnePerson.statuses as IClaimHistory[]}
        name={OnePerson?.getOnePerson.username as string}
      />
      {sortedNotifications?.length ? (
        <>
          <Title>{t('UserCard.Notifications')}</Title>
          <Description>{t('UserCard.NotificationsDescription')}</Description>
          {todayNotifications?.length ? (
            <>
              <Subtitle>{t('UserCard.Today')}</Subtitle>
              {todayNotifications?.map((notification) => (
                <>
                  {notification.type === 'message' ? (
                    <NotificationWrapper message>
                      <ColumnWrapper>
                        <NotificationDescription titlee>
                          {notification.title}
                        </NotificationDescription>
                        <NotificationDescription>
                          {notification.description}
                        </NotificationDescription>
                        <NotificationDescription small>
                          {specialParseDate(new Date(notification.created_at))}
                        </NotificationDescription>
                      </ColumnWrapper>
                      <OpenLink>{t('ManagerInfoCard.Link.Answer')}</OpenLink>
                    </NotificationWrapper>
                  ) : (
                    <NotificationWrapper>
                      <NotificationDescription>
                        {notification.title + ' '}
                        {notification.description
                          ? t('UserCard.BlockReason') + notification.description
                          : null}
                      </NotificationDescription>
                      <NotificationDescription small>
                        {specialParseDate(new Date(notification.created_at))}
                      </NotificationDescription>
                    </NotificationWrapper>
                  )}
                </>
              ))}
            </>
          ) : null}
          {earlierNotifications?.length ? (
            <>
              <Subtitle>{t('UserCard.Earlier')}</Subtitle>
              {earlierNotifications?.map((notification) => (
                <>
                  {notification.type === 'message' ? (
                    <NotificationWrapper message>
                      <ColumnWrapper>
                        <NotificationDescription titlee>
                          {notification.title}
                        </NotificationDescription>
                        <NotificationDescription>
                          {notification.description}
                        </NotificationDescription>
                        <NotificationDescription small>
                          {specialParseDate(new Date(notification.created_at))}
                        </NotificationDescription>
                      </ColumnWrapper>
                      <OpenLink>{t('ManagerInfoCard.Link.Answer')}</OpenLink>
                    </NotificationWrapper>
                  ) : (
                    <NotificationWrapper>
                      <NotificationDescription>
                        {notification.title + ' '}
                        {notification.description
                          ? t('UserCard.BlockReason') + notification.description
                          : null}
                      </NotificationDescription>
                      <NotificationDescription small>
                        {specialParseDate(new Date(notification.created_at))}
                      </NotificationDescription>
                    </NotificationWrapper>
                  )}
                </>
              ))}
            </>
          ) : null}
        </>
      ) : null}
    </div>
  );
};

export default UserCard;
