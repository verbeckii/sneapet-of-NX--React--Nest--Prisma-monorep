import {
  Form,
  FormField,
  Button,
  Container,
  SpaceBetween,
  Header,
  Spinner,
  Grid,
} from '@cloudscape-design/components';
import { useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Input,
  Select,
  TimeInput,
} from '@visionarea-admin/frontend/shared/components/form';
import { useNotifications } from '@visionarea-admin/frontend/shared/components/notifications';
import {
  useCreateDeviceMutation,
  useUpdateDeviceMutation,
} from '@visionarea-admin/frontend/shared/api';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const schema = yup
  .object({
    Code: yup.string().required(),
    Store: yup
      .object({
        value: yup.number().required(),
        label: yup.string().required(),
      })
      .required(),
    Customer: yup
      .object({
        value: yup.number().required(),
        label: yup.string().required(),
      })
      .required(),
    Description: yup.string().nullable(),
    Code_Detector: yup.string().nullable(),
    BEAInDirection: yup.string().nullable(),
    IPWan: yup.string().nullable(),
    IPLan: yup.string().nullable(),
    Operation: yup.string().nullable(),
    Password: yup.string().nullable(),
    Software: yup.string().nullable(),
    TimeCall: yup.date().nullable(),
    TimeReset: yup.date().nullable(),
    TimeZone: yup.string().nullable(),
    Type: yup.string().nullable(),
    User: yup.string().nullable(),
    Direction: yup.string().nullable(),
    Height: yup.number().nullable(),
  })
  .required();

const DEFAULT_VALUES = {
  Description: null,
  Code: null,
  BEAInDirection: null,
  IPWan: null,
  IPLan: null,
  Operation: null,
  Password: null,
  Software: null,
  Store: null,
  TimeCall: null,
  TimeReset: null,
  TimeZone: null,
  Type: null,
  User: null,
  Customer: null,
  Code_Detector: null,
  Direction: null,
  Height: null,
};

