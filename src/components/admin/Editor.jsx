"use client";

/**
 * The rich text editor. TipTap 3 on ProseMirror.
 *
 * ── WHAT IT IS ALLOWED TO PRODUCE ────────────────────────────────────────
 * Exactly the elements src/lib/admin/sanitizeHtml.js permits, and no others.
 * The two lists are meant to match: an editor that offers a button whose
 * output is then stripped on save is an editor that loses people's work
 * silently. If you add an extension here, add its tags to that allowlist in
 * the same commit — and if you cannot justify the tag there, do not add the
 * button here.
 *
 * H1 is deliberately absent from the toolbar. The page template renders the
 * article title as the document's single h1; a second one is an accessibility
 * fault and the most common self-inflicted on-page SEO problem there is. The
 * sanitiser refuses h1 as well, so this is belt and braces.
 *
 * ── IMAGES GO THROUGH THE LIBRARY ────────────────────────────────────────
 * There is no "paste an image URL" and no drag-to-embed that inlines a
 * data: URI. Both routes produce images that were never converted to WebP,
 * never sized, and never given alt text — which is the whole reason the media
 * pipeline exists. The image button opens the library, and what comes back is
 * a /media/… URL with width, height and alt already attached.
 *
 * ── SSR ──────────────────────────────────────────────────────────────────
 * `immediatelyRender: false` is required. TipTap renders to a DOM that does
 * not exist on the server, and without this the editor throws a hydration
 * mismatch on first paint in the App Router.
 */
