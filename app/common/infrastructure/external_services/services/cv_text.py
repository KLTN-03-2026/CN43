"""PDF text extraction utilities.

Uses PyPDF2 to extract text from PDF documents.
"""

from pathlib import Path

from PyPDF2 import PdfReader


def extract_text_from_pdf(path: str | Path) -> str:
    """Extract all text from a PDF file.

    Args:
        path: Path to the PDF file

    Returns:
        str: All text extracted from the PDF, with newlines
             between pages

    Raises:
        Exception: If PDF cannot be read
    """
    reader = PdfReader(str(path))
    parts: list[str] = []
    for page in reader.pages:
        t = page.extract_text()
        if t:
            parts.append(t)
    return "\n".join(parts).strip()
