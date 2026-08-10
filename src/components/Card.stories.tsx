import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { Heading2, Paragraph } from './Typography';

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div>
        <Heading2>Card Title</Heading2>
        <Paragraph>This is a card component with some content inside.</Paragraph>
      </div>
    ),
  },
};

export const WithCustomContent: Story = {
  render: () => (
    <Card style={{ maxWidth: '400px' }}>
      <Heading2>Featured Component</Heading2>
      <Paragraph>
        Cards are versatile containers for grouping related information and actions.
      </Paragraph>
    </Card>
  ),
};
