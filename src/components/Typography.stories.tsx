import type { Meta, StoryObj } from '@storybook/react';
import { Heading1, Heading2, Paragraph } from './Typography';

const headingMeta = {
  title: 'Components/Typography',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default headingMeta;

export const Heading1Story: StoryObj = {
  render: () => <Heading1>This is Heading 1 - 32px Bold</Heading1>,
};

export const Heading2Story: StoryObj = {
  render: () => <Heading2>This is Heading 2 - 24px Bold</Heading2>,
};

export const ParagraphStory: StoryObj = {
  render: () => (
    <Paragraph>
      This is a paragraph with base font size (16px) and regular weight.
      It has proper line height for readability and uses the semantic color system.
    </Paragraph>
  ),
};

export const AllTypography: StoryObj = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <Heading1>Heading 1</Heading1>
      <Heading2>Heading 2</Heading2>
      <Paragraph>
        This is a paragraph that demonstrates how body text renders in the Design System.
      </Paragraph>
      <Heading2>Another Section</Heading2>
      <Paragraph>
        Paragraphs maintain consistent line height and color for excellent readability.
      </Paragraph>
    </div>
  ),
};
