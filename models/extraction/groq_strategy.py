"""
Groq API Strategy — Concrete Strategy using Groq Vision API.

Uses meta-llama/llama-4-scout-17b-16e-instruct for vision-based text extraction.

Design Pattern: STRATEGY PATTERN (Concrete Strategy)
"""

import base64
import io
from typing import List

from PIL import Image

from models.extraction.base import ExtractionStrategy, ExtractionError

GROQ_DEFAULT_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct"


class GroqStrategy(ExtractionStrategy):
    """
    Text extraction using Groq Vision API (LLaMA 4 Scout).
    Sends document images directly to the model for text extraction.
    """

    def __init__(self, api_key: str, model_name: str = GROQ_DEFAULT_MODEL):
        """
        Initialize the Groq strategy.

        Args:
            api_key:    Groq API key for authentication.
            model_name: The Groq vision model to use.
        """
        if not api_key or not api_key.strip():
            raise ValueError("Groq API key is required for Groq mode.")
        self._api_key = api_key
        self._model_name = model_name
        self._client = None

    @property
    def name(self) -> str:
        return f"API (Groq - {self._model_name})"

    def _get_client(self):
        """Lazy-load the Groq client."""
        if self._client is None:
            from groq import Groq
            self._client = Groq(api_key=self._api_key)
        return self._client

    def _image_to_base64(self, image: Image.Image) -> str:
        """Convert a PIL Image to a base64-encoded JPEG string."""
        buffer = io.BytesIO()
        image.save(buffer, format="JPEG")
        return base64.b64encode(buffer.getvalue()).decode("utf-8")

    def _extract_single_page(self, image: Image.Image) -> str:
        """Extract text from a single page image using Groq vision."""
        client = self._get_client()
        base64_image = self._image_to_base64(image)

        prompt = (
            "Extract all text from this document image exactly as written. "
            "Return only the raw text content, no formatting, no markdown, "
            "no explanations. If multiple lines exist, preserve line breaks."
        )

        response = client.chat.completions.create(
            model=self._model_name,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            }
                        }
                    ]
                }
            ],
            temperature=0.1,
            max_tokens=4096
        )

        if response.choices and response.choices[0].message.content:
            return response.choices[0].message.content.strip()
        return ""

    def extract_text(self, images: List[Image.Image], doc_type: str = "printed") -> str:
        """
        Extract text from document images using Groq Vision.
        """
        try:
            all_text = []
            for image in images:
                page_text = self._extract_single_page(image)
                if page_text:
                    all_text.append(page_text)

            return "\n\n".join(all_text)

        except ValueError as e:
            raise ExtractionError(self.name, str(e))
        except Exception as e:
            raise ExtractionError(
                self.name,
                f"Groq API call failed: {str(e)}"
            )
