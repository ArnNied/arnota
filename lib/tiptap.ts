import { Heading } from '@tiptap/extension-heading';
import { Placeholder } from '@tiptap/extension-placeholder';
import { mergeAttributes } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';

// https://github.com/ueberdosis/tiptap/issues/1514#issuecomment-1225496336
const headingClasses: Record<number, string> = {
  1: 'pt-2 pb-4 text-2xl',
  2: 'pt-2 pb-4 text-xl',
  3: 'pt-2 pb-4 text-lg'
};

const CustomStarterKit = StarterKit.configure({
  heading: false
});

const CustomHeading = Heading.configure({ levels: [1, 2, 3] }).extend({
  renderHTML({ node, HTMLAttributes }) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const level: number = this.options.levels.includes(node.attrs.level)
      ? (node.attrs.level as number)
      : this.options.levels[0];

    return [
      `h${level}`,
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: headingClasses[level]
      }),
      0
    ];
  }
});

export const configuredExtension = [
  CustomStarterKit,
  CustomHeading,
  Placeholder.configure({
    placeholder: 'Body: Record your ideas here'
  })
];

export const configuredEditor = {
  extensions: configuredExtension,
  editorProps: {
    attributes: {
      class: 'min-h-[10rem] px-2 p-1 rounded focus:outline-none'
    }
  },
  onFocus: (): void => {
    document
      .getElementById('tiptap-editor-container')
      ?.classList.replace('border-secondary', 'border-primary');
  },
  onBlur(): void {
    document
      .getElementById('tiptap-editor-container')
      ?.classList.replace('border-primary', 'border-secondary');
  }
};
