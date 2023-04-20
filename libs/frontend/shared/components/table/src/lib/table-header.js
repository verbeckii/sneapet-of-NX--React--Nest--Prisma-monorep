import { Header } from '@cloudscape-design/components';

export const TableHeader = (props) => {
  return (
    <Header
      variant={props.variant}
      description={props.description}
      actions={props.actionButtons}
      counter={props.counter}
    >
      {props.title}
    </Header>
  );
};
