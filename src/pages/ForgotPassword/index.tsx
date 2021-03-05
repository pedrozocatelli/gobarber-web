import React, { useCallback, useState, useRef } from 'react';
import { FiLogIn, FiMail } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import { useToast } from '../../hooks/toast';
import getValidationsErrors from '../../utils/getValidationsErrors';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AnimationContainer, Background } from './styles';
import api from '../../services/api';

interface ForgotPasswordFormData {
  email: string;
  password: string;
}

const ForgotPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const [loading, setLoading] = useState(false);

  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
      try {
        setLoading(true);
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          email: Yup.string()
            .email('Type a valid e-mail address')
            .required('E-mail is required'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });
        // Recuperação de senha

        await api.post('/password/forgot', {
          email: data.email,
        });

        addToast({
          type: 'success',
          title: 'Email sent',
          description:
            'We send you an email to confirm a password recovery, please check you inbox',
        });
        // history.push('/dashboard');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationsErrors(err);
          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Error',
          description: 'Something happened while trying to recover password',
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Reset your password</h1>

            <Input name="email" icon={FiMail} placeholder="E-mail" />

            <Button loading={loading} type="submit">
              Send password reset email
            </Button>
          </Form>
          <Link to="/">
            <FiLogIn />
            Back
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ForgotPassword;
