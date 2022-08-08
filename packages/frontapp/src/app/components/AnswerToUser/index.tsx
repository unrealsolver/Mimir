import React, { FC, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { colors, dimensions } from '@mimir/ui-kit';
import Button from '../Button';
import { ButtonWrapper } from '../BackButton';
import { useMutation } from '@apollo/client';
import {
  GetAllMessagesDocument,
  useCreateAnswerNotificationMutation,
} from '@mimir/apollo-client';
import { toast } from 'react-toastify';
import { t } from 'i18next';

interface IAnswer {
  active: boolean;
}

const Wrapper = styled.div`
  //width: 100%;
  //max-width: 40.625rem;
`;

const Title = styled.h1`
  font-weight: bold;
  font-size: ${dimensions.xl_2};
  line-height: ${dimensions.xl_3};
  color: ${colors.main_black};
  margin-bottom: ${dimensions.base_2};
`;

const WrapperListAnswers = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-bottom: ${dimensions.base_3};
`;

const TitleList = styled.h4`
  font-weight: 600;
  font-size: ${dimensions.base};
  line-height: ${dimensions.xl};
  color: ${colors.main_black};
  margin-bottom: ${dimensions.base};
`;

const Answer = styled.div<IAnswer>`
  padding: ${dimensions.base} ${dimensions.base_2};
  border: 2px solid ${colors.accent_color};
  color: ${({ active }) =>
    active ? colors.bg_secondary : colors.accent_color};
  background: ${({ active }) =>
    active ? colors.accent_color : colors.bg_secondary};
  font-weight: 400;
  font-size: ${dimensions.base};
  line-height: ${dimensions.xl};
  width: 100%;
  border-radius: ${dimensions.xl_3};
  margin-bottom: ${dimensions.base};
  text-align: center;
  cursor: pointer;
  :last-of-type {
    margin-bottom: 0;
  }

  :hover {
    background: ${colors.accent_color};
    color: ${colors.bg_secondary};
  }
`;

const TextField = styled.textarea`
  width: 100%;
  border: 1px solid ${colors.accent_color};
  height: 7.5rem;
  font-size: ${dimensions.base};
  line-height: ${dimensions.xl};
  color: ${colors.main_black};
  padding: ${dimensions.base} ${dimensions.xl_2};
  resize: none;
  border-radius: ${dimensions.xs_1};

  ::placeholder {
    color: ${colors.dropdown_gray};
  }

  :focus {
    outline: none;
    border: 1px solid ${colors.hover_color};
  }
`;

const ButtonWrapperStyled = styled(ButtonWrapper)`
  button {
    :first-of-type {
      margin-right: ${dimensions.base};
    }
    :last-of-type:hover {
      background: ${colors.accent_color};
      span {
        color: ${colors.bg_secondary};
      }
    }
  }
`;

interface IAnswerToUser {
  id: string | null | undefined;
  person_id: string | null | undefined;
  answers: Array<string>;
  close: () => void;
}
interface IAnswerState {
  index: number;
  answer: string;
}

const AnswerToUser: FC<IAnswerToUser> = ({ id, answers, close, person_id }) => {
  const [currentAnswer, setCurrentAnswer] = useState<IAnswerState | null>(null);
  const [message, setMessage] = useState('');
  const [createNotification, { error }] = useCreateAnswerNotificationMutation({
    refetchQueries: [GetAllMessagesDocument],
  });

  useEffect(() => {
    if (error) toast.error(error.message);
  }, [error]);

  useEffect(() => {
    return () => {
      setMessage('');
      setCurrentAnswer(null);
    };
  }, []);

  const handleAnswers = (answer: IAnswerState) => {
    setMessage('');
    setCurrentAnswer(answer);
  };
  const handleChangeMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };
  const handleClickTextArea = () => {
    setCurrentAnswer(null);
  };
  const sendNotification = async () => {
    try {
      const answerMessage = currentAnswer?.answer || message;
      const createNotificationObj = {
        id: Number(id),
        person_id: Number(person_id),
        message: answerMessage,
      };
      await createNotification({ variables: { input: createNotificationObj } });
      close();
    } catch (e) {
      if (e instanceof Error) toast.error(e.message);
    }
  };

  return (
    <Wrapper>
      <Title>{t('AnswerModal.Title')}</Title>
      <TitleList>{t('AnswerModal.SubTitle')}</TitleList>
      <WrapperListAnswers>
        {answers &&
          answers.map((answer, index) => (
            <Answer
              active={index === currentAnswer?.index}
              key={index}
              onClick={() => handleAnswers({ index, answer })}
            >
              {answer}
            </Answer>
          ))}
      </WrapperListAnswers>
      <TitleList>{t('AnswerModal.DescMessage')}</TitleList>
      <TextField
        placeholder="Enter your message"
        value={message}
        onChange={handleChangeMessage}
        onClick={handleClickTextArea}
      />
      <ButtonWrapperStyled>
        <Button
          value={t('AnswerModal.SendBtn')}
          type="button"
          onClick={sendNotification}
          disabled={!(currentAnswer || message)}
        />
        <Button value={t('Cancel')} type="button" transparent onClick={close} />
      </ButtonWrapperStyled>
    </Wrapper>
  );
};

export default React.memo(AnswerToUser);
