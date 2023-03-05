import { Heading } from '@tiptap/extension-heading';
import { Image } from '@tiptap/extension-image';
import { Placeholder } from '@tiptap/extension-placeholder';
import { mergeAttributes } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';

const CustomStarterKit = StarterKit.configure({
  heading: false,
  bulletList: {
    HTMLAttributes: {
      class: 'list-disc list-inside'
    }
  },
  orderedList: {
    HTMLAttributes: {
      class: 'list-decimal list-inside'
    }
  },
  paragraph: {
    HTMLAttributes: {
      class: 'my-1.5'
    }
  }
});

const CustomPlaceholder = Placeholder.configure({
  placeholder: 'Body: Record your ideas here'
});

const CustomHeading = Heading.extend({
  renderHTML({ node, HTMLAttributes }) {
    const { headingClasses, ...originalAttrs } = this.options.HTMLAttributes;

    // https://github.com/ueberdosis/tiptap/issues/1514#issuecomment-1225496336
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const level: number = this.options.levels.includes(node.attrs.level)
      ? (node.attrs.level as number)
      : this.options.levels[0];

    return [
      `h${level}`,
      mergeAttributes(originalAttrs, HTMLAttributes, {
        class: (headingClasses as Record<number, string>)[level]
      }),
      0
    ];
  }
}).configure({
  levels: [1, 2, 3],
  HTMLAttributes: {
    headingClasses: {
      1: 'pt-2 pb-4 text-2xl',
      2: 'pt-2 pb-4 text-xl',
      3: 'pt-2 pb-4 text-lg'
    }
  }
});

const CustomImage = Image.extend({
  renderHTML({ HTMLAttributes }) {
    // HTMLAttributes contains the attributes from the node
    // In this case, it's the src, alt, and title attribute

    // While this.options.HTMLAttributes contains the attributes
    // from the configure method

    const { containerClass, imageClass, ...originalAttrs } =
      this.options.HTMLAttributes;

    return [
      'div',
      mergeAttributes({
        class: containerClass as string
      }),
      [
        'img',
        mergeAttributes(originalAttrs, HTMLAttributes, {
          class: imageClass as string
        })
      ]
    ];
  }
}).configure({
  // This canbe accessed as this.options.HTMLAttributes
  HTMLAttributes: {
    containerClass: 'w-auto py-8 flex justify-center items-center',
    imageClass: 'h-full'
  }
});

export const configuredExtension = [
  CustomStarterKit,
  CustomHeading,
  CustomPlaceholder,
  CustomImage
];

export const configuredEditor = {
  extensions: configuredExtension,
  editorProps: {
    attributes: {
      class:
        'min-h-[10rem] px-2 pt-2 pb-8 rounded focus:outline-none editor-output'
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
