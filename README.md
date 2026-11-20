# BookLoom / 书脉

BookLoom is a private DeepSeek Harness plugin for structural reading. It imports one EPUB, Markdown, TXT, or text-based PDF and creates chapter, concept, keyword, and relationship views whose visible elements link back to source paragraphs.

## Scope

- EPUB: package, spine, nav/NCX, and XHTML text extraction.
- Markdown: AST-based heading structure.
- TXT: encoding detection and heuristic chapter splitting.
- PDF: text-layer extraction with page anchors; scanned PDFs return `OCR_REQUIRED`.
- Local-only storage under `$DSH_HOME/.dsh_book_loom`; original uploads are not retained by default.
- No OCR, multi-book merge, external publishing, or outside-knowledge graph augmentation.

## Install from a tarball

```powershell
npm install
npm run verify
npm pack
dsh plugin --profile desktop add .\local-dsh-book-loom-0.2.4.tgz
```

Fully exit and restart DSH after installing or changing Host code. For release validation, set a fresh `DSH_HOME` and never use a daily profile.

## Use

1. Open **书脉** from the DSH sidebar.
2. Choose **导入书籍** and select an EPUB, Markdown, TXT, or PDF file.
3. Review the chapter tree, rename levels, merge adjacent chapters, or split at paragraph boundaries, then confirm.
4. Open the structure map immediately while concepts and relationships finish in the background.
5. Switch among chapter, radial, concept, and word-cloud views. Path mode finds a typed shortest path; word-cloud mode compares up to three chapters.
6. Use **回到原文** to inspect the source paragraph behind every graph element, or select text to highlight, underline, comment, and create a concept.

The deterministic Host capability can also be checked through the `bookloom_status` tool. It returns health, import counts, and supported formats without invoking a model.

## Data and removal

Deleting a book from the panel requires explicit confirmation and removes that book's extracted text, graph, and annotations. Uninstalling the plugin does not silently delete user data. To roll back the package:

```powershell
dsh plugin --profile desktop remove @local/dsh-book-loom
```

Restart DSH afterward. Remove `$DSH_HOME/.dsh_book_loom` separately only when the stored books are no longer needed.
