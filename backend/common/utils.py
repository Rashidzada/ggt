from urllib.parse import quote_plus

from django.utils.text import slugify


def generate_unique_slug(model, value: str, instance_id=None, slug_field: str = "slug") -> str:
    base_slug = slugify(value)[:55] or "item"
    slug = base_slug
    counter = 1

    while True:
        queryset = model.objects.filter(**{slug_field: slug})
        if instance_id:
            queryset = queryset.exclude(pk=instance_id)
        if not queryset.exists():
            return slug
        counter += 1
        slug = f"{base_slug[:50]}-{counter}"


def build_whatsapp_url(phone_number: str, message: str) -> str:
    normalized_phone = "".join(character for character in phone_number if character.isdigit())
    if normalized_phone.startswith("0"):
        normalized_phone = f"92{normalized_phone[1:]}"
    return f"https://wa.me/{normalized_phone}?text={quote_plus(message)}"

