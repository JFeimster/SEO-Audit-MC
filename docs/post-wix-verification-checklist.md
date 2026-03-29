# Post Wix Verification Checklist

## Deployment Note

- Deployment method: `Custom Embeds API`
- Embed ID: `2cc73d0f-5700-4841-aee0-3e97c09c85f6`
- Position: `HEAD`
- Enabled: `true`
- Target paths:
  - `/privacy-policy`
  - `/revenuebased`
  - `/industries/wix-seller-financing`

## Post-Deployment Checks

1. Run `npm run verify` and archive outputs in `reports/`.
2. For each target path, confirm whether verifier still reports missing meta/JSON-LD.
3. If verifier still fails but embed is active, mark issue status `implemented_in_wix` and require JS-aware validation.
4. Keep robots-meta policy in `open` state until explicit indexing policy decision.