import { useCallback, useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { TableKit } from "@tiptap/extension-table";
import {
  AlertTriangle,
  Bold,
  Code,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  Link2,
  Link2Off,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Table as TableIcon,
  Underline as UnderlineIcon,
  Undo2,
} from "lucide-react";

import MediaPicker from "./MediaPicker";

/** One toolbar button. `active` draws the pressed state. */
function Tool({ onClick, active = false, disabled = false, label, children }) {
  return (
    <button
      type="button"
      onMouseDown={(event) => event.preventDefault()} // keep the selection
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition disabled:opacity-40 ${
        active
          ? "bg-emerald-600 text-white"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      {children}
    </button>
  );
}

const Divider = () => <span className="mx-1 h-5 w-px bg-slate-200" aria-hidden />;

export default function Editor({ value, onChange, placeholder = "Write the guide…" }) {
  const [picking, setPicking] = useState(false);

  const editor = useEditor({
    immediatelyRender: false, // see the note above — required in the App Router
    extensions: [
      StarterKit.configure({
        // The template owns the h1. Offering only 2–4 here means the outline
        // can never start at the wrong level.
        heading: { levels: [2, 3, 4] },
        link: {
          openOnClick: false, // clicking a link in the editor should edit it, not navigate
          autolink: true,
          defaultProtocol: "https",
          // The real rel is rebuilt by the sanitiser on save — an external link
          // always ends up nofollow noopener noreferrer whatever is set here.
          HTMLAttributes: { rel: "nofollow noopener noreferrer" },
        },
      }),
      Image.configure({
        // Inline base64 is exactly what the media pipeline exists to prevent.
        allowBase64: false,
        HTMLAttributes: { loading: "lazy", decoding: "async" },
      }),
      TableKit.configure({ table: { resizable: false } }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        // `blog-html` is the same class the public page uses, so what is typed
        // here is laid out with the styles it will have when published. A
        // WYSIWYG that is not W-Y-G is just a text box with buttons.
        class:
          "blog-html min-h-[24rem] max-w-none px-5 py-4 outline-none focus:outline-none",
      },
    },
    onUpdate: ({ editor: instance }) => onChange?.(instance.getHTML()),
  });

  /*
   * Pull the editor's content back in line if the parent replaces it wholesale
   * — loading a different post into the same mounted editor, say. Guarded on
   * an actual difference, or every keystroke would reset the cursor to the
   * start of the document.
   */
  useEffect(() => {
    if (!editor) return;
    const incoming = value || "";
    if (incoming !== editor.getHTML()) {
      editor.commands.setContent(incoming, { emitUpdate: false });
    }
  }, [value, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;

    const existing = editor.getAttributes("link").href ?? "";
    const href = window.prompt(
      "Link to — a path like /lab-test/deoria, or a full https:// URL",
      existing
    );

    if (href === null) return; // cancelled
    if (href === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // javascript: and data: are refused here as well as in the sanitiser. The
    // sanitiser is the one that counts; this is so the person gets told
    // immediately instead of finding the link gone after saving.
    if (/^\s*(javascript|data|vbscript):/i.test(href)) {
      window.alert("That kind of link is not allowed.");
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
  }, [editor]);

  const insertImage = useCallback(
    (media) => {
      setPicking(false);
      if (!editor || !media) return;

      // width and height go in so the browser reserves the space before the
      // image loads. Without them the text jumps as each picture arrives,
      // which is Cumulative Layout Shift and a Core Web Vitals failure.
      editor
        .chain()
        .focus()
        .setImage({
          src: media.url,
          alt: media.alt || "",
          title: media.title || undefined,
          width: media.width,
          height: media.height,
        })
        .run();
    },
    [editor]
  );

  /** A callout, built from the classes the sanitiser allows through. */
  const insertNote = useCallback(
    (tone) => {
      if (!editor) return;
      editor
        .chain()
        .focus()
        .insertContent(
          `<div class="note note-${tone}"><p>${
            tone === "warn" ? "Dhyan dein: " : ""
          }</p></div>`
        )
        .run();
    },
    [editor]
  );

  if (!editor) {
    // Matches the editor's own height so the form does not jump when it mounts.
    return (
      <div className="min-h-[28rem] animate-pulse rounded-xl border border-slate-200 bg-slate-50" />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:ring-2 focus-within:ring-emerald-600">
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-white/95 px-2 py-1.5 backdrop-blur">
        <Tool
          label="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" strokeWidth={2.5} />
        </Tool>
        <Tool
          label="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" strokeWidth={2.5} />
        </Tool>
        <Tool
          label="Underline"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="h-4 w-4" strokeWidth={2.5} />
        </Tool>
        <Tool
          label="Strikethrough"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" strokeWidth={2.5} />
        </Tool>

        <Divider />

        <Tool
          label="Section heading (H2)"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="h-4 w-4" strokeWidth={2.5} />
        </Tool>
        <Tool
          label="Sub-heading (H3)"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 className="h-4 w-4" strokeWidth={2.5} />
        </Tool>

        <Divider />

        <Tool
          label="Bulleted list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" strokeWidth={2.5} />
        </Tool>
        <Tool
          label="Numbered list"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" strokeWidth={2.5} />
        </Tool>
        <Tool
          label="Quote"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="h-4 w-4" strokeWidth={2.5} />
        </Tool>
        <Tool
          label="Inline code"
          active={editor.isActive("code")}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <Code className="h-4 w-4" strokeWidth={2.5} />
        </Tool>

        <Divider />

        <Tool label="Link" active={editor.isActive("link")} onClick={setLink}>
          <Link2 className="h-4 w-4" strokeWidth={2.5} />
        </Tool>
        <Tool
          label="Remove link"
          disabled={!editor.isActive("link")}
          onClick={() => editor.chain().focus().unsetLink().run()}
        >
          <Link2Off className="h-4 w-4" strokeWidth={2.5} />
        </Tool>
        <Tool label="Insert an image from the library" onClick={() => setPicking(true)}>
          <ImageIcon className="h-4 w-4" strokeWidth={2.5} />
        </Tool>
        <Tool
          label="Table"
          onClick={() =>
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          }
        >
          <TableIcon className="h-4 w-4" strokeWidth={2.5} />
        </Tool>
        <Tool label="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus className="h-4 w-4" strokeWidth={2.5} />
        </Tool>
        <Tool label="Warning callout" onClick={() => insertNote("warn")}>
          <AlertTriangle className="h-4 w-4" strokeWidth={2.5} />
        </Tool>

        <Divider />

        <Tool
          label="Undo"
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 className="h-4 w-4" strokeWidth={2.5} />
        </Tool>
        <Tool
          label="Redo"
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2 className="h-4 w-4" strokeWidth={2.5} />
        </Tool>

        {editor.isActive("table") && (
          <>
            <Divider />
            <button
              type="button"
              onClick={() => editor.chain().focus().addRowAfter().run()}
              className="rounded-md px-2 py-1 text-[12px] font-semibold text-slate-600 hover:bg-slate-100"
            >
              + row
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              className="rounded-md px-2 py-1 text-[12px] font-semibold text-slate-600 hover:bg-slate-100"
            >
              + column
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteTable().run()}
              className="rounded-md px-2 py-1 text-[12px] font-semibold text-slate-500 hover:bg-rose-50 hover:text-rose-700"
            >
              remove table
            </button>
          </>
        )}
      </div>

      <EditorContent editor={editor} />

      {picking && <MediaPicker onPick={insertImage} onClose={() => setPicking(false)} />}
    </div>
  );
}