export const FormContent = ({ item, customerOptions, storeOptions }) => {
  const [filteredStoreOptions, setFilteredStoreOptions] = useState(
    storeOptions.filter((el) => el.CustomerId === item?.Customer_id)
  );

  const foundCustomer = customerOptions.find(
    (el) => el.value === item?.Customer_id
  );
  const foundStore = storeOptions.find((el) => el.value === item?.Store_id);
  const setDefaultValues = (item = DEFAULT_VALUES) => ({
    ...item,
    Customer: { value: foundCustomer?.value, label: foundCustomer?.label },
    Store: { value: foundStore?.value, label: foundStore?.label },
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    defaultValues: setDefaultValues(item),
    resolver: yupResolver(schema),
    mode: 'onChange',
  });
  const navigate = useNavigate();
  const { addSuccessNotification, addErrorNotification } = useNotifications();

  const createDevice = useCreateDeviceMutation({
    onSuccess: () => addSuccessNotification('Device created successfully'),
    onError: () => addErrorNotification('Error creating new device'),
  });

  const updateCategory = useUpdateDeviceMutation({
    onSuccess: () => addSuccessNotification('Device successfully modified'),
    onError: () => addErrorNotification('Error editing device'),
  });

  const onSubmit = async (fields) => {
    const { Customer, Store, ...rest } = fields;
    rest.Customer_id = Customer.value;
    rest.Store_id = Store.value;
    rest.id ? updateCategory.mutate(rest) : createDevice.mutate(rest);
    navigate(-1);
  };

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'Customer') {
        const newOptions = storeOptions.filter(
          (el) => el.CustomerId === value.Customer.value
        );
        setFilteredStoreOptions(newOptions);
        setValue(
          'Store',
          { value: '', label: '', CustomerId: '' },
          { shouldValidate: true }
        );
      }
    });
    return () => subscription.unsubscribe();
  }, [storeOptions, setValue, watch]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Form
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={() => navigate('/devices')}>
                Cancel
              </Button>
              <Button
                variant="primary"
                disabled={!isValid || isSubmitting}
              >
                {isSubmitting ? <Spinner /> : 'Save Changes'}
              </Button>
            </SpaceBetween>
          }
          errorIconAriaLabel="Error"
        >
          <Container header={<Header variant="h2">Device</Header>}>
            <SpaceBetween direction="vertical" size="m">
              <Grid
                gridDefinition={[
                  { colspan: 6 },
                  { colspan: 6 },
                  { colspan: 6 },
                  { colspan: 6 },
                  { colspan: 6 },
                  { colspan: 6 },
                  { colspan: 6 },
                  { colspan: 6 },
                  { colspan: 4 },
                  { colspan: 4 },
                  { colspan: 4 },
                  { colspan: 4 },
                  { colspan: 4 },
                  { colspan: 4 },
                  { colspan: 6 },
                  { colspan: 6 },
                  { colspan: 12 },
                  { colspan: 12 },
                ]}
              >
                <FormField
                  label="Code"
                  constraintText="Max 4 character."
                  errorText={errors.Code?.message}
                >
                  <Input
                    name="Code"
                    placeholder="Enter the code"
                    control={control}
                    invalid={!!errors.Code}
                  />
                </FormField>
                <FormField
                  label="Description"
                  constraintText="Maximum length 20 characters."
                  errorText={errors.Description?.message}
                >
                  <Input
                    name="Description"
                    placeholder="Enter the description"
                    autofocus
                    control={control}
                    invalid={!!errors.Description}
                  />
                </FormField>
                <FormField
                  label="Code Detector"
                  constraintText=""
                  errorText={errors.Code_Detector?.message}
                >
                  <Input
                    name="Code_Detector"
                    placeholder="Enter the Code Detector"
                    control={control}
                    invalid={!!errors.Code_Detector}
                  />
                </FormField>
                <FormField
                  label="Type"
                  constraintText=""
                  errorText={errors.Type?.message}
                >
                  <Input
                    name="Type"
                    placeholder="Enter the Type"
                    control={control}
                    invalid={!!errors.Type}
                  />
                </FormField>
                <FormField
                  label="IP Lan"
                  constraintText=""
                  errorText={errors.IPLan?.message}
                >
                  <Input
                    name="IPLan"
                    placeholder="Enter the IP Lan"
                    control={control}
                    invalid={!!errors.IPLan}
                  />
                </FormField>
                <FormField
                  label="IP Wan"
                  constraintText=""
                  errorText={errors.IPWan?.message}
                >
                  <Input
                    name="IPWan"
                    placeholder="Enter the IP Wan"
                    control={control}
                    invalid={!!errors.IPWan}
                  />
                </FormField>
                <FormField
                  label="User"
                  constraintText=""
                  errorText={errors.User?.message}
                >
                  <Input
                    name="User"
                    placeholder="Enter the User"
                    control={control}
                    invalid={!!errors.User}
                  />
                </FormField>
                <FormField
                  label="Password"
                  constraintText=""
                  errorText={errors.Password?.message}
                >
                  <Input
                    name="Password"
                    placeholder="Enter the Password"
                    control={control}
                    invalid={!!errors.Password}
                  />
                </FormField>
                <FormField
                  label="Direction"
                  constraintText=""
                  errorText={errors.Direction?.message}
                >
                  <Input
                    name="Direction"
                    placeholder="Enter the Direction"
                    control={control}
                    invalid={!!errors.Direction}
                  />
                </FormField>
                <FormField
                  label="Height"
                  constraintText=""
                  errorText={errors.Height?.message}
                >
                  <Input
                    name="Height"
                    placeholder="Enter the Height"
                    control={control}
                    invalid={!!errors.Height}
                  />
                </FormField>
                <FormField
                  label="Software"
                  constraintText=""
                  errorText={errors.Software?.message}
                >
                  <Input
                    name="Software"
                    placeholder="Enter the Software"
                    control={control}
                    invalid={!!errors.Software}
                  />
                </FormField>
                <FormField
                  label="TimeZone"
                  constraintText=""
                  errorText={errors.TimeZone?.message}
                >
                  <Input
                    name="TimeZone"
                    placeholder="Enter the TimeZone"
                    control={control}
                    invalid={!!errors.TimeZone}
                  />
                </FormField>
                <FormField
                  label="Operation"
                  constraintText=""
                  errorText={errors.Operation?.message}
                >
                  <Input
                    name="Operation"
                    placeholder="Enter the TimeZone"
                    control={control}
                    invalid={!!errors.Operation}
                  />
                </FormField>
                <FormField
                  label="TimeCall"
                  constraintText=""
                  errorText={errors.TimeCall?.message}
                >
                  <TimeInput
                    name="TimeCall"
                    placeholder="hh:mm"
                    defaultValue={item?.TimeCall}
                    control={control}
                    invalid={!!errors.TimeCall}
                  />
                </FormField>
                <FormField
                  label="TimeReset"
                  constraintText=""
                  errorText={errors.TimeReset?.message}
                >
                  <TimeInput
                    name="TimeReset"
                    placeholder="hh:mm"
                    defaultValue={item?.TimeReset}
                    control={control}
                    invalid={!!errors.TimeReset}
                  />
                </FormField>
                <FormField
                  label="BEAInDirection"
                  constraintText=""
                  errorText={errors.BEAInDirection?.message}
                >
                  <Input
                    name="BEAInDirection"
                    placeholder="Enter the BEAInDirection"
                    control={control}
                    invalid={!!errors.BEAInDirection}
                  />
                </FormField>
                <FormField
                  label="Customer"
                  constraintText=""
                  errorText={errors.Customer?.message}
                >
                  <Select
                    name="Customer"
                    placeholder="Enter the Customer"
                    filteringType="auto"
                    options={customerOptions}
                    control={control}
                    invalid={!!errors.Customer}
                  />
                </FormField>
                <FormField
                  label="Store"
                  constraintText=""
                  errorText={errors.Store?.message}
                >
                  <Select
                    name="Store"
                    placeholder="Enter the Store"
                    filteringType="auto"
                    options={filteredStoreOptions}
                    control={control}
                    invalid={!!errors.Store}
                  />
                </FormField>
              </Grid>
            </SpaceBetween>
          </Container>
        </Form>
      </form>
      <DevTool control={control} placement="top-left" />
    </>
  );
};
