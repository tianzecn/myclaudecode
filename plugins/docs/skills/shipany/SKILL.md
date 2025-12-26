---
name: shipany
description: ShipAny 中文文档 - AI SaaS 快速构建平台
---

# Shipany Skill

Comprehensive assistance with shipany development, generated from official documentation.

## When to Use This Skill

This skill should be triggered when:
- Working with shipany
- Asking about shipany features or APIs
- Implementing shipany solutions
- Debugging shipany code
- Learning shipany best practices

## Quick Reference

### Common Patterns

*Quick reference patterns will be added as you use the skill.*

### Example Code Patterns

**Example 1** (python):
```python
ShipAny Two <no-reply@mail.shipany.codes>
```

**Example 2** (json):
```json
curl -X POST https://{your-domain}/api/email/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "emails":["support@xxx.com"],
    "subject":"Test Email"
  }'
```

## Reference Files

This skill includes comprehensive documentation in `references/`:

- **zh.md** - Zh documentation

Use `view` to read specific reference files when detailed information is needed.

## Working with This Skill

### For Beginners
Start with the getting_started or tutorials reference files for foundational concepts.

### For Specific Features
Use the appropriate category reference file (api, guides, etc.) for detailed information.

### For Code Examples
The quick reference section above contains common patterns extracted from the official docs.

## Resources

### references/
Organized documentation extracted from official sources. These files contain:
- Detailed explanations
- Code examples with language annotations
- Links to original documentation
- Table of contents for quick navigation

### scripts/
Add helper scripts here for common automation tasks.

### assets/
Add templates, boilerplate, or example projects here.

## Notes

- This skill was automatically generated from official documentation
- Reference files preserve the structure and examples from source docs
- Code examples include language detection for better syntax highlighting
- Quick reference patterns are extracted from common usage examples in the docs

## Updating

To refresh this skill with updated documentation:
1. Re-run the scraper with the same configuration
2. The skill will be rebuilt with the latest information
