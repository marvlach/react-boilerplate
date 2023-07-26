import { Alert, Button, Card, Form, Input, Spin } from 'antd';
import { InternalNamePath } from 'antd/es/form/interface';
import type { ValidateErrorEntity } from 'rc-field-form/lib/interface';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../../api/userApiSlice/userApiSlice';
import { useAppSelector } from '../../store/store';
import { userActions } from '../../store/userSlice';
import { setAccessTokenToLocalStorage } from '../../utils/localStorage';
import styles from './Login.module.css';
import translation from './Login.translation.json';

type FormValues = {
  username: string;
  password: string;
};

type SubmitError = '401' | 'other';

export default function Login() {
  const [login, { isLoading: loginIsLoading, isError: isLogginError, error: loginError }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const lang = useAppSelector((store) => store.languageSlice.language);

  // revalidate FieldError on language change, because field errors don't change
  useEffect(() => {
    const errorFields = form.getFieldsError().reduce((arr: InternalNamePath[], field) => {
      if (field.errors.length) {
        arr.push(field.name);
      }
      return arr;
    }, []);

    form.validateFields(errorFields);
  }, [lang, form]);

  const handleSubmit = async (values: FormValues) => {
    const credentials = new URLSearchParams();
    credentials.append('username', values.username);
    credentials.append('password', values.password);
    credentials.append('grant_type', 'password');
    try {
      const response = await login(credentials).unwrap();
      dispatch(userActions.login(response.access_token));
      // dispatch(organizationActions.setOrganizations(response.organization_groups));
      setAccessTokenToLocalStorage(response.access_token);
      navigate(/* location.state?.from?.pathname ?? */ '/dashboard');
    } catch (error) {
      // console.log(error);
    }
  };

  // keep this function for the type ValidateErrorEntity that is hard to find
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSubmitFailed = (_error: ValidateErrorEntity<FormValues>) => {};

  // error messages
  const fetchBaseQueryError = loginError && 'status' in loginError && loginError.status;
  const errorMessage: SubmitError =
    fetchBaseQueryError && typeof fetchBaseQueryError === 'number' && fetchBaseQueryError === 401 ? '401' : 'other';

  return (
    <Spin tip="Loading..." data-testid="loading-spinner" spinning={loginIsLoading}>
      <Card className={styles['form-container']}>
        <h2 data-testid="login-header"> {translation.login[lang]} </h2>
        <Form
          name="login"
          layout="vertical"
          form={form}
          initialValues={{
            remember: true,
          }}
          onFinish={handleSubmit}
          onFinishFailed={handleSubmitFailed}
          autoComplete="off"
          scrollToFirstError
        >
          <Form.Item
            name="username"
            label={translation.username[lang]}
            rules={[
              {
                required: true,
                message: translation.username_error[lang],
              },
            ]}
          >
            <Input placeholder={translation.username[lang]} data-testid="username-input" />
          </Form.Item>

          <Form.Item
            name="password"
            label={translation.password[lang]}
            rules={[
              {
                required: true,
                message: translation.password_error[lang],
              },
            ]}
          >
            <Input.Password placeholder={translation.password[lang]} data-testid="password-input" />
          </Form.Item>

          <div className={styles['button-container']}>
            <Form.Item shouldUpdate>
              {() => {
                const fieldValues: FormValues = form.getFieldsValue();
                const disabledInit = fieldValues.username === '' || fieldValues.password === '';

                // this is redundant but keep it for reference
                const fieldErrors = form.getFieldsError();
                const disabledErrors = fieldErrors.filter(({ errors }) => errors.length).length > 0;
                return (
                  <Button
                    type="primary"
                    htmlType="submit"
                    data-testid="submit-button"
                    disabled={disabledInit || disabledErrors}
                  >
                    {translation.login[lang]}
                  </Button>
                );
              }}
            </Form.Item>
          </div>
        </Form>
        {isLogginError && (
          <Alert
            style={{ width: '90%', margin: '1rem auto' }}
            message={errorMessage ? translation[`submit_error_${errorMessage}`][lang] : ''}
            type="error"
            showIcon
            closable
            banner
            data-testid="error-alert"
          />
        )}
      </Card>
    </Spin>
  );
}
